import * as path from 'path';
import { PathSanitizer } from './PathSanitizer';

const WORKSPACE = '/workspace/myproject';

describe('PathSanitizer', () => {
  let sanitizer: PathSanitizer;

  beforeEach(() => {
    sanitizer = new PathSanitizer(WORKSPACE);
  });

  describe('sanitize - path traversal rejection', () => {
    it('rejects ../../etc/passwd', () => {
      expect(sanitizer.sanitize('../../etc/passwd')).toBeNull();
    });

    it('rejects ../../../root/.ssh/id_rsa', () => {
      expect(sanitizer.sanitize('../../../root/.ssh/id_rsa')).toBeNull();
    });

    it('rejects absolute path outside workspace', () => {
      expect(sanitizer.sanitize('/etc/passwd')).toBeNull();
      expect(sanitizer.sanitize('/root/.ssh/id_rsa')).toBeNull();
    });

    it('rejects path that traverses out via nested dirs', () => {
      expect(sanitizer.sanitize('src/../../etc/shadow')).toBeNull();
    });

    it('accepts valid relative path within workspace', () => {
      const result = sanitizer.sanitize('src/index.ts');
      expect(result).not.toBeNull();
      expect(result).toBe(path.join(WORKSPACE, 'src/index.ts'));
    });

    it('accepts path at workspace root', () => {
      const result = sanitizer.sanitize('package.json');
      expect(result).not.toBeNull();
      expect(result).toBe(path.join(WORKSPACE, 'package.json'));
    });

    it('accepts nested path within workspace', () => {
      const result = sanitizer.sanitize('src/api/client.ts');
      expect(result).not.toBeNull();
      expect(result!.startsWith(WORKSPACE)).toBe(true);
    });

    it('rejects empty string', () => {
      expect(sanitizer.sanitize('')).toBeNull();
    });
  });

  describe('isSensitiveFile', () => {
    it('detects .env files', () => {
      expect(sanitizer.isSensitiveFile('.env')).toBe(true);
      expect(sanitizer.isSensitiveFile('.env.local')).toBe(true);
      expect(sanitizer.isSensitiveFile('.env.production')).toBe(true);
    });

    it('detects .pem files', () => {
      expect(sanitizer.isSensitiveFile('server.pem')).toBe(true);
      expect(sanitizer.isSensitiveFile('cert.pem')).toBe(true);
    });

    it('detects .key files', () => {
      expect(sanitizer.isSensitiveFile('private.key')).toBe(true);
      expect(sanitizer.isSensitiveFile('server.key')).toBe(true);
    });

    it('detects id_rsa files', () => {
      expect(sanitizer.isSensitiveFile('id_rsa')).toBe(true);
    });

    it('detects .pfx files', () => {
      expect(sanitizer.isSensitiveFile('cert.pfx')).toBe(true);
    });

    it('detects credentials files', () => {
      expect(sanitizer.isSensitiveFile('credentials.json')).toBe(true);
      expect(sanitizer.isSensitiveFile('credentials.yaml')).toBe(true);
    });

    it('does not flag normal source files', () => {
      expect(sanitizer.isSensitiveFile('index.ts')).toBe(false);
      expect(sanitizer.isSensitiveFile('package.json')).toBe(false);
      expect(sanitizer.isSensitiveFile('README.md')).toBe(false);
      expect(sanitizer.isSensitiveFile('styles.css')).toBe(false);
    });
  });
});
