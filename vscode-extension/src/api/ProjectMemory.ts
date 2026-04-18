import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

export interface MemoryEntry {
  key: string;
  value: string;
  timestamp: number;
  source: 'user' | 'ai' | 'auto';
}

export interface ProjectMemory {
  projectName: string;
  techStack: string[];
  architecture: string;
  conventions: string[];
  importantFiles: string[];
  notes: MemoryEntry[];
  lastUpdated: number;
}

const MEMORY_FILENAME = '.cybermind/memory.json';

/**
 * ProjectMemory — persistent AI memory across sessions.
 *
 * Stores project context in .cybermind/memory.json so the AI
 * remembers what it learned about your project between sessions.
 * Like Cline's memory bank but built-in.
 */
export class ProjectMemoryManager {
  private memory: ProjectMemory | null = null;
  private memoryPath: string = '';

  async load(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return;

    this.memoryPath = path.join(workspaceRoot, MEMORY_FILENAME);

    if (fs.existsSync(this.memoryPath)) {
      try {
        const content = fs.readFileSync(this.memoryPath, 'utf8');
        this.memory = JSON.parse(content) as ProjectMemory;
        logger.info(`[Memory] Loaded ${this.memory.notes.length} memory entries`);
      } catch {
        this.memory = this.createEmpty(workspaceRoot);
      }
    } else {
      this.memory = this.createEmpty(workspaceRoot);
      await this.autoDetect(workspaceRoot);
    }
  }

  private createEmpty(workspaceRoot: string): ProjectMemory {
    return {
      projectName: path.basename(workspaceRoot),
      techStack: [],
      architecture: '',
      conventions: [],
      importantFiles: [],
      notes: [],
      lastUpdated: Date.now(),
    };
  }

  // Auto-detect tech stack from project files
  private async autoDetect(workspaceRoot: string): Promise<void> {
    if (!this.memory) return;

    const detections: string[] = [];

    const checks: Array<[string, string]> = [
      ['package.json', ''],
      ['tsconfig.json', 'TypeScript'],
      ['next.config.js', 'Next.js'],
      ['next.config.ts', 'Next.js'],
      ['vite.config.ts', 'Vite'],
      ['tailwind.config.ts', 'Tailwind CSS'],
      ['prisma/schema.prisma', 'Prisma'],
      ['supabase/config.toml', 'Supabase'],
      ['requirements.txt', 'Python'],
      ['pyproject.toml', 'Python'],
      ['go.mod', 'Go'],
      ['Cargo.toml', 'Rust'],
      ['pom.xml', 'Java/Maven'],
      ['Dockerfile', 'Docker'],
      ['.github/workflows', 'GitHub Actions CI/CD'],
    ];

    for (const [file, tech] of checks) {
      if (fs.existsSync(path.join(workspaceRoot, file))) {
        if (tech) detections.push(tech);

        // Parse package.json for more details
        if (file === 'package.json') {
          try {
            const pkg = JSON.parse(fs.readFileSync(path.join(workspaceRoot, file), 'utf8'));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps['react']) detections.push('React');
            if (deps['next']) detections.push('Next.js');
            if (deps['vue']) detections.push('Vue.js');
            if (deps['@angular/core']) detections.push('Angular');
            if (deps['express']) detections.push('Express.js');
            if (deps['fastify']) detections.push('Fastify');
            if (deps['@supabase/supabase-js']) detections.push('Supabase');
            if (deps['stripe']) detections.push('Stripe');
            if (deps['prisma']) detections.push('Prisma');
            if (deps['drizzle-orm']) detections.push('Drizzle ORM');
            if (deps['tailwindcss']) detections.push('Tailwind CSS');
          } catch { /* ignore */ }
        }
      }
    }

