import * as path from 'path';

const SENSITIVE_PATTERNS = [
  /\.env$/i,
  /\.env\..+$/i,
  /\.pem$/i,
  /\.key$/i,
  /^id_rsa$/i,
  /id_rsa\.pub$/i,
  /\.pfx$/i,
  /credentials\..+$/i,
  /credentials$/i,
  /\.p12$/i,
  /\.pkcs12$/i,
  /\.jks$/i,
  /secret[s]?\..+$/i,
  /private[_-]?key/i,
];

export class PathSanitizer {
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string) {
    // Normalize the workspace root to remove trailing slashes
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  /**
   * Sanitizes an AI-provided path, ensuring it stays within the workspace root.
   * Returns null if the path is outside the workspace or otherwise invalid.
   */
  sanitize(aiProvidedPath: string): string | null {
    if (!aiProvidedPath || typeof aiProvidedPath !== 'string') {
      return null;
    }

    try {
      // Resolve the path relative to workspace root
      let resolved: string;
      if (path.isAbsolute(aiProvidedPath)) {
        resolved = path.resolve(aiProvidedPath);
      } else {
        resolved = path.resolve(this.workspaceRoot, aiProvidedPath);
      }

      // Normalize to remove any .. sequences
      resolved = path.normalize(resolved);

      // Check if the resolved path is within the workspace root
      if (!this.isWithinWorkspace(resolved)) {
        return null;
      }

      return resolved;
    } catch {
      return null;
    }
  }

  /**
   * Checks if a file path matches sensitive file patterns.
   */
  isSensitiveFile(filePath: string): boolean {
    const basename = path.basename(filePath);
    const normalizedPath = filePath.replace(/\\/g, '/');

    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(basename) || pattern.test(normalizedPath)) {
        return true;
      }
    }

    return false;
  }

  private isWithinWorkspace(resolvedPath: string): boolean {
    // Ensure the resolved path starts with the workspace root
    // Add path separator to prevent partial directory name matches
    const workspaceWithSep = this.workspaceRoot.endsWith(path.sep)
      ? this.workspaceRoot
      : this.workspaceRoot + path.sep;

    return resolvedPath === this.workspaceRoot ||
      resolvedPath.startsWith(workspaceWithSep);
  }
}
