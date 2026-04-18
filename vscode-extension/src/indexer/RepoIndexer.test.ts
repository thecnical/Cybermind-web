import { RepoIndexer } from './RepoIndexer';

describe('RepoIndexer', () => {
  describe('shouldExclude', () => {
    let indexer: RepoIndexer;

    beforeEach(() => {
      indexer = new RepoIndexer();
    });

    it('excludes node_modules paths', () => {
      expect(indexer.shouldExclude('/workspace/node_modules/lodash/index.js')).toBe(true);
      expect(indexer.shouldExclude('/workspace/src/node_modules/pkg/file.js')).toBe(true);
    });

    it('excludes .git paths', () => {
      expect(indexer.shouldExclude('/workspace/.git/config')).toBe(true);
      expect(indexer.shouldExclude('/workspace/.git/objects/abc123')).toBe(true);
    });

    it('excludes dist paths', () => {
      expect(indexer.shouldExclude('/workspace/dist/bundle.js')).toBe(true);
    });

    it('excludes build paths', () => {
      expect(indexer.shouldExclude('/workspace/build/output.js')).toBe(true);
    });

    it('excludes .lock files', () => {
      expect(indexer.shouldExclude('/workspace/package-lock.json')).toBe(true);
      expect(indexer.shouldExclude('/workspace/yarn.lock')).toBe(true);
      expect(indexer.shouldExclude('/workspace/Cargo.lock')).toBe(true);
    });

    it('excludes .min.js files', () => {
      expect(indexer.shouldExclude('/workspace/public/app.min.js')).toBe(true);
    });

    it('excludes .map files', () => {
      expect(indexer.shouldExclude('/workspace/dist/app.js.map')).toBe(true);
    });

    it('does not exclude normal source files', () => {
      expect(indexer.shouldExclude('/workspace/src/index.ts')).toBe(false);
      expect(indexer.shouldExclude('/workspace/src/api/client.ts')).toBe(false);
      expect(indexer.shouldExclude('/workspace/README.md')).toBe(false);
      expect(indexer.shouldExclude('/workspace/package.json')).toBe(false);
    });
  });

  describe('searchFiles', () => {
    it('returns empty array when index is empty', () => {
      const indexer = new RepoIndexer();
      expect(indexer.searchFiles('test')).toHaveLength(0);
    });

    it('returns up to 20 results for empty query', () => {
      const indexer = new RepoIndexer();
      // Access private index for testing
      const privateIndexer = indexer as any;
      for (let i = 0; i < 30; i++) {
        privateIndexer.index.set(`/workspace/file${i}.ts`, {
          path: `/workspace/file${i}.ts`,
          relativePath: `file${i}.ts`,
          summary: `content ${i}`,
          lastModified: Date.now(),
        });
      }

      const results = indexer.searchFiles('');
      expect(results.length).toBeLessThanOrEqual(20);
    });
  });

  describe('getStatus', () => {
    it('returns initial status with 0 files', () => {
      const indexer = new RepoIndexer();
      const status = indexer.getStatus();
      expect(status.fileCount).toBe(0);
      expect(status.lastIndexed).toBeNull();
      expect(status.isIndexing).toBe(false);
    });
  });
});
