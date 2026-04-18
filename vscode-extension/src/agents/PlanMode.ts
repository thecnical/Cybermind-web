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

const PLAN_SYSTEM_PROMPT = `You are CyberMind AI planning assistant. When given a task, output a structured plan in JSON.

ALWAYS respond with this exact JSON format (no markdown, no explanation outside JSON):
{
  "goal": "brief description of what will be accomplished",
  "steps": [
    {
      "id": "step-1",
      "title": "Short title",
      "description": "What this step does",
      "type": "file_create|file_edit|command|analysis",
      "filePath": "path/to/file.ts (for file steps)",
      "command": "npm install (for command steps)"
    }
  ]
}

Rules:
- Maximum 8 steps
- Be specific about file paths
- Commands must be safe (no rm -rf, no destructive ops)
- type must be exactly one of: file_create, file_edit, command, analysis
- filePath required for file_create and file_edit
- command required for command type`;

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

    const request: ChatRequest = {
      message: `Create a step-by-step plan for this task:\n\n${goal}\n\nWorkspace context:\n${context}`,
      agent: agentId,
      context,
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

      // Extract JSON from response
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.warn('Plan generation: no JSON found in response');
        return null;
      }

      const parsed = JSON.parse(jsonMatch[0]) as { goal: string; steps: Omit<PlanStep, 'status'>[] };

      const plan: Plan = {
        id: `plan-${Date.now()}`,
        goal: parsed.goal || goal,
        steps: (parsed.steps || []).map((s, i) => ({
          ...s,
          id: s.id || `step-${i + 1}`,
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
      'Approve this plan to execute, or type a different request.',
    ];
    return lines.join('\n');
  }
}
