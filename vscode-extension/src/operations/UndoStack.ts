import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export class UndoStack {
  private stack: vscode.WorkspaceEdit[] = [];
  private readonly maxSize = 50;

  push(inverseEdit: vscode.WorkspaceEdit): void {
    this.stack.push(inverseEdit);
    // Keep stack bounded
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }
  }

  pop(): vscode.WorkspaceEdit | undefined {
    return this.stack.pop();
  }

  clear(): void {
    this.stack = [];
  }

  get size(): number {
    return this.stack.length;
  }

  async undoLast(): Promise<boolean> {
    const inverseEdit = this.pop();
    if (!inverseEdit) {
      logger.info('Nothing to undo');
      return false;
    }

    try {
      const success = await vscode.workspace.applyEdit(inverseEdit);
      if (success) {
        logger.info('Undo applied successfully');
      } else {
        logger.warn('Undo failed to apply');
      }
      return success;
    } catch (error) {
      logger.error('Error applying undo', error);
      return false;
    }
  }
}
