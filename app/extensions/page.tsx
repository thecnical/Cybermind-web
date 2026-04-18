"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, Download, Shield, Code2, Zap, Terminal,
  Check, ChevronDown, Star, Lock, RefreshCw, FileCode2,
  Cpu, GitBranch, Puzzle, Key
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";

const AGENTS = [
  { icon: "🔒", id: "security", name: "Security Agent", desc: "OWASP Top 10, secrets detection, SQL injection & XSS scanning with inline diagnostics", badge: "Unique", badgeColor: "#FF4444" },
  { icon: "</>", id: "code",     name: "Code Agent",     desc: "Multi-file generation, editing, and scaffolding across your entire workspace", badge: null, badgeColor: "" },
  { icon: "🧪", id: "test",     name: "Unit Test Agent", desc: "Auto-detect your test framework and generate comprehensive test suites", badge: null, badgeColor: "" },
  { icon: "🐛", id: "bugfix",   name: "Bug Fix Agent",   desc: "Root cause analysis with minimal, targeted fixes — no unnecessary refactoring", badge: null, badgeColor: "" },
  { icon: "💡", id: "explain",  name: "Explain Agent",   desc: "Plain language walkthroughs of complex code, algorithms, and design patterns", badge: null, badgeColor: "" },
  { icon: "♻️", id: "refactor", name: "Refactor Agent",  desc: "Improve structure, readability, and performance without changing behavior", badge: null, badgeColor: "" },
  { icon: "📝", id: "docs",     name: "Docs Agent",      desc: "Generate JSDoc, TSDoc, Javadoc, or godoc for all public APIs", badge: null, badgeColor: "" },
  { icon: "🤖", id: "custom",   name: "Custom Agents",   desc: "Define your own agents with custom system prompts and specialized behavior", badge: "Pro", badgeColor: "#00ffff" },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    priceNote: "forever",
    color: "border-white/10",
    highlight: false,
    features: [
      "AI chat (free models via OpenRouter)",
      "Basic code actions",
      "20 requests/day",
      "No account needed",
      "Security scanning (basic)",
    ],
    cta: "Download Free",
    ctaHref: "/vscode-extension/cybermind-vscode-1.0.0.vsix",
    ctaDownload: true,
  },
  {
    name: "Pro",
    price: "₹1,149",
    priceNote: "/month",
    color: "border-[#00ffff]/30",
    highlight: true,
    features: [
      "All 8 AI agents",
      "Inline completions (ghost text)",
      "Full security scanning + diagnostics",
      "200 requests/day",
      "Real file editing with diff view",
      "Repo indexing & @ file mentions",
      "Pro models (enhanced reasoning)",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/plans",
    ctaDownload: false,
  },
  {
    name: "Elite",
    price: "₹2,399",
    priceNote: "/month",
    color: "border-[#8A2BE2]/30",
    highlight: false,
    features: [
      "Claude 3.7 Sonnet (AWS Bedrock)",
      "Unlimited requests",
      "All Pro features",
      "Priority routing",
      "Custom agent creation",
    ],
    cta: "Go Elite",
    ctaHref: "/plans",
    ctaDownload: false,
  },
];

const SHORTCUTS = [
  ["Ctrl+Shift+C", "Open Chat Panel"],
  ["Ctrl+Shift+S", "Scan File for Vulnerabilities"],
  ["Ctrl+Shift+Z", "Undo Last AI Change"],
  ["Tab", "Accept Inline Completion"],
  ["Enter", "Send Chat Message"],
  ["Shift+Enter", "New Line in Chat"],
  ["@filename", "Attach File as Context"],
  ["/agentname", "Switch Agent"],
];

