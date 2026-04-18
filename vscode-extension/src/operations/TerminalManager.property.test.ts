/**
 * Property-Based Tests for TerminalManager command classification
 * Validates: Requirements 8.2
 */
import * as fc from 'fast-check';
import { TerminalManager } from './TerminalManager';

describe('TerminalManager - Property Tests', () => {
  /**
   * Property 5: Any command containing a dangerous pattern substring is always classified as dangerous
   * Validates: Requirements 8.2
   */
  it('Property 5: commands containing dangerous patterns are always classified as dangerous', () => {
    const manager = new TerminalManager();

    const dangerousSubstrings = [
      'rm -rf',
      'del /f',
      'DROP TABLE',
      'DROP DATABASE',
      'mkfs',
      'dd if=',
      ':(){:|:&};:',
      'shutdown',
      'reboot',
      'curl | bash',
    ];

    fc.assert(
      fc.property(
        // Pick a dangerous substring
        fc.oneof(...dangerousSubstrings.map(s => fc.constant(s))),
        // Generate random prefix and suffix
        fc.string({ maxLength: 20 }),
        fc.string({ maxLength: 20 }),
        (dangerousSubstring, prefix, suffix) => {
          const command = `${prefix}${dangerousSubstring}${suffix}`;
          const classification = manager.classifyCommand(command);
          return classification === 'dangerous';
        }
      ),
      { numRuns: 500 }
    );
  });

  it('Property 5b: safe commands are never classified as dangerous', () => {
    const manager = new TerminalManager();

    const safeCommands = [
      'npm install',
      'npm run build',
      'npm test',
      'git status',
      'git add .',
      'git commit -m "fix"',
      'ls -la',
      'pwd',
      'echo hello',
      'cat file.txt',
      'mkdir newdir',
      'cp file1 file2',
      'mv file1 file2',
      'yarn install',
      'pip install requests',
      'go build ./...',
    ];

    fc.assert(
      fc.property(
        fc.oneof(...safeCommands.map(s => fc.constant(s))),
        (command) => {
          return manager.classifyCommand(command) === 'safe';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5c: classification is deterministic for same input', () => {
    const manager = new TerminalManager();

    fc.assert(
      fc.property(
        fc.string({ maxLength: 100 }),
        (command) => {
          const result1 = manager.classifyCommand(command);
          const result2 = manager.classifyCommand(command);
          return result1 === result2;
        }
      ),
      { numRuns: 200 }
    );
  });
});
