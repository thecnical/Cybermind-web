import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { logger } from '../utils/logger';

export interface Architecture {
  projectType: string;
  techStack: string[];
  folderStructure: FolderNode;
  files: FileSpec[];
  commands: string[];
  cicd: boolean;
  description: string;
}

export interface FolderNode {
  name: string;
  children?: FolderNode[];
  files?: string[];
}

export interface FileSpec {
  path: string;
  description: string;
  priority: number; // 1=critical, 2=important, 3=optional
  sizeEstimate: 'small' | 'medium' | 'large'; // small<100, medium<500, large<6000 lines
}

const ARCHITECT_SYSTEM_PROMPT = `You are CyberMind Architect — an expert software architect who designs complete, production-ready applications.

When given a project description, output a complete architecture plan as JSON.

RESPOND WITH ONLY VALID JSON — no markdown, no explanation:
{
  "projectType": "nextjs-saas|react-app|node-api|python-fastapi|fullstack|cli|library",
  "description": "what this project does",
  "techStack": ["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Stripe"],
  "folderStructure": {
    "name": "root",
    "children": [
      {"name": "src", "children": [
        {"name": "app", "files": ["page.tsx", "layout.tsx"]},
        {"name": "components", "files": ["Button.tsx", "Navbar.tsx"]},
        {"name": "lib", "files": ["supabase.ts", "utils.ts"]}
      ]},
      {"name": "public", "files": ["favicon.ico"]},
      {"files": ["package.json", "tsconfig.json", ".gitignore", "README.md", ".env.example"]}
    ]
  },
  "files": [
    {"path": "package.json", "description": "Dependencies and scripts", "priority": 1, "sizeEstimate": "small"},
    {"path": "src/app/page.tsx", "description": "Home page", "priority": 1, "sizeEstimate": "medium"},
    {"path": "src/components/Navbar.tsx", "description": "Navigation component", "priority": 2, "sizeEstimate": "medium"}
  ],
  "commands": ["npm install", "npm run dev"],
  "cicd": true
}

Rules:
- Include ALL files needed for a production app
- Priority 1 = must have (app won't run without it)
- Priority 2 = important feature files
- Priority 3 = nice to have
- sizeEstimate: small=<100 lines, medium=100-500 lines, large=500-6000 lines
- Always include: .gitignore, README.md, .env.example, package.json/requirements.txt
- For fullstack: include CI/CD (GitHub Actions), Docker, deployment config`;

export class ArchitectAgent {
  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager
  ) {}

  async designArchitecture(
    projectDescription: string,
    modelId: string
  ): Promise<Architecture | null> {
    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    const request: ChatRequest = {
      message: `Design a complete production-ready architecture for:\n\n${projectDescription}`,
      agent: 'code',
      context: '',
      system: ARCHITECT_SYSTEM_PROMPT,
    };

    let fullResponse = '';
    try {
      await this.backendClient.chat(
        request, modelId, apiKey,
        (token) => { fullResponse += token; },
        undefined, null, openRouterKey
      );

      const arch = this.parseArchitecture(fullResponse);
      if (arch) {
        logger.info(`[Architect] Designed ${arch.projectType} with ${arch.files.length} files`);
      }
      return arch;
    } catch (err) {
      logger.error('[Architect] Failed to design architecture', err);
      return null;
    }
  }

  private parseArchitecture(response: string): Architecture | null {
    // Extract JSON
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');
    if (start === -1 || end === -1) return null;

    try {
      const json = response.slice(start, end + 1);
      const parsed = JSON.parse(json) as Architecture;
      if (!parsed.files || !Array.isArray(parsed.files)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  formatArchitectureDisplay(arch: Architecture): string {
    const lines = [
      `## 🏗️ Architecture: ${arch.description}`,
      `**Type:** ${arch.projectType}`,
      `**Stack:** ${arch.techStack.join(', ')}`,
      '',
      '### Files to generate:',
      ...arch.files
        .sort((a, b) => a.priority - b.priority)
        .map(f => {
          const icon = f.priority === 1 ? '🔴' : f.priority === 2 ? '🟡' : '🟢';
          const size = f.sizeEstimate === 'large' ? '(large)' : '';
          return `${icon} \`${f.path}\` ${size} — ${f.description}`;
        }),
      '',
      '### Setup commands:',
      ...arch.commands.map(c => `\`${c}\``),
      '',
      arch.cicd ? '✅ CI/CD included' : '',
      '',
      '---',
      'Type **build** to generate all files, or **build priority** for critical files only.',
    ].filter(l => l !== undefined);

    return lines.join('\n');
  }
}
