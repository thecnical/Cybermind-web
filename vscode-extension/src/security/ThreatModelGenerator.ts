/**
 * ThreatModelGenerator — Generates STRIDE threat model from codebase.
 * Scans routes, auth middleware, DB models, external API calls, file operations.
 * Sends to AI with STRIDE analysis prompt and outputs THREAT_MODEL.md.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BackendClient } from '../api/BackendClient';
import { logger } from '../utils/logger';

export class ThreatModelGenerator {
  async generate(workspaceRoot: string, backendClient: BackendClient): Promise<string> {
    try {
      const context = await this.buildArchitectureContext(workspaceRoot);
      const prompt = this.buildStridePrompt(context);

      let fullResponse = '';
      await backendClient.freeChat(
        {
          message: prompt,
          agent: 'security',
          context: '',
          system:
            'You are a senior application security architect specializing in threat modeling. ' +
            'Generate comprehensive STRIDE threat models with actionable mitigations. ' +
            'Format output as clean Markdown suitable for a THREAT_MODEL.md file.',
        },
        (token) => { fullResponse += token; }
      );

      if (!fullResponse.trim()) {
        return '❌ Threat model generation failed. Please try again.';
      }

      // Write THREAT_MODEL.md to workspace root
      const outputPath = path.join(workspaceRoot, 'THREAT_MODEL.md');
      try {
        fs.writeFileSync(outputPath, fullResponse, 'utf8');
        // Open the file in editor
        const uri = vscode.Uri.file(outputPath);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch (writeErr) {
        logger.warn(`[ThreatModelGenerator] Could not write THREAT_MODEL.md: ${String(writeErr)}`);
      }

      return fullResponse;
    } catch (err) {
      logger.error('[ThreatModelGenerator] Generation failed', err);
      return `❌ Threat model generation failed: ${String(err)}`;
    }
  }

  private async buildArchitectureContext(workspaceRoot: string): Promise<string> {
    const context: string[] = [];

    // Scan for routes
    const routeFiles = await this.findFiles(workspaceRoot, [
      'routes', 'api', 'controllers', 'handlers', 'endpoints',
    ], ['.ts', '.js', '.py', '.go']);

    if (routeFiles.length > 0) {
      context.push('## API Routes / Endpoints');
      for (const file of routeFiles.slice(0, 10)) {
        const content = this.readFileSafe(file);
        if (content) {
          const routes = this.extractRoutes(content);
          if (routes.length > 0) {
            context.push(`### ${path.relative(workspaceRoot, file)}`);
            context.push(routes.slice(0, 20).join('\n'));
          }
        }
      }
    }

    // Scan for auth middleware
    const authFiles = await this.findFiles(workspaceRoot, [
      'auth', 'middleware', 'guard', 'jwt', 'session',
    ], ['.ts', '.js', '.py', '.go']);

    if (authFiles.length > 0) {
      context.push('\n## Authentication / Authorization');
      for (const file of authFiles.slice(0, 5)) {
        const content = this.readFileSafe(file);
        if (content) {
          context.push(`- ${path.relative(workspaceRoot, file)}: ${content.slice(0, 300)}`);
        }
      }
    }

    // Scan for DB models
    const modelFiles = await this.findFiles(workspaceRoot, [
      'models', 'schema', 'entities', 'prisma', 'migrations',
    ], ['.ts', '.js', '.py', '.go', '.prisma', '.sql']);

    if (modelFiles.length > 0) {
      context.push('\n## Data Models / Database');
      for (const file of modelFiles.slice(0, 5)) {
        const content = this.readFileSafe(file);
        if (content) {
          context.push(`- ${path.relative(workspaceRoot, file)}: ${content.slice(0, 400)}`);
        }
      }
    }

    // Scan for external API calls
    const externalApiPattern = /(?:fetch|axios|request|got|http\.get|https\.get)\s*\(\s*['"`]https?:\/\//gi;
    const allTsJsFiles = await this.findFiles(workspaceRoot, [], ['.ts', '.js']);
    const externalApis: string[] = [];
    for (const file of allTsJsFiles.slice(0, 30)) {
      const content = this.readFileSafe(file);
      if (!content) continue;
      const matches = content.match(externalApiPattern);
      if (matches) {
        externalApis.push(...matches.slice(0, 3).map(m => `${path.relative(workspaceRoot, file)}: ${m}`));
      }
    }
    if (externalApis.length > 0) {
      context.push('\n## External API Calls');
      context.push(externalApis.slice(0, 10).join('\n'));
    }

    // Scan for file operations
    const fileOpPattern = /(?:readFile|writeFile|createReadStream|createWriteStream|unlink|mkdir)/gi;
    const fileOps: string[] = [];
    for (const file of allTsJsFiles.slice(0, 20)) {
      const content = this.readFileSafe(file);
      if (!content) continue;
      if (fileOpPattern.test(content)) {
        fileOps.push(path.relative(workspaceRoot, file));
      }
    }
    if (fileOps.length > 0) {
      context.push('\n## File System Operations');
      context.push(fileOps.slice(0, 10).join('\n'));
    }

    // Check for package.json to understand tech stack
    const pkgPath = path.join(workspaceRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
          name?: string;
          dependencies?: Record<string, string>;
        };
        const deps = Object.keys(pkg.dependencies ?? {}).slice(0, 20);
        context.push(`\n## Tech Stack (${pkg.name ?? 'unknown'})`);
        context.push(`Dependencies: ${deps.join(', ')}`);
      } catch { /* ignore */ }
    }

    return context.join('\n') || 'No architecture context could be extracted from the workspace.';
  }

  private buildStridePrompt(architectureContext: string): string {
    return `You are a senior application security architect. Analyze the following codebase architecture and generate a comprehensive STRIDE threat model.

## Codebase Architecture

${architectureContext}

## Required Output Format

Generate a complete THREAT_MODEL.md with the following sections:

# Threat Model

## Executive Summary
Brief overview of the application, its purpose, and the overall security posture. Identify the top 3 most critical risks.

## Data Flow Diagram (Text)
ASCII/text representation of data flows between components, users, and external systems. Show trust boundaries.

## Trust Boundaries
List all trust boundaries identified in the codebase (e.g., Internet → API Gateway, API → Database, etc.)

## STRIDE Analysis

| Threat | Component | Description | Risk Level | Likelihood | Impact |
|--------|-----------|-------------|------------|------------|--------|
[Fill in all STRIDE threats: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege]

## Top 10 Mitigations (Prioritized by Risk)

For each mitigation:
1. **[Mitigation Name]** — [Description] — Risk: [HIGH/MEDIUM/LOW] — Effort: [LOW/MEDIUM/HIGH]

## Attack Scenarios
Describe 3-5 realistic attack scenarios with step-by-step exploitation paths and defenses.

## Compliance Considerations
Note any relevant compliance requirements (OWASP Top 10, PCI-DSS, GDPR, SOC2) based on the tech stack.

Be specific to the actual code patterns found. Do not generate generic advice.`;
  }

  private extractRoutes(content: string): string[] {
    const routes: string[] = [];
    const patterns = [
      /(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
      /export\s+(?:default\s+)?(?:async\s+)?function\s+handler/gi,
      /@(?:Get|Post|Put|Delete|Patch)\s*\(\s*['"`]([^'"`]*)['"`]\)/gi,
    ];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(content)) !== null) {
        routes.push(match[0].slice(0, 100));
        if (routes.length >= 20) break;
      }
    }

    return routes;
  }

  private async findFiles(
    workspaceRoot: string,
    nameHints: string[],
    extensions: string[]
  ): Promise<string[]> {
    try {
      const extPattern = extensions.map(e => e.slice(1)).join(',');
      const uris = await vscode.workspace.findFiles(
        `**/*.{${extPattern}}`,
        `**/{node_modules,.git,dist,build,.next,vendor}/**`,
        100
      );

      let files = uris.map(u => u.fsPath);

      if (nameHints.length > 0) {
        files = files.filter(f => {
          const lower = f.toLowerCase();
          return nameHints.some(hint => lower.includes(hint));
        });
      }

      return files;
    } catch {
      return [];
    }
  }

  private readFileSafe(filePath: string): string | null {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.slice(0, 5000);
    } catch {
      return null;
    }
  }
}
