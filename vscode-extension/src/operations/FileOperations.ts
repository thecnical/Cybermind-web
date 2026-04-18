import * as vscode from 'vscode';
import * as path from 'path';
import { UndoStack } from './UndoStack';
import { PathSanitizer } from '../security/PathSanitizer';
import { logger } from '../utils/logger';

export interface FileEdit {
  uri: vscode.Uri;
  newContent: string;
  originalContent?: string;
}

export interface FileCreation {
  uri: vscode.Uri;
  content: string;
}

export class FileOperations {
  constructor(
    private readonly undoStack: UndoStack,
    private readonly pathSanitizer: PathSanitizer
  ) {}

  async createFile(creation: FileCreation): Promise<void> {
    const sanitized = this.pathSanitizer.sanitize(creation.uri.fsPath);
    if (!sanitized) {
      throw new Error(`Path rejected by security check: ${creation.uri.fsPath}`);
    }

    try {
      const content = Buffer.from(creation.content, 'utf8');
      await vscode.workspace.fs.writeFile(creation.uri, content);

      // Open the new file in the editor
      const doc = await vscode.workspace.openTextDocument(creation.uri);
      await vscode.window.showTextDocument(doc);

      logger.info(`Created file: ${creation.uri.fsPath}`);
    } catch (error) {
      logger.error(`Failed to create file: ${creation.uri.fsPath}`, error);
      throw error;
    }
  }

