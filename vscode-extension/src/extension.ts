import * as vscode from 'vscode';
import { AuthManager } from './api/AuthManager';
import { BackendClient } from './api/BackendClient';
import { McpManager } from './api/McpManager';
import { OAuthFlow } from './api/OAuthFlow';
import { SessionManager } from './session/SessionManager';
import { RepoIndexer } from './indexer/RepoIndexer';
import { SecurityScanner } from './security/SecurityScanner';
import { TerminalManager } from './operations/TerminalManager';
import { UndoStack } from './operations/UndoStack';
import { FileOperations } from './operations/FileOperations';
import { PathSanitizer } from './security/PathSanitizer';
import { AgentRegistry } from './agents/AgentRegistry';
import { AutoDebugAgent } from './agents/AutoDebugAgent';
import { WorkspaceIntelligence } from './agents/WorkspaceIntelligence';
import { ProjectMemoryManager } from './api/ProjectMemory';
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
    const oauthFlow = new OAuthFlow(authManager, backendClient);
    const sessionManager = new SessionManager(context.globalState);
    const agentRegistry = new AgentRegistry(context.globalState);
    const mcpManager = new McpManager(context.globalState);

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
    const pathSanitizer = new PathSanitizer(workspaceRoot);
    const undoStack = new UndoStack();
    const fileOps = new FileOperations(undoStack, pathSanitizer);
    const terminalManager = new TerminalManager();
    const repoIndexer = new RepoIndexer();
    const securityScanner = new SecurityScanner(backendClient);

    // Load MCP config from file and start enabled servers
    await mcpManager.loadFromConfigFile();
    await mcpManager.startEnabledServers();

    // Start workspace intelligence
    const projectMemory = new ProjectMemoryManager();
    await projectMemory.load();
    const workspaceIntelligence = new WorkspaceIntelligence(backendClient, authManager, projectMemory);
    workspaceIntelligence.startAutoScanOnSave(context);

    // Run workspace analysis in background
    workspaceIntelligence.analyzeWorkspace().then(insights => {
      if (insights.length > 0) {
        const errors = insights.filter(i => i.severity === 'error');
        if (errors.length > 0) {
          vscode.window.showWarningMessage(
            `CyberMind: ${errors.length} issue(s) found in workspace`,
            'View Details'
          ).then(action => {
            if (action === 'View Details') {
              vscode.commands.executeCommand('workbench.view.extension.cybermind');
            }
          });
        }
      }
    }).catch(() => {});

    // --- Real-time SAST: scan on save ---
    const scanOnSaveDisposable = securityScanner.startScanOnSave();
    context.subscriptions.push(scanOnSaveDisposable);

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
      agentRegistry,
      mcpManager
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

    // --- Register URI handler for OAuth callback ---
    // Handles: vscode://cybermind/auth?token=...&plan=...&email=...&state=...
    context.subscriptions.push(
      vscode.window.registerUriHandler({
        handleUri: async (uri: vscode.Uri) => {
          if (uri.path === '/auth') {
            const params = new URLSearchParams(uri.query);
            const token = params.get('token');
            const plan = params.get('plan') || 'free';
            const email = params.get('email') || '';

            if (token) {
              await authManager.setToken(token);
              if (email) await authManager.setUserEmail(email);
              await authManager.setUserPlan(plan);

              const displayName = email?.split('@')[0] || 'User';
              chatPanelProvider.postToWebview({
                type: 'authState',
                isAuthenticated: true,
                email,
                plan,
                displayName,
              });
              chatPanelProvider.postToWebview({ type: 'showScreen', screen: 'chat' });
              chatPanelProvider.postToWebview({ type: 'welcome', name: displayName, plan });
              chatPanelProvider.postToWebview({ type: 'agentList', agents: agentRegistry.getAllAgents() });

              vscode.window.showInformationMessage(`CyberMind: Welcome, ${displayName}! (${plan} plan)`);
            }
          }
        }
      })
    );

    // --- signIn command (opens browser OAuth flow) ---
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.signIn', async () => {
        vscode.window.showInformationMessage('CyberMind: Opening sign-in page in your browser...');
        const crypto = await import('crypto');
        const state = crypto.randomBytes(16).toString('hex');
        const loginUrl = `https://cybermindcli1.vercel.app/auth/vscode?state=${state}`;
        await vscode.env.openExternal(vscode.Uri.parse(loginUrl));
      })
    );

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

    // 12. openMcpConfig — open/create MCP config file
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.openMcpConfig', async () => {
        await mcpManager.createDefaultConfig();
      })
    );

    // 13. planMode
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.planMode', async () => {
        const goal = await vscode.window.showInputBox({
          prompt: 'Describe what you want to build or change',
          placeHolder: 'e.g. Add JWT authentication with refresh tokens',
        });
        if (goal) {
          await chatPanelProvider.sendToChat(`/plan ${goal}`, 'code');
          vscode.commands.executeCommand('workbench.view.extension.cybermind');
        }
      })
    );

    // 14. buildMode — full-stack architect + builder
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.buildMode', async () => {
        const goal = await vscode.window.showInputBox({
          prompt: 'Describe the app you want to build',
          placeHolder: 'e.g. SaaS dashboard with Next.js, Supabase, Stripe',
        });
        if (goal) {
          await chatPanelProvider.sendToChat(`/build ${goal}`, 'code');
          vscode.commands.executeCommand('workbench.view.extension.cybermind');
        }
      })
    );

    // 15. generateImage — free image generation
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.generateImage', async () => {
        const prompt = await vscode.window.showInputBox({
          prompt: 'Describe the image to generate',
          placeHolder: 'e.g. modern SaaS dashboard hero image, dark theme, cyan accents',
        });
        if (prompt) {
          await chatPanelProvider.sendToChat(`/image ${prompt}`, 'code');
          vscode.commands.executeCommand('workbench.view.extension.cybermind');
        }
      })
    );

    // 16. autoDebug — fix errors automatically
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.autoDebug', async () => {
        const editor = vscode.window.activeTextEditor;
        const diagnostics = editor
          ? vscode.languages.getDiagnostics(editor.document.uri)
              .filter(d => d.severity === vscode.DiagnosticSeverity.Error)
          : [];

        if (diagnostics.length > 0) {
          const errorList = diagnostics.map(d => `Line ${d.range.start.line + 1}: ${d.message}`).join('\n');
          await chatPanelProvider.sendToChat(`/debug ${errorList}`, 'bug-fix');
        } else {
          const error = await vscode.window.showInputBox({
            prompt: 'Paste the error message to fix',
            placeHolder: 'TypeError: Cannot read property...',
          });
          if (error) {
            await chatPanelProvider.sendToChat(`/debug ${error}`, 'bug-fix');
          }
        }
        vscode.commands.executeCommand('workbench.view.extension.cybermind');
      })
    );

    // 17. viewMemory — open project memory file
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.viewMemory', async () => {
        await projectMemory.openMemoryFile();
      })
    );

    // 18. analyzeWorkspace — run workspace intelligence
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.analyzeWorkspace', async () => {
        const insights = await workspaceIntelligence.analyzeWorkspace();
        if (insights.length === 0) {
          vscode.window.showInformationMessage('CyberMind: Workspace looks good! No issues found.');
        } else {
          const messages = insights.map(i => `${i.severity === 'error' ? '❌' : '⚠️'} ${i.message}`).join('\n');
          vscode.window.showInformationMessage(`CyberMind found ${insights.length} insight(s)`, 'View in Chat').then(action => {
            if (action === 'View in Chat') {
              chatPanelProvider.postToWebview({ type: 'token', text: `\n\n**Workspace Analysis:**\n${messages}` });
              vscode.commands.executeCommand('workbench.view.extension.cybermind');
            }
          });
        }
      })
    );

    // --- Push disposables ---
    context.subscriptions.push(
      { dispose: () => terminalManager.dispose() },
      { dispose: () => repoIndexer.dispose() },
      { dispose: () => settingsPanelProvider.dispose() },
      { dispose: () => inlineProvider.dispose() },
      { dispose: () => mcpManager.stopAll() },
      { dispose: () => workspaceIntelligence.dispose() }
    );

    // 19. toggleScanOnSave — enable/disable real-time SAST
    context.subscriptions.push(
      vscode.commands.registerCommand('cybermind.toggleScanOnSave', () => {
        const current = securityScanner.isScanOnSaveEnabled();
        securityScanner.setScanOnSave(!current);
        vscode.window.showInformationMessage(
          `CyberMind: Real-time security scan on save ${!current ? 'enabled' : 'disabled'}.`
        );
      })
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
