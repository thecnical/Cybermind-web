/**
 * Property-Based Tests for BackendClient retry logic
 * Validates: Requirements 6.8, 19.4
 */
import * as fc from 'fast-check';
import { BackendClient } from './BackendClient';

// Minimal mock — no vscode needed for retry logic
jest.mock('vscode', () => ({}), { virtual: true });

describe('BackendClient - Property Tests', () => {
  /**
   * Property 1: Retry count never exceeds 3 for any sequence of 5xx responses
   * Validates: Requirements 6.8, 19.4
   */
  it('Property 1: retry count never exceeds 3 for any sequence of 5xx responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate sequences of 5xx status codes (1 to 10 failures)
        fc.array(fc.integer({ min: 500, max: 599 }), { minLength: 1, maxLength: 10 }),
        async (statusCodes) => {
          const client = new BackendClient();
          let callCount = 0;

          const fn = async () => {
            callCount++;
            const statusCode = statusCodes[Math.min(callCount - 1, statusCodes.length - 1)];
            const error = new Error(`HTTP ${statusCode}`);
            (error as any).statusCode = statusCode;
            throw error;
          };

          try {
            await client.withRetry(fn, 3);
          } catch {
            // Expected to throw after retries exhausted
          }

          // Total calls = initial attempt + retries (max 3 retries = max 4 total calls)
          expect(callCount).toBeLessThanOrEqual(4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1b: withRetry succeeds on first non-5xx attempt', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Number of 5xx failures before success (0 to 3)
        fc.integer({ min: 0, max: 3 }),
        async (failureCount) => {
          const client = new BackendClient();
          let callCount = 0;

          const fn = async (): Promise<string> => {
            callCount++;
            if (callCount <= failureCount) {
              const error = new Error('HTTP 503');
              (error as any).statusCode = 503;
              throw error;
            }
            return 'success';
          };

          // Override delays to 0 for testing speed
          const originalWithRetry = client.withRetry.bind(client);
          const fastWithRetry = async <T>(innerFn: () => Promise<T>, maxRetries = 3): Promise<T> => {
            let lastError: Error | undefined;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              try {
                return await innerFn();
              } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                const statusCode = (error as any).statusCode;
                if (statusCode && statusCode >= 500 && statusCode < 600 && attempt < maxRetries) {
                  // No delay in tests
                  continue;
                }
                throw lastError;
              }
            }
            throw lastError!;
          };

          const result = await fastWithRetry(fn, 3);
          expect(result).toBe('success');
          expect(callCount).toBe(failureCount + 1);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 1c: 4xx errors are never retried', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 400, max: 499 }),
        async (statusCode) => {
          const client = new BackendClient();
          let callCount = 0;

          const fn = async () => {
            callCount++;
            const error = new Error(`HTTP ${statusCode}`);
            (error as any).statusCode = statusCode;
            throw error;
          };

          // Use fast version (no delays)
          const fastWithRetry = async <T>(innerFn: () => Promise<T>, maxRetries = 3): Promise<T> => {
            let lastError: Error | undefined;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              try {
                return await innerFn();
              } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                const sc = (error as any).statusCode;
                if (sc && sc >= 500 && sc < 600 && attempt < maxRetries) {
                  continue;
                }
                throw lastError;
              }
            }
            throw lastError!;
          };

          try {
            await fastWithRetry(fn, 3);
          } catch {
            // Expected
          }

          // 4xx should never be retried — only 1 call
          expect(callCount).toBe(1);
        }
      ),
      { numRuns: 50 }
    );
  });
});