  async editFile(edit: FileEdit): Promise<boolean> {
    const sanitized = this.pathSanitizer.sanitize(edit.uri.fsPath);
    if (!sanitized) {
      throw new Error(`Path rejected by security check: ${edit.uri.fsPath}`);
    }

    try {
      // Read original content if not provided
      let originalContent = edit.originalContent;
      if (!originalContent) {
        const rawContent = await vscode.workspace.fs.readFile(edit.uri);
        originalContent = Buffer.from(rawContent).toString('utf8');
      }

      // Show diff view and wait for user decision
      const accepted = await this.openDiffView(
        originalContent,
        edit.newContent,
        `CyberMind: ${path.basename(edit.uri.fsPath)}`,
        edit.uri
      );

      if (!accepted) {
        return false;
      }

      // Apply the edit
      const workspaceEdit = new vscode.WorkspaceEdit();
      const doc = await vscode.workspace.openTextDocument(edit.uri);
      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(doc.getText().length)
      );
      workspaceEdit.replace(edit.uri, fullRange, edit.newContent);

      const success = await vscode.workspace.applyEdit(workspaceEdit);
      if (!success) {
        throw new Error('Failed to apply workspace edit');
      }

      // Push inverse edit to undo stack
      const inverseEdit = new vscode.WorkspaceEdit();
      inverseEdit.replace(edit.uri, fullRange, originalContent);
      this.undoStack.push(inverseEdit);

      logger.info(`Edited file: ${edit.uri.fsPath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to edit file: ${edit.uri.fsPath}`, error);
      throw error;
    }
  }

  async createDirectory(uri: vscode.Uri): Promise<void> {
    const sanitized = this.pathSanitizer.sanitize(uri.fsPath);
    if (!sanitized) {
      throw new Error(`Path rejected by security check: ${uri.fsPath}`);
    }

    try {
      await vscode.workspace.fs.createDirectory(uri);
      // Refresh the explorer
      await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
      logger.info(`Created directory: ${uri.fsPath}`);
    } catch (error) {
      logger.error(`Failed to create directory: ${uri.fsPath}`, error);
      throw error;
    }
  }

  async applyMultiFileEdit(edits: FileEdit[]): Promise<boolean> {
    // Validate all paths first
    for (const edit of edits) {
      const sanitized = this.pathSanitizer.sanitize(edit.uri.fsPath);
      if (!sanitized) {
        throw new Error(`Path rejected by security check: ${edit.uri.fsPath}`);
      }
    }

    // Read all original contents
    const editsWithOriginals: FileEdit[] = [];
    for (const edit of edits) {
      let originalContent = edit.originalContent;
      if (!originalContent) {
        try {
          const rawContent = await vscode.workspace.fs.readFile(edit.uri);
          originalContent = Buffer.from(rawContent).toString('utf8');
        } catch {
          originalContent = ''; // New file
        }
      }
      editsWithOriginals.push({ ...edit, originalContent });
    }

    if (editsWithOriginals.length === 0) return false;

    if (editsWithOriginals.length === 1) {
      // Single file — show diff view
      const edit = editsWithOriginals[0];
      const accepted = await this.openDiffView(
        edit.originalContent ?? '',
        edit.newContent,
        `CyberMind: ${path.basename(edit.uri.fsPath)}`,
        edit.uri
      );
      if (!accepted) return false;
    } else {
      // Multi-file — show summary with file list and quick pick
      const fileItems = editsWithOriginals.map(e => ({
        label: `$(file) ${path.basename(e.uri.fsPath)}`,
        description: path.relative(
          vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
          e.uri.fsPath
        ),
        detail: e.originalContent === '' ? '(new file)' : `${e.newContent.split('\n').length} lines`,
      }));

      // Show each diff in sequence
      const choice = await vscode.window.showQuickPick(
        [
          { label: '$(check) Apply All Changes', description: `${editsWithOriginals.length} files` },
          { label: '$(eye) Review Each File', description: 'Open diff for each file' },
          { label: '$(x) Cancel', description: 'Discard all changes' },
        ],
        {
          title: `CyberMind: ${editsWithOriginals.length} files to change`,
          placeHolder: 'Choose how to apply changes',
        }
      );

      if (!choice || choice.label.includes('Cancel')) return false;

      if (choice.label.includes('Review')) {
        // Show diff for each file
        for (const edit of editsWithOriginals) {
          const accepted = await this.openDiffView(
            edit.originalContent ?? '',
            edit.newContent,
            `CyberMind: ${path.basename(edit.uri.fsPath)}`,
            edit.uri
          );
          if (!accepted) {
            const skip = await vscode.window.showWarningMessage(
              `Skip ${path.basename(edit.uri.fsPath)} and continue?`,
              'Skip', 'Cancel All'
            );
            if (skip !== 'Skip') return false;
          }
        }
      }
    }

    // Build a single WorkspaceEdit for atomic apply
    const batchEdit = new vscode.WorkspaceEdit();
    const inverseEdit = new vscode.WorkspaceEdit();

    for (const edit of editsWithOriginals) {
      try {
        const doc = await vscode.workspace.openTextDocument(edit.uri);
        const fullRange = new vscode.Range(
          doc.positionAt(0),
          doc.positionAt(doc.getText().length)
        );
        batchEdit.replace(edit.uri, fullRange, edit.newContent);
        inverseEdit.replace(edit.uri, fullRange, edit.originalContent ?? '');
      } catch {
        // New file
        batchEdit.createFile(edit.uri, { overwrite: true });
        batchEdit.insert(edit.uri, new vscode.Position(0, 0), edit.newContent);
      }
    }

    const success = await vscode.workspace.applyEdit(batchEdit);
    if (!success) {
      throw new Error('Failed to apply multi-file workspace edit');
    }

    this.undoStack.push(inverseEdit);
    logger.info(`Applied multi-file edit: ${editsWithOriginals.length} files`);
    return true;
  }

  async openDiffView(
    original: string,
    modified: string,
    title: string,
    uri: vscode.Uri
  ): Promise<boolean> {
    // Create temp URIs for diff view
    const originalUri = uri.with({ scheme: 'cybermind-original', query: Date.now().toString() });
    const modifiedUri = uri.with({ scheme: 'cybermind-modified', query: Date.now().toString() });

    // Register content providers for the temp URIs
    const originalProvider = vscode.workspace.registerTextDocumentContentProvider(
      'cybermind-original',
      { provideTextDocumentContent: () => original }
    );
    const modifiedProvider = vscode.workspace.registerTextDocumentContentProvider(
      'cybermind-modified',
      { provideTextDocumentContent: () => modified }
    );

    try {
      await vscode.commands.executeCommand(
        'vscode.diff',
        originalUri,
        modifiedUri,
        title,
        { preview: true }
      );

      // Ask user to accept or reject
      const choice = await vscode.window.showInformationMessage(
        `Apply changes to ${path.basename(uri.fsPath)}?`,
        'Apply',
        'Reject'
      );

      return choice === 'Apply';
    } finally {
      originalProvider.dispose();
      modifiedProvider.dispose();
    }
  }
}
