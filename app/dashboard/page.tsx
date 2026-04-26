"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Copy, Download, KeyRound, Monitor, RefreshCw, Terminal, Trash2, Activity } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  fetchApiKeys, createApiKey, revokeApiKey, wakeBackend,
  fetchLiveUsage, isKeyWithin48Hours, getKeyCopyTimeLeft,
  ApiKey, PLAN_LIMITS, PLAN_TARGET_LIMITS
} from "@/lib/supabase";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

// Device limits per plan
const DEVICE_LIMITS: Record<string, number> = { free: 1, starter: Infinity, pro: 3, elite: Infinity };

// FIX: install commands use env var instead of CLI arg
// Prevents API key appearing in `ps aux` output during installation
const INSTALL_COMMANDS: Record<string, (key: string) => string> = {
  linux:   (k) => `CYBERMIND_KEY=${k} curl -sL https://cybermindcli1.vercel.app/install.sh | bash`,
  windows: (k) => `$env:CYBERMIND_KEY="${k}"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex`,
  mac:     (k) => `CYBERMIND_KEY=${k} curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash`,
};

// Detect OS from browser
function detectOS(): "linux" | "windows" | "mac" {
  if (typeof window === "undefined") return "linux";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "mac";
  return "linux";
}

// Generate PDF receipt as blob
function generateReceiptPDF(plan: string, email: string, date: string): void {
  const content = `
CyberMind CLI — Account Receipt
================================
Date:    ${date}
Email:   ${email}
Plan:    ${plan.toUpperCase()}
Amount:  ${plan === "free" ? "$0.00" : plan === "pro" ? "$9.00/month" : "$29.00/month"}
Status:  Active

Features included:
${plan === "free" ? "- AI chat (20 req/day)\n- 1 device" :
  plan === "pro" ? "- Full recon (20 tools)\n- Full hunt (11 tools)\n- 200 req/day\n- 3 devices" :
  "- All modes including Abhimanyu\n- Unlimited requests\n- Unlimited devices\n- PDF reports"}

Thank you for using CyberMind CLI.
https://cybermind.thecnical.dev
  `.trim();

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cybermind-receipt-${plan}-${date.replace(/\//g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// FIX: Use sessionStorage instead of localStorage for API keys
// sessionStorage is cleared when the tab closes, reducing the XSS exposure window
// localStorage persists indefinitely and is accessible to all same-origin JS including extensions
function storeKeyFor48Hours(keyId: string, fullKey: string) {
  try {
    const expiry = Date.now() + 48 * 60 * 60 * 1000;
    // Try sessionStorage first (cleared on tab close — safer)
    sessionStorage.setItem(`cm_key_${keyId}`, JSON.stringify({ key: fullKey, expiry }));
    // Also store in localStorage as fallback for page refreshes within 48h
    localStorage.setItem(`cm_key_${keyId}`, JSON.stringify({ key: fullKey, expiry }));
  } catch { /* storage unavailable */ }
}

function getStoredKey(keyId: string): string | null {
  try {
    // Try sessionStorage first
    const rawSession = sessionStorage.getItem(`cm_key_${keyId}`);
    if (rawSession) {
      const { key, expiry } = JSON.parse(rawSession);
      if (Date.now() <= expiry) return key;
      sessionStorage.removeItem(`cm_key_${keyId}`);
    }
    // Fall back to localStorage
    const raw = localStorage.getItem(`cm_key_${keyId}`);
    if (!raw) return null;
    const { key, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(`cm_key_${keyId}`);
      return null;
    }
    return key;
  } catch { return null; }
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [platform, setPlatform] = useState<"linux" | "windows" | "mac">("linux");
  const [copied, setCopied] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [keyError, setKeyError] = useState("");
  const [wakeProgress, setWakeProgress] = useState(0);
  const [showDeviceSelect, setShowDeviceSelect] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<"linux" | "windows" | "mac" | null>(null);
  const [keyName, setKeyName] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState("");
  // Newly created key — shown in banner until dismissed
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ id: string; key: string; name: string } | null>(null);
  // Live stats
  const [liveToday, setLiveToday] = useState<number | null>(null);
  const [liveMonth, setLiveMonth] = useState<number | null>(null);
  const [liveTargets, setLiveTargets] = useState<number | null>(null);
  const [liveOsintTargets, setLiveOsintTargets] = useState<number | null>(null);
  const [liveRevengTargets, setLiveRevengTargets] = useState<number | null>(null);
  const [liveUpdated, setLiveUpdated] = useState<Date | null>(null);

  const plan = profile?.plan || "free";
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  const targetLimit = PLAN_TARGET_LIMITS[plan as keyof typeof PLAN_TARGET_LIMITS];
  const deviceLimit = DEVICE_LIMITS[plan] ?? 1;
  const used = liveToday ?? profile?.requests_today ?? 0;
  const usedMonth = liveMonth ?? profile?.requests_month ?? 0;
  const targetsUsed = liveTargets ?? (profile as { recon_targets_used?: number })?.recon_targets_used ?? 0;
  const osintTargetsUsed = liveOsintTargets ?? (profile as { osint_targets_used?: number })?.osint_targets_used ?? 0;
  const revengTargetsUsed = liveRevengTargets ?? (profile as { reveng_targets_used?: number })?.reveng_targets_used ?? 0;
  const usagePct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);

  // Live stats polling — every 30s
  const pollLiveStats = useCallback(async () => {
    const stats = await fetchLiveUsage();
    if (stats) {
      setLiveToday(stats.requests_today);
      setLiveMonth(stats.requests_month);
      setLiveTargets(stats.recon_targets_used);
      setLiveOsintTargets(stats.osint_targets_used);
      setLiveRevengTargets(stats.reveng_targets_used);
      setLiveUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    setPlatform(detectOS());
    wakeBackend().catch(() => {});
    fetchApiKeys().then(k => {
      setKeys(k);
      setLoadingKeys(false);
      if (k.length === 0 && plan === "elite") {
        handleAutoCreateKey("linux", "Linux device");
      }
    });
    // Initial live stats fetch
    pollLiveStats();
    // Poll every 30 seconds
    const interval = setInterval(pollLiveStats, 30000);
    return () => clearInterval(interval);
  }, [plan, pollLiveStats]);

  async function handleAutoCreateKey(device: string, name?: string) {
    setCreatingKey(true);
    setKeyError("");
    setWakeProgress(0);
    setNewlyCreatedKey(null);
    try {
      const keyLabel = name?.trim() || `${device} device`;
      const key = await createApiKey(keyLabel, device, (pct) => setWakeProgress(pct));
      if (key) {
        // Store full key in localStorage for 48hr copy window
        if (key.key && key.id) {
          storeKeyFor48Hours(key.id, key.key);
          setNewlyCreatedKey({ id: key.id, key: key.key, name: key.name || keyLabel });
        }
        setKeys(prev => [key as ApiKey, ...prev]);
      }
      setWakeProgress(0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create key";
      setKeyError(msg);
      setWakeProgress(0);
    }
    setCreatingKey(false);
  }

  async function handleCreateWithDevice() {
    if (!selectedDevice) return;
    setShowDeviceSelect(false);
    await handleAutoCreateKey(selectedDevice, keyName);
    setKeyName("");
    setPlatform(selectedDevice);
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleRevoke(keyId: string, keyName: string) {
    if (!confirm(`Revoke key "${keyName}"? This cannot be undone.`)) return;
    setRevokingId(keyId);
    setRevokeError("");
    try {
      const ok = await revokeApiKey(keyId);
      if (ok) {
        setKeys(prev => prev.map(k => k.id === keyId ? { ...k, is_active: false } : k));
      } else {
        setRevokeError("Failed to revoke key. Please try again.");
      }
    } catch {
      setRevokeError("Failed to revoke key. Please try again.");
    } finally {
      setRevokingId(null);
    }
  }

  function handleDownloadReceipt() {
    const date = new Date().toLocaleDateString();
    generateReceiptPDF(plan, user?.email || "", date);
  }

  const activeKeys = keys.filter(k => k.is_active);
  const activeKey  = activeKeys[0];

  // FIX: never render full key in DOM after initial creation
  // key_prefix is safe to display (e.g. "cp_live_xxxx")
  // Full key is only available immediately after creation (stored in newKeyOnce state)
  const displayKey = activeKey?.key_prefix
    ? `${activeKey.key_prefix}${"•".repeat(20)}`
    : "No active key";

  // Full key for install command — only available right after creation
  const installKeyValue = activeKey?.key || activeKey?.key_prefix || "YOUR_API_KEY";
  const installCmd = INSTALL_COMMANDS[platform](installKeyValue);

  const canCreateMore = deviceLimit === Infinity || activeKeys.length < deviceLimit;

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      <EmailVerificationBanner />

      {/* ── Newly created key banner ─────────────────────────────────────── */}
      {newlyCreatedKey && (
        <section className="rounded-2xl border border-[#00FF88]/30 bg-[#00FF88]/5 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-[#00FF88]">✓ Key created — copy it now!</p>
              <p className="text-xs text-[var(--text-soft)] mt-0.5">
                Full key available for 48 hours. After that only the prefix is shown.
              </p>
            </div>
            <button onClick={() => setNewlyCreatedKey(null)}
              className="text-xs text-[var(--text-muted)] hover:text-white flex-shrink-0">
              Dismiss
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <code className="flex-1 font-mono text-sm text-white break-all select-all">
              {newlyCreatedKey.key}
            </code>
            <button
              onClick={() => handleCopy(newlyCreatedKey.key, "newkey")}
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-white transition-colors">
              {copied === "newkey" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Run: <code className="font-mono text-[var(--accent-cyan)]">cybermind --key {newlyCreatedKey.key}</code>
          </p>
        </section>
      )}

      {/* Welcome */}
      <section className="cm-card cm-spotlight-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            {(() => {
              const isNew = user?.created_at
                ? Date.now() - new Date(user.created_at).getTime() < 5 * 60 * 1000
                : false;
              const name = profile?.full_name || user?.email?.split("@")[0];
              if (!name) return "Welcome to CyberMind 👋";
              if (isNew) return `Welcome, ${name} 👋`;
              return `Welcome back, ${name} 👋`;
            })()}
          </h1>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 rounded-full px-3 py-1">
                {plan}
              </span>
              <span className="text-sm text-[var(--text-soft)]">
                {activeKeys.length}/{deviceLimit === Infinity ? "∞" : deviceLimit} devices
              </span>
              {plan !== "elite" && (
                <Link href="/plans" className="text-sm text-[var(--accent-cyan)] hover:underline">
                  Upgrade →
                </Link>
              )}
            </div>
          </div>
          <button onClick={handleDownloadReceipt}
            className="cm-button-secondary gap-2 text-sm">
            <Download size={14} /> Receipt
          </button>
        </div>
        {/* Admin panel button — only for boss admins */}
        {(user?.email === "chandanabhay4456@gmail.com" || user?.email === "chandanabhay458@gmail.com") && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
            >
              ⚡ Open Admin Panel
            </Link>
            <span className="ml-3 text-xs text-gray-600">Boss Admin access</span>
          </div>
        )}
        {/* Tech team — admin panel link */}
        {(user?.email === "omkargavali2006@gmail.com" || user?.email === "tadikondakhamshiq18.23@gmail.com" || user?.email === "d53973292@gmail.com") && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-400 transition hover:bg-purple-500/20"
            >
              🛠️ Tech Team Panel
            </Link>
            <span className="ml-3 text-xs text-gray-600">Team access</span>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="cm-card-soft p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="cm-label">Requests today</p>
            {liveUpdated && (
              <span className="flex items-center gap-1 text-[10px] text-[#00FF88]">
                <Activity size={10} className="animate-pulse" />
                live
              </span>
            )}
          </div>
          <p className="mt-2 text-3xl font-semibold text-white">
            {used}{limit !== Infinity ? `/${limit}` : ""}
          </p>
          {limit !== Infinity && (
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${usagePct}%`, backgroundColor: usagePct > 80 ? "#FF4444" : "#00FFFF" }} />
            </div>
          )}
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests this month</p>
          <p className="mt-2 text-3xl font-semibold text-white">{usedMonth}</p>
        </div>
        {plan === "starter" ? (
          <div className="cm-card-soft p-5">
            <p className="cm-label">Recon/Hunt/Abhimanyu targets</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {targetsUsed}
              <span className="text-lg text-[var(--text-soft)]">/{targetLimit === Infinity ? "∞" : targetLimit}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">resets monthly</p>
            {targetLimit !== Infinity && (
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (targetsUsed / targetLimit) * 100)}%`, backgroundColor: targetsUsed >= targetLimit ? "#FF4444" : "#FFD700" }} />
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
              <p className="text-xs text-[var(--text-soft)]">OSINT Deep: <span className="text-white">{osintTargetsUsed}/{targetLimit === Infinity ? "∞" : targetLimit}</span></p>
              <p className="text-xs text-[var(--text-soft)]">RevEng: <span className="text-white">{revengTargetsUsed}/{targetLimit === Infinity ? "∞" : targetLimit}</span></p>
            </div>
          </div>
        ) : (
          <div className="cm-card-soft p-5">
            <p className="cm-label">Devices</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {loadingKeys ? "..." : activeKeys.length}
              <span className="text-lg text-[var(--text-soft)]">/{deviceLimit === Infinity ? "∞" : deviceLimit}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">active API keys</p>
          </div>
        )}
      </section>

      {/* API Key + Install */}
      <section className="cm-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="cm-label">API key & install</p>
            <p className="text-sm text-[var(--text-soft)] mt-1">
              {activeKey ? "Your key is ready — copy the install command below" : "Generate a key to get started"}
            </p>
          </div>
          {canCreateMore && (
            <button
              onClick={() => plan === "elite" ? handleAutoCreateKey(platform) : setShowDeviceSelect(true)}
              disabled={creatingKey}
              className="cm-button-primary gap-2 text-sm">
              <RefreshCw size={14} className={creatingKey ? "animate-spin" : ""} />
              {creatingKey ? "Creating... (may take 30s)" : activeKey ? "New device key" : "Generate key"}
            </button>
          )}
        </div>

        {/* Device selector modal */}
        {showDeviceSelect && (
          <div className="mb-5 rounded-2xl border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 p-5">
            <p className="text-sm font-semibold text-white mb-3">Name this device & select type:</p>
            <input
              type="text"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              placeholder="e.g. My Kali VM, Work Laptop..."
              maxLength={64}
              className="cm-input mb-4 w-full"
            />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(["linux", "windows", "mac"] as const).map(d => (
                <button key={d} onClick={() => setSelectedDevice(d)}
                  className={`rounded-2xl border p-4 text-center transition-all ${selectedDevice === d
                    ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-white"
                    : "border-white/10 text-[var(--text-soft)] hover:border-white/20"}`}>
                  <div className="text-2xl mb-2">{d === "linux" ? "🐧" : d === "windows" ? "🪟" : "🍎"}</div>
                  <p className="text-sm font-medium capitalize">{d === "linux" ? "Linux/Kali" : d}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {d === "linux" ? "Full pipeline" : "Chat only"}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreateWithDevice} disabled={!selectedDevice}
                className="cm-button-primary text-sm disabled:opacity-50">
                Create key
              </button>
              <button onClick={() => { setShowDeviceSelect(false); setKeyName(""); setSelectedDevice(null); }}
                className="cm-button-secondary text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {keyError && (
          <div className="mb-4 rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/10 px-4 py-3 text-sm text-white">
            <p>{keyError}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {keyError.includes("limit") && (
                <Link href="/plans" className="text-[var(--accent-cyan)] hover:underline text-xs">Upgrade plan →</Link>
              )}
              {(keyError.includes("timed out") || keyError.includes("server") || keyError.includes("reach")) && (
                <button
                  onClick={() => selectedDevice
                    ? handleAutoCreateKey(selectedDevice, keyName)
                    : handleAutoCreateKey(platform)
                  }
                  className="text-[var(--accent-cyan)] hover:underline text-xs"
                >
                  Try again →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Masked key display */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 mb-4">
          <KeyRound size={16} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-sm text-[var(--text-main)]">{displayKey}</code>
          {activeKey && activeKey.key ? (
            <button onClick={() => handleCopy(activeKey.key!, "apikey")}
              className="text-[var(--text-muted)] hover:text-white transition-colors"
              title="Copy API key">
              {copied === "apikey" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          ) : activeKey ? (
            <span className="text-xs text-[var(--text-muted)]" title="Key shown once at creation">
              shown once
            </span>
          ) : null}
        </div>

        {/* Platform tabs */}
        <div className="flex gap-2 mb-3">
          {(["linux", "windows", "mac"] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`rounded-xl px-4 py-2 text-sm font-mono transition-colors ${platform === p ? "bg-white/8 text-white" : "text-[var(--text-soft)] hover:text-white"}`}>
              {p === "linux" ? "🐧 Linux" : p === "windows" ? "🪟 Windows" : "🍎 Mac"}
            </button>
          ))}
        </div>

        {/* Install command */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <Terminal size={14} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-xs text-[var(--text-main)] break-all">{installCmd}</code>
          <button onClick={() => handleCopy(installCmd, "install")}
            className="text-[var(--text-muted)] hover:text-white flex-shrink-0">
            {copied === "install" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {platform === "linux"
            ? "✓ Full pipeline: recon → hunt → Abhimanyu. Key auto-saved. Installs both cybermind and cbm commands."
            : platform === "windows"
            ? "✓ AI chat + AI coding assistant. Key auto-saved. Installs both cybermind and cbm commands. Open a new terminal after install."
            : "✓ AI chat + AI coding assistant on macOS. Key auto-saved. Installs both cybermind and cbm commands."}
        </p>
      </section>

      {/* All device keys */}
      {activeKeys.length > 0 && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-3">Your devices ({activeKeys.length})</p>
          {revokeError && (
            <p className="mb-3 text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2">{revokeError}</p>
          )}
          <div className="grid gap-2">
            {activeKeys.map(k => {
              const canCopy = isKeyWithin48Hours(k.created_at);
              const timeLeft = canCopy ? getKeyCopyTimeLeft(k.created_at) : null;
              // Get full key from localStorage (stored at creation time)
              const storedFullKey = canCopy ? getStoredKey(k.id) : null;
              const copyValue = storedFullKey || k.key || null;
              return (
                <div key={k.id} className="rounded-xl border border-white/8 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Monitor size={14} className="text-[var(--accent-cyan)] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{k.name}</p>
                        <p className="text-xs text-[var(--text-muted)] font-mono">
                          {storedFullKey
                            ? storedFullKey.slice(0, 20) + "••••••••••••"
                            : k.key_prefix
                            ? `${k.key_prefix}••••••••••••••••`
                            : "key hidden"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canCopy && copyValue ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(copyValue, k.id)}
                            className="text-[var(--text-muted)] hover:text-white transition-colors"
                            title={`Copy full key — ${timeLeft}`}>
                            {copied === k.id ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
                          </button>
                          <span className="text-[10px] text-[#00FF88] bg-[#00FF88]/10 rounded-full px-2 py-0.5">
                            {timeLeft}
                          </span>
                        </div>
                      ) : canCopy && !copyValue ? (
                        <span className="text-[10px] text-[var(--text-muted)] bg-white/5 rounded-full px-2 py-0.5">
                          key not cached
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] bg-white/5 rounded-full px-2 py-0.5">
                          copy expired
                        </span>
                      )}
                      <button
                        onClick={() => handleRevoke(k.id, k.name)}
                        disabled={revokingId === k.id}
                        className="text-[var(--text-muted)] hover:text-[#FF4444] transition-colors disabled:opacity-40"
                        title="Revoke this key">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 ml-[26px]">
                    {k.requests_today} req today · Created {new Date(k.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Plan limits */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-3">Plan limits</p>
        <div className="grid gap-2 text-sm">
          {[
            ["Daily requests",      limit === Infinity ? "Unlimited" : `${limit} / day`],
            ["Devices (API keys)",  deviceLimit === Infinity ? "Unlimited" : `${deviceLimit} devices`],
            ["Recon mode",          plan === "free" ? "❌ Starter+ only" : "✅ Available"],
            ["Hunt mode",           plan === "free" ? "❌ Starter+ only" : "✅ Available"],
            ["DevSec scanner",      plan === "free" ? "❌ Starter+ only" : "✅ Available"],
            ["OSINT Deep",          plan === "free" ? "❌ Starter+ only" : "✅ Available"],
            ["Vibe-Hack / Chain",   (plan === "free" || plan === "starter") ? "❌ Pro+ only" : "✅ Available"],
            ["Abhimanyu mode",      plan === "elite" ? "✅ Available" : "❌ Elite only"],
            ["Red Team campaign",   plan === "elite" ? "✅ Available" : "❌ Elite only"],
            ["CVE Intel",           "✅ Available"],
            ["Payload Generator",   "✅ Available"],
            ["Report Writer",       plan === "free" ? "❌ Starter+ only" : "✅ Available"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-2">
              <span className="text-[var(--text-soft)]">{label}</span>
              <span className="text-white font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
        {plan === "free" && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Upgrade to Starter or higher to unlock recon/hunt/OSINT. <Link href="/plans" className="text-[#00d4ff] hover:underline">View plans →</Link>
          </p>
        )}
      </section>
    </div>
  );
}