    this.memory.techStack = [...new Set(detections)];
    if (this.memory.techStack.length > 0) {
      this.addNote(`Auto-detected tech stack: ${this.memory.techStack.join(', ')}`, 'auto');
      this.save();
    }
  }

  addNote(value: string, source: MemoryEntry['source'] = 'ai', key?: string): void {
    if (!this.memory) return;
    this.memory.notes.push({
      key: key || `note-${Date.now()}`,
      value,
      timestamp: Date.now(),
      source,
    });
    // Keep last 100 notes
    if (this.memory.notes.length > 100) {
      this.memory.notes = this.memory.notes.slice(-100);
    }
    this.memory.lastUpdated = Date.now();
    this.save();
  }

  updateTechStack(stack: string[]): void {
    if (!this.memory) return;
    this.memory.techStack = [...new Set([...this.memory.techStack, ...stack])];
    this.save();
  }

  updateArchitecture(description: string): void {
    if (!this.memory) return;
    this.memory.architecture = description;
    this.save();
  }

  addImportantFile(filePath: string): void {
    if (!this.memory) return;
    if (!this.memory.importantFiles.includes(filePath)) {
      this.memory.importantFiles.push(filePath);
      this.save();
    }
  }

  addConvention(convention: string): void {
    if (!this.memory) return;
    if (!this.memory.conventions.includes(convention)) {
      this.memory.conventions.push(convention);
      this.save();
    }
  }

  // Build context string for AI prompts
  buildContextString(): string {
    if (!this.memory) return '';

    const parts: string[] = ['=== Project Memory ==='];

    if (this.memory.projectName) {
      parts.push(`Project: ${this.memory.projectName}`);
    }
    if (this.memory.techStack.length > 0) {
      parts.push(`Tech Stack: ${this.memory.techStack.join(', ')}`);
    }
    if (this.memory.architecture) {
      parts.push(`Architecture: ${this.memory.architecture}`);
    }
    if (this.memory.conventions.length > 0) {
      parts.push(`Conventions:\n${this.memory.conventions.map(c => `  - ${c}`).join('\n')}`);
    }
    if (this.memory.importantFiles.length > 0) {
      parts.push(`Key Files: ${this.memory.importantFiles.join(', ')}`);
    }

    // Recent notes (last 10)
    const recentNotes = this.memory.notes.slice(-10);
    if (recentNotes.length > 0) {
      parts.push('Recent context:');
      for (const note of recentNotes) {
        parts.push(`  - ${note.value}`);
      }
    }

    return parts.join('\n');
  }

  // Extract and save memory from AI response
  extractFromResponse(response: string): void {
    // Look for memory tags: <remember>...</remember>
    const rememberPattern = /<remember>([\s\S]*?)<\/remember>/g;
    let match;
    while ((match = rememberPattern.exec(response)) !== null) {
      this.addNote(match[1].trim(), 'ai');
    }

    // Auto-detect tech mentions
    const techPatterns = [
      /using (Next\.js|React|Vue|Angular|Svelte|Nuxt|Remix)/gi,
      /with (TypeScript|JavaScript|Python|Go|Rust|Java)/gi,
      /database[:\s]+(PostgreSQL|MySQL|MongoDB|SQLite|Supabase|PlanetScale)/gi,
    ];

    for (const pattern of techPatterns) {
      const techMatch = response.match(pattern);
      if (techMatch) {
        this.updateTechStack(techMatch.map(m => m.replace(/^(using|with|database[:\s]+)/i, '').trim()));
      }
    }
  }

  getMemory(): ProjectMemory | null {
    return this.memory;
  }

  private save(): void {
    if (!this.memory || !this.memoryPath) return;
    try {
      const dir = path.dirname(this.memoryPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.memoryPath, JSON.stringify(this.memory, null, 2), 'utf8');
    } catch (err) {
      logger.warn('[Memory] Failed to save', String(err));
    }
  }

  async openMemoryFile(): Promise<void> {
    if (!this.memoryPath) return;
    this.save();
    const uri = vscode.Uri.file(this.memoryPath);
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  }
}
