import * as vscode from 'vscode';
import { AuthManager } from './api/AuthManager';
import { BackendClient } from './api/BackendClient';
import { SessionManager } from './session/SessionManager';
import { RepoIndexer } from './indexer/RepoIndexer';
import { SecurityScanner } from './security/SecurityScanner';
import { TerminalManager } from './operations/TerminalManager';
import { UndoStack } from './operations/UndoStack';
import { FileOperations } from './operations/FileOperations';
import { PathSanitizer } from './security/PathSanitizer';
import { AgentRegistry } from './agents/AgentRegistry';
import { InlineCompletionProvider } from './completions/InlineCompletionProvider';
import { CyberMindCodeActionProvider } from './codeactions/CyberMindCodeActionProvider';
import { ChatPanelProvider } from './panel/ChatPanelProvider';
import { SettingsPanelProvider } from './panel/SettingsPanelProvider';
import { logger } from './utils/logger';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    logger.info('CyberMind extension activating...');

    // --- Instantiate all singletons ---
    const authManager = new AuthManager(context.secrets);
    const backendClient = new BackendClient();
    const sessionManager = new SessionManager(context.globalState);
    const agentRegistry = new AgentRegistry(context.globalState);

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
    const pathSanitizer = new PathSanitizer(workspaceRoot);
    const undoStack = new UndoStack();
    const fileOps = new FileOperations(undoStack, pathSanitizer);
    const terminalManager = new TerminalManager();
    const repoIndexer = new RepoIndexer();
    const securityScanner = new SecurityScanner(backendClient);

    // --- Register DiagnosticCollection ---
    context.subscriptions.push(securityScanner);

    // --- Register ChatPanelProvider as WebviewViewProvider ---
    const chatPanelProvider = new ChatPanelProvider(
      context.extensionUri,
      authManager,
      sessionManager,
      backendClient,
      repoIndexer,
      fileOps,
      terminalManager,
      securityScanner,
      agentRegistry
    );

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        ChatPanelProvider.viewType,
        chatPanelProvider,
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    );

    // --- Settings panel provider ---
    const settingsPanelProvider = new SettingsPanelProvider(
      context.extensionUri,
      authManager,
      repoIndexer
    );

    // --- Register InlineCompletionProvider ---
    const inlineProvider = new InlineCompletionProvider(backendClient, authManager);
    context.subscriptions.push(
      vscode.languages.registerInlineCompletionItemProvider(
        { pattern: '**' },
        inlineProvider
      )
    );

    // --- Register CodeActionProvider ---
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        { pattern: '**' },
        new CyberMindCodeActionProvider(),
        { providedCodeActionKinds: CyberMindCodeActionProvider.providedCodeActionKinds }
      )
    );

    // --- Start repo indexer watching ---
    repoIndexer.startWatching(context);

    // --- Register all 11 commands ---

    // 1. openChat
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.openChat', () => {
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 2. openSettings
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.openSettings', () => {
        settingsPanelProvider.openSettings();
      })
    );

    // 3. scanFile
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.scanFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showWarningMessage('CyberMind: No active file to scan.');
          return;
        }

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'CyberMind: Scanning file for vulnerabilities...',
            cancellable: false,
          },
          async () => {
            const findings = await securityScanner.scanFile(editor.document.uri);
            const summary = securityScanner.getSummary(findings);

            if (findings.length === 0) {
              vscode.window.showInformationMessage('CyberMind: No vulnerabilities found in this file.');
            } else {
              vscode.window.showWarningMessage(
                `CyberMind: Found ${summary.total} issue(s) — ${summary.critical} critical, ${summary.high} high, ${summary.medium} medium`
              );
            }

            chatPanelProvider.postToWebview({
              type: 'scanResults',
              findings,
              summary,
            });
          }
        );
      })
    );

    // 4. scanWorkspace
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.scanWorkspace', async () => {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'CyberMind: Scanning workspace...',
            cancellable: false,
          },
          async (progress) => {
            const findings = await securityScanner.scanWorkspace(
              repoIndexer,
              (current, total) => {
                progress.report({ message: `${current}/${total} files`, increment: (1 / total) * 100 });
              }
            );
            const summary = securityScanner.getSummary(findings);

            if (findings.length === 0) {
              vscode.window.showInformationMessage('CyberMind: No vulnerabilities found in workspace.');
            } else {
              vscode.window.showWarningMessage(
                `CyberMind: Found ${summary.total} issue(s) across workspace — ${summary.critical} critical, ${summary.high} high`
              );
            }

            chatPanelProvider.postToWebview({ type: 'scanResults', findings, summary });
          }
        );
      })
    );

    // 5. explainCode
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.explainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text.trim()) {
          vscode.window.showWarningMessage('CyberMind: Please select code to explain.');
          return;
        }

        await chatPanelProvider.sendToChat(`Explain this code:\n\`\`\`\n${text}\n\`\`\``, 'explain');
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 6. fixBug
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.fixBug', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text.trim()) {
          vscode.window.showWarningMessage('CyberMind: Please select code to fix.');
          return;
        }

        await chatPanelProvider.sendToChat(`Fix the bug in this code:\n\`\`\`\n${text}\n\`\`\``, 'bug-fix');
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 7. refactorCode
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.refactorCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text.trim()) {
          vscode.window.showWarningMessage('CyberMind: Please select code to refactor.');
          return;
        }

        await chatPanelProvider.sendToChat(`Refactor this code:\n\`\`\`\n${text}\n\`\`\``, 'refactor');
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 8. generateTests
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.generateTests', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const fileName = editor.document.fileName;

        if (!text.trim()) {
          vscode.window.showWarningMessage('CyberMind: Please select code to generate tests for.');
          return;
        }

        await chatPanelProvider.sendToChat(
          `Generate unit tests for this code from ${fileName}:\n\`\`\`\n${text}\n\`\`\``,
          'unit-test'
        );
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 9. generateDocs
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.generateDocs', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text.trim()) {
          vscode.window.showWarningMessage('CyberMind: Please select code to document.');
          return;
        }

        await chatPanelProvider.sendToChat(
          `Generate JSDoc/TSDoc documentation for this code:\n\`\`\`\n${text}\n\`\`\``,
          'docs'
        );
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 10. logout
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.logout', async () => {
        await authManager.clearAll();
        chatPanelProvider.postToWebview({ type: 'authState', isAuthenticated: false });
        chatPanelProvider.postToWebview({ type: 'showScreen', screen: 'welcome' });
        vscode.window.showInformationMessage('CyberMind: Logged out successfully.');
      })
    );

    // 11. undoLastChange
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.undoLastChange', async () => {
        const success = await undoStack.undoLast();
        if (success) {
          vscode.window.showInformationMessage('CyberMind: Last AI change undone.');
        } else {
          vscode.window.showInformationMessage('CyberMind: Nothing to undo.');
        }
      })
    );

    // --- Push disposables ---
    context.subscriptions.push(
      { dispose: () => terminalManager.dispose() },
      { dispose: () => repoIndexer.dispose() },
      { dispose: () => settingsPanelProvider.dispose() },
      { dispose: () => inlineProvider.dispose() }
    );

    logger.info('CyberMind extension activated successfully.');
  } catch (error) {
    logger.error('CyberMind activation failed', error);

    const action = await vscode.window.showErrorMessage(
      `CyberMind failed to activate: ${error instanceof Error ? error.message : String(error)}`,
      'View Logs'
    );

    if (action === 'View Logs') {
      logger.show();
    }
  }
}

export function deactivate(): void {
  logger.info('CyberMind extension deactivated.');
}
