"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Zap, Shield, Code2, RefreshCw, ExternalLink, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchLiveUsage } from "@/lib/supabase";

// Extension credits per plan
const EXTENSION_CREDITS: Record<string, { monthly: number | "Unlimited"; model: string; label: string }> = {
  free:    { monthly: 50,          model: "cybermindcli",  label: "Free" },
  starter: { monthly: 500,         model: "Pro models",    label: "Starter" },
  pro:     { monthly: 2000,        model: "Pro models",    label: "Pro" },
  elite:   { monthly: "Unlimited", model: "Claude 3.7",    label: "Elite" },
};

export default function ExtensionDashboardPage() {
  const { user, profile } = useAuth();
  const [usage, setUsage] = useState<{ requests_today: number; requests_month: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const plan = profile?.plan || "free";
  const credits = EXTENSION_CREDITS[plan] || EXTENSION_CREDITS.free;

  useEffect(() => {
    fetchLiveUsage().then(u => {
      setUsage(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Extension credits used = requests_month (shared pool)
  const creditsUsed = usage?.requests_month ?? 0;
  const creditsLimit = credits.monthly === "Unlimited" ? Infinity : credits.monthly;
  const creditsPct = creditsLimit === Infinity ? 0 : Math.min(100, (creditsUsed / creditsLimit) * 100);
  const creditsLeft = creditsLimit === Infinity ? "Unlimited" : Math.max(0, creditsLimit - creditsUsed);

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">

      {/* Header */}
      <section className="cm-card cm-spotlight-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="cm-label">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              VSCode Extension
            </h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              AI-powered security and coding assistant for Visual Studio Code
            </p>
          </div>
          <a
            href="/vscode-extension/cybermind-vscode-1.0.0.vsix"
            download
            className="cm-button-primary gap-2 text-sm flex-shrink-0"
          >
            <Download size={14} /> Download .vsix
          </a>
        </div>
      </section>

      {/* Credits usage */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="cm-card-soft p-5">
          <p className="cm-label">Credits used today</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : usage?.requests_today ?? 0}
          </p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">AI requests via extension</p>
        </div>

        <div className="cm-card-soft p-5">
          <p className="cm-label">Credits this month</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : creditsUsed}
            {creditsLimit !== Infinity && (
              <span className="text-lg text-[var(--text-soft)]">/{creditsLimit}</span>
            )}
          </p>
          {creditsLimit !== Infinity && (
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${creditsPct}%`,
                  backgroundColor: creditsPct > 80 ? "#FF4444" : "#00FFFF",
                }}
              />
            </div>
          )}
        </div>

        <div className="cm-card-soft p-5">
          <p className="cm-label">Credits remaining</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : creditsLeft === "Unlimited" ? "∞" : creditsLeft}
          </p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">
            Resets on 1st of each month
          </p>
        </div>
      </section>

      {/* Plan info */}
      <section className="cm-card-soft p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="cm-label">Your plan</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 rounded-full px-3 py-1">
                {credits.label}
              </span>
              <span className="text-sm text-[var(--text-soft)]">
                {credits.monthly === "Unlimited" ? "Unlimited" : `${credits.monthly}/month`} credits
              </span>
              <span className="text-sm text-[var(--text-soft)]">·</span>
              <span className="text-sm text-[var(--text-soft)]">Model: {credits.model}</span>
            </div>
          </div>
          {plan !== "elite" && (
            <Link href="/plans" className="cm-button-secondary text-sm gap-2">
              Upgrade for more credits <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {/* Credit limits by plan */}
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {Object.entries(EXTENSION_CREDITS).map(([p, c]) => (
            <div
              key={p}
              className={`rounded-xl border p-3 text-center ${
                p === plan
                  ? "border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <p className="text-xs font-semibold capitalize text-white">{p}</p>
              <p className="text-sm font-bold text-[var(--accent-cyan)] mt-1">
                {c.monthly === "Unlimited" ? "∞" : c.monthly}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{c.model}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install guide */}
      <section className="cm-card p-6">
        <p className="cm-label">Quick setup</p>
        <h2 className="mt-3 text-xl font-semibold text-white">Install in 3 steps</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Download .vsix",
              body: "Click the download button above to get the extension file.",
              action: (
                <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download
                  className="mt-3 flex items-center gap-1.5 text-xs text-[var(--accent-cyan)] hover:underline">
                  <Download size={12} /> Download now
                </a>
              ),
            },
            {
              n: "02",
              title: "Install in VSCode",
              body: "Extensions (Ctrl+Shift+X) → ··· menu → Install from VSIX...",
              action: null,
            },
            {
              n: "03",
              title: "Sign in with your key",
              body: "Click ⚡ in Activity Bar → Use API Key → paste your key below.",
              action: (
                <Link href="/dashboard/api-keys"
                  className="mt-3 flex items-center gap-1.5 text-xs text-[var(--accent-cyan)] hover:underline">
                  Get API key <ArrowRight size={12} />
                </Link>
              ),
            },
          ].map(step => (
            <div key={step.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-cyan)]">{step.n}</p>
              <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">{step.body}</p>
              {step.action}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 md:grid-cols-2">
        {[
          { icon: Shield, title: "Security Agent", desc: "OWASP Top 10, secrets detection, SQL injection & XSS scanning with inline diagnostics in your editor" },
          { icon: Code2, title: "8 AI Agents", desc: "Security, Code, Unit Test, Bug Fix, Explain, Refactor, Docs — each optimized for its specific task" },
          { icon: Zap, title: "Real File Editing", desc: "AI edits open a diff view — accept or reject before any file is changed. Full undo support." },
          { icon: RefreshCw, title: "Inline Completions", desc: "Ghost text suggestions as you type. Tab to accept, Esc to reject. 600ms debounce." },
        ].map(f => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="cm-card-soft p-5 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.14)] text-[var(--accent-cyan)]">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Keyboard shortcuts */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-3">Keyboard shortcuts</p>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            ["Ctrl+Shift+C", "Open Chat Panel"],
            ["Ctrl+Shift+S", "Scan File for Vulnerabilities"],
            ["Ctrl+Shift+Z", "Undo Last AI Change"],
            ["Tab", "Accept Inline Completion"],
            ["Enter", "Send Chat Message"],
            ["Shift+Enter", "New Line in Chat"],
            ["@filename", "Attach File as Context"],
            ["/agentname", "Switch Agent"],
          ].map(([key, action]) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2">
              <span className="text-xs text-[var(--text-soft)]">{action}</span>
              <code className="font-mono text-xs text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-2 py-0.5 rounded">
                {key}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-3">Resources</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/extensions" className="flex items-center gap-1.5 text-sm text-[var(--accent-cyan)] hover:underline">
            <ExternalLink size={13} /> Extension page
          </Link>
          <Link href="/docs" className="flex items-center gap-1.5 text-sm text-[var(--accent-cyan)] hover:underline">
            <ExternalLink size={13} /> Documentation
          </Link>
          <Link href="/plans" className="flex items-center gap-1.5 text-sm text-[var(--accent-cyan)] hover:underline">
            <ExternalLink size={13} /> Upgrade plan
          </Link>
          <Link href="/support" className="flex items-center gap-1.5 text-sm text-[var(--accent-cyan)] hover:underline">
            <ExternalLink size={13} /> Support
          </Link>
        </div>
      </section>

    </div>
  );
}
