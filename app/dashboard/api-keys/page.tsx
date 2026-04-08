"use client";

import { useEffect, useState } from "react";
import { Plus, Copy, Trash2, Check, Key } from "lucide-react";
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
    const key = await createApiKey(newKeyName);
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
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">API Keys</h1>
          <p className="text-[var(--text-soft)] mt-1">Manage keys for CLI authentication</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-2 text-sm text-white hover:bg-[rgba(141,117,255,0.28)]">
          <Plus size={16} /> New Key
        </button>
      </div>

      {/* New key created — show once */}
      {newKeyValue && (
        <div className="rounded-[24px] border border-[#00FF88]/30 bg-[#00FF88]/5 p-5 mb-6">
          <p className="text-sm font-semibold text-[#00FF88] mb-2">✓ Key created — copy it now, it won&apos;t be shown again</p>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <code className="flex-1 font-mono text-sm text-white break-all">{newKeyValue}</code>
            <button onClick={() => handleCopy(newKeyValue, "new")} className="text-[var(--text-muted)] hover:text-white">
              {copied === "new" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          </div>
          <button onClick={() => setNewKeyValue(null)} className="text-xs text-[var(--text-muted)] mt-3 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-3">New Key Name</p>
          <div className="flex gap-3">
            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. Kali VM, Work Laptop"
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none" />
            <button onClick={handleCreate} disabled={creating || !newKeyName.trim()} className="rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-5 py-3 text-sm text-white disabled:opacity-50">
              {creating ? "Creating..." : "Create"}
            </button>
            <button onClick={() => setShowCreate(false)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[var(--text-soft)] hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <p className="text-[var(--text-muted)] text-sm">Loading keys...</p>
      ) : keys.length === 0 ? (
        <div className="text-center py-16">
          <Key size={32} className="text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-soft)]">No API keys yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-sm text-[var(--accent-cyan)] hover:underline">Create your first key</button>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(key => (
            <div key={key.id} className={`rounded-[24px] border p-5 ${key.is_active ? "border-white/8 bg-white/[0.03]" : "border-white/4 bg-white/[0.01] opacity-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-white">{key.name}</p>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${key.is_active ? "bg-[#00FF88]/10 text-[#00FF88]" : "bg-white/5 text-[var(--text-muted)]"}`}>
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
                  <button onClick={() => handleRevoke(key.id)} className="text-[var(--text-muted)] hover:text-[#FF4444] transition-colors">
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
