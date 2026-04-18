import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AuthManager } from '../api/AuthManager';
import { BackendClient } from '../api/BackendClient';
import { McpManager } from '../api/McpManager';
import { ImageGenerator } from '../api/ImageGenerator';
import { SessionManager, Message, FileOpRecord } from '../session/SessionManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { FileOperations } from '../operations/FileOperations';
import { TerminalManager } from '../operations/TerminalManager';
import { SecurityScanner } from '../security/SecurityScanner';
import { AgentRegistry } from '../agents/AgentRegistry';
import { PlanMode, Plan } from '../agents/PlanMode';
import { AgenticLoop } from '../agents/AgenticLoop';
import { ArchitectAgent, Architecture } from '../agents/ArchitectAgent';
import { FullStackBuilder } from '../agents/FullStackBuilder';
import { generateNonce } from '../utils/nonce';
import { logger } from '../utils/logger';
import * as crypto from 'crypto';

export class ChatPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'cybermind.chatView';

  private _view?: vscode.WebviewView;
  private currentAgentId = 'code';
  private currentModelId = 'cybermindcli';
  private currentMessageId: string | null = null;
  private pendingPlan: Plan | null = null;
  private pendingArchitecture: Architecture | null = null;
  private planMode: PlanMode;
  private agenticLoop: AgenticLoop;
  private mcpManager: McpManager;
  private architectAgent: ArchitectAgent;
  private fullStackBuilder: FullStackBuilder;
  private imageGenerator: ImageGenerator;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly authManager: AuthManager,
    private readonly sessionManager: SessionManager,
    private readonly backendClient: BackendClient,
    private readonly repoIndexer: RepoIndexer,
    private readonly fileOps: FileOperations,
    private readonly terminalManager: TerminalManager,
    private readonly securityScanner: SecurityScanner,
    private readonly agentRegistry: AgentRegistry,
    mcpManager?: McpManager
  ) {
    this.planMode = new PlanMode(backendClient, authManager, agentRegistry);
    this.agenticLoop = new AgenticLoop(backendClient, authManager, fileOps, terminalManager, repoIndexer, mcpManager);
    this.mcpManager = mcpManager || new McpManager({ get: () => undefined, update: async () => {} } as unknown as vscode.Memento);
    this.architectAgent = new ArchitectAgent(backendClient, authManager);
    this.fullStackBuilder = new FullStackBuilder(backendClient, authManager);
    this.imageGenerator = new ImageGenerator();
  }

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
      const email = await this.authManager.getUserEmail();
      const plan = await this.authManager.getUserPlan();
      const displayName = email?.split('@')[0] || (apiKey ? 'Developer' : 'User');

      // Auto-select model based on plan
      if (!this.currentModelId || this.currentModelId === 'cybermindcli') {
        if (plan === 'elite') this.currentModelId = 'elite-claude-3-7';
        else if (plan === 'pro') this.currentModelId = 'groq-llama-3.3-70b';
        else this.currentModelId = 'cybermindcli';
      }

      this.postToWebview({
        type: 'authState',
        isAuthenticated: true,
        email: email || (apiKey ? 'API Key User' : 'Authenticated'),
        plan: plan || (apiKey ? 'api-key' : 'free'),
        displayName,
      });
      this.postToWebview({ type: 'showScreen', screen: 'chat' });
      this.postToWebview({ type: 'welcome', name: displayName, plan: plan || 'free' });
      this.postToWebview({ type: 'currentModel', modelId: this.currentModelId });

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
      case 'saveOpenRouterKey':
        await this.authManager.setOpenRouterKey(message.key as string);
        this.postToWebview({ type: 'showToast', message: 'OpenRouter key saved' });
        break;
      case 'continueAsFree':
        // User chose to use free tier without signing in
        this.currentModelId = 'cybermindcli';
        this.postToWebview({ type: 'authState', isAuthenticated: false, plan: 'free' });
        this.postToWebview({ type: 'showScreen', screen: 'chat' });
        this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
        this.postToWebview({ type: 'currentModel', modelId: 'cybermindcli' });
        this.postToWebview({ type: 'welcome', name: 'Guest', plan: 'free' });
        break;
      case 'webSignIn': {
        // Open browser OAuth flow directly — no command needed
        const crypto = require('crypto') as typeof import('crypto');
        const state = crypto.randomBytes(16).toString('hex');
        const loginUrl = `https://cybermindcli1.vercel.app/auth/vscode?state=${state}`;
        vscode.env.openExternal(vscode.Uri.parse(loginUrl));
        break;
      }
      case 'openExternal':
        vscode.env.openExternal(vscode.Uri.parse(message.url as string));
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

    // Build context from active file + attachments + rich repo context
    let context = '';

    // Active file context (highest priority)
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const doc = activeEditor.document;
      const selection = activeEditor.selection;
      const selectedText = doc.getText(selection);
      const fileContent = selectedText || doc.getText().slice(0, 30000);
      const relativePath = vscode.workspace.asRelativePath(doc.uri);
      context += `Active file: ${relativePath}\n\`\`\`${doc.languageId}\n${fileContent}\n\`\`\`\n\n`;
    }

    // Attachment context (at-mention files)
    if (attachments && attachments.length > 0) {
      const maxFiles = Math.min(attachments.length, 10);
      for (let i = 0; i < maxFiles; i++) {
        try {
          const content = await this.repoIndexer.getFileContent(attachments[i]);
          context += `File: ${attachments[i]}\n\`\`\`\n${content.slice(0, 20000)}\n\`\`\`\n\n`;
        } catch { /* skip */ }
      }
    }

    // Rich repo context — relevant files based on query
    if (context.length < 60000) {
      const richContext = await this.repoIndexer.buildRichContext(text, 60000 - context.length);
      if (richContext) context += richContext;
    }

    // MCP context
    const mcpContext = this.mcpManager.buildMcpContext();
    if (mcpContext) context += `\n\n${mcpContext}`;

    // Get agent info
    const agentDef = this.agentRegistry.getAgent(this.currentAgentId);

    // Check if user wants Plan Mode
    const isPlanRequest = text.startsWith('/plan ') || text.startsWith('plan: ');
    const planGoal = isPlanRequest ? text.replace(/^\/plan\s+|^plan:\s+/i, '') : '';

    // Check if user wants full-stack build (architect mode)
    const isBuildRequest = text.startsWith('/build ') || text.startsWith('build: ');
    const buildGoal = isBuildRequest ? text.replace(/^\/build\s+|^build:\s+/i, '') : '';

    // Check if user wants image generation
    const isImageRequest = text.startsWith('/image ') || text.startsWith('/img ');
    const imagePrompt = isImageRequest ? text.replace(/^\/image\s+|^\/img\s+/i, '') : '';

    if (isImageRequest && imagePrompt) {
      await this.handleImageGeneration(imagePrompt, messageId);
      return;
    }

    if (isBuildRequest && buildGoal) {
      await this.handleBuildMode(buildGoal, messageId);
      return;
    }

    if (isPlanRequest && planGoal) {
      await this.handlePlanMode(planGoal, context, messageId);
      return;
    }

    // Check if user is approving a pending architecture build
    if (this.pendingArchitecture && (text.toLowerCase() === 'build' || text.toLowerCase() === 'build all')) {
      await this.executePendingBuild('all', messageId);
      return;
    }
    if (this.pendingArchitecture && text.toLowerCase() === 'build priority') {
      await this.executePendingBuild('priority', messageId);
      return;
    }

    // Check if user is approving a pending plan
    if (this.pendingPlan && (text.toLowerCase() === 'yes' || text.toLowerCase() === 'approve' || text.toLowerCase() === 'execute' || text.toLowerCase() === 'run')) {
      await this.executePendingPlan(messageId);
      return;
    }

    // Check if user is rejecting
    if ((this.pendingPlan || this.pendingArchitecture) && (text.toLowerCase() === 'no' || text.toLowerCase() === 'cancel' || text.toLowerCase() === 'reject')) {
      this.pendingPlan = null;
      this.pendingArchitecture = null;
      this.postToWebview({ type: 'token', text: 'Cancelled. What would you like to do instead?' });
      this.postToWebview({ type: 'done', messageId, fileOps: [] });
      return;
    }

    // Show typing indicator
    this.postToWebview({ type: 'token', text: '' });

    try {
      const apiKey = await this.authManager.getApiKey();
      const jwtToken = await this.authManager.getToken();
      const openRouterKey = await this.authManager.getOpenRouterKey();
      const cancellationSource = new vscode.CancellationTokenSource();

      let fullResponse = '';

      // Get agent system prompt — pass separately, NOT prepended to user message
      const agentDef2 = this.agentRegistry.getAgent(this.currentAgentId);
      const systemPrompt = agentDef2?.systemPrompt || '';

      const chatRequest = {
        message: text,           // user message only — clean
        agent: this.currentAgentId,
        context,
        system: systemPrompt,   // separate field for system prompt
      };

      await this.backendClient.chat(
        chatRequest,
        this.currentModelId,
        apiKey,
        (token) => {
          fullResponse += token;
          this.postToWebview({ type: 'token', text: token });
        },
        cancellationSource.token,
        jwtToken,
        openRouterKey
      );

      // Execute any MCP tool calls in the response
      const mcpResults = await this.mcpManager.executeMcpCalls(fullResponse);
      if (mcpResults) {
        this.postToWebview({ type: 'token', text: `\n\n${mcpResults}` });
        fullResponse += `\n\n${mcpResults}`;
      }

      // Process any image generation requests in the response
      const imageRequests = this.imageGenerator.parseImageRequests(fullResponse);
      if (imageRequests.length > 0) {
        this.postToWebview({ type: 'token', text: `\n\n🎨 Generating ${imageRequests.length} image(s)...` });
        const updatedResponse = await this.imageGenerator.processImageRequests(fullResponse);
        if (updatedResponse !== fullResponse) {
          fullResponse = updatedResponse;
          this.postToWebview({ type: 'token', text: '\n✅ Images generated.' });
        }
      }

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

      // Handle 401 — API key rejected, never redirect to welcome screen
      if (errMsg.includes('401') || errMsg.includes('HTTP 401')) {
        this.postToWebview({ type: 'error', message: 'API key rejected or expired. Check your key in Settings, or use Continue Free.' });
        return;
      }

      // Handle 429 - rate limit
      if (errMsg.includes('429') || errMsg.includes('HTTP 429')) {
        this.postToWebview({ type: 'error', message: 'Rate limit reached. Please wait a moment and try again.' });
        return;
      }

      // Network error
      if (errMsg.includes('fetch') || errMsg.includes('network') || errMsg.includes('ECONNREFUSED') || errMsg.includes('Unable to reach')) {
        this.postToWebview({ type: 'error', message: 'Unable to reach CyberMind backend. Check your connection.' });
        return;
      }

      this.postToWebview({ type: 'error', message: errMsg });
      logger.error('Send message failed', error);
    }
  }

  private async handleImageGeneration(prompt: string, messageId: string): Promise<void> {
    this.postToWebview({ type: 'token', text: '' });
    this.postToWebview({ type: 'token', text: `🎨 **Generating image...**\n\`${prompt}\`\n\n` });

    const result = await this.imageGenerator.generateImage(prompt, { model: 'flux' });

    if (result) {
      this.postToWebview({ type: 'token', text: `✅ Image saved to \`${result.localPath}\`\n\n![${prompt}](${result.url})` });
    } else {
      this.postToWebview({ type: 'token', text: '❌ Image generation failed. Try again.' });
    }
    this.postToWebview({ type: 'done', messageId, fileOps: [] });
  }

  private async handleBuildMode(goal: string, messageId: string): Promise<void> {
    this.postToWebview({ type: 'token', text: '' });
    this.postToWebview({ type: 'token', text: `🏗️ **Designing architecture for:** ${goal}\n\n` });

    const arch = await this.architectAgent.designArchitecture(goal, this.currentModelId);

    if (!arch) {
      this.postToWebview({ type: 'token', text: '❌ Architecture design failed. Try `/plan` instead.' });
      this.postToWebview({ type: 'done', messageId, fileOps: [] });
      return;
    }

    this.pendingArchitecture = arch;
    const display = this.architectAgent.formatArchitectureDisplay(arch);
    this.postToWebview({ type: 'token', text: display });
    this.postToWebview({ type: 'architectureReady', fileCount: arch.files.length });
    this.postToWebview({ type: 'done', messageId, fileOps: [] });
  }

  private async executePendingBuild(mode: 'all' | 'priority', messageId: string): Promise<void> {
    if (!this.pendingArchitecture) return;
    const arch = this.pendingArchitecture;
    this.pendingArchitecture = null;

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
      this.postToWebview({ type: 'error', message: 'No workspace open. Open a folder first.' });
      return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const filesToBuild = mode === 'priority'
      ? arch.files.filter(f => f.priority === 1).length
      : arch.files.length;

    this.postToWebview({ type: 'token', text: '' });
    this.postToWebview({ type: 'token', text: `⚡ **Building ${filesToBuild} files...**\n\n` });

    const { created, failed } = await this.fullStackBuilder.buildProject(
      arch,
      workspaceRoot,
      mode,
      (file, status, lines) => {
        const icon = status === 'generating' ? '⏳' : status === 'done' ? '✅' : '❌';
        const lineInfo = lines ? ` (${lines} lines)` : '';
        this.postToWebview({ type: 'token', text: `${icon} \`${file}\`${lineInfo}\n` });
      }
    );

    this.postToWebview({ type: 'token', text: `\n---\n✅ **${created.length} files created**${failed.length > 0 ? `, ❌ ${failed.length} failed` : ''}` });

    // Run setup commands
    if (arch.commands.length > 0 && created.length > 0) {
      this.postToWebview({ type: 'token', text: `\n\nRunning setup: \`${arch.commands[0]}\`...` });
      const result = await this.terminalManager.executeCommand(
        arch.commands[0],
        (msg) => this.postToWebview(msg as Record<string, unknown>)
      );
      if (result.success) {
        this.postToWebview({ type: 'token', text: '\n✅ Dependencies installed!' });
      }
    }

    const fileOps: FileOpRecord[] = created.map(f => ({ type: 'edit' as const, path: f, timestamp: Date.now() }));
    this.postToWebview({ type: 'done', messageId, fileOps });

    // Refresh file explorer
    vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
  }

  private async handlePlanMode(goal: string, context: string, messageId: string): Promise<void> {
    this.postToWebview({ type: 'token', text: '' });
    this.postToWebview({ type: 'token', text: '🔍 **Generating plan...**\n\n' });

    const plan = await this.planMode.generatePlan(goal, context, this.currentAgentId, this.currentModelId);

    if (!plan) {
      this.postToWebview({ type: 'token', text: 'Failed to generate plan. Please try again.' });
      this.postToWebview({ type: 'done', messageId, fileOps: [] });
      return;
    }

    this.pendingPlan = plan;
    const planText = this.planMode.formatPlanForDisplay(plan);
    this.postToWebview({ type: 'token', text: planText });
    this.postToWebview({ type: 'planReady', planId: plan.id });
    this.postToWebview({ type: 'done', messageId, fileOps: [] });
  }

  private async executePendingPlan(messageId: string): Promise<void> {
    if (!this.pendingPlan) return;
    const plan = this.pendingPlan;
    this.pendingPlan = null;

    this.postToWebview({ type: 'token', text: '' });
    this.postToWebview({ type: 'token', text: `⚡ **Executing plan: ${plan.goal}**\n\n` });

    const results = await this.agenticLoop.executePlan(
      plan,
      this.currentModelId,
      (stepId, status, output) => {
        const icon = status === 'running' ? '⏳' : status === 'done' ? '✅' : '❌';
        this.postToWebview({ type: 'token', text: `${icon} ${output}\n` });
        this.postToWebview({ type: 'planStepUpdate', stepId, status });
      },
      (msg) => this.postToWebview(msg as Record<string, unknown>)
    );

    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const allFiles = results.flatMap(r => r.filesChanged);

    this.postToWebview({ type: 'token', text: `\n---\n✅ ${succeeded} steps completed${failed > 0 ? `, ❌ ${failed} failed` : ''}` });
    if (allFiles.length > 0) {
      this.postToWebview({ type: 'token', text: `\nFiles changed: ${allFiles.map(f => `\`${f}\``).join(', ')}` });
    }

    const fileOps: FileOpRecord[] = allFiles.map(f => ({ type: 'edit' as const, path: f, timestamp: Date.now() }));
    this.postToWebview({ type: 'done', messageId, fileOps });
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
    this.postToWebview({ type: 'authState', isAuthenticated: false, plan: null });
    this.postToWebview({ type: 'showScreen', screen: 'welcome' });
  }

  private async handleSignIn(email: string, password: string): Promise<void> {
    try {
      const result = await this.backendClient.login({ email, password });
      await this.authManager.setToken(result.token);
      if (result.email) await this.authManager.setUserEmail(result.email);
      if (result.plan) await this.authManager.setUserPlan(result.plan);
      const plan = result.plan || 'free';
      this.postToWebview({ type: 'authState', isAuthenticated: true, email, plan });
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

    const result = await this.backendClient.validateApiKey(apiKey);
    if (!result.valid) {
      this.postToWebview({ type: 'error', message: 'API key validation failed. Please check your key or create a new one from your dashboard.' });
      return;
    }

    await this.authManager.setApiKey(apiKey);
    const displayName = result.userName || result.email || 'API Key User';
    if (result.email) await this.authManager.setUserEmail(result.email);
    if (result.plan) await this.authManager.setUserPlan(result.plan);
    const plan = result.plan || 'free';
    this.postToWebview({ type: 'authState', isAuthenticated: true, email: displayName, plan });
    this.postToWebview({ type: 'showScreen', screen: 'chat' });
    this.postToWebview({ type: 'agentList', agents: this.agentRegistry.getAllAgents() });
  }

  private async handleSaveApiKey(apiKey: string): Promise<void> {
    if (!this.authManager.validateApiKeyFormat(apiKey)) {
      this.postToWebview({ type: 'error', message: 'Invalid API key format. Must start with cp_live_' });
      return;
    }
    const result = await this.backendClient.validateApiKey(apiKey);
    await this.authManager.setApiKey(apiKey);
    if (result.email) await this.authManager.setUserEmail(result.email);
    if (result.plan) await this.authManager.setUserPlan(result.plan);
    const plan = result.plan || 'free';
    this.postToWebview({ type: 'authState', isAuthenticated: true, email: result.email, plan });
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
