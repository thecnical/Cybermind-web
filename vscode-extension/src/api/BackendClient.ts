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

// ── Provider configuration ────────────────────────────────────────────────────
// All providers the backend supports — tried in order for free tier
// Priority: Groq (fastest) → Cerebras → GitHub Models → OpenRouter → HuggingFace

const BACKEND_URL = 'https://cybermind-backend-8yrt.onrender.com';

// OpenRouter free models — tried in parallel, first response wins
const OPENROUTER_FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'deepseek/deepseek-r1:free',
  'qwen/qwen3-coder:free',
  'mistralai/mistral-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
];

// Model ID → provider + model name mapping
function resolveModel(modelId: string): { provider: string; model: string } {
  // OpenRouter models
  if (modelId.startsWith('or-')) {
    const map: Record<string, string> = {
      'or-minimax-m2.5':   'minimax/minimax-m2.5:free',
      'or-qwen3-coder':    'qwen/qwen3-coder:free',
      'or-gemma-4-31b':    'google/gemma-4-31b-it:free',
      'or-dolphin':        'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
      'or-hermes-405b':    'nousresearch/hermes-3-llama-3.1-405b:free',
      'or-llama-3.3-70b':  'meta-llama/llama-3.3-70b-instruct:free',
      'or-deepseek-chat':  'deepseek/deepseek-chat',
      'or-qwen3-235b':     'qwen/qwen3-235b-a22b-instruct',
      'or-claude-3.7':     'anthropic/claude-3-7-sonnet',
    };
    return { provider: 'openrouter', model: map[modelId] || 'openrouter/free' };
  }
  // NVIDIA NIM models
  if (modelId.startsWith('nv-')) {
    const map: Record<string, string> = {
      'nv-minimax-m2.7':     'minimaxai/minimax-m2.7',
      'nv-kimi-k2-thinking': 'moonshotai/kimi-k2-thinking',
      'nv-kimi-k2-instruct': 'moonshotai/kimi-k2-instruct',
      'nv-glm-4.7':          'z-ai/glm4_7',
      'nv-gemma-2-27b':      'google/gemma-2-27b-it',
      'nv-phi-3.5-mini':     'microsoft/phi-3_5-mini-instruct',
      'nv-llama3-70b':       'meta/llama-3.3-70b-instruct',
    };
    return { provider: 'nvidia', model: map[modelId] || 'meta/llama-3.3-70b-instruct' };
  }
  // Groq models
  if (modelId.startsWith('groq-')) {
    const map: Record<string, string> = {
      'groq-llama-3.3-70b': 'llama-3.3-70b-versatile',
      'groq-kimi-k2':       'moonshotai/kimi-k2-instruct',
      'groq-qwen3-32b':     'qwen/qwen3-32b',
      'groq-llama-4-scout': 'meta-llama/llama-4-scout-17b-16e-instruct',
    };
    return { provider: 'groq', model: map[modelId] || 'llama-3.3-70b-versatile' };
  }
  // Cerebras models
  if (modelId.startsWith('cerebras-')) {
    const map: Record<string, string> = {
      'cerebras-llama3.3-70b': 'llama3.3-70b',
      'cerebras-qwen3-235b':   'qwen-3-235b-a22b-instruct-2507',
    };
    return { provider: 'cerebras', model: map[modelId] || 'llama3.3-70b' };
  }
  // Mistral models
  if (modelId.startsWith('mistral-') || modelId.startsWith('magistral-') || modelId.startsWith('ministral-')) {
    return { provider: 'mistral', model: modelId + '-latest' };
  }
  // SambaNova models
  if (modelId.startsWith('samba-')) {
    const map: Record<string, string> = {
      'samba-llama3.3-70b': 'Meta-Llama-3.3-70B-Instruct',
      'samba-qwen3-32b':    'Qwen3-32B',
    };
    return { provider: 'sambanova', model: map[modelId] || 'Meta-Llama-3.3-70B-Instruct' };
  }
  // Cloudflare Workers AI
  if (modelId.startsWith('cf-')) {
    const map: Record<string, string> = {
      'cf-llama3.3-70b': '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      'cf-deepseek-r1':  '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
      'cf-qwen2.5-72b':  '@cf/qwen/qwen2.5-72b-instruct',
    };
    return { provider: 'cloudflare', model: map[modelId] || '@cf/meta/llama-3.3-70b-instruct-fp8-fast' };
  }
  // Bytez models
  if (modelId.startsWith('bytez-')) {
    return { provider: 'bytez', model: 'meta-llama/Llama-3.1-8B-Instruct' };
  }
  // Elite (Bedrock) models
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
  public readonly baseUrl = BACKEND_URL;
  private readonly openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private abortController: AbortController | null = null;
  private backendHealthy: boolean | null = null; // null = unknown

  // ── Main chat entry point ─────────────────────────────────────────────────
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

    if (provider === 'bedrock' || model.startsWith('elite-')) {
      headers['X-User-Plan'] = 'elite';
    } else if (provider !== 'free') {
      headers['X-User-Plan'] = 'pro';
    }

    return this.withRetry(async () => {
      return this._doRequest('/chat', headers, request, onToken, cancellationToken);
    });
  }

  // ── Free chat — multi-provider fallback chain ─────────────────────────────
  // Order: /vscode/chat (Groq→Cerebras→OpenRouter) → /free/chat (HuggingFace) → OpenRouter direct
  async freeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
  ): Promise<string> {

    // Strategy 1: /vscode/chat — dedicated VSCode endpoint, no origin restriction
    // Uses Groq → Cerebras → OpenRouter → HuggingFace on the backend
    try {
      logger.info('[BackendClient] Trying /vscode/chat...');
      const result = await this._vscodeChatRequest(request, cancellationToken);
      if (result && result.trim().length > 5) {
        onToken(result);
        return result;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      logger.warn(`[BackendClient] /vscode/chat failed: ${String(err)}`);
    }

    // Strategy 2: OpenRouter direct (if user provided key)
    if (openRouterKey?.startsWith('sk-or-')) {
      try {
        logger.info('[BackendClient] Trying OpenRouter with user key...');
        const result = await this._openRouterChat(request, onToken, cancellationToken, openRouterKey);
        if (result && result.trim().length > 5) {
          return result;
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') throw err;
        logger.warn(`[BackendClient] OpenRouter failed: ${String(err)}`);
      }
    }

    // Strategy 3: OpenRouter free (no key, limited)
    try {
      logger.info('[BackendClient] Trying OpenRouter free models...');
      const result = await this._openRouterChat(request, onToken, cancellationToken, null);
      if (result && result.trim().length > 5) {
        return result;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      logger.warn(`[BackendClient] OpenRouter free failed: ${String(err)}`);
    }

    throw new Error(
      'AI is temporarily unavailable.\n\n' +
      '**Quick fixes:**\n' +
      '1. Sign in with CyberMind account (top button)\n' +
      '2. Add API key from cybermindcli1.vercel.app/dashboard/api-keys\n' +
      '3. Add free OpenRouter key at openrouter.ai → Settings\n' +
      '4. Wait 30s and retry (backend may be waking up)'
    );
  }

  // ── /vscode/chat — dedicated VSCode endpoint ──────────────────────────────
  private async _vscodeChatRequest(
    request: ChatRequest,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    let cancelDisposable: vscode.Disposable | undefined;
    if (cancellationToken) {
      cancelDisposable = cancellationToken.onCancellationRequested(() => this.abortController?.abort());
    }

    try {
      const response = await fetch(`${this.baseUrl}/vscode/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.message,
          messages: [],
          agent: request.agent,
          context: request.context?.slice(0, 6000) ?? '',
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`/vscode/chat HTTP ${response.status}`);
      }

      const data = await response.json() as { success?: boolean; response?: string; error?: string };
      if (!data.success || !data.response) throw new Error(data.error || 'Empty response');
      return data.response.trim();
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  // ── Backend /admin-ai/chat — Groq → Cerebras → GitHub → OpenRouter → HF ──
  private async _adminAiChat(
    request: ChatRequest,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    let cancelDisposable: vscode.Disposable | undefined;
    if (cancellationToken) {
      cancelDisposable = cancellationToken.onCancellationRequested(() => this.abortController?.abort());
    }

    try {
      const contextNote = request.context ? `\n\nContext:\n${request.context.slice(0, 3000)}` : '';
      const fullPrompt = request.message + contextNote;

      const response = await fetch(`${this.baseUrl}/admin-ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt.slice(0, 4000), messages: [] }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`/admin-ai/chat HTTP ${response.status}`);
      }

      const data = await response.json() as { success?: boolean; response?: string; error?: string };
      if (!data.success || !data.response) throw new Error(data.error || 'Empty response');
      return data.response.trim();
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  // ── Backend /free/chat — HuggingFace cybermindcli ─────────────────────────
  private async _backendFreeChat(
    request: ChatRequest,
    cancellationToken?: vscode.CancellationToken
  ): Promise<string> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    let cancelDisposable: vscode.Disposable | undefined;
    if (cancellationToken) {
      cancelDisposable = cancellationToken.onCancellationRequested(() => this.abortController?.abort());
    }

    try {
      const contextNote = request.context ? `\n\nContext:\n${request.context.slice(0, 2000)}` : '';
      const fullPrompt = request.message + contextNote;

      const response = await fetch(`${this.baseUrl}/free/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt.slice(0, 2000), messages: [] }),
        signal,
      });

      if (!response.ok) throw new Error(`/free/chat HTTP ${response.status}`);

      const data = await response.json() as { success?: boolean; response?: string; error?: string };
      if (!data.success || !data.response) throw new Error(data.error || 'Empty response');
      return data.response.trim();
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  // ── OpenRouter direct — streaming, tries multiple free models ─────────────
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
      cancelDisposable = cancellationToken.onCancellationRequested(() => this.abortController?.abort());
    }

    try {
      const systemContent = request.system ||
        `You are CyberMind AI, an expert security and coding assistant. Agent: ${request.agent}.`;
      const contextNote = request.context ? `\n\nWorkspace context:\n${request.context.slice(0, 5000)}` : '';

      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: request.message + contextNote },
      ];

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cybermindcli1.vercel.app',
        'X-Title': 'CyberMind VSCode Extension',
      };
      if (openRouterKey?.startsWith('sk-or-')) {
        headers['Authorization'] = `Bearer ${openRouterKey}`;
      }

      for (const model of OPENROUTER_FREE_MODELS) {
        try {
          const response = await fetch(this.openRouterUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages, stream: true, max_tokens: 4096 }),
            signal,
          });

          if (response.status === 429) { continue; }
          if (response.status === 401 || response.status === 403) {
            if (!openRouterKey) break; // all will fail without key
            continue;
          }
          if (!response.ok) { continue; }

          const reader = response.body?.getReader();
          if (!reader) continue;

          let fullResponse = '';
          let hasContent = false;
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) break;
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) { onToken(token); fullResponse += token; hasContent = true; }
              } catch { /* skip */ }
            }
          }

          if (hasContent && fullResponse.trim().length > 5) return fullResponse;
        } catch (modelErr) {
          if ((modelErr as Error).name === 'AbortError') throw modelErr;
        }
      }

      throw new Error('All OpenRouter free models failed');
    } finally {
      cancelDisposable?.dispose();
      this.abortController = null;
    }
  }

  // ── Authenticated backend request (streaming + non-streaming) ─────────────
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
      cancelDisposable = cancellationToken.onCancellationRequested(() => this.abortController?.abort());
    }

    try {
      const url = `${this.baseUrl}${path}`;
      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers,
          // Backend expects { prompt, messages, agent, context, system }
          // NOT the raw ChatRequest shape which uses "message" field
          body: JSON.stringify({
            prompt: request.message,
            messages: [],
            agent: request.agent,
            context: request.context?.slice(0, 8000) ?? '',
            system: request.system ?? '',
          }),
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
            for (const line of chunk.split('\n')) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const token = parsed.response || parsed.text || parsed.content ||
                    parsed.choices?.[0]?.delta?.content || '';
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

  // ── Health check — ping backend ───────────────────────────────────────────
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(8000),
      });
      this.backendHealthy = response.ok;
      return response.ok;
    } catch {
      this.backendHealthy = false;
      return false;
    }
  }

  isBackendHealthy(): boolean | null {
    return this.backendHealthy;
  }

  // ── Auth endpoints ────────────────────────────────────────────────────────
  async login(request: LoginRequest): Promise<LoginResponse> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: request.email, password: request.password }),
        signal: AbortSignal.timeout(20000),
      });
    } catch {
      throw new Error('Unable to reach authentication server. Check your connection.');
    }

    const data = await response.json().catch(() => ({})) as {
      success?: boolean; token?: string; plan?: string; email?: string; error?: string;
    };

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Login failed. Check your email and password.');
    }

    return { token: data.token || '', plan: data.plan || 'free', email: data.email || request.email };
  }

  async validateApiKey(apiKey: string): Promise<{ valid: boolean; plan?: string; email?: string; userName?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/validate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return { valid: false };
      const data = await response.json().catch(() => ({})) as {
        success?: boolean; plan?: string; email?: string; user_name?: string;
      };
      if (!data.success) return { valid: false };
      return { valid: true, plan: data.plan || 'free', email: data.email, userName: data.user_name };
    } catch {
      return { valid: false };
    }
  }

  async getUserInfo(apiKey: string): Promise<UserInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user/info`, {
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

  async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
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

  // ── Backward compat ───────────────────────────────────────────────────────
  async openRouterFreeChat(
    request: ChatRequest,
    onToken: (token: string) => void,
    cancellationToken?: vscode.CancellationToken,
    openRouterKey?: string | null
  ): Promise<string> {
    return this.freeChat(request, onToken, cancellationToken, openRouterKey);
  }
}
