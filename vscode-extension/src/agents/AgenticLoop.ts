import * as vscode from 'vscode';
import * as path from 'path';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { FileOperations } from '../operations/FileOperations';
import { TerminalManager } from '../operations/TerminalManager';
import { RepoIndexer } from '../indexer/RepoIndexer';
import { McpManager } from '../api/McpManager';
import { Plan, PlanStep } from './PlanMode';
import { logger } from '../utils/logger';

export interface AgenticResult {
  stepId: string;
  success: boolean;
  output: string;
  filesChanged: string[];
  iterations: number;
}

const EXECUTE_SYSTEM_PROMPT = `You are CyberMind AI executing a specific coding task.

For file operations, output the COMPLETE file content wrapped in:
\`\`\`filepath:path/to/file.ts
// complete file content here
\`\`\`

Rules:
- Output ONLY the file content block for file tasks
- Output ONLY the analysis text for analysis tasks
- Write complete, working code — no TODOs, no placeholders
- Follow existing code style from the context provided`;

const FIX_SYSTEM_PROMPT = `You are CyberMind AI fixing a failed step.

The previous attempt failed. Analyze the error output and produce a corrected version.

For file operations, output the COMPLETE corrected file content:
\`\`\`filepath:path/to/file.ts
// corrected content
\`\`\`

Be precise. Fix only what caused the failure.`;

/**
 * AgenticLoop — executes a Plan step by step with real self-correction.
 *
 * For each step:
 * 1. Execute the step (file edit, command, analysis)
 * 2. If it's a command step, READ the actual output (via pseudoterminal)
 * 3. If the command failed (non-zero exit), ask AI to fix and retry
 * 4. Repeat up to maxIterations times
 */
