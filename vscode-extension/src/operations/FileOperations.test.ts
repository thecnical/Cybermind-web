import * as vscode from 'vscode';
import { FileOperations } from './FileOperations';
import { UndoStack } from './UndoStack';
import { PathSanitizer } from '../security/PathSanitizer';

const WORKSPACE = '/workspace/myproject';

describe('FileOperations', () => {
  let fileOps: FileOperations;
  let undoStack: UndoStack;
  let pathSanitizer: PathSanitizer;

  beforeEach(() => {
    jest.clearAllMocks();
    undoStack = new UndoStack();
    pathSanitizer = new PathSanitizer(WORKSPACE);
    fileOps = new FileOperations(undoStack, pathSanitizer);
  });

  describe('createFile', () => {
    it('rejects paths outside workspace via PathSanitizer', async () => {
      const uri = vscode.Uri.file('/etc/passwd');

      await expect(
        fileOps.createFile({ uri, content: 'malicious content' })
      ).rejects.toThrow('Path rejected by security check');

      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });

    it('creates file within workspace', async () => {
      const uri = vscode.Uri.file(`${WORKSPACE}/src/newfile.ts`);
      (vscode.workspace.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
      (vscode.workspace.openTextDocument as jest.Mock) = jest.fn().mockResolvedValueOnce({});
      (vscode.window.showTextDocument as jest.Mock) = jest.fn().mockResolvedValueOnce(undefined);

      await fileOps.createFile({ uri, content: 'const x = 1;' });

      expect(vscode.workspace.fs.writeFile).toHaveBeenCalledWith(
        uri,
        expect.any(Buffer)
      );
    });
  });

  describe('applyMultiFileEdit', () => {
    it('rejects paths outside workspace', async () => {
      const edits = [
        { uri: vscode.Uri.file('/etc/passwd'), newContent: 'evil' },
      ];

      await expect(fileOps.applyMultiFileEdit(edits)).rejects.toThrow(
        'Path rejected by security check'
      );
    });

    it('pushes inverse edit to UndoStack on accept', async () => {
      const uri = vscode.Uri.file(`${WORKSPACE}/src/file.ts`);
      const originalContent = 'const x = 1;';
      const newContent = 'const x = 2;';

      // Mock file read
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValueOnce(
        Buffer.from(originalContent)
      );

      // Mock showInformationMessage to return 'Apply All'
      (vscode.window.showInformationMessage as jest.Mock).mockResolvedValueOnce('Apply All');

      // Mock openTextDocument
      (vscode.workspace.openTextDocument as jest.Mock) = jest.fn().mockResolvedValueOnce({
        getText: () => originalContent,
        positionAt: (offset: number) => ({ line: 0, character: offset }),
      });

      // Mock applyEdit to return true
      (vscode.workspace.applyEdit as jest.Mock).mockResolvedValueOnce(true);

      const pushSpy = jest.spyOn(undoStack, 'push');

      await fileOps.applyMultiFileEdit([{ uri, newContent, originalContent }]);

      expect(pushSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createDirectory', () => {
    it('rejects paths outside workspace', async () => {
      const uri = vscode.Uri.file('/etc/evil');

      await expect(fileOps.createDirectory(uri)).rejects.toThrow(
        'Path rejected by security check'
      );
    });

    it('creates directory within workspace', async () => {
      const uri = vscode.Uri.file(`${WORKSPACE}/src/newdir`);
      (vscode.workspace.fs.createDirectory as jest.Mock).mockResolvedValueOnce(undefined);
      (vscode.commands.executeCommand as jest.Mock).mockResolvedValueOnce(undefined);

      await fileOps.createDirectory(uri);

      expect(vscode.workspace.fs.createDirectory).toHaveBeenCalledWith(uri);
    });
  });
});
