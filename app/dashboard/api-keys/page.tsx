"use client";

import { useMemo, useState } from "react";
import { Check, Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { mockApiKeys, type ApiKeyRecord } from "@/lib/mockData";

function makeMockKey(name: string): ApiKeyRecord {
  const suffix = Math.random().toString(36).slice(2, 10);
  return {
    id: `key-${Date.now()}`,
    name,
    key: `sk_live_cm_${suffix}${Math.random().toString(36).slice(2, 10)}`,
    createdAt: "Apr 08, 2026",
    lastUsed: "Never",
    status: "active",
    permission: "write",
  };
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(mockApiKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdValue, setCreatedValue] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const activeCount = useMemo(() => keys.filter((key) => key.status === "active").length, [keys]);

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1500);
  }

  function createKey() {
    if (!newKeyName.trim()) return;
    const next = makeMockKey(newKeyName.trim());
    setKeys((prev) => [next, ...prev]);
    setCreatedValue(next.key);
    setNewKeyName("");
    setCreateOpen(false);
  }

  function revokeKey(id: string) {
    setKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, status: "revoked", lastUsed: key.lastUsed || "Today" } : key)),
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">API keys</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{activeCount} active keys</p>
          </div>
          <button type="button" onClick={() => setCreateOpen(true)} className="cm-button-primary gap-2">
            <Plus size={14} />
            Create new key
          </button>
        </div>
      </section>

      {createdValue ? (
        <section className="cm-card-soft p-5">
          <p className="text-sm text-[var(--success)]">New key created. Copy it now, it is shown only once.</p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-white">{createdValue}</code>
            <button type="button" onClick={() => copy(createdValue, "new-key")}
              className="text-[var(--text-muted)] hover:text-white">
              {copied === "new-key" ? <Check size={16} className="text-[var(--success)]" /> : <Copy size={16} />}
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3">
        {keys.map((key) => (
          <div key={key.id} className="cm-card-soft flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-white">{key.name}</p>
                <span className={`cm-pill ${key.status === "active" ? "text-[var(--success)]" : "text-[var(--text-muted)]"}`}>
                  {key.status}
                </span>
                <span className="cm-pill uppercase">{key.permission}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Created {key.createdAt} | Last used {key.lastUsed}
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-[var(--text-soft)]">
                <KeyRound size={14} className="text-[var(--accent-cyan)]" />
                {`${key.key.slice(0, 13)}${"*".repeat(10)}`}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => copy(key.key, key.id)} className="cm-button-secondary gap-2">
                {copied === key.id ? <Check size={14} /> : <Copy size={14} />}
                Copy
              </button>
              {key.status === "active" ? (
                <button type="button" onClick={() => revokeKey(key.id)} className="cm-button-danger gap-2">
                  <Trash2 size={14} />
                  Revoke
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create API key">
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="cm-label">Key name</span>
            <input
              value={newKeyName}
              onChange={(event) => setNewKeyName(event.target.value)}
              className="cm-input"
              placeholder="Primary CLI key"
            />
          </label>
          <button type="button" onClick={createKey} className="cm-button-primary w-full" disabled={!newKeyName.trim()}>
            Create key
          </button>
        </div>
      </Modal>
    </div>
  );
}

