"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Key, Plus, Trash2 } from "lucide-react";
import { fetchApiKeys, createApiKey, revokeApiKey, ApiKey } from "@/lib/supabase";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys().then(k => { setKeys(k); setLoading(false); });
  }, []);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const key = await createApiKey(newKeyName.trim());
    if (key) {
      setNewKeyValue(key.key || null);
      setKeys(prev => [key as ApiKey, ...prev]);
      setNewKeyName("");
      setShowCreate(false);
    }
    setCreating(false);
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
          <button onClick={() => setShowCreate(true)}
            className="cm-button-primary gap-2 text-sm">
            <Plus size={14} /> New key
          </button>
        </div>
      </section>

      {/* New key reveal — show once */}
      {newKeyValue && (
        <section className="cm-card-soft p-5">
          <p className="text-sm font-semibold text-[#00FF88] mb-2">✓ Key created — copy it now, shown only once</p>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <code className="flex-1 font-mono text-sm text-white break-all">{newKeyValue}</code>
            <button onClick={() => handleCopy(newKeyValue, "new")}
              className="text-[var(--text-muted)] hover:text-white flex-shrink-0">
              {copied === "new" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          </div>
          <button onClick={() => setNewKeyValue(null)} className="text-xs text-[var(--text-muted)] mt-3 hover:text-white">Dismiss</button>
        </section>
      )}

      {/* Create form */}
      {showCreate && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-3">Key name</p>
          <div className="flex gap-3">
            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
              placeholder="e.g. Kali VM, Work Laptop"
              className="cm-input flex-1"
              onKeyDown={e => e.key === "Enter" && handleCreate()} />
            <button onClick={handleCreate} disabled={creating || !newKeyName.trim()}
              className="cm-button-primary px-5 text-sm disabled:opacity-50">
              {creating ? "Creating..." : "Create"}
            </button>
            <button onClick={() => setShowCreate(false)}
              className="cm-button-secondary px-4 text-sm">Cancel</button>
          </div>
        </section>
      )}

      {/* Keys list */}
      {loading ? (
        <p className="text-[var(--text-muted)] text-sm px-2">Loading keys...</p>
      ) : keys.length === 0 ? (
        <div className="text-center py-16">
          <Key size={32} className="text-[var(--text-muted)] mx-auto mb-4" />
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
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-white">{key.name}</p>
                    <span className={`cm-pill text-xs ${key.is_active ? "text-[#00FF88]" : "text-[var(--text-muted)]"}`}>
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                    <span className="font-mono text-xs text-[var(--accent-cyan)] uppercase">{key.plan}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Created {new Date(key.created_at).toLocaleDateString()} ·
                    {key.last_used ? ` Last used ${new Date(key.last_used).toLocaleDateString()}` : " Never used"} ·
                    {key.requests_today} req today
                  </p>
                </div>
                {key.is_active && (
                  <button onClick={() => handleRevoke(key.id)}
                    className="text-[var(--text-muted)] hover:text-[#FF4444] transition-colors flex-shrink-0">
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
