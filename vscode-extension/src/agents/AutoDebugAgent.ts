import * as vscode from 'vscode';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { FileOperations } from '../operations/FileOperations';
import { TerminalManager } from '../operations/TerminalManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { logger } from '../utils/logger';

const AUTO_DEBUG_SYSTEM = `You are CyberMind Auto-Debug Agent. You receive terminal error output and fix it automatically.

Analyze the error and output a fix in this format:
1. First line: brief diagnosis (what went wrong)
2. Then for each file to fix:
\`\`\`filepath:path/to/file.ts
// complete fixed file content
\`\`\`
3. If a command needs to run: \`\`\`bash\ncommand\n\`\`\`

Rules:
- Fix the root cause, not just the symptom
- Output complete file content, not diffs
- Be minimal — only change what's needed
- If it's a missing package: output the install command`;

export interface DebugSession {
  error: string;
  filePath?: string;
  line?: number;
  fixed: boolean;
  attempts: number;
}

/**
 * AutoDebugAgent — watches for errors and fixes them automatically.
 *
 * Monitors:
 * 1. VSCode diagnostics (TypeScript errors, lint errors)
 * 2. Terminal output errors (from TerminalManager)
 * 3. Manual trigger via command
 */
export class AutoDebugAgent {
  private isActive = false;
  private diagnosticWatcher: vscode.Disposable | null = null;
  private onFixCallback: ((message: string) => void) | null = null;

  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager,
    private readonly fileOps: FileOperations,
    private readonly terminalManager: TerminalManager,
    private readonly repoIndexer: RepoIndexer
  ) {}

  setOnFix(callback: (message: string) => void): void {
    this.onFixCallback = callback;
  }

  startWatching(context: vscode.ExtensionContext): void {
    if (this.isActive) return;
    this.isActive = true;

    // Watch for diagnostic changes (TypeScript errors, etc.)
    this.diagnosticWatcher = vscode.languages.onDidChangeDiagnostics(async (event) => {
      if (!this.isActive) return;

      for (const uri of event.uris) {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        const errors = diagnostics.filter(d =>
          d.severity === vscode.DiagnosticSeverity.Error &&
          d.source !== 'CyberMind Security' // Don't auto-fix our own security findings
        );

        if (errors.length > 0 && errors.length <= 5) {
          // Auto-fix small number of errors
          const config = vscode.workspace.getConfiguration('cybermind');
          const autoFix = config.get<boolean>('autoDebug.enabled', false);
          if (autoFix) {
            await this.fixDiagnosticErrors(uri, errors);
          }
        }
      }
    });

    context.subscriptions.push(this.diagnosticWatcher);
    logger.info('[AutoDebug] Watching for errors');
  }

  stopWatching(): void {
    this.isActive = false;
    if (this.diagnosticWatcher) {
      this.diagnosticWatcher.dispose();
      this.diagnosticWatcher = null;
    }
  }

  // Fix errors from terminal output
  async fixTerminalError(
    errorOutput: string,
    modelId: string
  ): Promise<{ fixed: boolean; message: string }> {
    if (!errorOutput || errorOutput.length < 10) {
      return { fixed: false, message: 'No error to fix' };
    }

    logger.info(`[AutoDebug] Fixing terminal error: ${errorOutput.slice(0, 100)}`);

    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    // Get relevant file context
    const context = await this.buildErrorContext(errorOutput);

    const request: ChatRequest = {
      message: `Fix this error:\n\n${errorOutput.slice(0, 3000)}\n\nContext:\n${context}`,
      agent: 'bug-fix',
      context: '',
      system: AUTO_DEBUG_SYSTEM,
    };

    let response = '';
    try {
      await this.backendClient.chat(
        request, modelId, apiKey,
        (token) => { response += token; },
        undefined, null, openRouterKey
      );

      const filesFixed = await this.applyFixes(response);
      const message = filesFixed.length > 0
        ? `🐛 Auto-fixed: ${filesFixed.join(', ')}`
        : `🔍 Diagnosis: ${response.split('\n')[0]}`;

      if (this.onFixCallback) this.onFixCallback(message);
      return { fixed: filesFixed.length > 0, message };
    } catch (err) {
      return { fixed: false, message: `Auto-debug failed: ${String(err)}` };
    }
  }

  // Fix VSCode diagnostic errors
  private async fixDiagnosticErrors(
    uri: vscode.Uri,
    errors: vscode.Diagnostic[]
  ): Promise<void> {
    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const fileContent = Buffer.from(content).toString('utf8');
      const relativePath = vscode.workspace.asRelativePath(uri);

      const errorList = errors.map(e =>
        `Line ${e.range.start.line + 1}: [${e.source}] ${e.message}`
      ).join('\n');

      const request: ChatRequest = {
        message: `Fix these TypeScript/lint errors in ${relativePath}:\n\n${errorList}\n\nFile content:\n\`\`\`\n${fileContent.slice(0, 6000)}\n\`\`\``,
        agent: 'bug-fix',
        context: '',
        system: AUTO_DEBUG_SYSTEM,
      };

      let response = '';
      await this.backendClient.chat(
        request, 'cybermindcli', apiKey,
        (token) => { response += token; },
        undefined, null, openRouterKey
      );

      const filesFixed = await this.applyFixes(response);
      if (filesFixed.length > 0 && this.onFixCallback) {
        this.onFixCallback(`🐛 Auto-fixed ${errors.length} error(s) in ${relativePath}`);
      }
    } catch (err) {
      logger.warn('[AutoDebug] Failed to fix diagnostic errors', String(err));
    }
  }

  private async buildErrorContext(errorOutput: string): Promise<string> {
    // Extract file paths from error output
    const filePattern = /(?:at |in |file |Error in )([^\s:]+\.[a-z]+)(?::(\d+))?/gi;
    const files: string[] = [];
    let match;

    while ((match = filePattern.exec(errorOutput)) !== null) {
      const filePath = match[1];
      if (!files.includes(filePath) && !filePath.includes('node_modules')) {
        files.push(filePath);
      }
    }

    let context = '';
    for (const filePath of files.slice(0, 3)) {
      try {
        const content = await this.repoIndexer.getFileContent(filePath);
        context += `\n=== ${filePath} ===\n${content.slice(0, 3000)}\n`;
      } catch { /* skip */ }
    }

    return context;
  }

  private async applyFixes(response: string): Promise<string[]> {
    const filesFixed: string[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) return filesFixed;

    // Parse file fixes
    const filePattern = /```(?:filepath:([^\n]+))?\n([\s\S]*?)```/g;
    let match;

    while ((match = filePattern.exec(response)) !== null) {
      const filePath = match[1]?.trim();
      const content = match[2];

      if (!filePath || !content) continue;

      // Skip bash blocks
      if (filePath === 'bash' || filePath === 'sh') {
        // Run the command
        try {
          await this.terminalManager.executeCommand(content.trim(), () => {});
        } catch { /* ignore */ }
        continue;
      }

      try {
        const absolutePath = require('path').join(workspaceFolders[0].uri.fsPath, filePath);
        const uri = vscode.Uri.file(absolutePath);

        // Apply without diff view for auto-debug (silent fix)
        const workspaceEdit = new vscode.WorkspaceEdit();
        try {
          const doc = await vscode.workspace.openTextDocument(uri);
          const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
          workspaceEdit.replace(uri, fullRange, content);
        } catch {
          workspaceEdit.createFile(uri, { overwrite: true });
          workspaceEdit.insert(uri, new vscode.Position(0, 0), content);
        }

        await vscode.workspace.applyEdit(workspaceEdit);
        filesFixed.push(filePath);
      } catch (err) {
        logger.warn(`[AutoDebug] Failed to apply fix to ${filePath}`, String(err));
      }
    }

    return filesFixed;
  }
}
