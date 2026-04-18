import * as vscode from 'vscode';
import { InlineCompletionProvider } from './InlineCompletionProvider';
import { BackendClient } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';

function makeDocument(text: string, languageId = 'typescript') {
  return {
    getText: () => text,
    languageId,
    offsetAt: (pos: { line: number; character: number }) => {
      const lines = text.split('\n');
      let offset = 0;
      for (let i = 0; i < pos.line; i++) {
        offset += lines[i].length + 1;
      }
      return offset + pos.character;
    },
    positionAt: (offset: number) => {
      const lines = text.split('\n');
      let remaining = offset;
      for (let i = 0; i < lines.length; i++) {
        if (remaining <= lines[i].length) {
          return { line: i, character: remaining };
        }
        remaining -= lines[i].length + 1;
      }
      return { line: lines.length - 1, character: 0 };
    },
  };
}

function makePosition(line: number, character: number) {
  return { line, character };
}

function makeCancellationToken(cancelled = false) {
  return {
    isCancellationRequested: cancelled,
    onCancellationRequested: jest.fn(() => ({ dispose: jest.fn() })),
  };
}

describe('InlineCompletionProvider', () => {
  let provider: InlineCompletionProvider;
  let mockBackendClient: jest.Mocked<BackendClient>;
  let mockAuthManager: jest.Mocked<AuthManager>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockBackendClient = {
      freeChat: jest.fn().mockResolvedValue(''),
      chat: jest.fn(),
      login: jest.fn(),
      validateApiKey: jest.fn(),
      cancelCurrentRequest: jest.fn(),
      withRetry: jest.fn(),
    } as any;

    mockAuthManager = {
      getToken: jest.fn().mockResolvedValue(null),
      getApiKey: jest.fn().mockResolvedValue(null),
      isAuthenticated: jest.fn().mockResolvedValue(false),
    } as any;

    provider = new InlineCompletionProvider(mockBackendClient, mockAuthManager);
  });

  afterEach(() => {
    jest.useRealTimers();
    provider.dispose();
  });

  describe('debounce', () => {
    it('cancels previous timer on rapid keystrokes', async () => {
      const doc = makeDocument('const x = ');
      const pos = makePosition(0, 10);
      const token = makeCancellationToken();

      const context = { triggerKind: vscode.InlineCompletionTriggerKind?.Automatic ?? 0 };

      // Start first completion
      const promise1 = provider.provideInlineCompletionItems(doc as any, pos as any, context as any, token as any);

      // Immediately start second completion (should cancel first timer)
      const promise2 = provider.provideInlineCompletionItems(doc as any, pos as any, context as any, token as any);

      // Advance timer
      jest.advanceTimersByTime(700);

      await Promise.all([promise1, promise2]);

      // Backend should only be called once (second request)
      // (first was cancelled by debounce)
      expect(mockBackendClient.freeChat).toHaveBeenCalledTimes(1);
    });
  });

  describe('enabled setting', () => {
    it('returns null when cybermind.inlineCompletions.enabled is false', async () => {
      const mockConfig = {
        get: jest.fn((key: string, defaultValue?: unknown) => {
          if (key === 'inlineCompletions.enabled') return false;
          return defaultValue;
        }),
      };
      (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue(mockConfig);

      const doc = makeDocument('const x = ');
      const pos = makePosition(0, 10);
      const token = makeCancellationToken();
      const context = { triggerKind: 1 }; // Explicit

      const result = await provider.provideInlineCompletionItems(
        doc as any, pos as any, context as any, token as any
      );

      expect(result).toBeNull();
      expect(mockBackendClient.freeChat).not.toHaveBeenCalled();
    });

    it('proceeds when cybermind.inlineCompletions.enabled is true', async () => {
      const mockConfig = {
        get: jest.fn((key: string, defaultValue?: unknown) => {
          if (key === 'inlineCompletions.enabled') return true;
          return defaultValue;
        }),
      };
      (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue(mockConfig);

      mockBackendClient.freeChat.mockResolvedValueOnce('1;');

      const doc = makeDocument('const x = ');
      const pos = makePosition(0, 10);
      const token = makeCancellationToken();
      const context = { triggerKind: 1 }; // Explicit

      await provider.provideInlineCompletionItems(
        doc as any, pos as any, context as any, token as any
      );

      expect(mockBackendClient.freeChat).toHaveBeenCalled();
    });
  });

  describe('getPrefix and getSuffix', () => {
    it('getPrefix returns up to 2000 chars before cursor', () => {
      const longText = 'a'.repeat(3000);
      const doc = makeDocument(longText);
      const pos = makePosition(0, 3000);

      const prefix = provider.getPrefix(doc as any, pos as any);
      expect(prefix.length).toBeLessThanOrEqual(2000);
    });

    it('getSuffix returns up to 500 chars after cursor', () => {
      const longText = 'a'.repeat(1000);
      const doc = makeDocument(longText);
      const pos = makePosition(0, 0);

      const suffix = provider.getSuffix(doc as any, pos as any);
      expect(suffix.length).toBeLessThanOrEqual(500);
    });
  });
});
