"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw, Terminal } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchApiKeys, createApiKey, ApiKey, PLAN_LIMITS } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

const INSTALL_COMMANDS: Record<string, (key: string) => string> = {
  linux:   (k) => `curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key ${k}`,
  windows: (k) => `iwr https://cybermind.thecnical.dev/install.ps1 | iex; cybermind --key ${k}`,
  mac:     (k) => `brew install cybermind; cybermind --key ${k}`,
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [platform, setPlatform] = useState<"linux" | "windows" | "mac">("linux");
  const [copied, setCopied] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{endpoint: string; status: string; created_at: string}>>([]);

  useEffect(() => {
    fetchApiKeys().then(k => {
      setKeys(k);
      setLoadingKeys(false);
      // Auto-create first key if none exist
      if (k.length === 0) {
        handleCreateFirstKey();
      }
    });
    fetchRecentActivity();
  }, []);

  async function fetchRecentActivity() {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${BACKEND_URL}/auth/usage`, {
        headers: { "X-API-Key": "" }, // will be filled after keys load
      });
    } catch { /* silent */ }
  }

  async function handleCreateFirstKey() {
    const key = await createApiKey("Default Key");
    if (key) setKeys([key as ApiKey]);
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    const key = await createApiKey(`Key ${keys.length + 1}`);
    if (key) setKeys(prev => [key as ApiKey, ...prev]);
    setCreatingKey(false);
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const plan = profile?.plan || "free";
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  const used = profile?.requests_today || 0;
  const usagePct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
  const activeKey = keys.find(k => k.is_active);
  const maskedKey = activeKey ? `${activeKey.key?.slice(0, 14) ?? "sk_live_cm_"}${"•".repeat(18)}` : "No active key";
  const installCmd = activeKey
    ? INSTALL_COMMANDS[platform](activeKey.key || "YOUR_KEY")
    : INSTALL_COMMANDS[platform]("YOUR_API_KEY");

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      {/* Welcome */}
      <section className="cm-card cm-spotlight-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"} 👋
            </h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Plan: <span className="font-mono uppercase text-[var(--accent-cyan)]">{plan}</span>
              {plan === "free" && (
                <> · <a href="/plans" className="text-[var(--accent-cyan)] hover:underline">Upgrade for more</a></>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests today</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {used}{limit !== Infinity ? `/${limit}` : ""}
          </p>
          {limit !== Infinity && (
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, backgroundColor: usagePct > 80 ? "#FF4444" : "#00FFFF" }} />
            </div>
          )}
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests this month</p>
          <p className="mt-2 text-3xl font-semibold text-white">{profile?.requests_month || 0}</p>
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Active keys</p>
          <p className="mt-2 text-3xl font-semibold text-white">{keys.filter(k => k.is_active).length}</p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">{loadingKeys ? "Loading..." : `${keys.length} total`}</p>
        </div>
      </section>

      {/* API Key */}
      <section className="cm-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="cm-label">Your API key</p>
            <p className="text-sm text-[var(--text-soft)] mt-1">Use this in your CLI install command</p>
          </div>
          {!activeKey && (
            <button onClick={handleCreateKey} disabled={creatingKey}
              className="cm-button-primary gap-2 text-sm">
              <RefreshCw size={14} className={creatingKey ? "animate-spin" : ""} />
              Generate key
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <KeyRound size={16} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-sm text-[var(--text-main)]">{maskedKey}</code>
          {activeKey && (
            <button onClick={() => handleCopy(activeKey.key || "", "apikey")}
              className="text-[var(--text-muted)] hover:text-white transition-colors">
              {copied === "apikey" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </section>

      {/* Install command */}
      <section className="cm-card p-6">
        <p className="cm-label mb-4">Install command</p>
        <div className="flex gap-2 mb-4">
          {(["linux", "windows", "mac"] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`rounded-xl px-4 py-2 text-sm font-mono transition-colors ${platform === p ? "bg-white/8 text-white" : "text-[var(--text-soft)] hover:text-white"}`}>
              {p === "linux" ? "🐧 Linux" : p === "windows" ? "🪟 Windows" : "🍎 Mac"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <Terminal size={14} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-xs text-[var(--text-main)] break-all">{installCmd}</code>
          <button onClick={() => handleCopy(installCmd, "install")}
            className="text-[var(--text-muted)] hover:text-white flex-shrink-0">
            {copied === "install" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          {platform === "linux" ? "Full pipeline: recon → hunt → Abhimanyu on Kali Linux" :
           platform === "windows" ? "AI chat mode on Windows. Use Kali for full pipeline." :
           "AI chat mode on macOS. Use Kali for full pipeline."}
        </p>
      </section>

      {/* Plan limits info */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-3">Plan limits</p>
        <div className="grid gap-2 text-sm">
          {[
            ["Daily requests", limit === Infinity ? "Unlimited" : `${limit}/day`],
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
          <a href="/plans" className="cm-button-primary mt-4 text-sm w-full justify-center">
            Upgrade plan
          </a>
        )}
      </section>
    </div>
  );
}
