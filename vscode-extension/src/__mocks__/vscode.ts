// VSCode mock for Jest tests

const vscode = {
  window: {
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      show: jest.fn(),
      dispose: jest.fn(),
    })),
    createTerminal: jest.fn(() => ({
      sendText: jest.fn(),
      show: jest.fn(),
      dispose: jest.fn(),
      name: 'CyberMind Agent',
      exitStatus: undefined,
    })),
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showInputBox: jest.fn(),
    createTextEditorDecorationType: jest.fn(() => ({ dispose: jest.fn() })),
    activeTextEditor: undefined,
    terminals: [],
  },
  workspace: {
    fs: {
      writeFile: jest.fn(),
      readFile: jest.fn(),
      createDirectory: jest.fn(),
      delete: jest.fn(),
      stat: jest.fn(),
    },
    findFiles: jest.fn(() => Promise.resolve([])),
    applyEdit: jest.fn(() => Promise.resolve(true)),
    onDidCreateFiles: jest.fn(() => ({ dispose: jest.fn() })),
    onDidDeleteFiles: jest.fn(() => ({ dispose: jest.fn() })),
    onDidChangeTextDocument: jest.fn(() => ({ dispose: jest.fn() })),
    workspaceFolders: undefined,
    getConfiguration: jest.fn(() => ({
      get: jest.fn((key: string, defaultValue?: unknown) => defaultValue),
      update: jest.fn(),
    })),
  },
  languages: {
    createDiagnosticCollection: jest.fn(() => ({
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      dispose: jest.fn(),
      forEach: jest.fn(),
    })),
    registerInlineCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
    registerCodeActionsProvider: jest.fn(() => ({ dispose: jest.fn() })),
  },
  commands: {
    registerCommand: jest.fn(() => ({ dispose: jest.fn() })),
    executeCommand: jest.fn(),
  },
  env: {
    openExternal: jest.fn(),
  },
  Uri: {
    file: jest.fn((path: string) => ({ fsPath: path, scheme: 'file', path })),
    parse: jest.fn((uri: string) => ({ fsPath: uri, scheme: 'file', path: uri })),
    joinPath: jest.fn((base: { fsPath: string; path: string }, ...parts: string[]) => {
      const joined = [base.fsPath, ...parts].join('/');
      return { fsPath: joined, scheme: 'file', path: joined };
    }),
  },
  WorkspaceEdit: jest.fn(() => ({
    replace: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
    createFile: jest.fn(),
    deleteFile: jest.fn(),
    set: jest.fn(),
    entries: jest.fn(() => []),
  })),
  Position: jest.fn((line: number, character: number) => ({ line, character })),
  Range: jest.fn((start: unknown, end: unknown) => ({ start, end })),
  Diagnostic: jest.fn((range: unknown, message: string, severity: number) => ({
    range,
    message,
    severity,
    source: 'CyberMind',
  })),
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3,
  },
  InlineCompletionItem: jest.fn((text: string) => ({ insertText: text })),
  InlineCompletionList: jest.fn((items: unknown[]) => ({ items })),
  CodeAction: jest.fn((title: string, kind: unknown) => ({ title, kind, command: undefined, edit: undefined })),
  CodeActionKind: {
    QuickFix: { value: 'quickfix' },
    Refactor: { value: 'refactor' },
    Empty: { value: '' },
  },
  ExtensionContext: jest.fn(),
  SecretStorage: jest.fn(),
  Memento: jest.fn(),
  CancellationToken: jest.fn(() => ({
    isCancellationRequested: false,
    onCancellationRequested: jest.fn(),
  })),
  EventEmitter: jest.fn(() => ({
    event: jest.fn(),
    fire: jest.fn(),
    dispose: jest.fn(),
  })),
  ViewColumn: {
    One: 1,
    Two: 2,
    Active: -1,
  },
  TextDocument: jest.fn(),
};

module.exports = vscode;
