import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { logger } from '../utils/logger';

export interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  enabled: boolean;
}

export interface McpTool {
  serverId: string;
  serverName: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpToolResult {
  content: string;
  isError: boolean;
}

const MCP_CONFIG_KEY = 'cybermind.mcpServers';

export const MCP_TEMPLATES: Omit<McpServer, 'id' | 'enabled'>[] = [
  // ── Documentation ─────────────────────────────────────────────────────────
  {
    name: 'Context7 (Library Docs)',
    command: 'npx',
    args: ['-y', '@upstash/context7-mcp@latest'],
    // Injects current library docs — fixes outdated AI knowledge
  },
  // ── Web Search ────────────────────────────────────────────────────────────
  {
    name: 'Brave Search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: { BRAVE_API_KEY: '' }, // Free tier: 2000 queries/month at brave.com/search/api
  },
  // ── Filesystem ────────────────────────────────────────────────────────────
  {
    name: 'Filesystem (Secure)',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '${workspaceFolder}'],
    // Strict directory boundaries — safe file access
  },
  // ── Version Control ───────────────────────────────────────────────────────
  {
    name: 'GitHub',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' }, // github.com/settings/tokens
  },
  {
    name: 'Git (Local)',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-git', '--repository', '${workspaceFolder}'],
    // Local git: commit, branch, diff, log, blame
  },
  // ── Browser & Testing ─────────────────────────────────────────────────────
  {
    name: 'Playwright (Browser)',
    command: 'npx',
    args: ['-y', '@playwright/mcp@latest'],
    // Browser automation: navigate, click, fill forms, verify UI
  },
  // ── Databases ─────────────────────────────────────────────────────────────
  {
    name: 'PostgreSQL',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres'],
    env: { DATABASE_URL: '' }, // postgresql://user:pass@host:5432/db
  },
  // ── Infrastructure ────────────────────────────────────────────────────────
  {
    name: 'Docker',
    command: 'npx',
    args: ['-y', 'docker-mcp'],
    // Manage containers, images, networks
  },
  // ── Design ────────────────────────────────────────────────────────────────
  {
    name: 'Figma (Design)',
    command: 'npx',
    args: ['-y', 'figma-developer-mcp', '--figma-api-key', '${FIGMA_API_KEY}'],
    env: { FIGMA_API_KEY: '' }, // figma.com/developers/api
    // Reads live Figma designs — generates pixel-perfect code
  },
  // ── Communication ─────────────────────────────────────────────────────────
  {
    name: 'Slack',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-slack'],
    env: { SLACK_BOT_TOKEN: '', SLACK_TEAM_ID: '' },
  },
];

/**
 * McpClient — real JSON-RPC 2.0 client for a single MCP server process.
 *
 * Spawns the server as a child process, communicates via stdin/stdout
 * using the MCP protocol (JSON-RPC 2.0 over newline-delimited JSON).
 */
class McpClient {
  private proc: ChildProcess | null = null;
  private buffer = '';
  private pendingRequests = new Map<number, { resolve: (r: unknown) => void; reject: (e: Error) => void }>();
  private nextId = 1;
  private tools: McpTool[] = [];
  private ready = false;
  private readyPromise: Promise<void>;
  private readyResolve!: () => void;

  constructor(private readonly server: McpServer) {
    this.readyPromise = new Promise(r => { this.readyResolve = r; });
  }

  async start(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

    // Resolve ${workspaceFolder} in args
    const resolvedArgs = this.server.args.map(a =>
      a.replace('${workspaceFolder}', workspaceRoot)
    );

    const env = {
      ...process.env,
      ...this.server.env,
      PATH: process.env.PATH ?? '',
    };

    this.proc = spawn(this.server.command, resolvedArgs, {
      cwd: workspaceRoot,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.proc.stdout?.on('data', (data: Buffer) => {
      this.buffer += data.toString('utf8');
      this.processBuffer();
    });

    this.proc.stderr?.on('data', (data: Buffer) => {
      logger.warn(`[MCP:${this.server.name}] stderr: ${data.toString('utf8').trim()}`);
    });

    this.proc.on('error', (err) => {
      logger.error(`[MCP:${this.server.name}] process error`, err);
    });

    this.proc.on('close', (code) => {
      logger.info(`[MCP:${this.server.name}] process closed (exit ${code})`);
      this.ready = false;
      // Reject all pending requests
      for (const [, pending] of this.pendingRequests) {
        pending.reject(new Error(`MCP server ${this.server.name} closed`));
      }
      this.pendingRequests.clear();
    });

    // Initialize the MCP session
    await this.initialize();
    await this.listTools();
    this.ready = true;
    this.readyResolve();
  }

  private processBuffer(): void {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const msg = JSON.parse(trimmed) as {
          id?: number;
          result?: unknown;
          error?: { message: string };
          method?: string;
          params?: unknown;
        };

        if (msg.id !== undefined) {
          const pending = this.pendingRequests.get(msg.id);
          if (pending) {
            this.pendingRequests.delete(msg.id);
            if (msg.error) {
              pending.reject(new Error(msg.error.message));
            } else {
              pending.resolve(msg.result);
            }
          }
        }
      } catch {
        // Not JSON — ignore
      }
    }
  }

