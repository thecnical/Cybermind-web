"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Key, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { fetchApiKeys, createApiKey, revokeApiKey, wakeBackend, ApiKey } from "@/lib/supabase";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [wakeProgress, setWakeProgress] = useState(0);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadKeys() {
    setLoading(true);
    setLoadError("");
    try {
      const k = await fetchApiKeys();
      setKeys(k);
    } catch {
      setLoadError("Could not load keys. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
    // Pre-warm backend silently so it's ready when user clicks Create
    wakeBackend().catch(() => {});
  }, []);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setCreateError("");
    setWakeProgress(0);
    try {
      const key = await createApiKey(newKeyName.trim(), undefined, (pct) => setWakeProgress(pct));
      if (key) {
        setNewKeyValue(key.key || null);
        setKeys(prev => [key as ApiKey, ...prev]);
        setNewKeyName("");
        setShowCreate(false);
      }
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : "Failed to create key. Please try again.");
    } finally {
      setCreating(false);
      setWakeProgress(0);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this key? This cannot be undone.")) return;
    const ok = await revokeApiKey(id);
    if (ok) setKeys(prev => prev.map(k => k.id === id ? { ...k, is_active: false } : k));
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">API Keys</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              {keys.filter(k => k.is_active).length} active · {keys.length} total
            </p>
          </div>
          <button onClick={() => { setShowCreate(true); setCreateError(""); }}
            className="cm-button-primary gap-2 text-sm">
            <Plus size={14} /> New key
          </button>
        </div>
      </section>

      {/* New key reveal — show once */}
      {newKeyValue && (
        <section className="cm-card-soft p-5">
          <p className="mb-2 text-sm font-semibold text-[#00FF88]">✓ Key created — copy it now, shown only once</p>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-white">{newKeyValue}</code>
            <button onClick={() => handleCopy(newKeyValue, "new")}
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-white">
              {copied === "new" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          </div>
          <button onClick={() => setNewKeyValue(null)} className="mt-3 text-xs text-[var(--text-muted)] hover:text-white">Dismiss</button>
        </section>
      )}

      {/* Create form */}
      {showCreate && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-3">Key name</p>
          <div className="flex flex-wrap gap-3">
            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
              placeholder="e.g. Kali VM, Work Laptop"
              className="cm-input min-w-0 flex-1"
              disabled={creating}
              onKeyDown={e => e.key === "Enter" && handleCreate()} />
            <button onClick={handleCreate} disabled={creating || !newKeyName.trim()}
              className="cm-button-primary gap-2 px-5 text-sm disabled:opacity-50">
              {creating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : "Create"}
            </button>
            <button onClick={() => { setShowCreate(false); setCreateError(""); }}
              disabled={creating}
              className="cm-button-secondary px-4 text-sm disabled:opacity-50">Cancel</button>
          </div>

          {/* Wake progress bar */}
          {creating && wakeProgress > 0 && wakeProgress < 100 && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Waking server... this takes ~30s on first request</span>
                <span>{wakeProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--accent-cyan)] transition-all duration-500"
                  style={{ width: `${wakeProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Create error */}
          {createError && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{createError}</p>
              <button
                onClick={handleCreate}
                disabled={creating || !newKeyName.trim()}
                className="mt-2 flex items-center gap-1.5 text-xs text-[var(--accent-cyan)] hover:underline disabled:opacity-50"
              >
                <RefreshCw size={12} /> Try again
              </button>
            </div>
          )}
        </section>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="flex items-center gap-2 px-2 text-sm text-[var(--text-muted)]">
          <Loader2 size={14} className="animate-spin" /> Loading keys...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
          <p className="text-sm text-red-400">{loadError}</p>
          <button onClick={loadKeys} className="mt-2 flex items-center gap-1.5 text-xs text-[var(--accent-cyan)] hover:underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : keys.length === 0 ? (
        <div className="py-16 text-center">
          <Key size={32} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <p className="text-[var(--text-soft)]">No API keys yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-sm text-[var(--accent-cyan)] hover:underline">
            Create your first key
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {keys.map(key => (
            <div key={key.id}
              className={`cm-card-soft p-5 ${!key.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-white">{key.name}</p>
                    <span className={`cm-pill text-xs ${key.is_active ? "text-[#00FF88]" : "text-[var(--text-muted)]"}`}>
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                    <span className="font-mono text-xs uppercase text-[var(--accent-cyan)]">{key.plan}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Created {new Date(key.created_at).toLocaleDateString()} ·
                    {key.last_used ? ` Last used ${new Date(key.last_used).toLocaleDateString()}` : " Never used"} ·
                    {key.requests_today} req today
                  </p>
                  {key.key_prefix && (
                    <p className="mt-1 font-mono text-xs text-[var(--text-soft)]">
                      {key.key_prefix}{"•".repeat(16)}
                    </p>
                  )}
                </div>
                {key.is_active && (
                  <button onClick={() => handleRevoke(key.id)}
                    className="flex-shrink-0 text-[var(--text-muted)] transition-colors hover:text-[#FF4444]">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
