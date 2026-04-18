import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
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
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpToolResult {
  content: string;
  isError: boolean;
}

const MCP_CONFIG_KEY = 'cybermind.mcpServers';

// Built-in MCP server templates
export const MCP_TEMPLATES: Omit<McpServer, 'id' | 'enabled'>[] = [
  {
    name: 'GitHub',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' },
  },
  {
    name: 'Filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '${workspaceFolder}'],
  },
  {
    name: 'Brave Search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: { BRAVE_API_KEY: '' },
  },
  {
    name: 'PostgreSQL',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', '${DATABASE_URL}'],
    env: { DATABASE_URL: '' },
  },
  {
    name: 'Slack',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-slack'],
    env: { SLACK_BOT_TOKEN: '', SLACK_TEAM_ID: '' },
  },
];

export class McpManager {
  private servers: Map<string, McpServer> = new Map();
  private tools: Map<string, McpTool[]> = new Map();

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
    this.servers.delete(id);
    this.tools.delete(id);
    this.saveServers();
  }

  toggleServer(id: string, enabled: boolean): void {
    const server = this.servers.get(id);
    if (server) {
      server.enabled = enabled;
      this.saveServers();
    }
  }

  // Build MCP context string for AI prompts
  buildMcpContext(): string {
    const enabledServers = Array.from(this.servers.values()).filter(s => s.enabled);
    if (enabledServers.length === 0) return '';

    const lines = ['Available MCP tools:'];
    for (const server of enabledServers) {
      const serverTools = this.tools.get(server.id) || [];
      lines.push(`\n[${server.name}]`);
      if (serverTools.length > 0) {
        for (const tool of serverTools) {
          lines.push(`  - ${tool.name}: ${tool.description}`);
        }
      } else {
        lines.push(`  (connected, tools loading...)`);
      }
    }
    return lines.join('\n');
  }

  // Parse MCP tool calls from AI response
  parseMcpCalls(response: string): Array<{ tool: string; args: Record<string, unknown> }> {
    const calls: Array<{ tool: string; args: Record<string, unknown> }> = [];
    const mcpPattern = /<mcp:(\w+)>([\s\S]*?)<\/mcp:\1>/g;
    let match;

    while ((match = mcpPattern.exec(response)) !== null) {
      try {
        const args = JSON.parse(match[2].trim());
        calls.push({ tool: match[1], args });
      } catch {
        logger.warn(`Failed to parse MCP call: ${match[0]}`);
      }
    }

    return calls;
  }

  // Get MCP config file path (for user to edit)
  getMcpConfigPath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders?.length) {
      return path.join(workspaceFolders[0].uri.fsPath, '.cybermind', 'mcp.json');
    }
    return '';
  }

  // Load MCP config from .cybermind/mcp.json if it exists
  async loadFromConfigFile(): Promise<void> {
    const configPath = this.getMcpConfigPath();
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
      }
    } catch (err) {
      logger.warn('Failed to load MCP config file', String(err));
    }
  }

  // Create default MCP config file
  async createDefaultConfig(): Promise<void> {
    const configPath = this.getMcpConfigPath();
    if (!configPath) return;

    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const defaultConfig = {
      servers: MCP_TEMPLATES.map((t, i) => ({
        id: `template-${i}`,
        ...t,
        enabled: false,
      })),
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    const uri = vscode.Uri.file(configPath);
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  }
}
