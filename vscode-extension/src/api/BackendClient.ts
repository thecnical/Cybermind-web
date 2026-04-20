import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export type ModelTier = 'free' | 'pro' | 'elite';

export interface ChatRequest {
  message: string;
  agent: string;
  context: string;
  system?: string;  // agent system prompt — used by OpenRouter free tier
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

// OpenRouter free models — no API key needed
const OPENROUTER_FREE_MODELS = [
  'minimax/minimax-m2.5:free',
  'deepseek/deepseek-r1:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen3-coder:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
];

// Map extension model IDs to backend provider/model strings
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
  // Free/default
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

    // IMPORTANT: The backend /chat endpoint only accepts cp_live_ API keys.
    // JWT tokens from web login CANNOT be used with /chat — they fail with 401.
    // Only use /chat when we have a real API key. Otherwise use free tier.
    const hasValidApiKey = apiKey && apiKey.startsWith('cp_live_');

    if (!hasValidApiKey) {
      // No valid API key — use free tier (OpenRouter)
      return this.openRouterFreeChat(request, onToken, cancellationToken, openRouterKey);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    };

    // Tell backend which provider/model to use
    headers['X-Model-Id'] = model;
    headers['X-Provider'] = provider;

    if (provider === 'bedrock' || model.startsWith('elite')) {
      headers['X-User-Plan'] = 'elite';
    } else if (provider !== 'free') {
      headers['X-User-Plan'] = 'pro';
    }

    return this.withRetry(async () => {
      return this._doRequest('/chat', headers, request, onToken, cancellationToken);
    });
  }

  async openRouterFreeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
  ): Promise<string> {
    // Try CyberMind backend free endpoint first (HuggingFace)
    // Backend expects {prompt: "..."} not {message: "..."}
    const freeRequest = {
      prompt: request.message,
      messages: [],
    };

    try {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      let cancelDisposable: vscode.Disposable | undefined;
      if (cancellationToken) {
        cancelDisposable = cancellationToken.onCancellationRequested(() => {
          this.abortController?.abort();
        });
      }

      try {
        const response = await fetch(`${this.baseUrl}/free/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(freeRequest),
          signal,
        });

        if (response.ok) {
          const data = await response.json() as { success?: boolean; response?: string; error?: string };
          if (data.success && data.response && data.response.trim().length > 10) {
            onToken(data.response);
            return data.response;
          }
        }
      } catch (err) {
        logger.warn(`CyberMind /free/chat failed: ${String(err)}`);
      } finally {
        cancelDisposable?.dispose();
        this.abortController = null;
      }
    } catch { /* ignore */ }

    // Fallback to OpenRouter free models
    logger.info('Falling back to OpenRouter free models');
    return this._openRouterChat(request, onToken, cancellationToken, openRouterKey);
  }

  async freeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    return this.openRouterFreeChat(request, onToken, cancellationToken);
  }

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
      // Use the agent's system prompt if provided, otherwise use a default
      const systemContent = request.system ||
        `You are CyberMind AI, an expert security and coding assistant. Agent: ${request.agent}.`;
      const contextNote = request.context ? `\n\nWorkspace context:\n${request.context}` : '';

      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: request.message + contextNote },
      ];

      // Try each free model in order until one works
      for (const model of OPENROUTER_FREE_MODELS) {
        try {
          const response = await fetch(this.openRouterUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://cybermindcli1.vercel.app',
              'X-Title': 'CyberMind VSCode Extension',
              ...(openRouterKey ? { 'Authorization': `Bearer ${openRouterKey}` } : {}),
            },
            body: JSON.stringify({
              model,
              messages,
              stream: true,
              max_tokens: 4096,
            }),
            signal,
          });

          if (!response.ok) {
            logger.warn(`OpenRouter model ${model} returned ${response.status}, trying next`);
            continue;
          }

          const reader = response.body?.getReader();
          let fullResponse = '';

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
                    const token = parsed.choices?.[0]?.delta?.content || '';
                    if (token) { onToken(token); fullResponse += token; }
                  } catch { /* skip malformed */ }
                }
              }
            }
          }

          if (fullResponse) return fullResponse;
        } catch (modelErr) {
          if ((modelErr as Error).name === 'AbortError') throw modelErr;
          logger.warn(`OpenRouter model ${model} failed: ${String(modelErr)}, trying next`);
        }
      }

      throw new Error('All free models failed. Please sign in or add an OpenRouter API key in Settings.');
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
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
      } catch {
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
    // POST /auth/login — backend wraps Supabase auth and returns JWT + plan
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

    const data = await response.json().catch(() => ({})) as { success?: boolean; token?: string; plan?: string; email?: string; error?: string };

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
      // POST /auth/validate-key with X-API-Key header
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
        key_name?: string;
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