  private send(method: string, params?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.proc?.stdin) {
        reject(new Error('MCP process not running'));
        return;
      }

      const id = this.nextId++;
      this.pendingRequests.set(id, { resolve, reject });

      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
      this.proc.stdin.write(msg);

      // Timeout after 15s
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`MCP request timeout: ${method}`));
        }
      }, 15000);
    });
  }

  private async initialize(): Promise<void> {
    await this.send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'CyberMind VSCode', version: '1.0.0' },
    });
    // Send initialized notification
    if (this.proc?.stdin) {
      this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    }
  }

  async listTools(): Promise<McpTool[]> {
    try {
      const result = await this.send('tools/list') as { tools?: Array<{ name: string; description?: string; inputSchema?: Record<string, unknown> }> };
      this.tools = (result?.tools ?? []).map(t => ({
        serverId: this.server.id,
        serverName: this.server.name,
        name: t.name,
        description: t.description ?? '',
        inputSchema: t.inputSchema ?? {},
      }));
      logger.info(`[MCP:${this.server.name}] ${this.tools.length} tools loaded`);
      return this.tools;
    } catch (err) {
      logger.warn(`[MCP:${this.server.name}] listTools failed: ${String(err)}`);
      return [];
    }
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<McpToolResult> {
    await this.readyPromise;
    try {
      const result = await this.send('tools/call', { name: toolName, arguments: args }) as {
        content?: Array<{ type: string; text?: string }>;
        isError?: boolean;
      };

      const text = (result?.content ?? [])
        .filter(c => c.type === 'text')
        .map(c => c.text ?? '')
        .join('\n');

      return { content: text, isError: result?.isError ?? false };
    } catch (err) {
      return { content: `Tool call failed: ${String(err)}`, isError: true };
    }
  }

  getTools(): McpTool[] {
    return this.tools;
  }

  isReady(): boolean {
    return this.ready;
  }

  stop(): void {
    if (this.proc) {
      this.proc.kill();
      this.proc = null;
    }
    this.ready = false;
  }
}

/**
 * McpManager — manages multiple MCP server connections.
 * Starts/stops servers, routes tool calls, builds AI context.
 */
export class McpManager {
  private servers: Map<string, McpServer> = new Map();
  private clients: Map<string, McpClient> = new Map();

  constructor(private readonly globalState: vscode.Memento) {
    this.loadServers();
  }

  private loadServers(): void {
    const stored = this.globalState.get<McpServer[]>(MCP_CONFIG_KEY, []);
    for (const server of stored) {
      this.servers.set(server.id, server);
    }
  }

  private saveServers(): void {
    this.globalState.update(MCP_CONFIG_KEY, Array.from(this.servers.values()));
  }

  getServers(): McpServer[] {
    return Array.from(this.servers.values());
  }

  addServer(server: Omit<McpServer, 'id'>): McpServer {
    const id = `mcp-${Date.now()}`;
    const newServer: McpServer = { ...server, id };
    this.servers.set(id, newServer);
    this.saveServers();
    return newServer;
  }

  removeServer(id: string): void {
    this.stopServer(id);
    this.servers.delete(id);
    this.saveServers();
  }

  async toggleServer(id: string, enabled: boolean): Promise<void> {
    const server = this.servers.get(id);
    if (!server) return;
    server.enabled = enabled;
    this.saveServers();

    if (enabled) {
      await this.startServer(id);
    } else {
      this.stopServer(id);
    }
  }

  private async startServer(id: string): Promise<void> {
    const server = this.servers.get(id);
    if (!server || this.clients.has(id)) return;

    const client = new McpClient(server);
    this.clients.set(id, client);

    try {
      await client.start();
      logger.info(`[MCP] Started server: ${server.name}`);
    } catch (err) {
      logger.error(`[MCP] Failed to start ${server.name}`, err);
      this.clients.delete(id);
      vscode.window.showWarningMessage(`CyberMind MCP: Failed to start ${server.name}. Check your config.`);
    }
  }

