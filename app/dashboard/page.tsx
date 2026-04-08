"use client";

import { useEffect, useState } from "react";
import { Copy, RefreshCw, Terminal, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchApiKeys, createApiKey, ApiKey, PLAN_LIMITS } from "@/lib/supabase";

const BACKEND_URL = "https://cybermind-backend-8yrt.onrender.com";

const INSTALL_COMMANDS: Record<string, (key: string) => string> = {
  linux: (k) => `curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key ${k}`,
  windows: (k) => `iwr https://cybermind.thecnical.dev/install.ps1 | iex; cybermind --key ${k}`,
  mac: (k) => `brew install cybermind; cybermind --key ${k}`,
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [platform, setPlatform] = useState<"linux" | "windows" | "mac">("linux");
  const [copied, setCopied] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  useEffect(() => {
    fetchApiKeys().then(setKeys);
  }, []);

  const activeKey = keys.find(k => k.is_active);
  const displayKey = activeKey ? `sk_live_cm_${"•".repeat(20)}` : "No active key";
  const plan = profile?.plan || "free";
  const limit = PLAN_LIMITS[plan];
  const used = profile?.requests_today || 0;

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    const key = await createApiKey("Default Key");
    if (key) {
      setKeys(prev => [key as ApiKey, ...prev]);
    }
    setCreatingKey(false);
  }

  const installCmd = activeKey
    ? INSTALL_COMMANDS[platform](activeKey.key || "YOUR_KEY")
    : INSTALL_COMMANDS[platform]("YOUR_API_KEY");

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"} 👋
        </h1>
        <p className="text-[var(--text-soft)] mt-1">
          You&apos;re on the <span className="font-mono text-[var(--accent-cyan)] uppercase">{plan}</span> plan
          {plan === "free" && <> — <a href="/plans" className="text-[var(--accent-cyan)] hover:underline">upgrade for more</a></>}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Requests Today", value: `${used}${limit !== Infinity ? `/${limit}` : ""}`, sub: limit === Infinity ? "Unlimited" : `${limit - used} remaining` },
          { label: "Requests This Month", value: profile?.requests_month || 0, sub: "All time" },
          { label: "Active Keys", value: keys.filter(k => k.is_active).length, sub: "API keys" },
        ].map(stat => (
          <div key={stat.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{stat.label}</p>
            <p className="text-3xl font-semibold text-white mt-2">{stat.value}</p>
            <p className="text-xs text-[var(--text-soft)] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* API Key */}
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Your API Key</p>
            <p className="text-sm text-[var(--text-soft)] mt-1">Use this key in your CLI install command</p>
          </div>
          {!activeKey && (
            <button onClick={handleCreateKey} disabled={creatingKey} className="flex items-center gap-2 rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-2 text-sm text-white hover:bg-[rgba(141,117,255,0.28)] disabled:opacity-50">
              <RefreshCw size={14} className={creatingKey ? "animate-spin" : ""} />
              Generate Key
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <Terminal size={16} className="text-[var(--accent-cyan)] flex-shrink-0" />
          <code className="flex-1 font-mono text-sm text-[var(--text-main)]">{displayKey}</code>
          {activeKey && (
            <button onClick={() => handleCopy(activeKey.key || "", "apikey")} className="text-[var(--text-muted)] hover:text-white transition-colors">
              {copied === "apikey" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Install command */}
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-4">Install Command</p>
        <div className="flex gap-2 mb-4">
          {(["linux", "windows", "mac"] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)} className={`rounded-xl px-4 py-2 text-sm font-mono transition-colors ${platform === p ? "bg-white/8 text-white" : "text-[var(--text-soft)] hover:text-white"}`}>
              {p === "linux" ? "🐧 Linux" : p === "windows" ? "🪟 Windows" : "🍎 Mac"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <code className="flex-1 font-mono text-xs text-[var(--text-main)] break-all">{installCmd}</code>
          <button onClick={() => handleCopy(installCmd, "install")} className="text-[var(--text-muted)] hover:text-white flex-shrink-0">
            {copied === "install" ? <Check size={16} className="text-[#00FF88]" /> : <Copy size={16} />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          {platform === "linux" ? "Run on Kali Linux for full recon + hunt + Abhimanyu pipeline" :
           platform === "windows" ? "Windows supports AI chat mode. Use Kali for full pipeline." :
           "macOS supports AI chat mode. Use Kali for full pipeline."}
        </p>
      </div>
    </div>
  );
}
