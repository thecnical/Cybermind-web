import * as vscode from 'vscode';
import { BackendClient } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { logger } from '../utils/logger';

const COMPLETION_SYSTEM_PROMPT = `You are a code completion assistant. Complete the code at the cursor position.
Output ONLY the completion text — no explanations, no markdown, no code fences.
The completion should be syntactically correct and follow the existing code style.
Complete the current line or add the next logical lines of code.`;

export class InlineCompletionProvider implements vscode.InlineCompletionItemProvider {
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_MS = 600;
  private readonly PREFIX_LIMIT = 2000;
  private readonly SUFFIX_LIMIT = 500;

  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager
  ) {}

  async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionList | null> {
    // Check if inline completions are enabled
    const config = vscode.workspace.getConfiguration('cybermind');
    const enabled = config.get<boolean>('inlineCompletions.enabled', true);
    if (!enabled) {
      return null;
    }

    // Don't trigger on explicit invocation if already showing
    if (context.triggerKind === vscode.InlineCompletionTriggerKind.Automatic) {
      // Debounce automatic triggers
      return new Promise((resolve) => {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(async () => {
          if (token.isCancellationRequested) {
            resolve(null);
            return;
          }

          try {
            const completion = await this.fetchCompletion(document, position, token);
            resolve(completion);
          } catch {
            resolve(null);
          }
        }, this.DEBOUNCE_MS);

        // Cancel if token is cancelled
        token.onCancellationRequested(() => {
          if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
          }
          resolve(null);
        });
      });
    }

    return this.fetchCompletion(document, position, token);
  }

  private async fetchCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionList | null> {
    const prefix = this.getPrefix(document, position);
    const suffix = this.getSuffix(document, position);

    if (!prefix.trim()) {
      return null;
    }

    try {
      const message = `Complete the following code. Output ONLY the completion, nothing else.\n\nCode before cursor:\n${prefix}\n\nCode after cursor:\n${suffix}`;

      let completionText = '';

      await this.backendClient.freeChat(
        {
          message,
          agent: 'code',
          context: `Language: ${document.languageId}`,
        },
        (token_text) => {
          completionText += token_text;
        },
        token
      );

      if (!completionText || token.isCancellationRequested) {
        return null;
      }

      // Clean up the completion (remove markdown fences if present)
      completionText = this.cleanCompletion(completionText);

      if (!completionText) {
        return null;
      }

      const item = new vscode.InlineCompletionItem(
        completionText,
        new vscode.Range(position, position)
      );

      return new vscode.InlineCompletionList([item]);
    } catch (error) {
      if (token.isCancellationRequested) {
        return null;
      }
      logger.warn('Inline completion failed', String(error));
      return null;
    }
  }

  getPrefix(document: vscode.TextDocument, position: vscode.Position): string {
    const offset = document.offsetAt(position);
    const text = document.getText();
    const start = Math.max(0, offset - this.PREFIX_LIMIT);
    return text.slice(start, offset);
  }

  getSuffix(document: vscode.TextDocument, position: vscode.Position): string {
    const offset = document.offsetAt(position);
    const text = document.getText();
    const end = Math.min(text.length, offset + this.SUFFIX_LIMIT);
    return text.slice(offset, end);
  }

  private cleanCompletion(text: string): string {
    // Remove markdown code fences
    let cleaned = text.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
    // Remove leading/trailing whitespace but preserve internal indentation
    cleaned = cleaned.trimEnd();
    return cleaned;
  }

  dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
