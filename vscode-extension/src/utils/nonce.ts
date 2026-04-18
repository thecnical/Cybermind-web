import * as crypto from 'crypto';

/**
 * Generates a cryptographically random nonce for use in Content Security Policy headers.
 * Returns a 32-character hex string.
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}
