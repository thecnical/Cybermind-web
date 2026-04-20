import * as vscode from 'vscode';
import {
  SECURITY_PROMPT,
  CODE_PROMPT,
  UNIT_TEST_PROMPT,
  BUG_FIX_PROMPT,
  EXPLAIN_PROMPT,
  REFACTOR_PROMPT,
  DOCS_PROMPT,
  PLAYWRIGHT_PROMPT,
  GIT_PROMPT,
  REVIEW_PROMPT,
  FULLSTACK_PROMPT,
} from './agents';

export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  isCustom: boolean;
}

const CUSTOM_AGENTS_KEY = 'cybermind.customAgents';

const BUILT_IN_AGENTS: Agent[] = [
  {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    description: 'OWASP scanning, secrets detection, SQL injection & XSS analysis',
    systemPrompt: SECURITY_PROMPT,
    isCustom: false,
  },
  {
    id: 'code',
    name: 'Code',
    icon: '</>',
    description: 'Multi-file code generation and editing',
    systemPrompt: CODE_PROMPT,
    isCustom: false,
  },
  {
    id: 'unit-test',
    name: 'Unit Test',
    icon: '🧪',
    description: 'Generate test files for your code',
    systemPrompt: UNIT_TEST_PROMPT,
    isCustom: false,
  },
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    icon: '🐛',
    description: 'Identify and fix bugs with minimal changes',
    systemPrompt: BUG_FIX_PROMPT,
    isCustom: false,
  },
  {
    id: 'explain',
    name: 'Explain',
    icon: '💡',
    description: 'Plain language explanation of code',
    systemPrompt: EXPLAIN_PROMPT,
    isCustom: false,
  },
  {
    id: 'refactor',
    name: 'Refactor',
    icon: '♻️',
    description: 'Improve code without changing behavior',
    systemPrompt: REFACTOR_PROMPT,
    isCustom: false,
  },
  {
    id: 'docs',
    name: 'Docs',
    icon: '📝',
    description: 'Generate JSDoc/TSDoc documentation',
    systemPrompt: DOCS_PROMPT,
    isCustom: false,
  },
  {
    id: 'playwright',
    name: 'Playwright',
    icon: '🎭',
    description: 'Write E2E browser tests with Playwright',
    systemPrompt: PLAYWRIGHT_PROMPT,
    isCustom: false,
  },
  {
    id: 'git',
    name: 'Git',
    icon: '🌿',
    description: 'Commit messages, PR descriptions, branching strategy',
    systemPrompt: GIT_PROMPT,
    isCustom: false,
  },
  {
    id: 'review',
    name: 'Review',
    icon: '👁️',
    description: 'Thorough code review with security, performance, maintainability',
    systemPrompt: REVIEW_PROMPT,
    isCustom: false,
  },
  {
    id: 'fullstack',
    name: 'Full-Stack',
    icon: '🚀',
    description: 'Build complete features: Next.js, Supabase, Stripe, TypeScript',
    systemPrompt: FULLSTACK_PROMPT,
    isCustom: false,
  },
];

export class AgentRegistry {
  constructor(private readonly globalState: vscode.Memento) {}

  getBuiltInAgents(): Agent[] {
    return [...BUILT_IN_AGENTS];
  }

  getCustomAgents(): Agent[] {
    const stored = this.globalState.get<Agent[]>(CUSTOM_AGENTS_KEY, []);
    return stored.map(a => ({ ...a, isCustom: true }));
  }

  getAllAgents(): Agent[] {
    return [...this.getBuiltInAgents(), ...this.getCustomAgents()];
  }

  getAgent(id: string): Agent | undefined {
    return this.getAllAgents().find(a => a.id === id);
  }

  saveCustomAgent(agent: Omit<Agent, 'isCustom'>): void {
    const existing = this.getCustomAgents();
    const idx = existing.findIndex(a => a.id === agent.id);
    const newAgent: Agent = { ...agent, isCustom: true };

    if (idx >= 0) {
      existing[idx] = newAgent;
    } else {
      existing.push(newAgent);
    }

    this.globalState.update(CUSTOM_AGENTS_KEY, existing);
  }

  deleteCustomAgent(id: string): void {
    const existing = this.getCustomAgents();
    const filtered = existing.filter(a => a.id !== id);
    this.globalState.update(CUSTOM_AGENTS_KEY, filtered);
  }
}
