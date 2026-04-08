"use client";

import { useMemo, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  installCommands,
  mockActivities,
  mockApiKeys,
  withApiKey,
} from "@/lib/mockData";

const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 200,
  elite: Number.POSITIVE_INFINITY,
};

type Platform = "linux" | "windows" | "mac";

export default function DashboardPage() {
  const { profile } = useAuth();
  const [platform, setPlatform] = useState<Platform>("linux");
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const activeKey = useMemo(
    () => mockApiKeys.find((key) => key.status === "active")?.key ?? "sk_live_cm_xxxxxxxxxxxxxxxx",
    [],
  );

  const keyMask = `${activeKey.slice(0, 10)}${"*".repeat(14)}`;
  const plan = profile?.plan ?? "free";
  const planLimit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const today = profile?.requests_today ?? 12;
  const month = profile?.requests_month ?? 188;

  const installCommand = withApiKey(installCommands[platform], activeKey);

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1400);
  }

  function regenerateMock() {
    setRegenerating(true);
    window.setTimeout(() => setRegenerating(false), 800);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <section className="cm-card cm-spotlight-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              Welcome back, {profile?.full_name ?? "Chandan Pandey"}
            </h1>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              Current plan: <span className="text-[var(--accent-cyan)] uppercase">{plan}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests today</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {today}{planLimit !== Number.POSITIVE_INFINITY ? `/${planLimit}` : ""}
          </p>
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Requests this month</p>
          <p className="mt-2 text-3xl font-semibold text-white">{month}</p>
        </div>
        <div className="cm-card-soft p-5">
          <p className="cm-label">Plan limit</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {planLimit === Number.POSITIVE_INFINITY ? "Unlimited" : `${planLimit}/day`}
          </p>
        </div>
      </section>

      <section className="cm-card cm-spotlight-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="cm-label">API key</p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Primary live key for your CLI commands</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => copy(activeKey, "key")} className="cm-button-secondary gap-2">
              {copied === "key" ? <Check size={14} /> : <Copy size={14} />}
              Copy
            </button>
            <button type="button" onClick={regenerateMock} className="cm-button-secondary gap-2" disabled={regenerating}>
              <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
              Regenerate
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white">
          <KeyRound size={16} className="text-[var(--accent-cyan)]" />
          {keyMask}
        </div>
      </section>

      <section className="cm-card p-6">
        <p className="cm-label">Quick install</p>
        <div className="mt-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {([
            ["linux", "Linux/Kali"],
            ["windows", "Windows"],
            ["mac", "macOS"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPlatform(id)}
              className={`rounded-xl px-4 py-2 text-sm transition-colors ${platform === id ? "bg-white/10 text-white" : "text-[var(--text-soft)]"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-[var(--text-main)]">{installCommand}</code>
          <button type="button" onClick={() => copy(installCommand, "install")} className="text-[var(--text-muted)] hover:text-white">
            {copied === "install" ? <Check size={16} className="text-[var(--success)]" /> : <Copy size={16} />}
          </button>
        </div>
      </section>

      <section className="cm-card p-6">
        <p className="cm-label">Recent activity</p>
        <div className="mt-4 grid gap-3">
          {mockActivities.slice(0, 5).map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{item.endpoint}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{item.timestamp}</p>
              </div>
              <span className={`cm-pill ${item.status === "success" ? "text-[var(--success)]" : item.status === "warning" ? "text-[var(--warning)]" : "text-[var(--error)]"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

