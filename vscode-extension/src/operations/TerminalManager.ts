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
const OUTPUT_CAPTURE_TIMEOUT_MS = 30000; // 30s max wait for command output
const OUTPUT_IDLE_TIMEOUT_MS = 3000;     // 3s idle = command done

interface PendingCommand {
  resolve: (confirmed: boolean) => void;
}

export interface CommandResult {
  exitCode: number | undefined;
  output: string;
  success: boolean;
}

/**
 * TerminalManager with real output capture via pseudoterminal.
 *
 * Uses VSCode's ExtensionTerminalOptions (pseudoterminal) to intercept
 * all output written to the terminal — this is how Cline captures output.
 * The pseudoterminal acts as a proxy: it runs the shell command via
 * child_process and captures stdout/stderr before displaying it.
 */
export class TerminalManager {
  private terminal: vscode.Terminal | null = null;
  private pty: CaptureTerminal | null = null;
  private pendingCommands: Map<string, PendingCommand> = new Map();

  classifyCommand(command: string): CommandClassification {
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        return 'dangerous';
      }
    }
    return 'safe';
  }

  getOrCreateTerminal(): { terminal: vscode.Terminal; pty: CaptureTerminal } {
    // Reuse if still alive
    if (this.terminal && this.pty && !this.terminal.exitStatus) {
      return { terminal: this.terminal, pty: this.pty };
    }

    // Create a new pseudoterminal that captures output
    this.pty = new CaptureTerminal();
    this.terminal = vscode.window.createTerminal({
      name: TERMINAL_NAME,
      pty: this.pty,
    });

    return { terminal: this.terminal, pty: this.pty };
  }

  async executeCommand(
    command: string,
    postToWebview: (message: object) => void
  ): Promise<CommandResult> {
    const classification = this.classifyCommand(command);

    if (classification === 'dangerous') {
      const commandId = crypto.randomUUID();
      const confirmed = await new Promise<boolean>((resolve) => {
        this.pendingCommands.set(commandId, { resolve });
        postToWebview({ type: 'dangerousCommandConfirm', commandId, command });
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            this.pendingCommands.delete(commandId);
            resolve(false);
          }
        }, 60000);
      });

      if (!confirmed) {
        logger.info(`Dangerous command cancelled: ${command}`);
        return { exitCode: undefined, output: 'Command cancelled by user.', success: false };
      }
    }

    const { terminal, pty } = this.getOrCreateTerminal();
    terminal.show(true);

    logger.info(`Executing command: ${command}`);

    // Run via the pseudoterminal and capture output
    const result = await pty.runAndCapture(command);
    logger.info(`Command finished: exit=${result.exitCode}, output=${result.output.slice(0, 200)}`);

    return result;
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
    this.pty = null;
    for (const [, pending] of this.pendingCommands) {
      pending.resolve(false);
    }
    this.pendingCommands.clear();
  }
}

/**
 * CaptureTerminal — a VSCode pseudoterminal that captures command output.
 *
 * Implements vscode.Pseudoterminal. When runAndCapture() is called:
 * 1. Spawns the command via child_process.spawn
 * 2. Captures all stdout/stderr
 * 3. Writes output to the terminal display (so user sees it)
 * 4. Returns the captured output + exit code
 */
class CaptureTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  private closeEmitter = new vscode.EventEmitter<number>();

  onDidWrite = this.writeEmitter.event;
  onDidClose = this.closeEmitter.event;

  private currentResolve: ((result: CommandResult) => void) | null = null;
  private outputBuffer = '';
  private idleTimer: NodeJS.Timeout | null = null;
  private maxTimer: NodeJS.Timeout | null = null;
  private currentProcess: import('child_process').ChildProcess | null = null;

  open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
    this.writeEmitter.fire('\x1b[32mCyberMind Agent Terminal\x1b[0m\r\n');
  }

  close(): void {
    this.cleanup();
  }

  handleInput(data: string): void {
    // Ctrl+C — kill current process
    if (data === '\x03' && this.currentProcess) {
      this.currentProcess.kill('SIGINT');
    }
  }

  async runAndCapture(command: string): Promise<CommandResult> {
    return new Promise((resolve) => {
      this.currentResolve = resolve;
      this.outputBuffer = '';

      this.writeEmitter.fire(`\r\n\x1b[36m$ ${command}\x1b[0m\r\n`);

      // Spawn the command
      const { spawn } = require('child_process') as typeof import('child_process');
      const isWindows = process.platform === 'win32';

      const proc = spawn(
        isWindows ? 'cmd.exe' : '/bin/sh',
        isWindows ? ['/c', command] : ['-c', command],
        {
          cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
          env: { ...process.env },
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );

      this.currentProcess = proc;

      const onData = (data: Buffer) => {
        const text = data.toString('utf8');
        this.outputBuffer += text;

        // Write to terminal display (convert \n to \r\n for terminal)
        this.writeEmitter.fire(text.replace(/\n/g, '\r\n'));

        // Reset idle timer — command is still producing output
        this.resetIdleTimer();
      };

      proc.stdout?.on('data', onData);
      proc.stderr?.on('data', onData);

      proc.on('error', (err) => {
        const msg = `\r\n\x1b[31mError: ${err.message}\x1b[0m\r\n`;
        this.writeEmitter.fire(msg);
        this.outputBuffer += `Error: ${err.message}\n`;
        this.finish(1);
      });

      proc.on('close', (code) => {
        const exitCode = code ?? 0;
        const color = exitCode === 0 ? '\x1b[32m' : '\x1b[31m';
        this.writeEmitter.fire(`\r\n${color}[exit ${exitCode}]\x1b[0m\r\n`);
        this.finish(exitCode);
      });

      // Max timeout — kill if running too long
      this.maxTimer = setTimeout(() => {
        if (this.currentProcess) {
          this.currentProcess.kill();
          this.writeEmitter.fire('\r\n\x1b[33m[timeout — killed after 30s]\x1b[0m\r\n');
          this.finish(-1);
        }
      }, OUTPUT_CAPTURE_TIMEOUT_MS);
    });
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    // If no output for 3s after last data, consider command done
    // (handles commands that don't exit cleanly)
    this.idleTimer = setTimeout(() => {
      if (this.currentProcess && !this.currentProcess.exitCode) {
        // Still running but idle — don't kill, just note it
      }
    }, OUTPUT_IDLE_TIMEOUT_MS);
  }

  private finish(exitCode: number): void {
    if (this.maxTimer) { clearTimeout(this.maxTimer); this.maxTimer = null; }
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }
    this.currentProcess = null;

    if (this.currentResolve) {
      const resolve = this.currentResolve;
      this.currentResolve = null;
      resolve({
        exitCode,
        output: this.outputBuffer.trim(),
        success: exitCode === 0,
      });
    }
  }

  private cleanup(): void {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
    if (this.maxTimer) { clearTimeout(this.maxTimer); this.maxTimer = null; }
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }
    this.writeEmitter.dispose();
    this.closeEmitter.dispose();
  }
}
