/**
 * Property-Based Tests for RepoIndexer exclusion
 * Validates: Requirements 9.2
 */
import * as fc from 'fast-check';
import { RepoIndexer } from './RepoIndexer';

describe('RepoIndexer - Property Tests', () => {
  /**
   * Property 4: No file matching excluded patterns ever appears in the index
   * Validates: Requirements 9.2
   */
  it('Property 4: files matching excluded patterns are always excluded', () => {
    const indexer = new RepoIndexer();

    // Excluded directory patterns
    const excludedDirPatterns = [
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

    fc.assert(
      fc.property(
        // Generate paths that contain excluded directory patterns
        fc.oneof(
          ...excludedDirPatterns.map(dir =>
            fc.tuple(
              fc.stringMatching(/^[a-zA-Z0-9_-]{1,10}$/),
              fc.constant(dir),
              fc.stringMatching(/^[a-zA-Z0-9_.-]{1,20}$/)
            ).map(([prefix, excluded, file]) => `/workspace/${prefix}/${excluded}/${file}`)
          )
        ),
        (filePath) => {
          return indexer.shouldExclude(filePath) === true;
        }
      ),
      { numRuns: 500 }
    );
  });

  it('Property 4b: files with excluded extensions are always excluded', () => {
    const indexer = new RepoIndexer();

    const excludedExtensions = ['.lock', '.min.js', '.map', '.png', '.jpg', '.gif', '.ico'];

    fc.assert(
      fc.property(
        fc.oneof(
          ...excludedExtensions.map(ext =>
            fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/).map(name => `/workspace/src/${name}${ext}`)
          )
        ),
        (filePath) => {
          return indexer.shouldExclude(filePath) === true;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('Property 4c: normal source files are never excluded', () => {
    const indexer = new RepoIndexer();

    const safeExtensions = ['.ts', '.js', '.py', '.go', '.rs', '.java', '.cs', '.cpp', '.c', '.h'];

    fc.assert(
      fc.property(
        fc.tuple(
          fc.stringMatching(/^[a-zA-Z0-9_-]{1,10}$/),
          fc.oneof(...safeExtensions.map(ext => fc.constant(ext)))
        ),
        ([name, ext]) => {
          const filePath = `/workspace/src/${name}${ext}`;
          // Normal source files in non-excluded dirs should NOT be excluded
          return indexer.shouldExclude(filePath) === false;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('Property 4d: lock files are always excluded regardless of name', () => {
    const indexer = new RepoIndexer();

    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/).map(name => `/workspace/${name}.lock`),
        (filePath) => {
          return indexer.shouldExclude(filePath) === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
