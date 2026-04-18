import * as vscode from 'vscode';
import * as crypto from 'crypto';
import * as http from 'http';
import { AuthManager } from './AuthManager';
import { BackendClient } from './BackendClient';
import { logger } from '../utils/logger';

const SITE_URL = 'https://cybermindcli1.vercel.app';
const CALLBACK_PORT = 54321; // local port for OAuth callback

export class OAuthFlow {
  private server: http.Server | null = null;

  constructor(
    private readonly authManager: AuthManager,
    private readonly backendClient: BackendClient
  ) {}

  /**
   * Start OAuth web flow:
   * 1. Open browser to website login page with state param
   * 2. Start local HTTP server to receive callback
   * 3. Website redirects to vscode://cybermind/auth?token=...&plan=...
   * 4. VSCode handles the URI and we store the token
   */
  async startWebLogin(): Promise<{ token: string; plan: string; email: string } | null> {
    const state = crypto.randomBytes(16).toString('hex');

    // Build the login URL — website will redirect back to VSCode URI handler
    const loginUrl = `${SITE_URL}/auth/vscode?state=${state}`;

    // Open browser
    await vscode.env.openExternal(vscode.Uri.parse(loginUrl));

    // Wait for the URI callback (handled in extension.ts via registerUriHandler)
    // We use a promise that resolves when the URI handler fires
    return new Promise((resolve) => {
      const disposable = vscode.window.registerUriHandler({
        handleUri: async (uri: vscode.Uri) => {
          try {
            const params = new URLSearchParams(uri.query);
            const token = params.get('token');
            const plan = params.get('plan') || 'free';
            const email = params.get('email') || '';
            const returnedState = params.get('state');

            // Verify state to prevent CSRF
            if (returnedState !== state) {
              logger.warn('OAuth state mismatch — possible CSRF');
              vscode.window.showErrorMessage('CyberMind: Authentication failed (state mismatch). Please try again.');
              resolve(null);
              disposable.dispose();
              return;
            }

            if (!token) {
              vscode.window.showErrorMessage('CyberMind: No token received. Please try again.');
              resolve(null);
              disposable.dispose();
              return;
            }

            resolve({ token, plan, email });
            disposable.dispose();
          } catch (err) {
            logger.error('URI handler error', err);
            resolve(null);
            disposable.dispose();
          }
        }
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        disposable.dispose();
        resolve(null);
      }, 5 * 60 * 1000);
    });
  }

  dispose(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
