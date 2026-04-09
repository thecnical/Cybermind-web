"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, KeyRound, Monitor, RefreshCw, Terminal } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { fetchApiKeys, createApiKey, ApiKey, PLAN_LIMITS } from "@/lib/supabase";

// Device limits per plan
const DEVICE_LIMITS: Record<string, number> = { free: 1, pro: 3, elite: Infinity };

// Install commands with key embedded
const INSTALL_COMMANDS: Record<string, (key: string) => string> = {
  linux:   (k) => `curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key ${k}`,
  windows: (k) => `iwr https://cybermind.thecnical.dev/install.ps1 | iex; cybermind --key ${k}`,
  mac:     (k) => `curl -sL https://cybermind.thecnical.dev/install-mac.sh | bash -s -- --key ${k}`,
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

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [platform, setPlatform] = useState<"linux" | "windows" | "mac">("linux");
  const [copied, setCopied] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [keyError, setKeyError] = useState("");
  const [showDeviceSelect, setShowDeviceSelect] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<"linux" | "windows" | "mac" | null>(null);

  const plan = profile?.plan || "free";
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  const deviceLimit = DEVICE_LIMITS[plan] ?? 1;
  const used = profile?.requests_today || 0;
  const usagePct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);

  useEffect(() => {
    // Auto-detect platform
    setPlatform(detectOS());

    fetchApiKeys().then(k => {
      setKeys(k);
      setLoadingKeys(false);
      // Elite plan: auto-generate key without asking device
      if (k.length === 0 && plan === "elite") {
        handleAutoCreateKey("linux");
      }
    });
  }, [plan]);

  async function handleAutoCreateKey(device: string) {
    setCreatingKey(true);
    setKeyError("");
    try {
      const key = await createApiKey(`${device} device`, device);
      if (key) setKeys(prev => [key as ApiKey, ...prev]);
    } catch (e: unknown) {
      setKeyError(e instanceof Error ? e.message : "Failed to create key");
    }
    setCreatingKey(false);
  }

  async function handleCreateWithDevice() {
    if (!selectedDevice) return;
    setShowDeviceSelect(false);
    await handleAutoCreateKey(selectedDevice);
    setPlatform(selectedDevice);
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleDownloadReceipt() {
    const date = new Date().toLocaleDateString();
    generateReceiptPDF(plan, user?.email || "", date);
  }

  const activeKeys = keys.filter(k => k.is_active);
  const activeKey = activeKeys[0]; // primary key for current platform
  const maskedKey = activeKey
    ? `${(activeKey.key || "cp_live_").slice(0, 12)}${"•".repeat(20)}`
    : "No active key";
  const installCmd = activeKey
    ? INSTALL_COMMANDS[platform](activeKey.key || "YOUR_KEY")
    : INSTALL_COMMANDS[platform]("YOUR_API_KEY");

  const canCreateMore = deviceLimit === Infinity || activeKeys.length < deviceLimit;

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">

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
      </section>

      {/* Stats */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests today</p>
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
          <p className="mt-2 text-3xl font-semibold text-white">{profile?.requests_month || 0}</p>
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Devices</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loadingKeys ? "..." : activeKeys.length}
            <span className="text-lg text-[var(--text-soft)]">/{deviceLimit === Infinity ? "∞" : deviceLimit}</span>
          </p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">active API keys</p>
        </div>
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
              {creatingKey ? "Creating..." : activeKey ? "New device key" : "Generate key"}
            </button>
          )}
        </div>

        {/* Device selector modal */}
        {showDeviceSelect && (
          <div className="mb-5 rounded-2xl border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 p-5">
            <p className="text-sm font-semibold text-white mb-3">Select your device type:</p>
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
                Create key for this device
              </button>
              <button onClick={() => setShowDeviceSelect(false)} className="cm-button-secondary text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {keyError && (
          <div className="mb-4 rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/10 px-4 py-3 text-sm text-white">
            {keyError}
            {keyError.includes("limit") && (
              <> · <Link href="/plans" className="text-[var(--accent-cyan)] hover:underline">Upgrade plan</Link></>
            )}
          </div>
        )}

        {/* Masked key display */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 mb-4">
          <KeyRound size={16} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-sm text-[var(--text-main)]">{maskedKey}</code>
          {activeKey && (
            <button onClick={() => handleCopy(activeKey.key || "", "apikey")}
              className="text-[var(--text-muted)] hover:text-white transition-colors">
              {copied === "apikey" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          )}
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
            ? "✓ Full pipeline: recon → hunt → Abhimanyu. Key auto-saved on install."
            : platform === "windows"
            ? "✓ AI chat mode. Key auto-saved. Use Kali for full pipeline."
            : "✓ AI chat mode on macOS. Key auto-saved. Use Kali for full pipeline."}
        </p>
      </section>

      {/* All device keys */}
      {activeKeys.length > 1 && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-3">Your devices ({activeKeys.length})</p>
          <div className="grid gap-2">
            {activeKeys.map(k => (
              <div key={k.id} className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Monitor size={14} className="text-[var(--accent-cyan)]" />
                  <div>
                    <p className="text-sm font-medium text-white">{k.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{k.requests_today} req today</p>
                  </div>
                </div>
                <button onClick={() => handleCopy(k.key || "", k.id)}
                  className="text-[var(--text-muted)] hover:text-white">
                  {copied === k.id ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plan limits */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-3">Plan limits</p>
        <div className="grid gap-2 text-sm">
          {[
            ["Daily requests", limit === Infinity ? "Unlimited" : `${limit}/day`],
            ["Devices (API keys)", deviceLimit === Infinity ? "Unlimited" : `${deviceLimit} devices`],
            ["Recon mode", plan === "free" ? "❌ Pro required" : "✅ Available"],
            ["Hunt mode", plan === "free" ? "❌ Pro required" : "✅ Available"],
            ["Abhimanyu mode", plan !== "elite" ? "❌ Elite required" : "✅ Available"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-2">
              <span className="text-[var(--text-soft)]">{label}</span>
              <span className="text-white font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
        {plan !== "elite" && (
          <Link href="/plans" className="cm-button-primary mt-4 text-sm w-full justify-center block text-center">
            Upgrade plan
          </Link>
        )}
      </section>
    </div>
  );
}
