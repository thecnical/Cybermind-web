import * as vscode from 'vscode';
import { BackendClient } from '../api/BackendClient';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { SECURITY_PROMPT } from '../agents/agents';
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

export class SecurityScanner {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(private readonly backendClient: BackendClient) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('cybermind-security');
  }

  async scanFile(uri: vscode.Uri): Promise<VulnerabilityFinding[]> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');

      const response = await this.backendClient.freeChat(
        {
          message: `Analyze this file for security vulnerabilities:\n\n${text}`,
          agent: 'security',
          context: `File: ${uri.fsPath}`,
        },
        () => {} // No streaming needed for scan
      );

      const findings = this.parseFindings(response, uri.fsPath);
      this.applyDiagnostics(findings);
      return findings;
    } catch (error) {
      logger.error(`Failed to scan file: ${uri.fsPath}`, error);
      return [];
    }
  }

  async scanWorkspace(
    indexer: RepoIndexer,
    onProgress: (current: number, total: number) => void
  ): Promise<VulnerabilityFinding[]> {
    const status = indexer.getStatus();
    const allFiles = indexer.searchFiles('');
    const total = allFiles.length;
    const allFindings: VulnerabilityFinding[] = [];

    const BATCH_SIZE = 5;

    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          try {
            const uri = vscode.Uri.file(file.path);
            const findings = await this.scanFile(uri);
            allFindings.push(...findings);
          } catch (error) {
            logger.warn(`Failed to scan ${file.path}`, String(error));
          }
        })
      );

      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }

    return allFindings;
  }

  parseFindings(response: string, defaultFilePath: string): VulnerabilityFinding[] {
    const findings: VulnerabilityFinding[] = [];

    // Extract content from <cybermind-findings> XML tag
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
          line: Math.max(0, (f.line ?? 1) - 1), // Convert to 0-indexed
          column: Math.max(0, (f.column ?? 1) - 1),
          severity,
          category: f.category ?? 'Unknown',
          description: f.description ?? '',
          remediationSuggestion: f.remediation ?? '',
        });
      }
    } catch (error) {
      logger.warn('Failed to parse security findings JSON', String(error));
    }

    return findings;
  }

  applyDiagnostics(findings: VulnerabilityFinding[]): void {
    // Group findings by file
    const byFile = new Map<string, VulnerabilityFinding[]>();
    for (const finding of findings) {
      const existing = byFile.get(finding.filePath) ?? [];
      existing.push(finding);
      byFile.set(finding.filePath, existing);
    }

    // Apply diagnostics per file
    for (const [filePath, filefindings] of byFile) {
      const uri = vscode.Uri.file(filePath);
      const diagnostics: vscode.Diagnostic[] = filefindings.map(f => {
        const range = new vscode.Range(
          new vscode.Position(f.line, f.column),
          new vscode.Position(f.line, f.column + 1)
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          `[${f.category}] ${f.description}\n\nRemediation: ${f.remediationSuggestion}`,
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
      total: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
      info: findings.filter(f => f.severity === 'info').length,
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
    this.diagnosticCollection.dispose();
  }
}
