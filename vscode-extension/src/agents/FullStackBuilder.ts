import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BackendClient, ChatRequest } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { Architecture, FileSpec } from './ArchitectAgent';
import { logger } from '../utils/logger';

// Built-in file templates — no AI needed for these
const BUILTIN_TEMPLATES: Record<string, (arch: Architecture) => string> = {
  '.gitignore': (arch) => getGitignore(arch.projectType),
  '.env.example': (arch) => getEnvExample(arch.techStack),
  'README.md': (arch) => getReadme(arch),
  '.github/workflows/ci.yml': (arch) => getCiCd(arch.projectType),
  'Dockerfile': (arch) => getDockerfile(arch.projectType),
  '.dockerignore': () => getDockerignore(),
};

const FILE_SYSTEM_PROMPT = `You are CyberMind FullStack Builder. Generate complete, production-ready file content.

Output ONLY the file content — no explanation, no markdown fences, no filepath header.
The content must be complete and immediately usable.
Write up to 6000 lines if needed — do not truncate or add "// ... rest of file".
Follow modern best practices for the tech stack.`;

const LARGE_FILE_CONTINUATION_PROMPT = `Continue generating the file content from where you left off.
Output ONLY the continuation — no explanation, no overlap with previous content.
Complete the remaining sections.`;

export class FullStackBuilder {
  constructor(
    private readonly backendClient: BackendClient,
    private readonly authManager: AuthManager
  ) {}

  async buildProject(
    arch: Architecture,
    workspaceRoot: string,
    priorityFilter: 'all' | 'priority' = 'all',
    onProgress: (file: string, status: 'generating' | 'done' | 'failed', lines?: number) => void
  ): Promise<{ created: string[]; failed: string[] }> {
    const created: string[] = [];
    const failed: string[] = [];

    const filesToBuild = priorityFilter === 'priority'
      ? arch.files.filter(f => f.priority === 1)
      : arch.files;

    // Create folder structure first
    await this.createFolderStructure(arch.folderStructure, workspaceRoot);

    // Generate files in priority order
    const sorted = [...filesToBuild].sort((a, b) => a.priority - b.priority);

    for (const fileSpec of sorted) {
      onProgress(fileSpec.path, 'generating');

      try {
        const content = await this.generateFile(fileSpec, arch);
        const absolutePath = path.join(workspaceRoot, fileSpec.path);

        // Ensure directory exists
        const dir = path.dirname(absolutePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(absolutePath, content, 'utf8');
        const lines = content.split('\n').length;
        created.push(fileSpec.path);
        onProgress(fileSpec.path, 'done', lines);
        logger.info(`[Builder] Created ${fileSpec.path} (${lines} lines)`);
      } catch (err) {
        failed.push(fileSpec.path);
        onProgress(fileSpec.path, 'failed');
        logger.warn(`[Builder] Failed ${fileSpec.path}: ${String(err)}`);
      }
    }

    return { created, failed };
  }

  private async generateFile(fileSpec: FileSpec, arch: Architecture): Promise<string> {
    // Use built-in template if available
    const templateFn = BUILTIN_TEMPLATES[fileSpec.path];
    if (templateFn) {
      return templateFn(arch);
    }

    const apiKey = await this.authManager.getApiKey();
    const openRouterKey = await this.authManager.getOpenRouterKey();

    const techContext = `Tech stack: ${arch.techStack.join(', ')}\nProject type: ${arch.projectType}\nProject: ${arch.description}`;

    const request: ChatRequest = {
      message: `Generate the complete content for file: ${fileSpec.path}\n\nPurpose: ${fileSpec.description}\n\n${techContext}\n\nWrite complete, production-ready code. For large files, write up to 6000 lines.`,
      agent: 'code',
      context: '',
      system: FILE_SYSTEM_PROMPT,
    };

    let content = '';
    await this.backendClient.chat(
      request, 'cybermindcli', apiKey,
      (token) => { content += token; },
      undefined, null, openRouterKey
    );

    // Clean up any accidental markdown fences
    content = this.cleanContent(content, fileSpec.path);

    // For large files, check if content seems truncated and continue
    if (fileSpec.sizeEstimate === 'large' && this.looksIncomplete(content, fileSpec.path)) {
      content = await this.continueGeneration(content, fileSpec, arch, apiKey, openRouterKey);
    }

    return content;
  }

  private async continueGeneration(
    existingContent: string,
    fileSpec: FileSpec,
    arch: Architecture,
    apiKey: string | null,
    openRouterKey: string | null
  ): Promise<string> {
    const lastLines = existingContent.split('\n').slice(-20).join('\n');

    const request: ChatRequest = {
      message: `Continue this file: ${fileSpec.path}\n\nLast generated content:\n${lastLines}\n\nContinue from here. Complete all remaining sections.`,
      agent: 'code',
      context: '',
      system: LARGE_FILE_CONTINUATION_PROMPT,
    };

    let continuation = '';
    try {
      await this.backendClient.chat(
        request, 'cybermindcli', apiKey,
        (token) => { continuation += token; },
        undefined, null, openRouterKey
      );
      return existingContent + '\n' + this.cleanContent(continuation, fileSpec.path);
    } catch {
      return existingContent; // Return what we have
    }
  }

  private looksIncomplete(content: string, filePath: string): boolean {
    const lines = content.split('\n');
    if (lines.length < 50) return false; // Too short to be a large file

    const lastLine = lines[lines.length - 1].trim();
    const ext = path.extname(filePath);

    // Check for common truncation signs
    if (lastLine.includes('// ...') || lastLine.includes('# ...')) return true;
    if (lastLine.includes('TODO') || lastLine.includes('rest of')) return true;

    // For TypeScript/JS: check if braces are balanced
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      const opens = (content.match(/\{/g) || []).length;
      const closes = (content.match(/\}/g) || []).length;
      if (opens > closes + 2) return true; // Significantly unbalanced
    }

    return false;
  }

