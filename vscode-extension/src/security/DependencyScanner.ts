/**
 * DependencyScanner — Scans package.json for CVEs using OSV.dev API (free, no key needed).
 * On every package.json save, fetches https://api.osv.dev/v1/querybatch with all dependencies
 * and shows findings as VSCode diagnostics on the package.json file.
 */
import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export interface CVEFinding {
  packageName: string;
  version: string;
  cveId: string;
  severity: string;
  description: string;
  fixedVersion: string;
}

interface OsvVulnerability {
  id: string;
  summary?: string;
  severity?: Array<{ type: string; score: string }>;
  affected?: Array<{
    ranges?: Array<{
      type: string;
      events?: Array<{ introduced?: string; fixed?: string }>;
    }>;
  }>;
}

interface OsvQueryResult {
  vulns?: OsvVulnerability[];
}

interface OsvBatchResponse {
  results?: OsvQueryResult[];
}

export class DependencyScanner {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private saveWatcher: vscode.Disposable | null = null;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('cybermind-deps');
  }

  startWatching(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('cybermind');
    const enabled = config.get<boolean>('security.scanDepsOnSave', true);
    if (!enabled) return;

    this.saveWatcher = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      if (!doc.fileName.endsWith('package.json')) return;
      // Skip lock files and node_modules
      if (doc.fileName.includes('node_modules') || doc.fileName.includes('package-lock')) return;

      try {
        const findings = await this.scanPackageJson(doc.uri);
        if (findings.length > 0) {
          const critical = findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
          if (critical.length > 0) {
            vscode.window.showWarningMessage(
              `CyberMind: ${findings.length} CVE(s) found in dependencies (${critical.length} critical/high)`,
              'View Details'
            ).then(action => {
              if (action === 'View Details') {
                vscode.commands.executeCommand('workbench.view.extension.cybermind');
              }
            });
          }
        }
      } catch (err) {
        logger.warn(`[DependencyScanner] Scan failed: ${String(err)}`);
      }
    });

    context.subscriptions.push(this.saveWatcher);
  }

  async scanPackageJson(uri: vscode.Uri): Promise<CVEFinding[]> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');
      const pkg = JSON.parse(text) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };

      const allDeps: Array<{ name: string; version: string }> = [];

      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
        const cleanVersion = version.replace(/[\^~>=<]/g, '').split(' ')[0];
        if (cleanVersion && cleanVersion !== '*' && cleanVersion !== 'latest') {
          allDeps.push({ name, version: cleanVersion });
        }
      }
      for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
        const cleanVersion = version.replace(/[\^~>=<]/g, '').split(' ')[0];
        if (cleanVersion && cleanVersion !== '*' && cleanVersion !== 'latest') {
          allDeps.push({ name, version: cleanVersion });
        }
      }

      if (allDeps.length === 0) return [];

      // OSV.dev batch query — max 1000 per request
      const BATCH_SIZE = 100;
      const allFindings: CVEFinding[] = [];

      for (let i = 0; i < allDeps.length; i += BATCH_SIZE) {
        const batch = allDeps.slice(i, i + BATCH_SIZE);
        const queries = batch.map(dep => ({
          package: { name: dep.name, ecosystem: 'npm' },
          version: dep.version,
        }));

        try {
          const response = await fetch('https://api.osv.dev/v1/querybatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ queries }),
            signal: AbortSignal.timeout(15000),
          });

          if (!response.ok) {
            logger.warn(`[DependencyScanner] OSV API returned ${response.status}`);
            continue;
          }

          const data = await response.json() as OsvBatchResponse;
          const results = data.results ?? [];

          for (let j = 0; j < results.length; j++) {
            const result = results[j];
            const dep = batch[j];
            if (!result?.vulns?.length) continue;

            for (const vuln of result.vulns) {
              const severity = this.extractSeverity(vuln);
              const fixedVersion = this.extractFixedVersion(vuln);
              allFindings.push({
                packageName: dep.name,
                version: dep.version,
                cveId: vuln.id,
                severity,
                description: vuln.summary ?? `Vulnerability in ${dep.name}@${dep.version}`,
                fixedVersion,
              });
            }
          }
        } catch (batchErr) {
          logger.warn(`[DependencyScanner] Batch query failed: ${String(batchErr)}`);
        }
      }

      this.applyDiagnostics(uri, allFindings, text);
      return allFindings;
    } catch (err) {
      logger.error(`[DependencyScanner] Failed to scan ${uri.fsPath}`, err);
      return [];
    }
  }

  private extractSeverity(vuln: OsvVulnerability): string {
    if (vuln.severity && vuln.severity.length > 0) {
      const cvss = vuln.severity.find(s => s.type === 'CVSS_V3' || s.type === 'CVSS_V2');
      if (cvss) {
        const score = parseFloat(cvss.score);
        if (score >= 9.0) return 'CRITICAL';
        if (score >= 7.0) return 'HIGH';
        if (score >= 4.0) return 'MEDIUM';
        return 'LOW';
      }
    }
    // Infer from ID
    if (vuln.id.startsWith('CVE-')) return 'HIGH';
    return 'MEDIUM';
  }

  private extractFixedVersion(vuln: OsvVulnerability): string {
    try {
      for (const affected of vuln.affected ?? []) {
        for (const range of affected.ranges ?? []) {
          for (const event of range.events ?? []) {
            if (event.fixed) return event.fixed;
          }
        }
      }
    } catch { /* ignore */ }
    return 'unknown';
  }

  private applyDiagnostics(uri: vscode.Uri, findings: CVEFinding[], packageJsonText: string): void {
    const lines = packageJsonText.split('\n');
    const diagnostics: vscode.Diagnostic[] = [];

    for (const finding of findings) {
      // Find the line containing this package name
      let lineIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`"${finding.packageName}"`)) {
          lineIdx = i;
          break;
        }
      }

      const col = lines[lineIdx]?.indexOf(`"${finding.packageName}"`) ?? 0;
      const range = new vscode.Range(
        new vscode.Position(lineIdx, Math.max(0, col)),
        new vscode.Position(lineIdx, Math.max(0, col) + finding.packageName.length + 2)
      );

      const severity = finding.severity === 'CRITICAL' || finding.severity === 'HIGH'
        ? vscode.DiagnosticSeverity.Error
        : vscode.DiagnosticSeverity.Warning;

      const diag = new vscode.Diagnostic(
        range,
        `[CyberMind CVE] ${finding.cveId} in ${finding.packageName}@${finding.version} (${finding.severity}): ${finding.description}${finding.fixedVersion !== 'unknown' ? ` — Fix: upgrade to ${finding.fixedVersion}` : ''}`,
        severity
      );
      diag.source = 'CyberMind Deps';
      diag.code = finding.cveId;
      diagnostics.push(diag);
    }

    this.diagnosticCollection.set(uri, diagnostics);
  }

  dispose(): void {
    this.saveWatcher?.dispose();
    this.diagnosticCollection.dispose();
  }
}
