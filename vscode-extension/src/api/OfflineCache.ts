/**
 * OfflineCache — Caches last 5 responses per agent for offline use.
 * Uses vscode.Memento (globalState) for persistence.
 */
import * as vscode from 'vscode';

export interface CachedResponse {
  agent: string;
  promptHash: string;
  promptPreview: string;
  response: string;
  timestamp: number;
}

const CACHE_KEY = 'cybermind.offlineCache';
const MAX_PER_AGENT = 5;

export class OfflineCache {
  constructor(private readonly storage: vscode.Memento) {}

  /**
   * Get a cached response for the given agent and prompt.
   * Uses fuzzy matching on the first 100 chars of the prompt.
   */
  get(agent: string, prompt: string): string | null {
    const config = vscode.workspace.getConfiguration('cybermind');
    if (!config.get<boolean>('offline.enabled', true)) return null;

    const all = this.loadAll();
    const agentCache = all[agent] ?? [];
    const hash = this.hashPrompt(prompt);

    // Exact hash match first
    const exact = agentCache.find(c => c.promptHash === hash);
    if (exact) return exact.response;

    // Fuzzy match — check if prompt preview is similar
    const promptPreview = prompt.slice(0, 100).toLowerCase();
    const fuzzy = agentCache.find(c => {
      const similarity = this.similarity(c.promptPreview.toLowerCase(), promptPreview);
      return similarity > 0.7;
    });

    return fuzzy?.response ?? null;
  }

  /**
   * Store a response in the cache for the given agent and prompt.
   * Evicts oldest entries if over MAX_PER_AGENT.
   */
  set(agent: string, prompt: string, response: string): void {
    const config = vscode.workspace.getConfiguration('cybermind');
    if (!config.get<boolean>('offline.enabled', true)) return;

    const all = this.loadAll();
    const agentCache = all[agent] ?? [];

    const entry: CachedResponse = {
      agent,
      promptHash: this.hashPrompt(prompt),
      promptPreview: prompt.slice(0, 100),
      response,
      timestamp: Date.now(),
    };

    // Remove existing entry with same hash
    const filtered = agentCache.filter(c => c.promptHash !== entry.promptHash);

    // Add new entry at front
    filtered.unshift(entry);

    // Keep only MAX_PER_AGENT entries (evict oldest)
    all[agent] = filtered.slice(0, MAX_PER_AGENT);

    this.saveAll(all);
  }

  /**
   * Get the last 5 cached responses for a given agent.
   */
  getRecentForAgent(agent: string): CachedResponse[] {
    const all = this.loadAll();
    return (all[agent] ?? []).slice(0, MAX_PER_AGENT);
  }

  /**
   * Clear all cached responses.
   */
  clear(): void {
    this.storage.update(CACHE_KEY, {});
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private loadAll(): Record<string, CachedResponse[]> {
    return this.storage.get<Record<string, CachedResponse[]>>(CACHE_KEY, {});
  }

  private saveAll(data: Record<string, CachedResponse[]>): void {
    this.storage.update(CACHE_KEY, data);
  }

  /**
   * Simple hash of the first 100 chars of a prompt.
   */
  private hashPrompt(prompt: string): string {
    const str = prompt.slice(0, 100);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Simple Jaccard similarity between two strings (word-level).
   */
  private similarity(a: string, b: string): number {
    const wordsA = new Set(a.split(/\s+/).filter(Boolean));
    const wordsB = new Set(b.split(/\s+/).filter(Boolean));
    if (wordsA.size === 0 && wordsB.size === 0) return 1;
    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }

    const union = wordsA.size + wordsB.size - intersection;
    return intersection / union;
  }
}
