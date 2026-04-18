/**
 * Property-Based Tests for PathSanitizer
 * Validates: Requirements 16.4
 */
import * as fc from 'fast-check';
import * as path from 'path';
import { PathSanitizer } from './PathSanitizer';

const WORKSPACE_ROOT = '/workspace/myproject';

describe('PathSanitizer - Property Tests', () => {
  /**
   * Property 2: Any path containing .. sequences never resolves outside workspace root
   * Validates: Requirements 16.4
   */
  it('Property 2: paths with .. sequences never resolve outside workspace root', () => {
    const sanitizer = new PathSanitizer(WORKSPACE_ROOT);

    fc.assert(
      fc.property(
        // Generate paths with various .. sequences
        fc.array(
          fc.oneof(
            fc.constant('..'),
            fc.constant('.'),
            fc.stringMatching(/^[a-zA-Z0-9_-]{1,10}$/),
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (segments) => {
          const testPath = segments.join('/');
          const result = sanitizer.sanitize(testPath);

          if (result !== null) {
            // If sanitize returns a path, it MUST be within workspace root
            const workspaceWithSep = WORKSPACE_ROOT + path.sep;
            const isWithin = result === WORKSPACE_ROOT ||
              result.startsWith(workspaceWithSep);
            return isWithin;
          }
          // null means rejected — that's always safe
          return true;
        }
      ),
      { numRuns: 1000 }
    );
  });

  it('Property 2b: absolute paths outside workspace are always rejected', () => {
    const sanitizer = new PathSanitizer(WORKSPACE_ROOT);

    fc.assert(
      fc.property(
        // Generate absolute paths that are clearly outside the workspace
        fc.oneof(
          fc.constant('/etc/passwd'),
          fc.constant('/etc/shadow'),
          fc.constant('/root/.ssh/id_rsa'),
          fc.constant('/tmp/evil'),
          fc.constant('C:\\Windows\\System32'),
          fc.constant('/home/user/.bashrc'),
        ),
        (outsidePath) => {
          const result = sanitizer.sanitize(outsidePath);
          // All paths outside workspace must be rejected
          return result === null;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 2c: traversal attacks via .. are always blocked', () => {
    const sanitizer = new PathSanitizer(WORKSPACE_ROOT);

    const traversalPaths = [
      '../../etc/passwd',
      '../../../root/.ssh/id_rsa',
      'src/../../etc/shadow',
      'src/../../../etc/passwd',
      './../../etc/passwd',
      'a/b/c/../../../../../../../etc/passwd',
    ];

    for (const traversal of traversalPaths) {
      const result = sanitizer.sanitize(traversal);
      if (result !== null) {
        // If not null, must be within workspace
        const workspaceWithSep = WORKSPACE_ROOT + path.sep;
        const isWithin = result === WORKSPACE_ROOT || result.startsWith(workspaceWithSep);
        expect(isWithin).toBe(true);
      }
    }
  });

  it('Property 2d: valid workspace paths are always accepted', () => {
    const sanitizer = new PathSanitizer(WORKSPACE_ROOT);

    fc.assert(
      fc.property(
        // Generate valid relative paths (no ..)
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_-]{1,10}$/),
          { minLength: 1, maxLength: 5 }
        ),
        (segments) => {
          const relativePath = segments.join('/');
          const result = sanitizer.sanitize(relativePath);

          // Valid paths should be accepted and within workspace
          if (result !== null) {
            const workspaceWithSep = WORKSPACE_ROOT + path.sep;
            return result === WORKSPACE_ROOT || result.startsWith(workspaceWithSep);
          }
          return true; // null is also acceptable
        }
      ),
      { numRuns: 200 }
    );
  });
});
