/**
 * PRDescriptionGenerator — Generates PR descriptions from git diff.
 * Gets git diff, commit messages, and sends to AI for a structured PR description.
 */
import * as cp from 'child_process';
import { BackendClient } from '../api/BackendClient';
import { AuthManager } from '../api/AuthManager';
import { logger } from '../utils/logger';

export class PRDescriptionGenerator {
  async generate(
    workspaceRoot: string,
    backendClient: BackendClient,
    authManager: AuthManager
  ): Promise<string> {
    try {
      // Get git diff stat
      const diffStat = await this.runGit(['diff', 'main...HEAD', '--stat'], workspaceRoot);
      // Get full diff (truncated)
      const fullDiff = await this.runGit(['diff', 'main...HEAD'], workspaceRoot);
      // Get commit messages
      const commits = await this.runGit(['log', 'main...HEAD', '--oneline'], workspaceRoot);

      if (!diffStat && !commits) {
        // Try origin/main
        const diffStatOrigin = await this.runGit(['diff', 'origin/main...HEAD', '--stat'], workspaceRoot);
        const fullDiffOrigin = await this.runGit(['diff', 'origin/main...HEAD'], workspaceRoot);
        const commitsOrigin = await this.runGit(['log', 'origin/main...HEAD', '--oneline'], workspaceRoot);

        if (!diffStatOrigin && !commitsOrigin) {
          return '❌ No changes found compared to main branch. Make sure you have commits ahead of main.';
        }

        return this.generateFromDiff(
          diffStatOrigin,
          fullDiffOrigin,
          commitsOrigin,
          backendClient,
          authManager
        );
      }

      return this.generateFromDiff(diffStat, fullDiff, commits, backendClient, authManager);
    } catch (err) {
      logger.error('[PRDescriptionGenerator] Generation failed', err);
      return `❌ PR description generation failed: ${String(err)}`;
    }
  }

  private async generateFromDiff(
    diffStat: string,
    fullDiff: string,
    commits: string,
    backendClient: BackendClient,
    authManager: AuthManager
  ): Promise<string> {
    // Truncate diff to avoid token limits
    const truncatedDiff = fullDiff.slice(0, 8000);
    const prompt = this.buildPrompt(diffStat, truncatedDiff, commits);

    let fullResponse = '';
    await backendClient.freeChat(
      {
        message: prompt,
        agent: 'git',
        context: '',
        system:
          'You are an expert software engineer who writes clear, comprehensive pull request descriptions. ' +
          'Generate PR descriptions that help reviewers understand the changes quickly. ' +
          'Format output as clean Markdown.',
      },
      (token) => { fullResponse += token; }
    );

    if (!fullResponse.trim()) {
      return '❌ PR description generation failed. Please try again.';
    }

    return fullResponse;
  }

  private buildPrompt(diffStat: string, fullDiff: string, commits: string): string {
    return `Generate a comprehensive pull request description based on the following git changes.

## Commit Messages
\`\`\`
${commits || '(no commits found)'}
\`\`\`

## Changed Files Summary
\`\`\`
${diffStat || '(no stat available)'}
\`\`\`

## Diff (truncated)
\`\`\`diff
${fullDiff || '(no diff available)'}
\`\`\`

## Required PR Description Format

Generate a complete PR description with these sections:

## Summary
Brief 2-3 sentence description of what this PR does and why.

## Changes
- List of specific changes made, grouped by area (e.g., Backend, Frontend, Tests)
- Be specific about what was added, modified, or removed

## Testing
- How to test these changes
- What test cases were added or should be verified
- Any manual testing steps

## Breaking Changes
- List any breaking changes (API changes, schema changes, config changes)
- If none, write "None"

## Screenshots
<!-- Add screenshots here if applicable -->
N/A

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented above)
- [ ] Code reviewed for security issues

Be specific to the actual changes in the diff. Do not use generic placeholder text.`;
  }

  private runGit(args: string[], cwd: string): Promise<string> {
    return new Promise((resolve) => {
      cp.execFile('git', args, { cwd, maxBuffer: 5 * 1024 * 1024, timeout: 15000 }, (err, stdout) => {
        if (err) {
          resolve('');
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}
