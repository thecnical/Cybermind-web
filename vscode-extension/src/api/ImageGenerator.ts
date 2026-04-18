import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { logger } from '../utils/logger';

/**
 * Free image generation via Pollinations.ai
 * No API key, no signup, completely free.
 * URL format: https://image.pollinations.ai/prompt/{prompt}?width=512&height=512&model=flux
 */
export class ImageGenerator {
  private readonly baseUrl = 'https://image.pollinations.ai/prompt';

  async generateImage(
    prompt: string,
    options: {
      width?: number;
      height?: number;
      model?: 'flux' | 'turbo' | 'flux-realism' | 'flux-anime' | 'flux-3d';
      seed?: number;
      outputPath?: string; // relative to workspace
    } = {}
  ): Promise<{ localPath: string; url: string } | null> {
    const {
      width = 1024,
      height = 1024,
      model = 'flux',
      seed = Math.floor(Math.random() * 999999),
    } = options;

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `${this.baseUrl}/${encodedPrompt}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`;

    logger.info(`[ImageGen] Generating: ${prompt.slice(0, 50)}...`);

    try {
      const imageBuffer = await this.downloadImage(url);

      // Save to workspace
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceRoot) throw new Error('No workspace open');

      const outputDir = path.join(workspaceRoot, options.outputPath ? path.dirname(options.outputPath) : 'public/images');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = options.outputPath
        ? path.basename(options.outputPath)
        : `generated-${seed}.png`;

      const localPath = path.join(outputDir, filename);
      fs.writeFileSync(localPath, imageBuffer);

      const relativePath = path.relative(workspaceRoot, localPath);
      logger.info(`[ImageGen] Saved to ${relativePath}`);

      return { localPath: relativePath, url };
    } catch (err) {
      logger.error('[ImageGen] Failed', err);
      return null;
    }
  }

  private downloadImage(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      const request = https.get(url, { timeout: 60000 }, (res) => {
        // Follow redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            this.downloadImage(redirectUrl).then(resolve).catch(reject);
            return;
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      });

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Image generation timeout (60s)'));
      });
    });
  }

  // Parse image generation requests from AI response
  // Format: <image:prompt|width=512|height=512|path=public/hero.png>
  parseImageRequests(response: string): Array<{
    prompt: string;
    width?: number;
    height?: number;
    path?: string;
    model?: 'flux' | 'turbo' | 'flux-realism' | 'flux-anime' | 'flux-3d';
  }> {
    const requests: ReturnType<typeof this.parseImageRequests> = [];
    const pattern = /<image:([^>]+)>/g;
    let match;

    while ((match = pattern.exec(response)) !== null) {
      const parts = match[1].split('|');
      const prompt = parts[0].trim();
      const opts: (typeof requests)[0] = { prompt };

      for (const part of parts.slice(1)) {
        const [key, value] = part.split('=');
        if (key === 'width') opts.width = parseInt(value);
        else if (key === 'height') opts.height = parseInt(value);
        else if (key === 'path') opts.path = value;
        else if (key === 'model') opts.model = value as typeof opts.model;
      }

      requests.push(opts);
    }

    return requests;
  }

  // Generate images from AI response and return updated response with local paths
  async processImageRequests(response: string): Promise<string> {
    const requests = this.parseImageRequests(response);
    if (requests.length === 0) return response;

    let updatedResponse = response;

    for (const req of requests) {
      const result = await this.generateImage(req.prompt, {
        width: req.width,
        height: req.height,
        model: req.model,
        outputPath: req.path,
      });

      if (result) {
        // Replace the image tag with the local path
        const tag = `<image:${req.prompt}${req.path ? `|path=${req.path}` : ''}>`;
        updatedResponse = updatedResponse.replace(
          new RegExp(`<image:${req.prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`),
          `![${req.prompt}](${result.localPath})`
        );
      }
    }

    return updatedResponse;
  }
}
