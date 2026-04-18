import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AuthManager } from '../api/AuthManager';
import { BackendClient } from '../api/BackendClient';
import { SessionManager, Message, FileOpRecord } from '../session/SessionManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { FileOperations } from '../operations/FileOperations';
import { TerminalManager } from '../operations/TerminalManager';
import { SecurityScanner } from '../security/SecurityScanner';
import { AgentRegistry } from '../agents/AgentRegistry';
import { generateNonce } from '../utils/nonce';
import { logger } from '../utils/logger';
import * as crypto from 'crypto';

export class ChatPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'cybermind.chatView';

  private _view?: vscode.WebviewView;
  private currentAgentId = 'code';
  private currentModelId = 'cybermindcli';
  private currentMessageId: string | null = null;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly authManager: AuthManager,
    private readonly sessionManager: SessionManager,
    private readonly backendClient: BackendClient,
    private readonly repoIndexer: RepoIndexer,
    private readonly fileOps: FileOperations,
    private readonly terminalManager: TerminalManager,
    private readonly securityScanner: SecurityScanner,
    private readonly agentRegistry: AgentRegistry
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    const nonce = generateNonce();
    webviewView.webview.html = this.getWebviewContent(nonce);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        logger.error('Error handling webview message', error);
        this.postToWebview({ type: 'error', message: String(error) });
      }
    });

    // Initialize: check auth and post screen
    this.initializePanel();

    // Start repo indexer in background
    this.repoIndexer.buildIndex().then(() => {
      const status = this.repoIndexer.getStatus();
      this.postToWebview({
        type: 'indexStatus',
        fileCount: status.fileCount,
        lastIndexed: status.lastIndexed?.toISOString() ?? null,
        isIndexing: status.isIndexing,
      });
    }).catch(err => logger.warn('Repo index build failed', String(err)));
  }

  private async initializePanel(): Promise<void> {
    const isAuth = await this.authManager.isAuthenticated();
    if (isAuth) {
      const apiKey = await this.authManager.getApiKey();
      const token = await this.authManager.getToken();
      this.postToWebview({
        type: 'authState',
        isAuthenticated: true,
        email: token ? 'Authenticated' : undefined,
        plan: apiKey ? 'api-key' : 'token',
      });
      this.postToWebview({ type: 'showScreen', screen: 'chat' });

      // Send agent list
      this.postToWebview({
        type: 'agentList',
        agents: this.agentRegistry.getAllAgents(),
      });

      // Send sessions
      const sessions = this.sessionManager.getAllSessions().map(s => ({
        id: s.id,
        title: s.title,
        timestamp: s.timestamp,
        agentId: s.agentId,
        modelId: s.modelId,
        messageCount: s.messages.length,
      }));
      this.postToWebview({ type: 'sessions', sessions });
    } else {
      this.postToWebview({ type: 'authState', isAuthenticated: false });
      this.postToWebview({ type: 'showScreen', screen: 'welcome' });
    }
  }

  private async handleMessage(message: { type: string; [key: string]: unknown }): Promise<void> {
    switch (message.type) {
      case 'sendMessage':
        await this.handleSendMessage(message as {
          type: string;
          text: string;
          agent: string;
          model: string;
          attachments: string[];
        });
        break;
      case 'applyEdit':
        await this.handleApplyEdit(message as {
          type: string;
          messageId: string;
          filePath: string;
          newContent: string;
        });
        break;
      case 'rejectEdit':
        this.handleRejectEdit(message as { type: string; messageId: string });
        break;
      case 'switchAgent':
        this.handleSwitchAgent(message as { type: string; agentId: string });
        break;
      case 'switchModel':
        this.handleSwitchModel(message as { type: string; modelId: string });
        break;
      case 'atMentionQuery':
        await this.handleAtMention(message as { type: string; query: string });
        break;
      case 'newChat':
        this.handleNewChat();
        break;
      case 'loadSession':
        this.handleLoadSession(message.sessionId as string);
        break;
      case 'openFile':
        await this.handleOpenFile(message.filePath as string);
        break;
      case 'openSettings':
        vscode.commands.executeCommand('cybermind.openSettings');
        break;
      case 'logout':
        await this.handleLogout();
        break;
      case 'signIn':
        await this.handleSignIn(message.email as string, message.password as string);
        break;
      case 'signInWithApiKey':
        await this.handleSignInWithApiKey(message.apiKey as string);
        break;
      case 'saveApiKey':
        await this.handleSaveApiKey(message.apiKey as string);
        break;
      case 'reindexWorkspace':
        await this.handleReindexWorkspace();
        break;
      case 'saveCustomAgent':
        this.handleSaveCustomAgent(message.agent as Parameters<AgentRegistry['saveCustomAgent']>[0]);
        break;
      case 'deleteCustomAgent':
        this.handleDeleteCustomAgent(message.agentId as string);
        break;
      case 'saveInstructions':
        // Store custom instructions (future use)
        logger.info('Custom instructions saved');
        break;
      case 'confirmDangerousCommand':
        this.terminalManager.confirmDangerousCommand(
          message.commandId as string,
          message.confirmed as boolean
        );
        break;
      default:
        logger.warn(`Unknown message type: ${message.type}`);
    }
  }

  private async handleSendMessage(payload: {
    type: string;
    text: string;
    agent: string;
    model: string;
    attachments: string[];
  }): Promise<void> {
    const { text, agent, model, attachments } = payload;

    if (!text?.trim()) return;

    // Cancel any in-flight request
    this.backendClient.cancelCurrentRequest();

    this.currentAgentId = agent || this.currentAgentId;
    this.currentModelId = model || this.currentModelId;

    const messageId = crypto.randomUUID();
    this.currentMessageId = messageId;

    // Add user message to session
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      agentId: this.currentAgentId,
    };
    this.sessionManager.addMessage(userMsg);

    // Build context from active file + attachments
    let context = '';

    // Active file context
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const doc = activeEditor.document;
      const selection = activeEditor.selection;
      const selectedText = doc.getText(selection);
      const fileContent = selectedText || doc.getText().slice(0, 50000);
      const relativePath = vscode.workspace.asRelativePath(doc.uri);
      context += `Active file: ${relativePath}\n\`\`\`${doc.languageId}\n${fileContent}\n\`\`\`\n\n`;
    }

    // Attachment context (at-mention files)
    if (attachments && attachments.length > 0) {
      const maxFiles = Math.min(attachments.length, 10);
      for (let i = 0; i < maxFiles; i++) {
        try {
          const content = await this.repoIndexer.getFileContent(attachments[i]);
          const truncated = content.slice(0, 50000);
          context += `File: ${attachments[i]}\n\`\`\`\n${truncated}\n\`\`\`\n\n`;
        } catch {
          // Skip unreadable files
        }
      }
    }

    // Get agent info
    const agentDef = this.agentRegistry.getAgent(this.currentAgentId);
    const agentName = agentDef?.name ?? this.currentAgentId;

    // Show typing indicator
    this.postToWebview({ type: 'token', text: '' });

    try {
      const apiKey = await this.authManager.getApiKey();
      const cancellationSource = new vscode.CancellationTokenSource();

      let fullResponse = '';

      const chatRequest = {
        message: text,
        agent: this.currentAgentId,
        context,
      };

      await this.backendClient.chat(
        chatRequest,
        this.currentModelId,
        apiKey,
        (token) => {
          fullResponse += token;
          this.postToWebview({ type: 'token', text: token });
        },
        cancellationSource.token
      );

      // Parse file operations from response
      const fileOps = await this.parseAndExecuteFileOps(fullResponse, messageId);

      // Add assistant message to session
      const assistantMsg: Message = {
        id: messageId,
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
        agentId: this.currentAgentId,
        fileOps,
      };
      this.sessionManager.addMessage(assistantMsg);
      this.sessionManager.saveCurrentSession();
      await this.sessionManager.summarizeIfNeeded();

      this.postToWebview({ type: 'done', messageId, fileOps });

      // Update sessions list
      const sessions = this.sessionManager.getAllSessions().map(s => ({
        id: s.id,
        title: s.title,
        timestamp: s.timestamp,
        agentId: s.agentId,
        modelId: s.modelId,
        messageCount: s.messages.length,
      }));
      this.postToWebview({ type: 'sessions', sessions });

      cancellationSource.dispose();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);

      // Handle 401 - session expired
      if (errMsg.includes('401')) {
        await this.authManager.clearAll();
        this.postToWebview({ type: 'showScreen', screen: 'signin' });
        this.postToWebview({ type: 'error', message: 'Session expired. Please sign in again.' });
        return;
      }

      // Handle 429 - rate limit
      if (errMsg.includes('429')) {
        this.postToWebview({ type: 'error', message: 'Rate limit reached. Please wait a moment and try again.' });
        return;
      }

      // Network error
      if (errMsg.includes('fetch') || errMsg.includes('network') || errMsg.includes('ECONNREFUSED')) {
        this.postToWebview({ type: 'error', message: 'Unable to reach CyberMind backend. Check your connection.' });
        return;
      }

      this.postToWebview({ type: 'error', message: errMsg });
      logger.error('Send message failed', error);
    }
  }

  private async parseAndExecuteFileOps(response: string, messageId: string): Promise<FileOpRecord[]> {
    const fileOps: FileOpRecord[] = [];

    // Parse terminal commands: ```bash\ncommand\n```
    const bashBlocks = response.matchAll(/```(?:bash|sh|shell)\n([\s\S]*?)```/g);
    for (const match of bashBlocks) {
      const command = match[1].trim();
      if (command) {
        try {
          await this.terminalManager.executeCommand(command, (msg) => this.postToWebview(msg as Record<string, unknown>));
          fileOps.push({ type: 'edit', path: 'terminal', timestamp: Date.now() });
        } catch (err) {
          logger.warn('Terminal command failed', String(err));
        }
      }
    }

    return fileOps;
  }

  private async handleApplyEdit(payload: {
    type: string;
    messageId: string;
    filePath: string;
    newContent: string;
  }): Promise<void> {
    const { filePath, newContent, messageId } = payload;

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error('No workspace open');
      }

      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(workspaceFolders[0].uri.fsPath, filePath);

      const uri = vscode.Uri.file(absolutePath);
      const accepted = await this.fileOps.editFile({ uri, newContent });

      if (accepted) {
        this.postToWebview({ type: 'done', messageId, fileOps: [{ type: 'edit', path: filePath, timestamp: Date.now() }] });
      }
    } catch (error) {
      logger.error('Apply edit failed', error);
      this.postToWebview({ type: 'error', message: `Failed to apply edit: ${String(error)}` });
    }
  }

  private handleRejectEdit(payload: { type: string; messageId: string }): void {
    logger.info(`Edit rejected for message: ${payload.messageId}`);
  }

  private handleSwitchAgent(payload: { type: string; agentId: string }): void {
    this.currentAgentId = payload.agentId;
    const config = vscode.workspace.getConfiguration('cybermind');
    config.update('activeAgent', payload.agentId, vscode.ConfigurationTarget.Global);
  }

  private handleSwitchModel(payload: { type: string; modelId: string }): void {
    this.currentModelId = payload.modelId;
    const config = vscode.workspace.getConfiguration('cybermind');
    config.update('activeModel', payload.modelId, vscode.ConfigurationTarget.Global);
  }

  private async handleAtMention(payload: { type: string; query: string }): Promise<void> {
    const results = this.repoIndexer.searchFiles(payload.query);
    const files = results.map(f => f.relativePath);
    this.postToWebview({ type: 'atMentionResults', files });
  }

  handleNewChat(): void {
    this.sessionManager.saveCurrentSession();
    const session = this.sessionManager.createSession(this.currentAgentId, this.currentModelId);
    this.postToWebview({ type: 'sessionLoaded', session });
  }

  private handleLoadSession(sessionId: string): void {
    const session = this.sessionManager.loadSession(sessionId);
    if (session) {
      this.currentAgentId = session.agentId;
      this.currentModelId = session.modelId;
      this.postToWebview({ type: 'sessionLoaded', session });
    }
  }

  private async handleOpenFile(filePath: string): Promise<void> {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) return;

      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(workspaceFolders[0].uri.fsPath, filePath);

      const uri = vscode.Uri.file(absolutePath);
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
    } catch (error) {
      logger.error('Open file failed', error);
    }
  }

  private async handleLogout(): Promise<void> {
    await this.authManager.clearAll();
    this.postToWebview({ type: 'authState', isAuthenticated: false });
    this.postToWebview({ type: 'showScreen', screen: 'welcome' });
  }

  private async handleSignIn(email: string, password: string): Promise<void> {
    try {
      const result = await this.backendClient.login({ email, password });
      await this.authManager.setToken(result.token);
      this.postToWebview({ type: 'authState', isAuthenticated: true, email, plan: 'token' });
      this.postToWebview({ type: 'showScreen', screen: 'chat' });
      this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
    } catch (error) {
      this.postToWebview({ type: 'error', message: `Sign in failed: ${String(error)}` });
    }
  }

  private async handleSignInWithApiKey(apiKey: string): Promise<void> {
    if (!this.authManager.validateApiKeyFormat(apiKey)) {
      this.postToWebview({ type: 'error', message: 'Invalid API key format. Must start with cp_live_' });
      return;
    }

    const valid = await this.backendClient.validateApiKey(apiKey);
    if (!valid) {
      this.postToWebview({ type: 'error', message: 'API key validation failed. Please check your key.' });
      return;
    }

    await this.authManager.setApiKey(apiKey);
    this.postToWebview({ type: 'authState', isAuthenticated: true, plan: 'api-key' });
    this.postToWebview({ type: 'showScreen', screen: 'chat' });
    this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
  }

  private async handleSaveApiKey(apiKey: string): Promise<void> {
    if (!this.authManager.validateApiKeyFormat(apiKey)) {
      this.postToWebview({ type: 'error', message: 'Invalid API key format. Must start with cp_live_' });
      return;
    }
    await this.authManager.setApiKey(apiKey);
    this.postToWebview({ type: 'authState', isAuthenticated: true, plan: 'api-key' });
  }

  private async handleReindexWorkspace(): Promise<void> {
    this.postToWebview({ type: 'indexStatus', fileCount: 0, lastIndexed: null, isIndexing: true });
    await this.repoIndexer.buildIndex();
    const status = this.repoIndexer.getStatus();
    this.postToWebview({
      type: 'indexStatus',
      fileCount: status.fileCount,
      lastIndexed: status.lastIndexed?.toISOString() ?? null,
      isIndexing: false,
    });
  }

  private handleSaveCustomAgent(agent: Parameters<AgentRegistry['saveCustomAgent']>[0]): void {
    this.agentRegistry.saveCustomAgent(agent);
    this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
  }

  private handleDeleteCustomAgent(agentId: string): void {
    this.agentRegistry.deleteCustomAgent(agentId);
    this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
  }

  postToWebview(message: Record<string, unknown>): void {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }

  // Called from extension commands to send context to chat
  async sendToChat(text: string, agentId?: string): Promise<void> {
    if (agentId) {
      this.currentAgentId = agentId;
    }
    // Focus the view
    await vscode.commands.executeCommand('cybermind.chatView.focus');
    // Post a pre-fill message
    this.postToWebview({ type: 'prefillMessage', text, agentId: agentId ?? this.currentAgentId });
  }

  private getWebviewContent(nonce: string): string {
    // HTML is in media/ folder (included in .vsix, src/ is excluded)
    const htmlPath = path.join(this.extensionUri.fsPath, 'media', 'chat.html');

    let html: string;
    try {
      html = fs.readFileSync(htmlPath, 'utf8');
    } catch {
      // Fallback minimal HTML
      html = `<!DOCTYPE html><html><body style="background:#1a1a1a;color:#e0e0e0;font-family:sans-serif;padding:20px"><p>CyberMind loading...</p><p style="font-size:11px;color:#666">If this persists, reinstall the extension.</p></body></html>`;
    }

    // Replace nonce placeholder
    html = html.replace(/\{\{NONCE\}\}/g, nonce);

    return html;
  }
}
