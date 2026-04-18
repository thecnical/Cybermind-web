import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export type ModelTier = 'free' | 'pro' | 'elite';

export interface ChatRequest {
  message: string;
  agent: string;
  context: string;
}

export interface ChatResponse {
  response: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  plan?: string;
  email?: string;
}

export interface UserInfo {
  email: string;
  plan: string;
  credits_used_today: number;
  credits_limit: number;
}

export class BackendClient {
  public readonly baseUrl = 'https://cybermind-backend-8yrt.onrender.com';
  private abortController: AbortController | null = null;

  async chat(
    request: ChatRequest,
    model: string,
    apiKey: string | null,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    const isFree = model === 'cybermindcli' || (!apiKey);

    if (isFree) {
      return this.freeChat(request, onToken, cancellationToken);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    if (model.startsWith('elite')) {
      headers['X-User-Plan'] = 'elite';
    } else if (model.startsWith('pro')) {
      headers['X-User-Plan'] = 'pro';
    }

    return this.withRetry(async () => {
      return this._doRequest('/chat', headers, request, onToken, cancellationToken);
    });
  }

  async freeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    return this.withRetry(async () => {
      return this._doRequest('/free/chat', headers, request, onToken, cancellationToken);
    });
  }

  private async _doRequest(
    path: string,
    headers: Record<string, string>,
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    let cancelDisposable: vscode.Disposable | undefined;
    if (cancellationToken) {
      cancelDisposable = cancellationToken.onCancellationRequested(() => {
        this.abortController?.abort();
      });
    }

    try {
      const url = `${this.baseUrl}${path}`;
      logger.info(`POST ${path}`);

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
          signal,
        });
      } catch (fetchErr) {
        const networkError = new Error('Unable to reach CyberMind backend. Check your connection.');
        (networkError as any).isNetworkError = true;
        throw networkError;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        const error = new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
        (error as any).statusCode = response.status;

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          (error as any).retryAfter = retryAfter ? parseInt(retryAfter, 10) : 60;
        }

        throw error;
      }

      const contentType = response.headers.get('content-type') || '';
      let fullResponse = '';

      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const token = parsed.response || parsed.text || parsed.content || '';
                  if (token) { onToken(token); fullResponse += token; }
                } catch {
                  if (data) { onToken(data); fullResponse += data; }
                }
              }
            }
          }
        }
      } else {
        const json = await response.json() as ChatResponse;
        fullResponse = json.response || '';
        if (fullResponse) onToken(fullResponse);
      }

      return fullResponse;
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    logger.info('POST /auth/login');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Login failed: ${errorBody || response.statusText}`);
    }

    return response.json() as Promise<LoginResponse>;
  }

  async validateApiKey(apiKey: string): Promise<{ valid: boolean; plan?: string; email?: string }> {
    try {
      const url = `${this.baseUrl}/auth/validate`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'X-API-Key': apiKey },
      });
      if (!response.ok) return { valid: false };
      const data = await response.json().catch(() => ({})) as { plan?: string; email?: string };
      return { valid: true, plan: data.plan, email: data.email };
    } catch {
      return { valid: false };
    }
  }

  async getUserInfo(apiKey: string): Promise<UserInfo | null> {
    try {
      const url = `${this.baseUrl}/user/info`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'X-API-Key': apiKey },
      });
      if (!response.ok) return null;
      return response.json() as Promise<UserInfo>;
    } catch {
      return null;
    }
  }

  cancelCurrentRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | undefined;
    const delays = [1000, 2000, 4000];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const statusCode = (error as any).statusCode;

        if (statusCode && statusCode >= 500 && statusCode < 600 && attempt < maxRetries) {
          const delay = delays[attempt] ?? 4000;
          logger.warn(`Request failed with ${statusCode}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }
}
