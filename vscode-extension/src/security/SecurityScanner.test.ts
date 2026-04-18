import * as vscode from 'vscode';
import { SecurityScanner } from './SecurityScanner';
import { BackendClient } from '../api/BackendClient';

describe('SecurityScanner', () => {
  let scanner: SecurityScanner;
  let mockBackendClient: jest.Mocked<BackendClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBackendClient = {
      freeChat: jest.fn(),
      chat: jest.fn(),
      login: jest.fn(),
      validateApiKey: jest.fn(),
      cancelCurrentRequest: jest.fn(),
      withRetry: jest.fn(),
    } as any;
    scanner = new SecurityScanner(mockBackendClient);
  });

  describe('severityToDiagnostic', () => {
    it('maps critical to DiagnosticSeverity.Error', () => {
      expect(scanner.severityToDiagnostic('critical')).toBe(vscode.DiagnosticSeverity.Error);
    });

    it('maps high to DiagnosticSeverity.Error', () => {
      expect(scanner.severityToDiagnostic('high')).toBe(vscode.DiagnosticSeverity.Error);
    });

    it('maps medium to DiagnosticSeverity.Warning', () => {
      expect(scanner.severityToDiagnostic('medium')).toBe(vscode.DiagnosticSeverity.Warning);
    });

    it('maps low to DiagnosticSeverity.Information', () => {
      expect(scanner.severityToDiagnostic('low')).toBe(vscode.DiagnosticSeverity.Information);
    });

    it('maps info to DiagnosticSeverity.Information', () => {
      expect(scanner.severityToDiagnostic('info')).toBe(vscode.DiagnosticSeverity.Information);
    });
  });

  describe('parseFindings', () => {
    it('parses valid cybermind-findings XML block', () => {
      const response = `
I found some security issues:

<cybermind-findings>
{
  "findings": [
    {
      "file": "src/auth.ts",
      "line": 42,
      "column": 8,
      "severity": "high",
      "category": "Hardcoded Secret",
      "description": "API key hardcoded in source code",
      "remediation": "Move to environment variable"
    },
    {
      "file": "src/db.ts",
      "line": 15,
      "column": 1,
      "severity": "critical",
      "category": "SQL Injection",
      "description": "Unsanitized user input in SQL query",
      "remediation": "Use parameterized queries"
    }
  ]
}
</cybermind-findings>

Please fix these issues immediately.
      `;

      const findings = scanner.parseFindings(response, 'default.ts');

      expect(findings).toHaveLength(2);

      expect(findings[0].filePath).toBe('src/auth.ts');
      expect(findings[0].line).toBe(41); // 0-indexed
      expect(findings[0].column).toBe(7); // 0-indexed
      expect(findings[0].severity).toBe('high');
      expect(findings[0].category).toBe('Hardcoded Secret');
      expect(findings[0].description).toBe('API key hardcoded in source code');
      expect(findings[0].remediationSuggestion).toBe('Move to environment variable');

      expect(findings[1].severity).toBe('critical');
      expect(findings[1].category).toBe('SQL Injection');
    });

    it('returns empty array when no cybermind-findings tag', () => {
      const response = 'No security issues found in this code.';
      const findings = scanner.parseFindings(response, 'file.ts');
      expect(findings).toHaveLength(0);
    });

    it('returns empty array for malformed JSON', () => {
      const response = `
<cybermind-findings>
{ invalid json }
</cybermind-findings>
      `;
      const findings = scanner.parseFindings(response, 'file.ts');
      expect(findings).toHaveLength(0);
    });

    it('uses default file path when file not specified in finding', () => {
      const response = `
<cybermind-findings>
{
  "findings": [
    {
      "line": 10,
      "severity": "low",
      "category": "Info",
      "description": "Minor issue",
      "remediation": "Consider fixing"
    }
  ]
}
</cybermind-findings>
      `;
      const findings = scanner.parseFindings(response, 'default.ts');
      expect(findings[0].filePath).toBe('default.ts');
    });

    it('normalizes unknown severity to info', () => {
      const response = `
<cybermind-findings>
{
  "findings": [
    {
      "file": "test.ts",
      "line": 1,
      "severity": "unknown-level",
      "category": "Test",
      "description": "Test",
      "remediation": "Test"
    }
  ]
}
</cybermind-findings>
      `;
      const findings = scanner.parseFindings(response, 'test.ts');
      expect(findings[0].severity).toBe('info');
    });
  });
});
