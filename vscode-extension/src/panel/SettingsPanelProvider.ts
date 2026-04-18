import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AuthManager } from '../api/AuthManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { generateNonce } from '../utils/nonce';
import { logger } from '../utils/logger';

export class SettingsPanelProvider {
  private panel: vscode.WebviewPanel | undefined;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly authManager: AuthManager,
    private readonly repoIndexer: RepoIndexer
  ) {}

  async openSettings(): Promise<void> {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'cybermind.settings',
      'CyberMind Settings',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this.extensionUri],
        retainContextWhenHidden: true,
      }
    );

    const nonce = generateNonce();
    this.panel.webview.html = this.getWebviewContent(nonce);

    this.panel.webview.onDidReceiveMessage(async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        logger.error('Settings panel message error', error);
      }
    });

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    // Post initial state
    await this.postInitialState();
  }

  private async postInitialState(): Promise<void> {
    if (!this.panel) return;

    const isAuth = await this.authManager.isAuthenticated();
    const apiKey = await this.authManager.getApiKey();
    const token = await this.authManager.getToken();

    this.panel.webview.postMessage({
      type: 'authState',
      isAuthenticated: isAuth,
      email: token ? 'Authenticated via token' : apiKey ? 'Authenticated via API key' : undefined,
      plan: apiKey ? 'api-key' : token ? 'token' : undefined,
    });

    const status = this.repoIndexer.getStatus();
    this.panel.webview.postMessage({
      type: 'indexStatus',
      fileCount: status.fileCount,
      lastIndexed: status.lastIndexed?.toISOString() ?? null,
      isIndexing: status.isIndexing,
    });

    const config = vscode.workspace.getConfiguration('cybermind');
    this.panel.webview.postMessage({
      type: 'settings',
      activeModel: config.get<string>('activeModel', 'cybermindcli'),
      inlineCompletionsEnabled: config.get<boolean>('inlineCompletions.enabled', true),
      openRouterKey: await this.repoIndexer.getStatus ? '' : '', // placeholder
    });
  }

  private async handleMessage(message: { type: string; [key: string]: unknown }): Promise<void> {
    switch (message.type) {
      case 'changeModel': {
        const config = vscode.workspace.getConfiguration('cybermind');
        await config.update('activeModel', message.modelId as string, vscode.ConfigurationTarget.Global);
        break;
      }
      case 'toggleInlineCompletions': {
        const config = vscode.workspace.getConfiguration('cybermind');
        await config.update('inlineCompletions.enabled', message.enabled as boolean, vscode.ConfigurationTarget.Global);
        break;
      }
      case 'reindexWorkspace': {
        if (this.panel) {
          this.panel.webview.postMessage({ type: 'indexStatus', fileCount: 0, lastIndexed: null, isIndexing: true });
        }
        await this.repoIndexer.buildIndex();
        const status = this.repoIndexer.getStatus();
        if (this.panel) {
          this.panel.webview.postMessage({
            type: 'indexStatus',
            fileCount: status.fileCount,
            lastIndexed: status.lastIndexed?.toISOString() ?? null,
            isIndexing: false,
          });
        }
        break;
      }
      default:
        logger.warn(`Unknown settings message: ${message.type}`);
    }
  }

  private getWebviewContent(nonce: string): string {
    // HTML is in media/ folder (included in .vsix, src/ is excluded)
    const htmlPath = path.join(this.extensionUri.fsPath, 'media', 'settings.html');

    let html: string;
    try {
      html = fs.readFileSync(htmlPath, 'utf8');
    } catch {
      html = this.getFallbackHtml(nonce);
    }

    html = html.replace(/\{\{NONCE\}\}/g, nonce);
    return html;
  }

  private getFallbackHtml(nonce: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
  <title>CyberMind Settings</title>
  <style>body{background:#1a1a1a;color:#e0e0e0;font-family:sans-serif;padding:20px;}</style>
</head>
<body>
  <h2>CyberMind Settings</h2>
  <p>Settings panel loading...</p>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
  </script>
</body>
</html>`;
  }

  dispose(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
  }
}
