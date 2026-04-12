"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Key, Loader2, Plus, RefreshCw, Trash2, Shield, Code2, Monitor } from "lucide-react";
import { fetchApiKeys, createApiKey, revokeApiKey, wakeBackend, isKeyWithin48Hours, getKeyCopyTimeLeft, ApiKey } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

// Store full key in sessionStorage (cleared on tab close) + localStorage fallback
function storeKey(keyId: string, fullKey: string) {
  try {
    const expiry = Date.now() + 48 * 60 * 60 * 1000;
    const data = JSON.stringify({ key: fullKey, expiry });
    sessionStorage.setItem(`cm_key_${keyId}`, data);
    localStorage.setItem(`cm_key_${keyId}`, data);
  } catch { /* storage unavailable */ }
}

function getStoredKey(keyId: string): string | null {
  try {
    for (const store of [sessionStorage, localStorage]) {
      const raw = store.getItem(`cm_key_${keyId}`);
      if (!raw) continue;
      const { key, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) { store.removeItem(`cm_key_${keyId}`); continue; }
      return key;
    }
    return null;
  } catch { return null; }
}

// Device types with clear descriptions of what each unlocks
const DEVICE_TYPES = [
  {
    id: "linux",
    icon: "🐧",
    label: "Linux / Kali",
    sublabel: "Full hacking pipeline",
    features: ["Recon (20 tools)", "Hunt (11 tools)", "Abhimanyu exploit", "Omega plan mode", "AI security chat"],
    color: "#00FF88",
    note: "Key locked to Linux. Hacking tools only — CBM Code not available on Linux.",
  },
  {
    id: "windows",
    icon: "🪟",
    label: "Windows",
    sublabel: "AI chat + CBM Code",
    features: ["AI security chat", "CBM Code (full)", "CVE intel", "Payload gen", "Report writer"],
    color: "#00d4ff",
    note: "Key locked to Windows. Cannot be used on Linux/macOS.",
  },
  {
    id: "mac",
    icon: "🍎",
    label: "macOS",
    sublabel: "AI chat + CBM Code",
    features: ["AI security chat", "CBM Code (full)", "CVE intel", "Payload gen", "Report writer"],
    color: "#8A2BE2",
    note: "Key locked to macOS. Cannot be used on Linux/Windows.",
  },
];

