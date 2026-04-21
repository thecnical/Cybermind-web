/**
 * SecretLeakDetector — Pre-commit secret scanning
 * Detects API keys, tokens, passwords, private keys in staged diffs.
 * Uses entropy analysis + pattern matching (truffleHog-style).
 * Runs as a pre-commit hook and on-demand via command.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import { logger } from '../utils/logger';

export interface SecretFinding {
  file: string;
  line: number;
  column: number;
  type: string;
  value: string; // redacted
  entropy: number;
  severity: 'critical' | 'high' | 'medium';
  remediation: string;
}

// High-entropy secret patterns
const SECRET_PATTERNS: Array<{ name: string; regex: RegExp; severity: 'critical' | 'high' | 'medium' }> = [
  { name: 'AWS Access Key',        regex: /AKIA[0-9A-Z]{16}/g,                                    severity: 'critical' },
  { name: 'AWS Secret Key',        regex: /(?:aws[_\-]?secret|AWS_SECRET)[^=\n]*=\s*["']?([A-Za-z0-9/+=]{40})["']?/gi, severity: 'critical' },
  { name: 'GitHub Token',          regex: /ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82}/g,    severity: 'critical' },
  { name: 'OpenAI API Key',        regex: /sk-[A-Za-z0-9]{48}/g,                                  severity: 'critical' },
  { name: 'Stripe Secret Key',     regex: /sk_live_[A-Za-z0-9]{24,}/g,                            severity: 'critical' },
  { name: 'Stripe Publishable Key',regex: /pk_live_[A-Za-z0-9]{24,}/g,                            severity: 'high' },
  { name: 'Slack Token',           regex: /xox[baprs]-[A-Za-z0-9\-]{10,}/g,                       severity: 'critical' },
  { name: 'Slack Webhook',         regex: /https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9\/]+/g, severity: 'high' },
  { name: 'Google API Key',        regex: /AIza[0-9A-Za-z\-_]{35}/g,                              severity: 'critical' },
  { name: 'Firebase Key',          regex: /AAAA[A-Za-z0-9_\-]{7}:[A-Za-z0-9_\-]{140}/g,          severity: 'critical' },
  { name: 'Twilio Account SID',    regex: /AC[a-z0-9]{32}/g,                                      severity: 'high' },
  { name: 'Twilio Auth Token',     regex: /SK[a-z0-9]{32}/g,                                      severity: 'critical' },
  { name: 'SendGrid API Key',      regex: /SG\.[A-Za-z0-9_\-]{22}\.[A-Za-z0-9_\-]{43}/g,         severity: 'critical' },
  { name: 'JWT Token',             regex: /eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/g, severity: 'high' },
  { name: 'Private Key',           regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,   severity: 'critical' },
  { name: 'Password in Code',      regex: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}["']/gi, severity: 'high' },
  { name: 'Database URL',          regex: /(?:postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@[^\s"']+/gi, severity: 'critical' },
  { name: 'Generic API Key',       regex: /(?:api[_\-]?key|apikey)\s*[:=]\s*["']([A-Za-z0-9_\-]{20,})["']/gi, severity: 'medium' },
  { name: 'Bearer Token',          regex: /Bearer\s+[A-Za-z0-9_\-\.]{20,}/g,                      severity: 'medium' },
  { name: 'Supabase Key',          regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g, severity: 'critical' },
  { name: 'HuggingFace Token',     regex: /hf_[A-Za-z0-9]{34,}/g,                                 severity: 'high' },
  { name: 'Groq API Key',          regex: /gsk_[A-Za-z0-9]{52}/g,                                 severity: 'critical' },
  { name: 'OpenRouter Key',        regex: /sk-or-[A-Za-z0-9\-]{40,}/g,                            severity: 'critical' },
];

// Files that should never contain secrets
const SENSITIVE_FILE_PATTERNS = [
  /\.env$/i, /\.env\./i, /config\.json$/i, /secrets\.json$/i,
  /credentials\.json$/i, /\.pem$/i, /\.key$/i, /\.p12$/i,
];

// Files to skip (generated, vendor, etc.)
const SKIP_PATTERNS = [
  'node_modules', '.git', 'dist', 'build', '.next', 'vendor',
  '__pycache__', '.venv', 'coverage', 'package-lock.json', 'yarn.lock',
];

export class SecretLeakDetector {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private gitWatcher: vscode.Disposable | null = null;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('cybermind-secrets');
  }

  // ── Scan a single file ────────────────────────────────────────────────────

  async scanFile(uri: vscode.Uri): Promise<SecretFinding[]> {
    const filePath = uri.fsPath;

    // Skip non-scannable paths
    for (const skip of SKIP_PATTERNS) {
      if (filePath.includes(skip)) return [];
    }

    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');
      const findings = this.scanText(text, filePath);
      this.applyDiagnostics(uri, findings);
      return findings;
    } catch {
      return [];
    }
  }

  // ── Scan staged git diff (pre-commit) ─────────────────────────────────────

  async scanStagedDiff(): Promise<SecretFinding[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return [];

    return new Promise((resolve) => {
      cp.exec('git diff --cached --unified=0', { cwd: workspaceRoot, maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
        if (err || !stdout) { resolve([]); return; }
        const findings = this.scanDiffOutput(stdout);
        resolve(findings);
      });
    });
  }

  // ── Scan entire workspace ─────────────────────────────────────────────────

  async scanWorkspace(onProgress?: (current: number, total: number) => void): Promise<SecretFinding[]> {
    const files = await vscode.workspace.findFiles(
      '**/*.{ts,tsx,js,jsx,py,rb,php,go,java,cs,env,json,yaml,yml,toml,sh,bash,ps1}',
      `**/{${SKIP_PATTERNS.join(',')}}/**`
    );

    const allFindings: SecretFinding[] = [];
    for (let i = 0; i < files.length; i++) {
      const findings = await this.scanFile(files[i]);
      allFindings.push(...findings);
      onProgress?.(i + 1, files.length);
    }
    return allFindings;
  }

  // ── Core text scanner ─────────────────────────────────────────────────────

  scanText(text: string, filePath: string): SecretFinding[] {
    const findings: SecretFinding[] = [];
    const lines = text.split('\n');

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];

      // Skip comments and empty lines
      if (line.trim().startsWith('//') || line.trim().startsWith('#') || !line.trim()) continue;
      // Skip .env.example and similar
      if (filePath.includes('.example') || filePath.includes('.sample')) continue;

      for (const pattern of SECRET_PATTERNS) {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          const value = match[0];

          // Skip obvious placeholders
          if (this.isPlaceholder(value)) continue;

          // Entropy check for generic patterns
          if (pattern.name === 'Generic API Key' || pattern.name === 'Bearer Token') {
            const entropy = this.shannonEntropy(value);
            if (entropy < 3.5) continue; // low entropy = not a real secret
          }

          findings.push({
            file: filePath,
            line: lineIdx,
            column: match.index,
            type: pattern.name,
            value: this.redact(value),
            entropy: this.shannonEntropy(value),
            severity: pattern.severity,
            remediation: this.getRemediation(pattern.name, filePath),
          });
        }
      }
    }

    return findings;
  }

  // ── Diff scanner ──────────────────────────────────────────────────────────

  private scanDiffOutput(diff: string): SecretFinding[] {
    const findings: SecretFinding[] = [];
    let currentFile = '';
    let lineNumber = 0;

    for (const line of diff.split('\n')) {
      if (line.startsWith('+++ b/')) {
        currentFile = line.slice(6);
        lineNumber = 0;
        continue;
      }
      if (line.startsWith('@@ ')) {
        const match = line.match(/@@ \-\d+(?:,\d+)? \+(\d+)/);
        if (match) lineNumber = parseInt(match[1], 10) - 1;
        continue;
      }
      if (line.startsWith('+') && !line.startsWith('+++')) {
        lineNumber++;
        const content = line.slice(1);
        const lineFindings = this.scanText(content, currentFile);
        for (const f of lineFindings) {
          findings.push({ ...f, line: lineNumber });
        }
      } else if (!line.startsWith('-')) {
        lineNumber++;
      }
    }

    return findings;
  }

  // ── Diagnostics ───────────────────────────────────────────────────────────

  applyDiagnostics(uri: vscode.Uri, findings: SecretFinding[]): void {
    const diagnostics: vscode.Diagnostic[] = findings.map(f => {
      const range = new vscode.Range(
        new vscode.Position(f.line, f.column),
        new vscode.Position(f.line, f.column + 20)
      );
      const diag = new vscode.Diagnostic(
        range,
        `🔑 Secret detected: ${f.type} — ${f.value}\n\nRemediation: ${f.remediation}`,
        f.severity === 'critical' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
      );
      diag.source = 'CyberMind Secrets';
      diag.code = f.type;
      return diag;
    });
    this.diagnosticCollection.set(uri, diagnostics);
  }

  clearDiagnostics(uri?: vscode.Uri): void {
    if (uri) this.diagnosticCollection.delete(uri);
    else this.diagnosticCollection.clear();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private shannonEntropy(str: string): number {
    const freq: Record<string, number> = {};
    for (const c of str) freq[c] = (freq[c] || 0) + 1;
    let entropy = 0;
    for (const count of Object.values(freq)) {
      const p = count / str.length;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  private isPlaceholder(value: string): boolean {
    const lower = value.toLowerCase();
    return (
      lower.includes('your_') || lower.includes('your-') ||
      lower.includes('example') || lower.includes('placeholder') ||
      lower.includes('change_me') || lower.includes('changeme') ||
      lower.includes('xxx') || lower.includes('yyy') ||
      lower.includes('todo') || lower.includes('fixme') ||
      /^[a-z_]+$/.test(lower) || // all lowercase letters = variable name
      value.length < 8
    );
  }

  private redact(value: string): string {
    if (value.length <= 8) return '***';
    return value.slice(0, 4) + '***' + value.slice(-4);
  }

  private getRemediation(type: string, filePath: string): string {
    const base = `Move to .env file and add .env to .gitignore. Use process.env.${type.toUpperCase().replace(/\s/g, '_')} in code.`;
    if (type === 'Private Key') return 'Never commit private keys. Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, or GitHub Secrets).';
    if (type === 'Database URL') return 'Move to .env. Use connection pooling with environment variables. Never hardcode credentials.';
    if (type === 'JWT Token') return 'This appears to be a live JWT. Revoke it immediately if it was committed. JWTs should never be hardcoded.';
    return base;
  }

  formatReport(findings: SecretFinding[]): string {
    if (findings.length === 0) return '✅ No secrets detected.';

    const critical = findings.filter(f => f.severity === 'critical');
    const high = findings.filter(f => f.severity === 'high');
    const medium = findings.filter(f => f.severity === 'medium');

    let report = `🔑 **Secret Leak Report** — ${findings.length} finding(s)\n\n`;
    if (critical.length) report += `🔴 **CRITICAL (${critical.length}):** Revoke these immediately\n`;
    if (high.length) report += `🟠 **HIGH (${high.length}):** Rotate these keys\n`;
    if (medium.length) report += `🟡 **MEDIUM (${medium.length}):** Review and move to .env\n`;
    report += '\n';

    for (const f of findings) {
      const icon = f.severity === 'critical' ? '🔴' : f.severity === 'high' ? '🟠' : '🟡';
      report += `${icon} **${f.type}** in \`${path.basename(f.file)}\` line ${f.line + 1}\n`;
      report += `   Value: \`${f.value}\`\n`;
      report += `   Fix: ${f.remediation}\n\n`;
    }

    return report;
  }

  dispose(): void {
    this.diagnosticCollection.dispose();
    this.gitWatcher?.dispose();
  }
}
