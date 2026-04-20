import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export type ModelTier = 'free' | 'pro' | 'elite';

export interface ChatRequest {
  message: string;
  agent: string;
  context: string;
  system?: string;
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

// OpenRouter free models — tried in order, first working one wins
// These are :free models — they work WITHOUT an API key but are rate-limited
// With a free OpenRouter key (sk-or-...) they work much better
const OPENROUTER_FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'qwen/qwen3-coder:free',
];

function resolveModel(modelId: string): { provider: string; model: string } {
  if (modelId.startsWith('or-')) {
    const map: Record<string, string> = {
      'or-minimax-m2.5':    'minimax/minimax-m2.5:free',
      'or-qwen3-coder':     'qwen/qwen3-coder:free',
      'or-gemma-4-31b':     'google/gemma-4-31b-it:free',
      'or-dolphin':         'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
      'or-hermes-405b':     'nousresearch/hermes-3-llama-3.1-405b:free',
      'or-gpt-oss-120b':    'openai/gpt-oss-120b:free',
      'or-llama-3.3-70b':   'meta-llama/llama-3.3-70b-instruct:free',
      'or-nemotron-super':  'nvidia/nemotron-3-super-120b-a12b:free',
      'or-deepseek-chat':   'deepseek/deepseek-chat',
      'or-qwen3-235b':      'qwen/qwen3-235b-a22b-instruct',
      'or-claude-3.7':      'anthropic/claude-3-7-sonnet',
    };
    return { provider: 'openrouter', model: map[modelId] || 'openrouter/free' };
  }
  if (modelId.startsWith('nv-')) {
    const map: Record<string, string> = {
      'nv-minimax-m2.7':       'minimaxai/minimax-m2.7',
      'nv-kimi-k2-thinking':   'moonshotai/kimi-k2-thinking',
      'nv-kimi-k2-instruct':   'moonshotai/kimi-k2-instruct',
      'nv-glm-4.7':            'z-ai/glm4_7',
      'nv-gemma-2-27b':        'google/gemma-2-27b-it',
      'nv-phi-3.5-mini':       'microsoft/phi-3_5-mini-instruct',
      'nv-mamba-codestral':    'mistralai/mamba-codestral-7b-v0.1',
      'nv-llama3-70b':         'meta/llama-3.3-70b-instruct',
    };
    return { provider: 'nvidia', model: map[modelId] || 'meta/llama-3.3-70b-instruct' };
  }
  if (modelId.startsWith('groq-')) {
    const map: Record<string, string> = {
      'groq-llama-3.3-70b': 'llama-3.3-70b-versatile',
      'groq-kimi-k2':       'moonshotai/kimi-k2-instruct',
      'groq-qwen3-32b':     'qwen/qwen3-32b',
      'groq-llama-4-scout': 'meta-llama/llama-4-scout-17b-16e-instruct',
      'groq-gpt-oss-120b':  'openai/gpt-oss-120b',
    };
    return { provider: 'groq', model: map[modelId] || 'llama-3.3-70b-versatile' };
  }
  if (modelId.startsWith('mistral-') || modelId.startsWith('magistral-') || modelId.startsWith('ministral-')) {
    return { provider: 'mistral', model: modelId + '-latest' };
  }
  if (modelId.startsWith('elite-')) {
    const map: Record<string, string> = {
      'elite-claude-3-7':        'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
      'elite-claude-3-5-sonnet': 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
      'elite-claude-3-5-haiku':  'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      'elite-nova-pro':          'us.amazon.nova-pro-v1:0',
      'elite-nova-lite':         'us.amazon.nova-lite-v1:0',
      'elite-llama-3-3-70b':     'us.meta.llama3-3-70b-instruct-v1:0',
    };
    return { provider: 'bedrock', model: map[modelId] || 'us.anthropic.claude-3-7-sonnet-20250219-v1:0' };
  }
  return { provider: 'free', model: modelId };
}

