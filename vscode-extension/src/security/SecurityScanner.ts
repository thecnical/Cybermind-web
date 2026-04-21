import * as vscode from 'vscode';
import { BackendClient } from '../api/BackendClient';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { logger } from '../utils/logger';

export interface VulnerabilityFinding {
  filePath: string;
  line: number;
  column: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  description: string;
  remediationSuggestion: string;
}

export interface ScanSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

// File extensions that are worth scanning for security issues
const SCANNABLE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.rb', '.php', '.java', '.go', '.cs',
  '.cpp', '.c', '.h', '.rs', '.swift', '.kt',
  '.sql', '.env', '.yaml', '.yml', '.json', '.toml',
  '.sh', '.bash', '.ps1', '.psm1',
]);

// Files/paths to skip — no value scanning these
const SKIP_PATTERNS = [
  'node_modules', '.git', 'dist', 'build', '.next',
  'vendor', '__pycache__', '.venv', 'coverage',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
];

export class SecurityScanner {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private saveWatcher: vscode.Disposable | null = null;
  private scanOnSaveEnabled: boolean = true;
  private scanDebounceTimers = new Map<string, NodeJS.Timeout>();
  private readonly DEBOUNCE_MS = 1500; // wait 1.5s after save before scanning

  constructor(private readonly backendClient: BackendClient) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('cybermind-security');
    this.loadConfig();
  }

  // ── Config ────────────────────────────────────────────────────────────────

  private loadConfig() {
    const config = vscode.workspace.getConfiguration('cybermind');
    this.scanOnSaveEnabled = config.get<boolean>('security.scanOnSave', true);
  }

  // ── Real-time scan on save ────────────────────────────────────────────────

  /**
   * Start watching for file saves and trigger security scans automatically.
   * Debounced — waits 1.5s after save to avoid scanning mid-edit.
   */
  startScanOnSave(): vscode.Disposable {
    this.stopScanOnSave();

    this.saveWatcher = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      if (!this.scanOnSaveEnabled) return;
      if (!this.shouldScanFile(doc.uri)) return;

      const key = doc.uri.fsPath;

      // Clear any pending debounce for this file
      const existing = this.scanDebounceTimers.get(key);
      if (existing) clearTimeout(existing);

      // Schedule scan after debounce
      const timer = setTimeout(async () => {
        this.scanDebounceTimers.delete(key);
        try {
          const findings = await this.scanFile(doc.uri);
          if (findings.length > 0) {
            const summary = this.getSummary(findings);
            const sevText = [
              summary.critical > 0 ? `${summary.critical} critical` : '',
              summary.high > 0 ? `${summary.high} high` : '',
              summary.medium > 0 ? `${summary.medium} medium` : '',
            ].filter(Boolean).join(', ');

            // Show status bar notification for serious findings
            if (summary.critical > 0 || summary.high > 0) {
              vscode.window.showWarningMessage(
                `CyberMind: ${sevText} security issue${summary.total > 1 ? 's' : ''} found in ${doc.fileName.split(/[\\/]/).pop()}`,
                'View Details'
              ).then(action => {
                if (action === 'View Details') {
                  vscode.commands.executeCommand('cybermind.showSecurityPanel');
                }
              });
            }
          } else {
            // Clear old diagnostics for this file if scan is clean
            this.clearDiagnostics(doc.uri);
          }
        } catch (err) {
          logger.warn(`[SecurityScanner] Scan-on-save failed for ${doc.uri.fsPath}: ${String(err)}`);
        }
      }, this.DEBOUNCE_MS);

      this.scanDebounceTimers.set(key, timer);
    });

    logger.info('[SecurityScanner] Scan-on-save started');
    return this.saveWatcher;
  }

  stopScanOnSave() {
    if (this.saveWatcher) {
      this.saveWatcher.dispose();
      this.saveWatcher = null;
    }
    // Clear all pending debounce timers
    for (const timer of this.scanDebounceTimers.values()) {
      clearTimeout(timer);
    }
    this.scanDebounceTimers.clear();
  }

  setScanOnSave(enabled: boolean) {
    this.scanOnSaveEnabled = enabled;
    const config = vscode.workspace.getConfiguration('cybermind');
    config.update('security.scanOnSave', enabled, vscode.ConfigurationTarget.Global);
    logger.info(`[SecurityScanner] Scan-on-save ${enabled ? 'enabled' : 'disabled'}`);
  }

  isScanOnSaveEnabled(): boolean {
    return this.scanOnSaveEnabled;
  }

  // ── File filtering ────────────────────────────────────────────────────────

  private shouldScanFile(uri: vscode.Uri): boolean {
    const path = uri.fsPath;

    // Skip non-scannable paths
    for (const skip of SKIP_PATTERNS) {
      if (path.includes(skip)) return false;
    }

    // Only scan known code/config extensions
    const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
    return SCANNABLE_EXTENSIONS.has(ext);
  }

  // ── Single file scan ──────────────────────────────────────────────────────

  async scanFile(uri: vscode.Uri): Promise<VulnerabilityFinding[]> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');

      // Skip very large files (>500KB) — too slow and usually generated
      if (text.length > 500_000) {
        logger.warn(`[SecurityScanner] Skipping large file: ${uri.fsPath}`);
        return [];
      }

      const ext = uri.fsPath.substring(uri.fsPath.lastIndexOf('.')).toLowerCase();
      const systemPrompt = this.buildSecurityPrompt(ext);

      const response = await this.backendClient.freeChat(
        {
          message: this.buildScanMessage(text, uri.fsPath),
          agent: 'security',
          context: `File: ${uri.fsPath}\nExtension: ${ext}`,
          system: systemPrompt,
        },
        () => {} // no streaming needed for scan
      );

      const findings = this.parseFindings(response, uri.fsPath);
      this.applyDiagnostics(findings);
      return findings;
    } catch (error) {
      logger.error(`[SecurityScanner] Failed to scan file: ${uri.fsPath}`, error);
      return [];
    }
  }

  private buildScanMessage(code: string, filePath: string): string {
    const truncated = code.length > 8000 ? code.slice(0, 8000) + '\n... [truncated]' : code;
    return (
      `Analyze this file for security vulnerabilities. Return ONLY a JSON object wrapped in <cybermind-findings> tags.\n\n` +
      `File: ${filePath}\n\n` +
      `\`\`\`\n${truncated}\n\`\`\`\n\n` +
      `Return format:\n` +
      `<cybermind-findings>\n` +
      `{"findings":[{"file":"${filePath}","line":1,"column":1,"severity":"high","category":"SQL Injection","description":"...","remediation":"..."}]}\n` +
      `</cybermind-findings>\n\n` +
      `Only include real, confirmed issues. Empty array if no issues found.`
    );
  }

  private buildSecurityPrompt(ext: string): string {
    const langHints: Record<string, string> = {
      '.py':   'Focus on: SQL injection, command injection, pickle deserialization, path traversal, hardcoded secrets.',
      '.js':   'Focus on: prototype pollution, eval/Function injection, XSS sinks, SSRF, hardcoded secrets, insecure dependencies.',
      '.ts':   'Focus on: prototype pollution, eval/Function injection, XSS sinks, SSRF, hardcoded secrets, insecure dependencies.',
      '.php':  'Focus on: SQL injection, LFI/RFI, command injection, XSS, object injection, hardcoded credentials.',
      '.java': 'Focus on: SQL injection, deserialization, XXE, SSRF, path traversal, hardcoded secrets.',
      '.go':   'Focus on: SQL injection, command injection, path traversal, hardcoded secrets, race conditions.',
      '.sql':  'Focus on: dynamic SQL construction, missing parameterization, privilege escalation.',
      '.env':  'Focus on: hardcoded secrets, API keys, passwords, tokens.',
      '.yaml': 'Focus on: hardcoded secrets, insecure configurations, exposed credentials.',
      '.yml':  'Focus on: hardcoded secrets, insecure configurations, exposed credentials.',
    };

    const hint = langHints[ext] ?? 'Focus on: hardcoded secrets, injection flaws, insecure configurations.';

    return (
      `You are CyberMind Security Scanner, an expert SAST tool. ` +
      `${hint} ` +
      `Be precise — only report real vulnerabilities with exact line numbers. ` +
      `Do not report style issues, missing tests, or theoretical risks without evidence in the code. ` +
      `Always wrap your response in <cybermind-findings> XML tags with valid JSON inside.`
    );
  }

  // ── Workspace scan ────────────────────────────────────────────────────────

  async scanWorkspace(
    indexer: RepoIndexer,
    onProgress: (current: number, total: number) => void
  ): Promise<VulnerabilityFinding[]> {
    const allFiles = indexer.searchFiles('').filter(f => {
      const uri = vscode.Uri.file(f.path);
      return this.shouldScanFile(uri);
    });

    const total = allFiles.length;
    const allFindings: VulnerabilityFinding[] = [];
    const BATCH_SIZE = 3; // smaller batches to avoid rate limiting

    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          try {
            const uri = vscode.Uri.file(file.path);
            const findings = await this.scanFile(uri);
            allFindings.push(...findings);
          } catch (error) {
            logger.warn(`[SecurityScanner] Failed to scan ${file.path}`, String(error));
          }
        })
      );

      onProgress(Math.min(i + BATCH_SIZE, total), total);

      // Small delay between batches to avoid hammering the backend
      if (i + BATCH_SIZE < allFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return allFindings;
  }

  // ── Finding parser ────────────────────────────────────────────────────────

  parseFindings(response: string, defaultFilePath: string): VulnerabilityFinding[] {
    const findings: VulnerabilityFinding[] = [];

    const xmlMatch = response.match(/<cybermind-findings>([\s\S]*?)<\/cybermind-findings>/);
    if (!xmlMatch) {
      return findings;
    }

    try {
      const jsonContent = xmlMatch[1].trim();
      const parsed = JSON.parse(jsonContent) as {
        findings: Array<{
          file?: string;
          line?: number;
          column?: number;
          severity?: string;
          category?: string;
          description?: string;
          remediation?: string;
        }>;
      };

      if (!parsed.findings || !Array.isArray(parsed.findings)) {
        return findings;
      }

      for (const f of parsed.findings) {
        const severity = this.normalizeSeverity(f.severity ?? 'info');
        findings.push({
          filePath: f.file ?? defaultFilePath,
          line: Math.max(0, (f.line ?? 1) - 1),
          column: Math.max(0, (f.column ?? 1) - 1),
          severity,
          category: f.category ?? 'Unknown',
          description: f.description ?? '',
          remediationSuggestion: f.remediation ?? '',
        });
      }
    } catch (error) {
      logger.warn('[SecurityScanner] Failed to parse security findings JSON', String(error));
    }

    return findings;
  }

  // ── Diagnostics ───────────────────────────────────────────────────────────

  applyDiagnostics(findings: VulnerabilityFinding[]): void {
    const byFile = new Map<string, VulnerabilityFinding[]>();
    for (const finding of findings) {
      const existing = byFile.get(finding.filePath) ?? [];
      existing.push(finding);
      byFile.set(finding.filePath, existing);
    }

    for (const [filePath, fileFindings] of byFile) {
      const uri = vscode.Uri.file(filePath);
      const diagnostics: vscode.Diagnostic[] = fileFindings.map(f => {
        const range = new vscode.Range(
          new vscode.Position(f.line, f.column),
          new vscode.Position(f.line, Math.max(f.column + 1, f.column + 20))
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          `[CyberMind] [${f.category}] ${f.description}\n\nRemediation: ${f.remediationSuggestion}`,
          this.severityToDiagnostic(f.severity)
        );
        diagnostic.source = 'CyberMind Security';
        diagnostic.code = f.category;
        return diagnostic;
      });

      this.diagnosticCollection.set(uri, diagnostics);
    }
  }

  clearDiagnostics(uri?: vscode.Uri): void {
    if (uri) {
      this.diagnosticCollection.delete(uri);
    } else {
      this.diagnosticCollection.clear();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  severityToDiagnostic(severity: VulnerabilityFinding['severity']): vscode.DiagnosticSeverity {
    switch (severity) {
      case 'critical':
      case 'high':
        return vscode.DiagnosticSeverity.Error;
      case 'medium':
        return vscode.DiagnosticSeverity.Warning;
      case 'low':
      case 'info':
      default:
        return vscode.DiagnosticSeverity.Information;
    }
  }

  getSummary(findings: VulnerabilityFinding[]): ScanSummary {
    return {
      total:    findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high:     findings.filter(f => f.severity === 'high').length,
      medium:   findings.filter(f => f.severity === 'medium').length,
      low:      findings.filter(f => f.severity === 'low').length,
      info:     findings.filter(f => f.severity === 'info').length,
    };
  }

  private normalizeSeverity(severity: string): VulnerabilityFinding['severity'] {
    const lower = severity.toLowerCase();
    if (['critical', 'high', 'medium', 'low', 'info'].includes(lower)) {
      return lower as VulnerabilityFinding['severity'];
    }
    return 'info';
  }

  dispose(): void {
    this.stopScanOnSave();
    this.diagnosticCollection.dispose();
  }
}