export class AgenticLoop {
  private readonly maxIterations = 3;

  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager,
    private readonly fileOps: FileOperations,
    private readonly terminalManager: TerminalManager,
    private readonly repoIndexer: RepoIndexer,
    private readonly mcpManager?: McpManager
  ) {}

  async executePlan(
    plan: Plan,
    modelId: string,
    onProgress: (stepId: string, status: 'running' | 'done' | 'failed', output: string) => void,
    postToWebview: (msg: object) => void
  ): Promise<AgenticResult[]> {
    const results: AgenticResult[] = [];

    for (const step of plan.steps) {
      onProgress(step.id, 'running', `Executing: ${step.title}...`);

      const result = await this.executeStepWithRetry(
        step, plan.goal, modelId, postToWebview, onProgress
      );

      results.push(result);
      onProgress(step.id, result.success ? 'done' : 'failed', result.output);
    }

    return results;
  }

  private async executeStepWithRetry(
    step: PlanStep,
    goal: string,
    modelId: string,
    postToWebview: (msg: object) => void,
    onProgress: (stepId: string, status: 'running' | 'done' | 'failed', output: string) => void
  ): Promise<AgenticResult> {
    let lastOutput = '';
    let lastError = '';

    for (let iteration = 1; iteration <= this.maxIterations; iteration++) {
      try {
        const result = await this.executeStep(
          step, goal, modelId, postToWebview, lastError, iteration
        );

        if (result.success) {
          return { ...result, iterations: iteration };
        }

        lastError = result.output;
        lastOutput = result.output;

        if (iteration < this.maxIterations) {
          onProgress(step.id, 'running',
            `⚠️ Attempt ${iteration} failed: ${result.output.slice(0, 100)}\n🔄 Retrying (${iteration + 1}/${this.maxIterations})...`
          );
          // Small delay before retry
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (err) {
        lastError = String(err);
        lastOutput = lastError;
      }
    }

    return {
      stepId: step.id,
      success: false,
      output: `Failed after ${this.maxIterations} attempts. Last error: ${lastOutput}`,
      filesChanged: [],
      iterations: this.maxIterations,
    };
  }

  private async executeStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    postToWebview: (msg: object) => void,
    previousError: string,
    iteration: number
  ): Promise<AgenticResult> {
    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    switch (step.type) {
      case 'file_create':
      case 'file_edit':
        return this.executeFileStep(step, goal, modelId, apiKey, openRouterKey, previousError, iteration);

      case 'command':
        return this.executeCommandStep(step, goal, modelId, apiKey, openRouterKey, postToWebview, previousError, iteration);

      case 'analysis':
        return this.executeAnalysisStep(step, goal, modelId, apiKey, openRouterKey);

      default:
        return { stepId: step.id, success: false, output: `Unknown step type: ${step.type}`, filesChanged: [], iterations: iteration };
    }
  }

  private async executeFileStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    apiKey: string | null,
    openRouterKey: string | null,
    previousError: string,
    iteration: number
  ): Promise<AgenticResult> {
    if (!step.filePath) {
      return { stepId: step.id, success: false, output: 'No file path specified', filesChanged: [], iterations: iteration };
    }

    // Get existing file content
    let existingContent = '';
    try {
      existingContent = await this.repoIndexer.getFileContent(step.filePath);
    } catch { /* new file */ }

    const isRetry = iteration > 1 && previousError;
    const systemPrompt = isRetry ? FIX_SYSTEM_PROMPT : EXECUTE_SYSTEM_PROMPT;

    let prompt: string;
    if (isRetry) {
      prompt = `Fix this failed step.\n\nGoal: ${goal}\nTask: ${step.description}\nFile: ${step.filePath}\n\nPrevious error:\n${previousError}\n\nCurrent file content:\n\`\`\`\n${existingContent.slice(0, 6000)}\n\`\`\``;
    } else if (step.type === 'file_create') {
      prompt = `Create file \`${step.filePath}\`\n\nGoal: ${goal}\nTask: ${step.description}`;
    } else {
      prompt = `Edit file \`${step.filePath}\`\n\nGoal: ${goal}\nTask: ${step.description}\n\nCurrent content:\n\`\`\`\n${existingContent.slice(0, 6000)}\n\`\`\``;
    }

    const request: ChatRequest = {
      message: prompt,
      agent: 'code',
      context: '',
      system: systemPrompt,
    };

    let fullResponse = '';
    await this.backendClient.chat(
      request, modelId, apiKey,
      (token) => { fullResponse += token; },
      undefined, null, openRouterKey
    );

    // Parse file content — try multiple patterns
    const fileContent = this.extractFileContent(fullResponse, step.filePath);
    if (!fileContent) {
      return {
        stepId: step.id,
        success: false,
        output: `AI did not generate file content (response: ${fullResponse.slice(0, 200)})`,
        filesChanged: [],
        iterations: iteration,
      };
    }

    // Apply the edit
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
      return { stepId: step.id, success: false, output: 'No workspace open', filesChanged: [], iterations: iteration };
    }

    const absolutePath = path.isAbsolute(step.filePath)
      ? step.filePath
      : path.join(workspaceFolders[0].uri.fsPath, step.filePath);

    const uri = vscode.Uri.file(absolutePath);

    try {
      const accepted = await this.fileOps.editFile({
        uri,
        newContent: fileContent,
        originalContent: existingContent,
      });

      if (accepted) {
        return {
          stepId: step.id,
          success: true,
          output: `✓ ${step.type === 'file_create' ? 'Created' : 'Edited'} \`${step.filePath}\``,
          filesChanged: [step.filePath],
          iterations: iteration,
        };
      } else {
        return {
          stepId: step.id,
          success: false,
          output: `User rejected changes to \`${step.filePath}\``,
          filesChanged: [],
          iterations: iteration,
        };
      }
    } catch (err) {
      return {
        stepId: step.id,
        success: false,
        output: `Write failed: ${String(err)}`,
        filesChanged: [],
        iterations: iteration,
      };
    }
  }

  private async executeCommandStep(
    step: PlanStep,
    goal: string,
    modelId: string,
    apiKey: string | null,
    openRouterKey: string | null,
    postToWebview: (msg: object) => void,
    previousError: string,
    iteration: number
  ): Promise<AgenticResult> {
    if (!step.command) {
      return { stepId: step.id, success: false, output: 'No command specified', filesChanged: [], iterations: iteration };
    }

    let commandToRun = step.command;

    // If this is a retry, ask AI to suggest a fixed command
    if (iteration > 1 && previousError) {
      const fixedCommand = await this.getFixedCommand(
        step.command, previousError, goal, modelId, apiKey, openRouterKey
      );
      if (fixedCommand && fixedCommand !== step.command) {
        commandToRun = fixedCommand;
        logger.info(`[AgenticLoop] Retry with fixed command: ${commandToRun}`);
      }
    }

    // Execute and capture real output
    const result = await this.terminalManager.executeCommand(commandToRun, postToWebview);

    if (result.success) {
      return {
        stepId: step.id,
        success: true,
        output: `✓ \`${commandToRun}\`\n${result.output.slice(0, 1000)}`,
        filesChanged: [],
        iterations: iteration,
      };
    } else {
      // Command failed — return the actual error output for self-correction
      return {
        stepId: step.id,
        success: false,
        output: `Command failed (exit ${result.exitCode}):\n${result.output.slice(0, 2000)}`,
        filesChanged: [],
        iterations: iteration,
      };
    }
  }

  private async getFixedCommand(
    originalCommand: string,
    errorOutput: string,
    goal: string,
    modelId: string,
    apiKey: string | null,
    openRouterKey: string | null
  ): Promise<string | null> {
    const request: ChatRequest = {
      message: `A command failed. Suggest a fixed command.\n\nOriginal: ${originalCommand}\nGoal: ${goal}\nError:\n${errorOutput.slice(0, 1000)}\n\nRespond with ONLY the fixed command, nothing else. No explanation.`,
      agent: 'bug-fix',
      context: '',
      system: 'Output only the fixed shell command. No explanation, no markdown, no code fences.',
    };

    let response = '';
    try {
      await this.backendClient.chat(
        request, modelId, apiKey,
        (token) => { response += token; },
        undefined, null, openRouterKey
      );
      // Clean up the response
      return response.trim().replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    } catch {
      return null;
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
      message: `Analyze for goal: ${goal}\n\nTask: ${step.description}`,
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

    return {
      stepId: step.id,
      success: true,
      output: fullResponse,
      filesChanged: [],
      iterations: 1,
    };
  }

  /**
   * Extract file content from AI response.
   * Tries multiple patterns to handle different model output formats.
   */
  private extractFileContent(response: string, expectedPath: string): string | null {
    // Pattern 1: ```filepath:path/to/file.ts\n...\n```
    const fpMatch = response.match(/```(?:filepath:([^\n]+))?\n([\s\S]*?)```/);
    if (fpMatch) return fpMatch[2];

    // Pattern 2: ```typescript\n...\n``` or ```js\n...\n```
    const langMatch = response.match(/```(?:typescript|javascript|ts|js|python|py|go|rust|java|css|html|json|yaml|sh|bash)\n([\s\S]*?)```/);
    if (langMatch) return langMatch[1];

    // Pattern 3: Any code fence
    const anyFence = response.match(/```[^\n]*\n([\s\S]*?)```/);
    if (anyFence) return anyFence[1];

    // Pattern 4: If response looks like raw code (starts with import/const/function/class/etc.)
    const codeStart = /^(import|export|const|let|var|function|class|interface|type|package|from|#!)/m;
    if (codeStart.test(response.trim())) {
      return response.trim();
    }

    return null;
  }
}