export class BackendClient {
  public readonly baseUrl = 'https://cybermind-backend-8yrt.onrender.com';
  private readonly openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private abortController: AbortController | null = null;

  async chat(
    request: ChatRequest,
    model: string,
    apiKey: string | null,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    jwtToken?: string | null,
    openRouterKey?: string | null
  ): Promise<string> {
    const { provider } = resolveModel(model);
    const hasValidApiKey = apiKey && apiKey.startsWith('cp_live_');

    if (!hasValidApiKey) {
      return this.freeChat(request, onToken, cancellationToken, openRouterKey);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'X-Model-Id': model,
      'X-Provider': provider,
    };

    if (provider === 'bedrock' || model.startsWith('elite')) {
      headers['X-User-Plan'] = 'elite';
    } else if (provider !== 'free') {
      headers['X-User-Plan'] = 'pro';
    }

    return this.withRetry(async () => {
      return this._doRequest('/chat', headers, request, onToken, cancellationToken);
    });
  }

  /**
   * Free chat — tries in this order:
   * 1. CyberMind backend /free/chat (HuggingFace cybermindcli model — our own fine-tuned model)
   * 2. OpenRouter free models (if user has OR key, or as anonymous fallback)
   * 3. Error with helpful message
   *
   * The backend /free/chat is tried FIRST because:
   * - It uses our own cybermindcli model (security-trained, no filters)
   * - It's proxied through our backend (no CORS issues)
   * - OpenRouter anonymous requests are heavily rate-limited
   */
  async freeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
  ): Promise<string> {
    // Strategy 1: CyberMind backend /free/chat (our cybermindcli model via HuggingFace)
    try {
      logger.info('Trying CyberMind backend /free/chat...');
      const result = await this._backendFreeChat(request, cancellationToken);
      if (result && result.trim().length > 5) {
        onToken(result);
        return result;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      logger.warn(`Backend /free/chat failed: ${String(err)}`);
    }

    // Strategy 2: OpenRouter (with key if available, or anonymous)
    // Only try if user has an OR key OR as last resort
    try {
      logger.info('Trying OpenRouter...');
      const result = await this._openRouterChat(request, onToken, cancellationToken, openRouterKey);
      if (result && result.trim().length > 5) {
        return result;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      logger.warn(`OpenRouter failed: ${String(err)}`);
    }

    throw new Error(
      'AI is temporarily unavailable.\n\n' +
      'Options to fix this:\n' +
      '1. Sign in with your CyberMind account (click "Sign in with CyberMind")\n' +
      '2. Add a CyberMind API key from cybermindcli1.vercel.app/dashboard/api-keys\n' +
      '3. Add a free OpenRouter key at openrouter.ai (free signup) in Settings\n' +
      '4. Try again in 30 seconds (free models may be loading)'
    );
  }

  /**
   * Call CyberMind backend /free/chat — uses our cybermindcli HuggingFace model
   * This is the primary free path — no API key needed, proxied through our backend
   */
  private async _backendFreeChat(
    request: ChatRequest,
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
      const systemNote = request.system ? `\n\nRole: ${request.agent}` : '';
      const contextNote = request.context ? `\n\nContext:\n${request.context.slice(0, 3000)}` : '';
      const fullPrompt = request.message + systemNote + contextNote;

      const response = await fetch(`${this.baseUrl}/free/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt.slice(0, 2000),
          messages: [],
        }),
        signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Backend /free/chat HTTP ${response.status}: ${errText.slice(0, 100)}`);
      }

      const data = await response.json() as {
        success?: boolean;
        response?: string;
        error?: string;
      };

      if (!data.success || !data.response) {
        throw new Error(data.error || 'Empty response from backend');
      }

      return data.response.trim();
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  /**
   * OpenRouter chat — tries free models in sequence
   * Works best with a free OR key (sk-or-...) but also works anonymously (rate-limited)
   */
  private async _openRouterChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
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
      const systemContent = request.system ||
        `You are CyberMind AI, an expert security and coding assistant. Agent: ${request.agent}.`;
      const contextNote = request.context ? `\n\nWorkspace context:\n${request.context.slice(0, 6000)}` : '';

      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: request.message + contextNote },
      ];

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cybermindcli1.vercel.app',
        'X-Title': 'CyberMind VSCode Extension',
      };

      // Add auth if we have a key — dramatically improves rate limits
      if (openRouterKey && openRouterKey.startsWith('sk-or-')) {
        headers['Authorization'] = `Bearer ${openRouterKey}`;
      }

      for (const model of OPENROUTER_FREE_MODELS) {
        try {
          logger.info(`Trying OpenRouter model: ${model}`);

          const response = await fetch(this.openRouterUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model,
              messages,
              stream: true,
              max_tokens: 4096,
            }),
            signal,
          });

          if (response.status === 429) {
            logger.warn(`OpenRouter ${model}: rate limited, trying next`);
            continue;
          }

          if (response.status === 401 || response.status === 403) {
            // Auth error — skip remaining models if no key (all will fail the same way)
            if (!openRouterKey) {
              logger.warn(`OpenRouter: auth required for free models, skipping`);
              break;
            }
            logger.warn(`OpenRouter ${model}: auth error ${response.status}`);
            continue;
          }

          if (!response.ok) {
            const errText = await response.text().catch(() => '');
            logger.warn(`OpenRouter ${model}: HTTP ${response.status} ${errText.slice(0, 100)}, trying next`);
            continue;
          }

          const reader = response.body?.getReader();
          if (!reader) continue;

          let fullResponse = '';
          let hasContent = false;
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                // Check for error in stream
                if (parsed.error) {
                  logger.warn(`OpenRouter ${model} stream error: ${parsed.error.message || JSON.stringify(parsed.error)}`);
                  break;
                }

                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                  onToken(token);
                  fullResponse += token;
                  hasContent = true;
                }
              } catch { /* skip malformed JSON lines */ }
            }
          }

          if (hasContent && fullResponse.trim().length > 5) {
            logger.info(`OpenRouter ${model}: success (${fullResponse.length} chars)`);
            return fullResponse;
          }

          logger.warn(`OpenRouter ${model}: empty response, trying next`);
        } catch (modelErr) {
          if ((modelErr as Error).name === 'AbortError') throw modelErr;
          logger.warn(`OpenRouter ${model} exception: ${String(modelErr)}, trying next`);
        }
      }

      throw new Error('All OpenRouter free models returned empty responses');
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  /**
   * openRouterFreeChat — kept for backward compatibility
   */
  async openRouterFreeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
  ): Promise<string> {
    return this.freeChat(request, onToken, cancellationToken, openRouterKey);
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
        throw new Error(`Network error: ${String(fetchErr)}`);
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

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: request.email, password: request.password }),
        signal: AbortSignal.timeout(20000),
      });
    } catch {
      throw new Error('Unable to reach authentication server. Check your connection.');
    }

    const data = await response.json().catch(() => ({})) as {
      success?: boolean;
      token?: string;
      plan?: string;
      email?: string;
      error?: string;
    };

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Login failed. Check your email and password.');
    }

    return {
      token: data.token || '',
      plan: data.plan || 'free',
      email: data.email || request.email,
    };
  }

  async validateApiKey(apiKey: string): Promise<{ valid: boolean; plan?: string; email?: string; userName?: string }> {
    try {
      const url = `${this.baseUrl}/auth/validate-key`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return { valid: false };
      const data = await response.json().catch(() => ({})) as {
        success?: boolean;
        plan?: string;
        email?: string;
        user_name?: string;
      };
      if (!data.success) return { valid: false };
      return {
        valid: true,
        plan: data.plan || 'free',
        email: data.email,
        userName: data.user_name,
      };
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

  async withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
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
          logger.warn(`Request failed with ${statusCode}, retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }
}
