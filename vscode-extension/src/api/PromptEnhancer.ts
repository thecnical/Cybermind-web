import { BackendClient, ChatRequest } from './BackendClient';
import { AuthManager } from './AuthManager';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

const PROMPT_ENHANCER_SYSTEM = `You are the world's best prompt engineer. Your job is to transform any user input — regardless of language, quality, or length — into a perfect, detailed prompt for an AI coding assistant.

Rules:
1. Understand the intent even if the input is in Hindi, Hinglish, broken English, or any language
2. Translate and rephrase into clear, professional English
3. Add technical specifics: exact file paths, function names, error handling, edge cases
4. Structure with: Goal → Context → Requirements → Constraints → Expected Output
5. For UI tasks: add design details (colors, layout, responsiveness, accessibility)
6. For backend tasks: add API design, error handling, security considerations
7. For full-stack: add both frontend and backend requirements
8. Keep the enhanced prompt under 8000 words
9. If the original prompt is already in English and clear, still enhance it with technical depth

Output ONLY the enhanced prompt — no explanation, no "Here is the enhanced prompt:", just the prompt itself.`;

const LONG_PROMPT_SYSTEM = `You are the world's best prompt engineer. The user's request is very detailed.
Convert it into a perfectly structured technical specification document.
Format as a proper spec with sections: Overview, Requirements, Technical Details, File Structure, API Design, UI/UX, Testing.
Output ONLY the spec document.`;

/**
 * PromptEnhancer — transforms any user input into a world-class AI prompt.
 *
 * Features:
 * - Understands any language (Hindi, Hinglish, broken English, etc.)
 * - Adds technical depth and specifics
 * - Handles prompts > 8000 words by saving to a temp file
 * - The AI then reads the file as context
 */
export class PromptEnhancer {
  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager
  ) {}

  async enhance(rawPrompt: string, modelId: string): Promise<{
    enhanced: string;
    savedToFile?: string;
    wasEnhanced: boolean;
  }> {
    // Don't enhance very short prompts or commands
    if (rawPrompt.length < 20 || rawPrompt.startsWith('/')) {
      return { enhanced: rawPrompt, wasEnhanced: false };
    }

    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    const isLong = rawPrompt.length > 4000; // ~1000 words
    const system = isLong ? LONG_PROMPT_SYSTEM : PROMPT_ENHANCER_SYSTEM;

    const request: ChatRequest = {
      message: isLong
        ? `Convert this detailed request into a structured technical spec:\n\n${rawPrompt}`
        : `Enhance this prompt for an AI coding assistant:\n\n${rawPrompt}`,
      agent: 'code',
      context: '',
      system,
    };

    let enhanced = '';
    try {
      await this.backendClient.chat(
        request, modelId, apiKey,
        (token) => { enhanced += token; },
        undefined, null, openRouterKey
      );

      enhanced = enhanced.trim();

      // If enhanced prompt is > 8000 words, save to file
      const wordCount = enhanced.split(/\s+/).length;
      if (wordCount > 8000) {
        const filePath = await this.saveToFile(enhanced);
        return { enhanced: `[Prompt saved to file: ${filePath}]\n\nSummary: ${enhanced.slice(0, 500)}...`, savedToFile: filePath, wasEnhanced: true };
      }

      logger.info(`[PromptEnhancer] Enhanced: ${rawPrompt.slice(0, 50)} → ${enhanced.slice(0, 50)}`);
      return { enhanced, wasEnhanced: true };
    } catch (err) {
      logger.warn('[PromptEnhancer] Failed, using original', String(err));
      return { enhanced: rawPrompt, wasEnhanced: false };
    }
  }

  private async saveToFile(content: string): Promise<string> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) throw new Error('No workspace');

    const dir = path.join(workspaceRoot, '.cybermind', 'prompts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `prompt-${Date.now()}.md`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, content, 'utf8');

    // Open the file so user can see it
    const uri = vscode.Uri.file(filePath);
    const doc = await vscode.workspace.openTextDocument(uri);
    vscode.window.showTextDocument(doc, { preview: true, viewColumn: vscode.ViewColumn.Beside });

    return path.relative(workspaceRoot, filePath);
  }

  // Read a saved prompt file and return its content
  async readPromptFile(filePath: string): Promise<string> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return '';

    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(workspaceRoot, filePath);

    if (!fs.existsSync(absolutePath)) return '';
    return fs.readFileSync(absolutePath, 'utf8');
  }
}
