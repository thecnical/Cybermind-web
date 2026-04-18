import * as vscode from 'vscode';

const CREDENTIAL_PATTERNS = [
  /cp_live_[a-zA-Z0-9]+/g,
  /Bearer\s+[a-zA-Z0-9._-]+/g,
  /X-API-Key:\s*[^\s]+/g,
  /"password"\s*:\s*"[^"]+"/g,
  /"token"\s*:\s*"[^"]+"/g,
];

function redactCredentials(message: string): string {
  let redacted = message;
  for (const pattern of CREDENTIAL_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }
  return redacted;
}

class Logger {
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('CyberMind');
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const safe = redactCredentials(message);
    return `[${timestamp}] [${level}] ${safe}`;
  }

  info(message: string, ...args: unknown[]): void {
    const extra = args.length > 0 ? ' ' + args.map(a => redactCredentials(String(a))).join(' ') : '';
    this.outputChannel.appendLine(this.formatMessage('INFO', message + extra));
  }

  warn(message: string, ...args: unknown[]): void {
    const extra = args.length > 0 ? ' ' + args.map(a => redactCredentials(String(a))).join(' ') : '';
    this.outputChannel.appendLine(this.formatMessage('WARN', message + extra));
  }

  error(message: string, error?: unknown): void {
    let errorStr = '';
    if (error instanceof Error) {
      errorStr = ` | ${redactCredentials(error.message)}`;
      if (error.stack) {
        errorStr += `\n${redactCredentials(error.stack)}`;
      }
    } else if (error !== undefined) {
      errorStr = ` | ${redactCredentials(String(error))}`;
    }
    this.outputChannel.appendLine(this.formatMessage('ERROR', message + errorStr));
  }

  show(): void {
    this.outputChannel.show();
  }

  dispose(): void {
    this.outputChannel.dispose();
  }
}

export const logger = new Logger();
