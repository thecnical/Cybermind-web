import * as vscode from 'vscode';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { AgentRegistry } from './AgentRegistry';
import { logger } from '../utils/logger';

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  type: 'file_create' | 'file_edit' | 'command' | 'analysis';
  filePath?: string;
  command?: string;
  status: 'pending' | 'running' | 'done' | 'failed' | 'skipped';
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
  approved: boolean;
  createdAt: number;
}

const PLAN_SYSTEM_PROMPT = `You are CyberMind AI planning assistant. Output a structured JSON plan.

CRITICAL: Your ENTIRE response must be valid JSON only. No markdown, no explanation, no code fences.

Required format:
{"goal":"what will be accomplished","steps":[{"id":"step-1","title":"Short title","description":"What this step does","type":"file_create","filePath":"src/auth.ts"},{"id":"step-2","title":"Run tests","description":"Verify changes","type":"command","command":"npm test"}]}

Step types:
- file_create: create a new file (requires filePath)
- file_edit: modify existing file (requires filePath)
- command: run a shell command (requires command)
- analysis: analyze code or explain something

Rules:
- Maximum 8 steps
- filePath must be relative to workspace root
- Commands must be safe (no rm -rf, no format, no destructive ops)
- Be specific about exact file paths based on the workspace context`;

/**
 * Robustly extract JSON from AI response.
 * Handles: raw JSON, JSON in markdown fences, JSON with surrounding text.
 */
function extractJson(text: string): string | null {
  // 1. Try direct parse first
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    try { JSON.parse(trimmed); return trimmed; } catch { /* continue */ }
  }

  // 2. Extract from markdown code fence ```json ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try { JSON.parse(fenceMatch[1]); return fenceMatch[1]; } catch { /* continue */ }
  }

  // 3. Find the outermost { ... } block
  const start = trimmed.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let end = -1;
  for (let i = start; i < trimmed.length; i++) {
    if (trimmed[i] === '{') depth++;
    else if (trimmed[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  if (end === -1) return null;
  const candidate = trimmed.slice(start, end + 1);
  try { JSON.parse(candidate); return candidate; } catch { /* continue */ }

  // 4. Try to fix common JSON issues (trailing commas, single quotes)
  const fixed = candidate
    .replace(/,\s*([}\]])/g, '$1')   // trailing commas
    .replace(/'/g, '"')               // single quotes
    .replace(/(\w+):/g, '"$1":');     // unquoted keys
  try { JSON.parse(fixed); return fixed; } catch { return null; }
}

export class PlanMode {
  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager,
    private readonly agentRegistry: AgentRegistry
  ) {}

  async generatePlan(
    goal: string,
    context: string,
    agentId: string,
    modelId: string
  ): Promise<Plan | null> {
    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    // Truncate context to avoid overwhelming the model
    const truncatedContext = context.slice(0, 6000);

    const request: ChatRequest = {
      message: `Create a step-by-step execution plan for this task:\n\n${goal}\n\nWorkspace context (truncated):\n${truncatedContext}`,
      agent: agentId,
      context: '',
      system: PLAN_SYSTEM_PROMPT,
    };

    let fullResponse = '';
    try {
      await this.backendClient.chat(
        request,
        modelId,
        apiKey,
        (token) => { fullResponse += token; },
        undefined,
        null,
        openRouterKey
      );

      logger.info(`Plan response (${fullResponse.length} chars): ${fullResponse.slice(0, 200)}`);

      const jsonStr = extractJson(fullResponse);
      if (!jsonStr) {
        logger.warn('Plan generation: could not extract JSON from response');
        // Try to build a simple plan from the text response
        return this.buildFallbackPlan(goal, fullResponse);
      }

      const parsed = JSON.parse(jsonStr) as {
        goal?: string;
        steps?: Array<{
          id?: string;
          title?: string;
          description?: string;
          type?: string;
          filePath?: string;
          command?: string;
        }>;
      };

      if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
        return this.buildFallbackPlan(goal, fullResponse);
      }

      const plan: Plan = {
        id: `plan-${Date.now()}`,
        goal: parsed.goal || goal,
        steps: parsed.steps.map((s, i) => ({
          id: s.id || `step-${i + 1}`,
          title: s.title || `Step ${i + 1}`,
          description: s.description || '',
          type: this.normalizeStepType(s.type),
          filePath: s.filePath,
          command: s.command,
          status: 'pending' as const,
        })),
        approved: false,
        createdAt: Date.now(),
      };

      return plan;
    } catch (err) {
      logger.error('Plan generation failed', err);
      return null;
    }
  }

  private normalizeStepType(type?: string): PlanStep['type'] {
    const valid = ['file_create', 'file_edit', 'command', 'analysis'];
    if (type && valid.includes(type)) return type as PlanStep['type'];
    // Guess from keywords
    if (type?.includes('creat') || type?.includes('new')) return 'file_create';
    if (type?.includes('edit') || type?.includes('modif') || type?.includes('updat')) return 'file_edit';
    if (type?.includes('run') || type?.includes('exec') || type?.includes('cmd')) return 'command';
    return 'analysis';
  }

  // Build a simple 1-step plan when JSON parsing fails
  private buildFallbackPlan(goal: string, aiResponse: string): Plan {
    logger.info('Using fallback plan (AI response was not valid JSON)');
    return {
      id: `plan-${Date.now()}`,
      goal,
      steps: [{
        id: 'step-1',
        title: 'Execute task',
        description: goal,
        type: 'analysis',
        status: 'pending',
      }],
      approved: false,
      createdAt: Date.now(),
    };
  }

  formatPlanForDisplay(plan: Plan): string {
    const lines = [
      `**Plan: ${plan.goal}**`,
      '',
      ...plan.steps.map((step, i) => {
        const icon = step.type === 'file_create' ? '📄' :
                     step.type === 'file_edit' ? '✏️' :
                     step.type === 'command' ? '⚡' : '🔍';
        const detail = step.filePath ? ` \`${step.filePath}\`` :
                       step.command ? ` \`${step.command}\`` : '';
        return `${i + 1}. ${icon} **${step.title}**${detail}\n   ${step.description}`;
      }),
      '',
      '---',
      'Type **yes** to execute, or describe changes to the plan.',
    ];
    return lines.join('\n');
  }
}