  private cleanContent(content: string, filePath: string): string {
    // Remove markdown code fences
    let cleaned = content
      .replace(/^```[\w]*\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    // Remove filepath header if AI added it
    const ext = path.extname(filePath);
    cleaned = cleaned.replace(new RegExp(`^// ${filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n`), '');
    cleaned = cleaned.replace(new RegExp(`^# ${filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n`), '');

    return cleaned;
  }

  private async createFolderStructure(node: { name: string; children?: typeof node[]; files?: string[] }, basePath: string): Promise<void> {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    if (node.children) {
      for (const child of node.children) {
        if (child.name && child.name !== 'root') {
          await this.createFolderStructure(child, path.join(basePath, child.name));
        } else {
          await this.createFolderStructure(child, basePath);
        }
      }
    }
  }
}

// ─── Built-in templates ────────────────────────────────────────────────────

function getGitignore(projectType: string): string {
  const base = `# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/
.nuxt/
.output/
__pycache__/
*.pyc
*.pyo
target/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/
.pytest_cache/

# Misc
*.tsbuildinfo
.eslintcache
.stylelintcache
`;

  if (projectType.includes('python')) {
    return base + `
# Python
venv/
env/
.venv/
*.egg-info/
dist/
*.egg
`;
  }

  if (projectType.includes('go')) {
    return base + `
# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
vendor/
`;
  }

  return base;
}

function getEnvExample(techStack: string[]): string {
  const lines = ['# Environment Variables — copy to .env.local and fill in values', ''];

  if (techStack.some(t => t.toLowerCase().includes('supabase'))) {
    lines.push('# Supabase', 'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co', 'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key', 'SUPABASE_SERVICE_ROLE_KEY=your-service-role-key', '');
  }
  if (techStack.some(t => t.toLowerCase().includes('stripe'))) {
    lines.push('# Stripe', 'STRIPE_SECRET_KEY=sk_test_...', 'STRIPE_WEBHOOK_SECRET=whsec_...', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...', '');
  }
  if (techStack.some(t => t.toLowerCase().includes('openai') || t.toLowerCase().includes('ai'))) {
    lines.push('# AI', 'OPENAI_API_KEY=sk-...', 'ANTHROPIC_API_KEY=sk-ant-...', '');
  }
  if (techStack.some(t => t.toLowerCase().includes('postgres') || t.toLowerCase().includes('database'))) {
    lines.push('# Database', 'DATABASE_URL=postgresql://user:password@localhost:5432/dbname', '');
  }
  if (techStack.some(t => t.toLowerCase().includes('redis'))) {
    lines.push('# Redis', 'REDIS_URL=redis://localhost:6379', '');
  }

  lines.push('# App', 'NEXT_PUBLIC_APP_URL=http://localhost:3000', 'NODE_ENV=development');

  return lines.join('\n');
}

function getReadme(arch: Architecture): string {
  return `# ${arch.description}

Built with ${arch.techStack.join(', ')}.

## Getting Started

\`\`\`bash
# Install dependencies
${arch.commands[0] || 'npm install'}

# Set up environment
cp .env.example .env.local
# Fill in your environment variables

# Start development server
${arch.commands[1] || 'npm run dev'}
\`\`\`

## Tech Stack

${arch.techStack.map(t => `- ${t}`).join('\n')}

## Project Structure

\`\`\`
${formatFolderTree(arch.folderStructure)}
\`\`\`

## Deployment

${arch.cicd ? 'CI/CD is configured via GitHub Actions. Push to main to deploy.' : 'Configure your deployment platform of choice.'}

## License

MIT
`;
}

function formatFolderTree(node: { name: string; children?: typeof node[]; files?: string[] }, indent = ''): string {
  const lines: string[] = [];
  if (node.name && node.name !== 'root') lines.push(`${indent}${node.name}/`);
  const childIndent = node.name && node.name !== 'root' ? indent + '  ' : indent;
  if (node.files) {
    for (const f of node.files) lines.push(`${childIndent}${f}`);
  }
  if (node.children) {
    for (const child of node.children) lines.push(formatFolderTree(child, childIndent));
  }
  return lines.join('\n');
}

function getCiCd(projectType: string): string {
  if (projectType.includes('python')) {
    return `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest
      - run: ruff check .
`;
  }

  return `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test --if-present
      - run: npm run lint --if-present

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Add your deployment step here"
`;
}

function getDockerfile(projectType: string): string {
  if (projectType.includes('python')) {
    return `FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`;
  }

  return `FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
`;
}

function getDockerignore(): string {
  return `node_modules
.next
dist
build
.env
.env.local
*.log
coverage
.git
`;
}
