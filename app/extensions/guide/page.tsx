"use client";

import Link from "next/link";
import { Download, Key, Puzzle, LogIn, MessageSquare, Shield, Code2, Zap, ChevronRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";

const STEPS = [
  {
    n: "01",
    icon: Download,
    title: "Download the extension",
    color: "#00ffff",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-[#888]">Download the <code className="text-[#00ffff] bg-[#00ffff]/10 px-1.5 py-0.5 rounded">.vsix</code> file — it&apos;s 85 KB and works on Windows, macOS, and Linux.</p>
        <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download
          className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#00cccc] transition-all">
          <Download size={14} /> Download .vsix (85 KB)
        </a>
        <p className="text-xs text-[#555]">Requires VSCode 1.85+ · Works on Windows, macOS, Linux</p>
      </div>
    ),
  },
  {
    n: "02",
    icon: Puzzle,
    title: "Install in VSCode",
    color: "#8A2BE2",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-[#888]">Open VSCode and install the downloaded file:</p>
        <ol className="space-y-2">
          {[
            "Press Ctrl+Shift+X (or Cmd+Shift+X on Mac) to open Extensions",
            'Click the ··· menu (top right of Extensions panel)',
            'Select "Install from VSIX..."',
            "Choose the downloaded cybermind-vscode-1.0.0.vsix file",
            "Click Install and reload VSCode when prompted",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#888]">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2BE2]/20 text-[10px] font-bold text-[#b06aff]">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-xs text-[#555]">After install, the CyberMind ⚡ icon appears in the Activity Bar (left sidebar).</p>
      </div>
    ),
  },
  {
    n: "03",
    icon: LogIn,
    title: "Sign in (3 options)",
    color: "#00FF88",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-[#888]">Click the ⚡ icon in the Activity Bar. You&apos;ll see 3 options:</p>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#00ffff]/20 bg-[#00ffff]/5 p-4">
            <p className="text-sm font-semibold text-[#00ffff] mb-1">⚡ Sign in with CyberMind (Recommended)</p>
            <p className="text-xs text-[#888]">Click the button → your browser opens → sign in with Google or email → click "Open VSCode" → done. Your plan and credits sync automatically.</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold text-white mb-1">🔑 Use API Key</p>
            <p className="text-xs text-[#888]">Go to Dashboard → API Keys → Create new key → select "VSCode Extension" → copy the <code className="text-[#00ffff]">cp_live_...</code> key → paste it in the extension.</p>
            <Link href="/dashboard/api-keys" className="mt-2 inline-flex items-center gap-1 text-xs text-[#00ffff] hover:underline">
              Get API key <ChevronRight size={11} />
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold text-white mb-1">🆓 Continue Free (OpenRouter)</p>
            <p className="text-xs text-[#888]">No account needed. Uses free AI models via OpenRouter (DeepSeek R1, Llama 3.3, Gemma 4). Limited to free models only.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    icon: MessageSquare,
    title: "Start chatting with agents",
    color: "#FFBD2E",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-[#888]">The chat panel opens automatically. Select an agent and start typing:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "🔒", name: "Security", desc: "OWASP scanning" },
            { icon: "</>", name: "Code", desc: "Generate & edit files" },
            { icon: "🧪", name: "Unit Test", desc: "Write test suites" },
            { icon: "🐛", name: "Bug Fix", desc: "Root cause analysis" },
            { icon: "💡", name: "Explain", desc: "Understand code" },
            { icon: "♻️", name: "Refactor", desc: "Improve quality" },
          ].map(a => (
            <div key={a.name} className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
              <p className="text-xs font-semibold text-white">{a.icon} {a.name}</p>
              <p className="text-[11px] text-[#666]">{a.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#555]">
          Tip: Use <code className="text-[#00ffff]">@filename</code> to attach files as context, or <code className="text-[#00ffff]">/agentname</code> to switch agents.
        </p>
      </div>
    ),
  },
];

const FEATURES = [
  { icon: Shield, title: "Security Scanning", desc: "Right-click any file → CyberMind → Scan for vulnerabilities. Or press Ctrl+Shift+S. Findings appear as inline squiggles.", color: "#FF4444" },
  { icon: Code2, title: "Apply AI Edits", desc: "When AI generates code, click Apply on any code block. A diff view opens — review and accept or reject before anything is written.", color: "#00ffff" },
  { icon: Zap, title: "Inline Completions", desc: "Ghost text appears as you type. Press Tab to accept, Esc to reject. Toggle in Settings (Ctrl+Shift+P → CyberMind: Open Settings).", color: "#FFBD2E" },
];

export default function ExtensionGuidePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#06070B]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-28 md:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ffff]/25 bg-[#00ffff]/8 px-3 py-1.5">
            <Puzzle size={12} className="text-[#00ffff]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00ffff]">VSCode Extension</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">How to use CyberMind for VSCode</h1>
          <p className="mt-3 text-base text-[#888]">Get up and running in under 2 minutes. No configuration required.</p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{ borderColor: step.color + '30', backgroundColor: step.color + '15', color: step.color }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: step.color }}>{step.n}</p>
                    <h2 className="text-lg font-semibold text-white">{step.title}</h2>
                  </div>
                </div>
                {step.content}
              </div>
            );
          })}
        </div>

        {/* Key features */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Key features to know</h2>
          <div className="space-y-4">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: f.color + '15', border: `1px solid ${f.color}30`, color: f.color }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="mt-1 text-sm text-[#777]">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="mb-16 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Keyboard shortcuts</h2>
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
                <span className="text-sm text-[#888]">{action}</span>
                <code className="rounded-lg border border-[#00ffff]/20 bg-[#00ffff]/8 px-2 py-0.5 font-mono text-xs text-[#00ffff]">{key}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="mb-16 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <h2 className="text-xl font-semibold text-white mb-4">What each plan gets you</h2>
          <div className="space-y-3">
            {[
              { plan: "Free", color: "#00FF88", features: ["Free AI models (OpenRouter)", "Basic code actions", "20 requests/day", "No account needed"] },
              { plan: "Pro", color: "#00ffff", features: ["All 8 agents", "200 requests/day", "Pro models", "Inline completions", "Security scanning", "Real file editing"] },
              { plan: "Elite", color: "#FFBD2E", features: ["Claude 3.7 Sonnet (AWS Bedrock)", "Unlimited requests", "All Pro features", "Priority routing"] },
            ].map(p => (
              <div key={p.plan} className="flex items-start gap-3 rounded-xl border border-white/8 p-4">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded-full" style={{ color: p.color, backgroundColor: p.color + '15', border: `1px solid ${p.color}30` }}>{p.plan}</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {p.features.map(f => (
                    <span key={f} className="flex items-center gap-1 text-xs text-[#888]">
                      <Check size={10} className="text-[#00FF88]" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href="/plans" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#00ffff] hover:underline">
            View full plan comparison <ChevronRight size={13} />
          </Link>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#00ffff]/15 bg-gradient-to-br from-[#0a0f1a] to-[#06070B] p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Ready to start?</h2>
          <p className="mt-2 text-sm text-[#888]">Download the extension and start coding with AI security superpowers.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download
              className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-6 py-3 text-sm font-bold text-black hover:bg-[#00cccc] transition-all">
              <Download size={14} /> Download Free
            </a>
            {!user && (
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition-all">
                Create account <ChevronRight size={13} />
              </Link>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