  private stopServer(id: string): void {
    const client = this.clients.get(id);
    if (client) {
      client.stop();
      this.clients.delete(id);
    }
  }

  // Start all enabled servers (call on extension activate)
  async startEnabledServers(): Promise<void> {
    for (const server of this.servers.values()) {
      if (server.enabled) {
        await this.startServer(server.id);
      }
    }
  }

  // Get all tools from all running servers
  getAllTools(): McpTool[] {
    const tools: McpTool[] = [];
    for (const client of this.clients.values()) {
      if (client.isReady()) {
        tools.push(...client.getTools());
      }
    }
    return tools;
  }

  // Call a specific tool by name
  async callTool(toolName: string, args: Record<string, unknown>): Promise<McpToolResult> {
    // Find which server has this tool
    for (const [id, client] of this.clients.entries()) {
      if (!client.isReady()) continue;
      const tools = client.getTools();
      if (tools.some(t => t.name === toolName)) {
        return client.callTool(toolName, args);
      }
    }
    return { content: `Tool '${toolName}' not found in any connected MCP server`, isError: true };
  }

  // Build context string for AI prompts — lists available tools
  buildMcpContext(): string {
    const tools = this.getAllTools();
    if (tools.length === 0) return '';

    const lines = ['\n\n=== Available MCP Tools ==='];
    const byServer = new Map<string, McpTool[]>();
    for (const tool of tools) {
      const list = byServer.get(tool.serverName) ?? [];
      list.push(tool);
      byServer.set(tool.serverName, list);
    }

    for (const [serverName, serverTools] of byServer) {
      lines.push(`\n[${serverName}]`);
      for (const tool of serverTools) {
        lines.push(`  ${tool.name}: ${tool.description}`);
      }
    }

    lines.push('\nTo use a tool, respond with: <mcp:toolName>{"arg": "value"}</mcp:toolName>');
    return lines.join('\n');
  }

  // Parse and execute MCP tool calls from AI response
  async executeMcpCalls(response: string): Promise<string> {
    const mcpPattern = /<mcp:(\w+)>([\s\S]*?)<\/mcp:\1>/g;
    let match;
    const results: string[] = [];

    while ((match = mcpPattern.exec(response)) !== null) {
      const toolName = match[1];
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(match[2].trim());
      } catch {
        args = { input: match[2].trim() };
      }

      logger.info(`[MCP] Calling tool: ${toolName}`);
      const result = await this.callTool(toolName, args);
      results.push(`[${toolName} result]: ${result.content}`);
    }

    return results.join('\n\n');
  }

  getMcpConfigPath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders?.length) {
      return path.join(workspaceFolders[0].uri.fsPath, '.kiro', 'settings', 'mcp.json');
    }
    return '';
  }

  private getLegacyMcpConfigPath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders?.length) {
      return path.join(workspaceFolders[0].uri.fsPath, '.cybermind', 'mcp.json');
    }
    return '';
  }

  private getExistingConfigPath(): string {
    const preferred = this.getMcpConfigPath();
    if (preferred && fs.existsSync(preferred)) {
      return preferred;
    }

    const legacy = this.getLegacyMcpConfigPath();
    if (legacy && fs.existsSync(legacy)) {
      return legacy;
    }

    return preferred;
  }

  async loadFromConfigFile(): Promise<void> {
    const configPath = this.getExistingConfigPath();
    if (!configPath || !fs.existsSync(configPath)) return;

    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content) as { servers?: McpServer[] };
      if (config.servers) {
        for (const server of config.servers) {
          if (!this.servers.has(server.id)) {
            this.servers.set(server.id, server);
          }
        }
        this.saveServers();
        // Start any newly enabled servers
        await this.startEnabledServers();
      }
    } catch (err) {
      logger.warn('Failed to load MCP config file', String(err));
    }
  }

  async createDefaultConfig(): Promise<void> {
    const configPath = this.getMcpConfigPath();
    if (!configPath) return;

    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Enable zero-config servers by default (no API keys needed)
    const zeroConfigIds = new Set(['Filesystem (Secure)', 'Git (Local)', 'Playwright (Browser)']);

    const defaultConfig = {
      _comment: 'CyberMind MCP config. Set enabled:true and fill in env vars to activate a server.',
      servers: MCP_TEMPLATES.map((t, i) => ({
        id: `template-${i}`,
        ...t,
        enabled: zeroConfigIds.has(t.name), // auto-enable zero-config servers
      })),
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    const uri = vscode.Uri.file(configPath);
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  }

  stopAll(): void {
    for (const id of this.clients.keys()) {
      this.stopServer(id);
    }
  }
}
