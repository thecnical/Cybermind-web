import * as vscode from 'vscode';
import * as path from 'path';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { FileOperations } from '../operations/FileOperations';
import { TerminalManager } from '../operations/TerminalManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { Plan, PlanStep } from './PlanMode';
import { logger } from '../utils/logger';

export interface AgenticResult {
  stepId: string;
  success: boolean;
  output: string;
  filesChanged: string[];
}

const EXECUTE_SYSTEM_PROMPT = `You are CyberMind AI executing a specific task step.

For file operations, output the complete file content wrapped in:
\`\`\`filepath:path/to/file.ts
// complete file content here
\`\`\`

For analysis, provide a clear explanation.
For commands, just confirm what was done.

Be precise and complete. Output working code only.`;

export class AgenticLoop {
  private maxIterations = 3;

  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager,
    private readonly fileOps: FileOperations,
    private readonly terminalManager: TerminalManager,
    private readonly repoIndexer: RepoIndexer
  ) {}

  async executePlan(
    plan: Plan,
    modelId: string,
    onProgress: (stepId: string, status: 'running' | 'done' | 'failed', output: string) => void,
    postToWebview: (msg: Record<string, unknown>) => void
  ): Promise<AgenticResult[]> {
    const results: AgenticResult[] = [];

    for (const step of plan.steps) {
      onProgress(step.id, 'running', `Executing: ${step.title}...`);

      try {
        const result = await this.executeStep(step, plan.goal, modelId, postToWebview);
        results.push(result);
        onProgress(step.id, result.success ? 'done' : 'failed', result.output);

        if (!result.success) {
          logger.warn(`Step ${step.id} failed: ${result.output}`);
          // Continue with remaining steps unless it's critical
        }
      } catch (err) {
        const errMsg = String(err);
        results.push({ stepId: step.id, success: false, output: errMsg, filesChanged: [] });
        onProgress(step.id, 'failed', errMsg);
      }
    }

    return results;
  }

  private async executeStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    postToWebview: (msg: Record<string, unknown>) => void
  ): Promise<AgenticResult> {
    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    switch (step.type) {
      case 'file_create':
      case 'file_edit':
        return this.executeFileStep(step, goal, modelId, apiKey, openRouterKey);

      case 'command':
        return this.executeCommandStep(step, postToWebview);

      case 'analysis':
        return this.executeAnalysisStep(step, goal, modelId, apiKey, openRouterKey);

      default:
        return { stepId: step.id, success: false, output: `Unknown step type: ${step.type}`, filesChanged: [] };
    }
  }

  private async executeFileStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    apiKey: string | null,
    openRouterKey: string | null
  ): Promise<AgenticResult> {
    if (!step.filePath) {
      return { stepId: step.id, success: false, output: 'No file path specified', filesChanged: [] };
    }

    // Get existing file content for context
    let existingContent = '';
    try {
      existingContent = await this.repoIndexer.getFileContent(step.filePath);
    } catch { /* new file */ }

    const prompt = step.type === 'file_create'
      ? `Create the file \`${step.filePath}\` for this goal: ${goal}\n\nTask: ${step.description}`
      : `Edit the file \`${step.filePath}\` for this goal: ${goal}\n\nTask: ${step.description}\n\nCurrent content:\n\`\`\`\n${existingContent.slice(0, 8000)}\n\`\`\``;

    const request: ChatRequest = {
      message: prompt,
      agent: 'code',
      context: '',
      system: EXECUTE_SYSTEM_PROMPT,
    };

    let fullResponse = '';
    await this.backendClient.chat(
      request, modelId, apiKey,
      (token) => { fullResponse += token; },
      undefined, null, openRouterKey
    );

    // Parse file content from response
    const fileMatch = fullResponse.match(/```(?:filepath:([^\n]+))?\n([\s\S]*?)```/);
    if (!fileMatch) {
      return { stepId: step.id, success: false, output: 'AI did not generate file content', filesChanged: [] };
    }

    const filePath = fileMatch[1]?.trim() || step.filePath;
    const fileContent = fileMatch[2];

    // Apply the file edit
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
      return { stepId: step.id, success: false, output: 'No workspace open', filesChanged: [] };
    }

    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(workspaceFolders[0].uri.fsPath, filePath);

    const uri = vscode.Uri.file(absolutePath);

    try {
      const accepted = await this.fileOps.editFile({ uri, newContent: fileContent, originalContent: existingContent });
      if (accepted) {
        return { stepId: step.id, success: true, output: `✓ ${step.type === 'file_create' ? 'Created' : 'Edited'} ${filePath}`, filesChanged: [filePath] };
      } else {
        return { stepId: step.id, success: false, output: `User rejected changes to ${filePath}`, filesChanged: [] };
      }
    } catch (err) {
      return { stepId: step.id, success: false, output: `Failed to write ${filePath}: ${String(err)}`, filesChanged: [] };
    }
  }

  private async executeCommandStep(
    step: PlanStep,
    postToWebview: (msg: Record<string, unknown>) => void
  ): Promise<AgenticResult> {
    if (!step.command) {
      return { stepId: step.id, success: false, output: 'No command specified', filesChanged: [] };
    }

    try {
      const result = await this.terminalManager.executeCommand(step.command, postToWebview);
      return {
        stepId: step.id,
        success: true,
        output: `✓ Ran: \`${step.command}\`\n${result.output}`,
        filesChanged: [],
      };
    } catch (err) {
      return { stepId: step.id, success: false, output: `Command failed: ${String(err)}`, filesChanged: [] };
    }
  }

  private async executeAnalysisStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    apiKey: string | null,
    openRouterKey: string | null
  ): Promise<AgenticResult> {
    const request: ChatRequest = {
      message: `Analyze for this goal: ${goal}\n\nTask: ${step.description}`,
      agent: 'explain',
      context: '',
      system: EXECUTE_SYSTEM_PROMPT,
    };

    let fullResponse = '';
    await this.backendClient.chat(
      request, modelId, apiKey,
      (token) => { fullResponse += token; },
      undefined, null, openRouterKey
    );

    return { stepId: step.id, success: true, output: fullResponse, filesChanged: [] };
  }
}
