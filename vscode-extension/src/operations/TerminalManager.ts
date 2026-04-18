import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { logger } from '../utils/logger';

export type CommandClassification = 'safe' | 'dangerous';

const DANGEROUS_PATTERNS = [
  /rm\s+-rf/i,
  /del\s+\/f/i,
  /\bformat\b/i,
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /\bmkfs\b/i,
  /dd\s+if=/i,
  /:\(\)\{:\|:&\};:/,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /curl\s+.*\|\s*bash/i,
  /wget\s+.*\|\s*bash/i,
  /curl\s+.*\|\s*sh/i,
  /wget\s+.*\|\s*sh/i,
  /\btruncate\b.*--size\s+0/i,
  />\s*\/dev\/sd[a-z]/i,
];

const TERMINAL_NAME = 'CyberMind Agent';

interface PendingCommand {
  resolve: (confirmed: boolean) => void;
}

export class TerminalManager {
  private terminal: vscode.Terminal | null = null;
  private pendingCommands: Map<string, PendingCommand> = new Map();

  classifyCommand(command: string): CommandClassification {
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        return 'dangerous';
      }
    }
    return 'safe';
  }

  getOrCreateTerminal(): vscode.Terminal {
    // Try to reuse existing terminal
    const existing = vscode.window.terminals.find(t => t.name === TERMINAL_NAME);
    if (existing && !existing.exitStatus) {
      this.terminal = existing;
      return existing;
    }

    // Create new terminal
    this.terminal = vscode.window.createTerminal({
      name: TERMINAL_NAME,
      env: process.env as Record<string, string>,
    });

    return this.terminal;
  }

  async executeCommand(
    command: string,
    postToWebview: (message: object) => void
  ): Promise<{ exitCode: number | undefined; output: string }> {
    const classification = this.classifyCommand(command);

    if (classification === 'dangerous') {
      // Post confirmation request to webview
      const commandId = crypto.randomUUID();

      const confirmed = await new Promise<boolean>((resolve) => {
        this.pendingCommands.set(commandId, { resolve });

        postToWebview({
          type: 'dangerousCommandConfirm',
          commandId,
          command,
        });

        // Timeout after 60 seconds
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            this.pendingCommands.delete(commandId);
            resolve(false);
          }
        }, 60000);
      });

      if (!confirmed) {
        logger.info(`Dangerous command cancelled by user: ${command}`);
        return { exitCode: undefined, output: 'Command cancelled by user.' };
      }
    }

    const terminal = this.getOrCreateTerminal();
    terminal.show(true);
    terminal.sendText(command);

    logger.info(`Executed command: ${command}`);

    // We can't easily capture terminal output in VSCode extension API
    // Return a placeholder — the terminal shows output visually
    return { exitCode: undefined, output: `Command sent to terminal: ${command}` };
  }

  confirmDangerousCommand(commandId: string, confirmed: boolean): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      this.pendingCommands.delete(commandId);
      pending.resolve(confirmed);
    }
  }

  dispose(): void {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = null;
    }
    // Reject all pending commands
    for (const [, pending] of this.pendingCommands) {
      pending.resolve(false);
    }
    this.pendingCommands.clear();
  }
}
