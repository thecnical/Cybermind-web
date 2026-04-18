import * as vscode from 'vscode';

export class CyberMindCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.Refactor,
    vscode.CodeActionKind.Empty,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    const hasSelection = !range.isEmpty;
    const actions: vscode.CodeAction[] = [];

    if (hasSelection) {
      actions.push(this.createAction('Explain Selection', 'cybermind.explainCode', vscode.CodeActionKind.Empty));
      actions.push(this.createAction('Fix Bug in Selection', 'cybermind.fixBug', vscode.CodeActionKind.QuickFix));
      actions.push(this.createAction('Refactor Selection', 'cybermind.refactorCode', vscode.CodeActionKind.Refactor));
      actions.push(this.createAction('Generate Tests for Selection', 'cybermind.generateTests', vscode.CodeActionKind.Empty));
      actions.push(this.createAction('Add Documentation', 'cybermind.generateDocs', vscode.CodeActionKind.Empty));
    }

    actions.push(this.createAction('Scan for Vulnerabilities', 'cybermind.scanFile', vscode.CodeActionKind.Empty));

    return actions;
  }

  private createAction(
    title: string,
    command: string,
    kind: vscode.CodeActionKind
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(`CyberMind: ${title}`, kind);
    action.command = {
      command,
      title,
      tooltip: `CyberMind: ${title}`,
    };
    return action;
  }
}