export default function ApiKeysPage() {
  const { profile } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [wakeProgress, setWakeProgress] = useState(0);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const plan = profile?.plan || "free";

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
    wakeBackend().catch(() => {});
  }, []);

  async function handleCreate() {
    if (!newKeyName.trim() || !selectedDevice) return;
    setCreating(true);
    setCreateError("");
    setWakeProgress(0);
    try {
      const key = await createApiKey(newKeyName.trim(), selectedDevice, (pct) => setWakeProgress(pct));
      if (key) {
        if (key.key && key.id) storeKey(key.id, key.key);
        setNewKeyValue(key.key || null);
        setKeys(prev => [key as ApiKey, ...prev]);
        setNewKeyName("");
        setSelectedDevice(null);
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

  const activeKeys = keys.filter(k => k.is_active);

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">

      {/* Header */}
      <section className="cm-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">API Keys</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              {activeKeys.length} active · Each key is locked to one OS for security.
            </p>
          </div>
          <button onClick={() => { setShowCreate(true); setCreateError(""); }}
            className="cm-button-primary gap-2 text-sm">
            <Plus size={14} /> New key
          </button>
        </div>
      </section>

      {/* OS lock explanation */}
      <div className="rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/5 px-5 py-4">
        <p className="text-sm font-semibold text-[#FFD700] mb-1">🔒 OS-locked keys</p>
        <p className="text-xs text-[var(--text-soft)]">
          Each API key is locked to the OS you select. A Linux key enables the full hacking pipeline (recon, hunt, Abhimanyu).
          A Windows/macOS key enables AI chat + CBM Code. Keys cannot be used across different operating systems.
          Pro/Elite plans can create keys for multiple devices.
        </p>
      </div>

      {/* New key reveal */}
      {newKeyValue && (
        <section className="cm-card-soft p-5">
          <p className="mb-2 text-sm font-semibold text-[#00FF88]">✓ Key created — copy it now (shown once, available 48h)</p>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-white">{newKeyValue}</code>
            <button onClick={() => handleCopy(newKeyValue, "new")}
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-white">
              {copied === "new" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Install command: <code className="font-mono text-[#00d4ff]">cybermind --key {newKeyValue.slice(0, 20)}...</code>
          </p>
          <button onClick={() => setNewKeyValue(null)} className="mt-3 text-xs text-[var(--text-muted)] hover:text-white">Dismiss</button>
        </section>
      )}

      {/* Create form */}
      {showCreate && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-4">Create new API key</p>

          {/* Step 1: Name */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--text-soft)] mb-2">1. Name this key</p>
            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
              placeholder="e.g. Kali VM, Work Laptop, Home Mac"
              className="cm-input w-full"
              disabled={creating}
              maxLength={64} />
          </div>

          {/* Step 2: Select OS */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--text-soft)] mb-3">2. Select your operating system</p>
            <div className="grid gap-3 md:grid-cols-3">
              {DEVICE_TYPES.map(device => (
                <button key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  disabled={creating}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    selectedDevice === device.id
                      ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{device.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{device.label}</p>
                      <p className="text-xs" style={{ color: device.color }}>{device.sublabel}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {device.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--text-soft)]">
                        <span style={{ color: device.color }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[10px] text-[var(--text-muted)]">{device.note}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleCreate}
              disabled={creating || !newKeyName.trim() || !selectedDevice}
              className="cm-button-primary gap-2 px-5 text-sm disabled:opacity-50">
              {creating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : "Create key"}
            </button>
            <button onClick={() => { setShowCreate(false); setCreateError(""); setSelectedDevice(null); }}
              disabled={creating}
              className="cm-button-secondary px-4 text-sm disabled:opacity-50">Cancel</button>
          </div>

          {/* Wake progress */}
          {creating && wakeProgress > 0 && wakeProgress < 100 && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Waking server... ~30s on first request</span>
                <span>{wakeProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--accent-cyan)] transition-all duration-500"
                  style={{ width: `${wakeProgress}%` }} />
              </div>
            </div>
          )}

          {createError && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{createError}</p>
              <button onClick={handleCreate} disabled={creating || !newKeyName.trim() || !selectedDevice}
                className="mt-2 flex items-center gap-1.5 text-xs text-[var(--accent-cyan)] hover:underline disabled:opacity-50">
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
          {keys.map(key => {
            const canCopy = isKeyWithin48Hours(key.created_at);
            const timeLeft = canCopy ? getKeyCopyTimeLeft(key.created_at) : null;
            const storedKey = canCopy ? getStoredKey(key.id) : null;
            const copyValue = storedKey || key.key || null;
            const deviceType = (key as ApiKey & { device_type?: string }).device_type || "unknown";
            const deviceInfo = DEVICE_TYPES.find(d => d.id === deviceType);

            return (
              <div key={key.id} className={`cm-card-soft p-5 ${!key.is_active ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {deviceInfo && <span className="text-base">{deviceInfo.icon}</span>}
                      <p className="font-semibold text-white">{key.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${key.is_active ? "text-[#00FF88] border-[#00FF88]/20 bg-[#00FF88]/10" : "text-[var(--text-muted)] border-white/10"}`}>
                        {key.is_active ? "Active" : "Revoked"}
                      </span>
                      <span className="font-mono text-xs uppercase text-[var(--accent-cyan)]">{key.plan}</span>
                      {deviceInfo && (
                        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-[var(--text-muted)]">
                          {deviceInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Created {new Date(key.created_at).toLocaleDateString()} ·
                      {key.last_used ? ` Last used ${new Date(key.last_used).toLocaleDateString()}` : " Never used"} ·
                      {key.requests_today} req today
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--text-soft)]">
                      {storedKey
                        ? storedKey.slice(0, 20) + "••••••••••••"
                        : key.key_prefix
                        ? `${key.key_prefix}${"•".repeat(16)}`
                        : "key hidden"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {key.is_active && canCopy && copyValue ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleCopy(copyValue, key.id)}
                          className="text-[var(--text-muted)] transition-colors hover:text-white"
                          title={`Copy full key — ${timeLeft}`}>
                          {copied === key.id ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
                        </button>
                        <span className="text-[10px] text-[#00FF88] bg-[#00FF88]/10 rounded-full px-2 py-0.5">
                          {timeLeft}
                        </span>
                      </div>
                    ) : key.is_active && !canCopy ? (
                      <span className="text-[10px] text-[var(--text-muted)] bg-white/5 rounded-full px-2 py-0.5">
                        copy expired
                      </span>
                    ) : null}
                    {key.is_active && (
                      <button onClick={() => handleRevoke(key.id)}
                        className="text-[var(--text-muted)] transition-colors hover:text-[#FF4444]">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