export default function ExtensionsPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Do I need an account to use the extension?",
      a: "No. The free tier uses OpenRouter's free AI models — no account or API key needed. Just install and start chatting. Sign up for a CyberMind account to unlock more requests, better models, and security scanning.",
    },
    {
      q: "How do I get my API key?",
      a: "Sign up at cybermindcli1.vercel.app → Dashboard → API Keys → Create new key → select 'VSCode Extension' as the device type. Copy the key and paste it in the extension's sign-in screen.",
    },
    {
      q: "What AI models does the extension use?",
      a: "Free tier: DeepSeek R1 and Llama 3.3 70B via OpenRouter (free, no key needed). Pro: Enhanced reasoning models via CyberMind backend. Elite: Claude 3.7 Sonnet via AWS Bedrock.",
    },
    {
      q: "Can the AI actually edit my files?",
      a: "Yes. When the AI generates code, you get Apply/Reject buttons on each code block. Clicking Apply opens a VSCode diff view — you review the change and accept or reject it. Nothing is written without your approval. Full undo support via Ctrl+Shift+Z.",
    },
    {
      q: "What makes the Security Agent unique?",
      a: "It runs OWASP Top 10 analysis, detects hardcoded secrets, SQL injection patterns, XSS vectors, and more. Findings appear as inline diagnostics (red/yellow squiggles) in your editor — just like TypeScript errors, but for security vulnerabilities.",
    },
    {
      q: "Does it work offline?",
      a: "No — the AI requires an internet connection to reach the backend. The extension itself loads offline, but chat and completions need connectivity.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070B]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 pb-24 pt-28 md:px-8">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-[36px] border border-[#00ffff]/15 bg-gradient-to-br from-[#0a0f1a] via-[#06070B] to-[#0a0a14] p-8 md:p-14">
          {/* Glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-[#00ffff]/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-64 rounded-full bg-[#8A2BE2]/10 blur-3xl" />

          <div className="relative grid gap-10 xl:grid-cols-2 xl:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00ffff]/25 bg-[#00ffff]/8 px-3 py-1.5">
                <Puzzle size={12} className="text-[#00ffff]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#00ffff]">VSCode Extension v1.0</span>
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl lg:text-6xl">
                CyberMind AI<br />
                <span className="text-[#00ffff]">for VSCode</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#999]">
                AI-powered security scanning and coding assistant. 8 specialized agents, real file editing with diff view, inline completions, and OWASP vulnerability detection — all inside VSCode.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {["Free tier", "No account needed", "OpenRouter powered"].map(t => (
                  <span key={t} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[#999]">
                    <Check size={10} className="text-[#00FF88]" /> {t}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/vscode-extension/cybermind-vscode-1.0.0.vsix"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cccc]"
                >
                  <Download size={16} /> Download .vsix — Free
                </a>
                {user ? (
                  <Link href="/dashboard/api-keys" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]">
                    Get API Key <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]">
                    Sign up free <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            {/* Extension preview mockup */}
            <div className="hidden xl:block">
              <div className="rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d0d0d] px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="ml-2 font-mono text-[10px] text-[#555]">CyberMind AI — VSCode</span>
                </div>
                {/* Chat UI mockup */}
                <div className="p-4 font-mono text-[11px] space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/8 pb-3">
                    <span className="text-[#00ffff] font-bold">⚡ CyberMind</span>
                    <span className="ml-auto text-[#444]">All Chats ▾  +  ···</span>
                  </div>
                  {/* Agent cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {[["🔒","Security","OWASP scanning"],["</>","Code","Multi-file gen"],["🧪","Unit Test","Test suites"],["🐛","Bug Fix","Root cause"]].map(([icon,name,desc]) => (
                      <div key={name} className="rounded-lg border border-white/8 bg-white/[0.03] p-2">
                        <p className="text-[#00ffff]">{icon} {name}</p>
                        <p className="text-[#555] text-[10px]">{desc}</p>
                      </div>
                    ))}
                  </div>
                  {/* Message */}
                  <div className="rounded-lg border border-white/8 bg-[#0a0a0a] p-3">
                    <p className="text-[#00ffff] text-[10px] mb-1">🔒 Security</p>
                    <p className="text-[#ccc] leading-4">Found SQL injection on line 42. Remediation: use parameterized queries...</p>
                  </div>
                  {/* Input */}
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2">
                    <span className="flex-1 text-[#444]">Ask CyberMind...</span>
                    <span className="text-[#333]">@ / </span>
                    <span className="rounded bg-[#00ffff] px-2 py-0.5 text-[10px] font-bold text-black">Send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTALL STEPS ── */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">Installation</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Up and running in 3 steps</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01", icon: Download, title: "Download .vsix",
                body: "Click the download button above to get the extension file (73 KB).",
                action: <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#00ffff] hover:underline"><Download size={12} /> Download now</a>,
              },
              {
                n: "02", icon: Puzzle, title: "Install in VSCode",
                body: "Extensions panel (Ctrl+Shift+X) → ··· menu → Install from VSIX... → select the file.",
                action: null,
              },
              {
                n: "03", icon: Key, title: "Sign in or use free",
                body: "Click ⚡ in Activity Bar → Sign In with your API key, or click Continue Free to start immediately.",
                action: user
                  ? <Link href="/dashboard/api-keys" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#00ffff] hover:underline"><Key size={12} /> Get API key</Link>
                  : <Link href="/auth/register" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#00ffff] hover:underline"><ArrowRight size={12} /> Create account</Link>,
              },
            ].map(step => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                  <div className="mb-3 inline-flex rounded-xl border border-[#00ffff]/20 bg-[#00ffff]/8 p-2.5 text-[#00ffff]">
                    <Icon size={16} />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00ffff]">{step.n}</p>
                  <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#777]">{step.body}</p>
                  {step.action}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 8 AGENTS ── */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">Agents</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">8 specialized AI agents</h2>
          <p className="mt-2 text-sm text-[#777]">Each agent has a custom system prompt optimized for its specific task. Switch instantly with the / command or agent selector.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {AGENTS.map(agent => (
              <div key={agent.id} className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-[#00ffff]/20 hover:bg-[#00ffff]/[0.03]">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{agent.icon}</span>
                  {agent.badge && (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: agent.badgeColor + '40', color: agent.badgeColor, backgroundColor: agent.badgeColor + '15' }}>
                      {agent.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">{agent.name}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#666]">{agent.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── KEY FEATURES ── */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: Shield, title: "OWASP Security Scanning", desc: "Inline diagnostics for SQL injection, XSS, hardcoded secrets, broken auth, and all OWASP Top 10 patterns. Findings appear as editor squiggles.", color: "#FF4444" },
            { icon: FileCode2, title: "Real File Editing", desc: "AI edits open a diff view — accept or reject before any file is written. Full undo stack via Ctrl+Shift+Z.", color: "#00ffff" },
            { icon: Zap, title: "Inline Completions", desc: "Ghost text suggestions as you type. 600ms debounce, Tab to accept, Esc to reject. Context-aware from current file.", color: "#FFBD2E" },
            { icon: GitBranch, title: "Repo Grokking", desc: "Indexes your entire workspace. Use @ to attach any file as context. AI understands your full codebase.", color: "#00FF88" },
            { icon: Terminal, title: "Terminal Execution", desc: "Safe commands run automatically in a dedicated terminal. Dangerous commands (rm -rf, DROP TABLE) require your confirmation.", color: "#8A2BE2" },
            { icon: Cpu, title: "Multi-Model Support", desc: "Free: OpenRouter (DeepSeek R1, Llama 3.3). Pro: CyberMind models. Elite: Claude 3.7 Sonnet via AWS Bedrock.", color: "#00ffff" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                <div className="mb-4 inline-flex rounded-xl p-2.5" style={{ backgroundColor: f.color + '15', border: `1px solid ${f.color}30` }}>
                  <Icon size={16} style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#777]">{f.desc}</p>
              </div>
            );
          })}
        </section>

        {/* ── PLANS ── */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Plans for every developer</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PLANS.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl border p-6 ${plan.color} ${plan.highlight ? 'bg-[#00ffff]/[0.03]' : 'bg-white/[0.02]'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#00ffff]/30 bg-[#00ffff]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00ffff]">
                    Most Popular
                  </div>
                )}
                <p className="text-base font-semibold text-white">{plan.name}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-[#666]">{plan.priceNote}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#888]">
                      <Check size={13} className="mt-0.5 flex-shrink-0 text-[#00FF88]" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.ctaDownload ? (
                  <a href={plan.ctaHref} download className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all ${plan.highlight ? 'bg-[#00ffff] text-black hover:bg-[#00cccc]' : 'border border-white/15 text-white hover:bg-white/[0.06]'}`}>
                    {plan.cta}
                  </a>
                ) : (
                  <Link href={plan.ctaHref} className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all ${plan.highlight ? 'bg-[#00ffff] text-black hover:bg-[#00cccc]' : 'border border-white/15 text-white hover:bg-white/[0.06]'}`}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── SHORTCUTS ── */}
        <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">Keyboard Shortcuts</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Work faster with shortcuts</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {SHORTCUTS.map(([key, action]) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
                <span className="text-sm text-[#888]">{action}</span>
                <code className="rounded-lg border border-[#00ffff]/20 bg-[#00ffff]/8 px-2.5 py-1 font-mono text-xs text-[#00ffff]">{key}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Common questions</h2>
          <div className="mt-6 space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown size={16} className={`flex-shrink-0 text-[#666] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/8 px-6 py-4">
                    <p className="text-sm leading-6 text-[#888]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-[36px] border border-[#00ffff]/15 bg-gradient-to-br from-[#0a0f1a] to-[#06070B] p-8 text-center md:p-14">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[#00ffff]/[0.03]" />
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
            Start coding with AI security superpowers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#777]">
            Free tier available — no account needed. Powered by OpenRouter free models. Upgrade anytime for more power.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download
              className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cccc]">
              <Download size={16} /> Download Free
            </a>
            <Link href="/plans"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]">
              View Plans <ArrowRight size={14} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#555]">73 KB · Works on Windows, macOS, Linux · VSCode 1.85+</p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
