import * as vscode from 'vscode';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface IndexedFile {
  path: string;
  relativePath: string;
  summary: string; // first 500 chars of content
  lastModified: number;
}

const EXCLUDED_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  '__pycache__',
  '.pytest_cache',
  'vendor',
];

const EXCLUDED_EXTENSIONS = [
  '.lock',
  '.min.js',
  '.map',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp4',
  '.mp3',
  '.zip',
  '.tar',
  '.gz',
  '.exe',
  '.dll',
  '.so',
  '.dylib',
];

export class RepoIndexer {
  private index: Map<string, IndexedFile> = new Map();
  private isIndexing = false;
  private lastIndexed: Date | null = null;
  private watchers: vscode.Disposable[] = [];

  async buildIndex(): Promise<void> {
    if (this.isIndexing) return;

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      logger.info('No workspace folders found, skipping index build');
      return;
    }

    this.isIndexing = true;
    logger.info('Building repo index...');

    try {
      this.index.clear();

      const files = await vscode.workspace.findFiles(
        '**/*',
        `**/{${EXCLUDED_PATTERNS.join(',')}}/**`
      );

      let indexed = 0;
      for (const fileUri of files) {
        if (this.shouldExclude(fileUri.fsPath)) continue;

        try {
          const content = await vscode.workspace.fs.readFile(fileUri);
          const text = Buffer.from(content).toString('utf8');
          const summary = text.slice(0, 500);

          const workspaceRoot = workspaceFolders[0].uri.fsPath;
          const relativePath = path.relative(workspaceRoot, fileUri.fsPath);

          this.index.set(fileUri.fsPath, {
            path: fileUri.fsPath,
            relativePath,
            summary,
            lastModified: Date.now(),
          });
          indexed++;
        } catch {
          // Skip files that can't be read (binary, permissions, etc.)
        }
      }

      this.lastIndexed = new Date();
      logger.info(`Repo index built: ${indexed} files indexed`);
    } finally {
      this.isIndexing = false;
    }
  }

  shouldExclude(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Check excluded directory patterns
    for (const pattern of EXCLUDED_PATTERNS) {
      if (normalizedPath.includes(`/${pattern}/`) || normalizedPath.includes(`/${pattern}`)) {
        return true;
      }
    }

    // Check excluded extensions
    const ext = path.extname(filePath).toLowerCase();
    if (EXCLUDED_EXTENSIONS.includes(ext)) {
      return true;
    }

    // Check for .lock files (e.g., package-lock.json, yarn.lock)
    const basename = path.basename(filePath);
    if (basename.endsWith('.lock') || basename === 'package-lock.json' || basename === 'yarn.lock') {
      return true;
    }

    return false;
  }

  async getFileContent(relativePath: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace open');
    }

    const absolutePath = path.join(workspaceFolders[0].uri.fsPath, relativePath);
    const uri = vscode.Uri.file(absolutePath);
    const content = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(content).toString('utf8');
  }

  searchFiles(query: string): IndexedFile[] {
    if (!query) {
      return Array.from(this.index.values()).slice(0, 20);
    }

    const lowerQuery = query.toLowerCase();
    const results: Array<{ file: IndexedFile; score: number }> = [];

    for (const file of this.index.values()) {
      const lowerPath = file.relativePath.toLowerCase();
      const lowerBasename = path.basename(file.relativePath).toLowerCase();

      let score = 0;

      // Exact basename match gets highest score
      if (lowerBasename === lowerQuery) {
        score = 100;
      } else if (lowerBasename.startsWith(lowerQuery)) {
        score = 80;
      } else if (lowerBasename.includes(lowerQuery)) {
        score = 60;
      } else if (lowerPath.includes(lowerQuery)) {
        score = 40;
      }

      if (score > 0) {
        results.push({ file, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(r => r.file);
  }

  getStatus(): { fileCount: number; lastIndexed: Date | null; isIndexing: boolean } {
    return {
      fileCount: this.index.size,
      lastIndexed: this.lastIndexed,
      isIndexing: this.isIndexing,
    };
  }

  startWatching(context: vscode.ExtensionContext): void {
    // Watch for file creation
    const createWatcher = vscode.workspace.onDidCreateFiles(async (event) => {
      for (const file of event.files) {
        if (this.shouldExclude(file.fsPath)) continue;
        try {
          const content = await vscode.workspace.fs.readFile(file);
          const text = Buffer.from(content).toString('utf8');
          const workspaceFolders = vscode.workspace.workspaceFolders;
          const workspaceRoot = workspaceFolders?.[0]?.uri.fsPath ?? '';
          const relativePath = path.relative(workspaceRoot, file.fsPath);

          this.index.set(file.fsPath, {
            path: file.fsPath,
            relativePath,
            summary: text.slice(0, 500),
            lastModified: Date.now(),
          });
        } catch {
          // Skip unreadable files
        }
      }
    });

    // Watch for file changes
    const changeWatcher = vscode.workspace.onDidChangeTextDocument(async (event) => {
      const filePath = event.document.uri.fsPath;
      if (this.shouldExclude(filePath) || !this.index.has(filePath)) return;

      const text = event.document.getText();
      const existing = this.index.get(filePath)!;
      this.index.set(filePath, {
        ...existing,
        summary: text.slice(0, 500),
        lastModified: Date.now(),
      });
    });

    // Watch for file deletion
    const deleteWatcher = vscode.workspace.onDidDeleteFiles((event) => {
      for (const file of event.files) {
        this.index.delete(file.fsPath);
      }
    });

    this.watchers.push(createWatcher, changeWatcher, deleteWatcher);
    context.subscriptions.push(createWatcher, changeWatcher, deleteWatcher);
  }

  dispose(): void {
    for (const watcher of this.watchers) {
      watcher.dispose();
    }
    this.watchers = [];
  }
}
