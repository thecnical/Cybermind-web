import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { ProjectMemoryManager } from '../api/ProjectMemory';
import { logger } from '../utils/logger';

export interface WorkspaceInsight {
  type: 'outdated-deps' | 'missing-gitignore' | 'no-tests' | 'security-issue' | 'suggestion' | 'tech-detected';
  message: string;
  action?: string;
  severity: 'info' | 'warning' | 'error';
}

/**
 * WorkspaceIntelligence — proactively analyzes the workspace and suggests improvements.
 *
 * Runs on:
 * - Extension activation
 * - File save (security scan)
 * - Manual trigger
 */
export class WorkspaceIntelligence {
  private lastScanTime = 0;
  private readonly SCAN_COOLDOWN_MS = 30000; // 30s between auto-scans
  private saveWatcher: vscode.Disposable | null = null;
  private onInsightCallback: ((insights: WorkspaceInsight[]) => void) | null = null;

  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager,
    private readonly memory: ProjectMemoryManager
  ) {}

  setOnInsight(callback: (insights: WorkspaceInsight[]) => void): void {
    this.onInsightCallback = callback;
  }

  // Run on activation — analyze workspace
  async analyzeWorkspace(): Promise<WorkspaceInsight[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return [];

    const insights: WorkspaceInsight[] = [];

    // 1. Check for .gitignore
    if (!fs.existsSync(path.join(workspaceRoot, '.gitignore'))) {
      insights.push({
        type: 'missing-gitignore',
        message: 'No .gitignore found — your secrets might be committed to git',
        action: 'Create .gitignore',
        severity: 'warning',
      });
    }

    // 2. Check for outdated/vulnerable packages
    const pkgPath = path.join(workspaceRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        // Known vulnerable versions (simplified check)
        const vulnerablePackages = [
          { name: 'lodash', badVersions: ['<4.17.21'], issue: 'Prototype pollution' },
          { name: 'axios', badVersions: ['<1.6.0'], issue: 'SSRF vulnerability' },
          { name: 'jsonwebtoken', badVersions: ['<9.0.0'], issue: 'Algorithm confusion' },
        ];

        for (const vuln of vulnerablePackages) {
          if (deps[vuln.name]) {
            insights.push({
              type: 'security-issue',
              message: `${vuln.name} may have security issues: ${vuln.issue}`,
              action: `Update ${vuln.name}`,
              severity: 'warning',
            });
          }
        }

        // Check for missing test setup
        if (!deps['jest'] && !deps['vitest'] && !deps['mocha'] && !deps['@testing-library/react']) {
          insights.push({
            type: 'no-tests',
            message: 'No test framework detected — consider adding tests',
            action: 'Add testing',
            severity: 'info',
          });
        }
      } catch { /* ignore */ }
    }

    // 3. Check for .env files committed (security)
    const gitignorePath = path.join(workspaceRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignore.includes('.env')) {
        insights.push({
          type: 'security-issue',
          message: '.env is not in .gitignore — your API keys could be exposed',
          action: 'Add .env to .gitignore',
          severity: 'error',
        });
      }
    }

    // 4. Tech stack detection
    const mem = this.memory.getMemory();
    if (mem && mem.techStack.length > 0) {
      insights.push({
        type: 'tech-detected',
        message: `Detected: ${mem.techStack.join(', ')}`,
        severity: 'info',
      });
    }

    if (insights.length > 0 && this.onInsightCallback) {
      this.onInsightCallback(insights);
    }

    return insights;
  }

  // Auto-scan on file save
  startAutoScanOnSave(context: vscode.ExtensionContext): void {
    this.saveWatcher = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      const now = Date.now();
      if (now - this.lastScanTime < this.SCAN_COOLDOWN_MS) return;

      const ext = path.extname(doc.fileName);
      const scanableExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.java', '.php'];

      if (!scanableExts.includes(ext)) return;

      this.lastScanTime = now;

      // Quick security check on save
      const config = vscode.workspace.getConfiguration('cybermind');
      const autoScan = config.get<boolean>('security.autoScanOnSave', false);

      if (autoScan) {
        await this.quickSecurityCheck(doc);
      }
    });

    context.subscriptions.push(this.saveWatcher);
  }

  private async quickSecurityCheck(doc: vscode.TextDocument): Promise<void> {
    const content = doc.getText();
    const fileName = path.basename(doc.fileName);

    // Quick pattern-based checks (no AI needed — instant)
    const quickChecks = [
      { pattern: /password\s*=\s*["'][^"']{3,}["']/i, message: 'Hardcoded password detected', severity: 'error' as const },
      { pattern: /api[_-]?key\s*=\s*["'][a-zA-Z0-9]{10,}["']/i, message: 'Hardcoded API key detected', severity: 'error' as const },
      { pattern: /secret\s*=\s*["'][^"']{5,}["']/i, message: 'Hardcoded secret detected', severity: 'error' as const },
      { pattern: /eval\s*\(/i, message: 'eval() usage — potential code injection', severity: 'warning' as const },
      { pattern: /innerHTML\s*=/i, message: 'innerHTML assignment — potential XSS', severity: 'warning' as const },
    ];

    const findings: WorkspaceInsight[] = [];
    for (const check of quickChecks) {
      if (check.pattern.test(content)) {
        findings.push({
          type: 'security-issue',
          message: `${fileName}: ${check.message}`,
          severity: check.severity,
        });
      }
    }

    if (findings.length > 0 && this.onInsightCallback) {
      this.onInsightCallback(findings);
    }
  }

  // Get smart suggestions based on what user is working on
  async getSuggestions(currentFile: string, recentActivity: string): Promise<string> {
    const mem = this.memory.getMemory();
    if (!mem) return '';

    const suggestions: string[] = [];

    // Based on tech stack
    if (mem.techStack.includes('Next.js') && currentFile.includes('page.tsx')) {
      suggestions.push('💡 Consider adding metadata export for SEO');
    }
    if (mem.techStack.includes('Supabase') && currentFile.includes('auth')) {
      suggestions.push('💡 Remember to handle session refresh in middleware');
    }
    if (currentFile.includes('.test.') || currentFile.includes('.spec.')) {
      suggestions.push('💡 Run tests: Ctrl+Shift+P → CyberMind: Plan Mode → "run tests and fix failures"');
    }

    return suggestions.join('\n');
  }

  dispose(): void {
    if (this.saveWatcher) {
      this.saveWatcher.dispose();
      this.saveWatcher = null;
    }
  }
}
