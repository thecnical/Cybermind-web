/**
 * Property-Based Tests for SessionManager summarization
 * Validates: Requirements 14.6
 */
import * as fc from 'fast-check';
import { SessionManager, Message } from './SessionManager';

function makeMockMemento() {
  const store: Record<string, unknown> = {};
  return {
    get: jest.fn(<T>(key: string, defaultValue?: T): T => {
      return (store[key] as T) ?? (defaultValue as T);
    }),
    update: jest.fn(async (key: string, value: unknown) => {
      store[key] = value;
    }),
    keys: jest.fn(() => Object.keys(store)),
  };
}

function makeMessage(role: 'user' | 'assistant', content: string, index: number): Message {
  return {
    id: `msg-${index}`,
    role,
    content,
    timestamp: Date.now() + index,
  };
}

describe('SessionManager - Property Tests', () => {
  /**
   * Property 3: After summarization, session message count is always ≤ 51
   * (1 summary + up to 50 recent messages)
   * Validates: Requirements 14.6
   */
  it('Property 3: after summarization, message count is always ≤ 51', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate message counts between 101 and 200 (must exceed 100 to trigger summarization)
        fc.integer({ min: 101, max: 200 }),
        async (messageCount) => {
          const manager = new SessionManager(makeMockMemento() as any);
          manager.createSession('code', 'cybermindcli');

          // Add messages
          for (let i = 0; i < messageCount; i++) {
            const role = i % 2 === 0 ? 'user' : 'assistant';
            manager.addMessage(makeMessage(role, `Message ${i}`, i));
          }

          await manager.summarizeIfNeeded();

          const session = manager.getCurrentSession();
          expect(session).not.toBeNull();
          // After summarization: 1 summary + (messageCount - 50) remaining
          // But capped: total should be ≤ 51
          expect(session!.messages.length).toBeLessThanOrEqual(51);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 3b: summarization is idempotent — running twice gives same result', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 101, max: 150 }),
        async (messageCount) => {
          const manager = new SessionManager(makeMockMemento() as any);
          manager.createSession('code', 'cybermindcli');

          for (let i = 0; i < messageCount; i++) {
            const role = i % 2 === 0 ? 'user' : 'assistant';
            manager.addMessage(makeMessage(role, `Message ${i}`, i));
          }

          await manager.summarizeIfNeeded();
          const countAfterFirst = manager.getCurrentSession()!.messages.length;

          // Run again — should not change if already under limit
          await manager.summarizeIfNeeded();
          const countAfterSecond = manager.getCurrentSession()!.messages.length;

          // Second run should not increase message count
          expect(countAfterSecond).toBeLessThanOrEqual(countAfterFirst);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Property 3c: sessions with ≤ 100 messages are never summarized', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (messageCount) => {
          const manager = new SessionManager(makeMockMemento() as any);
          manager.createSession('code', 'cybermindcli');

          for (let i = 0; i < messageCount; i++) {
            const role = i % 2 === 0 ? 'user' : 'assistant';
            manager.addMessage(makeMessage(role, `Message ${i}`, i));
          }

          const countBefore = manager.getCurrentSession()!.messages.length;
          await manager.summarizeIfNeeded();
          const countAfter = manager.getCurrentSession()!.messages.length;

          // No summarization should occur
          return countAfter === countBefore;
        }
      ),
      { numRuns: 50 }
    );
  });
});
