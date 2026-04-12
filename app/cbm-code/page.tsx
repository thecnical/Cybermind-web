"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Brain, Code2, Globe, Shield, Sparkles,
  Terminal, Zap, Check, Copy, ChevronRight, Star,
  GitBranch, Layers, Cpu, Lock, FileCode, Play,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Reveal, Surface } from "@/components/DesignPrimitives";

export const metadata = {
  title: "CBM Code — AI Coding Assistant | CyberMind",
  description: "Terminal-based AI coding assistant with 11+ providers, free tier, and built-in security mode. The Claude Code alternative that works everywhere.",
};

const STATS = [
  { value: "11+", label: "AI Providers" },
  { value: "128k", label: "Context Window" },
  { value: "27+", label: "Built-in Docs" },
  { value: "Free", label: "Starter Tier" },
];

const COMPARISON = [
  { feature: "Free tier",       cbm: "Yes — bring your own keys",        claude: "No — paid only",        cbmWin: true },
  { feature: "AI providers",    cbm: "11+ (GPT-5, DeepSeek, Qwen…)",     claude: "Claude only",           cbmWin: true },
  { feature: "Context window",  cbm: "128k tokens",                       claude: "200k tokens",           cbmWin: false },
  { feature: "Windows support", cbm: "Full support",                      claude: "Not supported",         cbmWin: true },
  { feature: "Cyber / Sec mode",cbm: "Built-in",                          claude: "Not available",         cbmWin: true },
  { feature: "Image generation",cbm: "Included",                          claude: "Not available",         cbmWin: true },
  { feature: "Price",           cbm: "Free / ₹85 per month",              claude: "$20 per month",         cbmWin: true },
  { feature: "Offline models",  cbm: "Ollama support",                    claude: "Cloud only",            cbmWin: true },
];

const FEATURES = [
  {
    icon: Brain,
    title: "11+ AI Providers",
    desc: "GPT-5, DeepSeek R1, Qwen3 Coder, Kimi K2, Groq, Mistral, Gemini — all in one CLI. Auto-routes to the best model for your task.",
    accent: "#00d4ff",
    badge: "Core",
  },
  {
    icon: Shield,
    title: "Security Mode",
    desc: "Built-in vulnerability scanner, CVE checker, and ethical filter. Scan your codebase, detect secrets, fix issues — all from the terminal.",
    accent: "#8A2BE2",
    badge: "Unique",
  },
  {
    icon: Zap,
    title: "Smart Router",
    desc: "Automatically selects the fastest, cheapest model for each task. Simple questions go to Groq. Complex refactors go to DeepSeek R1.",
    accent: "#00FF88",
    badge: "AI",
  },
  {
    icon: FileCode,
    title: "27+ Library Docs",
    desc: "GSAP, shadcn/ui, Three.js, React, Next.js, Tailwind, Prisma, Supabase — all indexed and searchable from inside the session.",
    accent: "#FF6B35",
    badge: "Knowledge",
  },
  {
    icon: Layers,
    title: "5 Edit Modes",
    desc: "Guard, AutoEdit, Blueprint, Autopilot, Unleashed. From fully supervised to fully autonomous — you control how much the AI does on its own.",
    accent: "#00d4ff",
    badge: "Control",
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    desc: "Windows, macOS, Linux with native shell integration. PowerShell, bash, zsh — CBM Code adapts to your environment automatically.",
    accent: "#8A2BE2",
    badge: "Platform",
  },
];

const INSTALL_TABS = [
  { id: "linux",   label: "🐧 Linux / Kali", cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install.sh | bash" },
  { id: "windows", label: "🪟 Windows",       cmd: '$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex' },
  { id: "macos",   label: "🍎 macOS",         cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash" },
];

const WORKFLOW = [
  { n: "01", title: "Install",        desc: "One-line install script. Under 30 seconds on any platform." },
  { n: "02", title: "Set your key",   desc: "Use your CyberMind key or bring your own OpenRouter / Groq key." },
  { n: "03", title: "Run cbm code",   desc: "Launch in your project directory. CBM Code indexes your codebase instantly." },
  { n: "04", title: "Build faster",   desc: "Edit files, run commands, search semantically — all from one intelligent shell." },
];

const TERMINAL_DEMO = `$ cybermind vibe

  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗
 ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗
 ██║     ██╔══██╗██║╚██╔╝██║    ██║     ██║   ██║██║  ██║██╔══╝
 ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗
  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝

⚡ CBM Code v2.5.0  |  Workspace: ~/my-saas (2,341 files)
   Model: DeepSeek R1  |  Provider: OpenRouter  |  Mode: Guard

> add rate limiting middleware to all API routes

◆ CBM Code [deepseek-r1]: Analyzing project structure...
  ✓ Found 14 route files in src/routes/
  ✓ Detected: Express.js + existing middleware pattern
  ✓ Plan ready — 3 files to edit, 1 to create

  + src/middleware/rateLimiter.js    (new — Redis-backed, per-IP)
  ~ src/app.js                       (add middleware import + mount)
  ~ src/routes/auth.js               (tighten login limit to 5/15min)
  ~ src/routes/api.js                (add endpoint-specific limits)

  [A]pply  [S]kip  [P]review diff  [E]xplain

> A
  ✓ 4 changes applied  |  ✓ Tests: 24/24 passing  |  ✓ No regressions`;

const TESTIMONIALS = [
  { name: "Arjun S.", role: "Full-stack dev", text: "Switched from Claude Code last month. CBM Code is faster, works on Windows, and the free tier is actually usable.", stars: 5 },
  { name: "Priya M.", role: "Security engineer", text: "The Cyber Mode is insane. Scanned my entire codebase and found 3 real vulnerabilities in under 2 minutes.", stars: 5 },
  { name: "Rahul K.", role: "Indie hacker", text: "I use my own OpenRouter key so it costs me almost nothing. The smart router picks the right model automatically.", stars: 5 },
];

export default function CBMCodePage() {
  const [tab, setTab] = useState("linux");
  const [copied, setCopied] = useState(false);

  const activeCmd = INSTALL_TABS.find(t => t.id === tab)!.cmd;

  function copy() {
    navigator.clipboard.writeText(activeCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-24 pt-28 md:px-8">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="accent" elevation="high" motion="hero"
            className="relative overflow-hidden rounded-[44px] px-6 py-14 text-center md:px-14 md:py-20">
            <div className="absolute inset-0 cm-grid-bg opacity-[0.07]" />
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#00d4ff]/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-[#8A2BE2]/20 blur-[60px]" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-1.5 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="text-xs font-semibold text-[#00d4ff] uppercase tracking-widest">CBM Code — Now Available</span>
              </div>

              <h1 className="text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-8xl">
                CBM Code
              </h1>
              <p className="mt-4 text-xl font-semibold text-[#00d4ff] md:text-2xl">
                The AI Coding Assistant Built for Hackers & Builders
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                Terminal-native. 11+ AI providers. Free tier. Built-in security scanner.
                Works on Windows, macOS, and Linux. No subscription required to start.
              </p>

              {/* Stats row */}
              <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 gap-4">
                {STATS.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-[var(--text-soft)] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/auth/register" className="cm-button-primary gap-2 px-6 py-3 text-base">
                  Start Free <ArrowRight size={16} />
                </Link>
                <Link href="/docs/cbm-code" className="cm-button-secondary px-6 py-3 text-base">
                  Read Docs
                </Link>
              </div>

              {/* Command pill */}
              <div className="mt-6 flex justify-center">
                <Surface variant="skeuo" tone="cyan" elevation="low"
                  className="inline-flex items-center gap-3 rounded-2xl px-5 py-2.5">
                  <Terminal size={14} className="text-[#00d4ff]" />
                  <code className="font-mono text-sm text-white">cybermind vibe</code>
                </Surface>
              </div>
            </div>
          </Surface>
        </Reveal>

        {/* ── TERMINAL DEMO ─────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="default" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="cm-label">Live demo</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">See CBM Code in action</h2>
              </div>
              <Surface variant="skeuo" elevation="low" className="hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="text-xs text-[var(--text-soft)]">Real session</span>
              </Surface>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#030508] overflow-hidden shadow-[0_0_60px_rgba(0,212,255,0.06)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#050810]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-xs text-[var(--text-muted)]">cbm-code — ~/my-saas</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-[#00d4ff]/60">DeepSeek R1</span>
                </div>
              </div>
              <pre className="p-5 font-mono text-xs leading-[1.7] overflow-x-auto scrollbar-thin">
                {TERMINAL_DEMO.split("\n").map((line, i) => {
                  let color = "rgba(255,255,255,0.45)";
                  if (line.includes("CBM Code") && line.includes("v2")) color = "#00d4ff";
                  else if (line.includes("██") || line.includes("╗") || line.includes("╔")) color = "#00d4ff";
                  else if (line.includes("◆ CBM Code")) color = "#8A2BE2";
                  else if (line.startsWith("  ✓")) color = "#00FF88";
                  else if (line.startsWith("  +")) color = "#00FF88";
                  else if (line.startsWith("  ~")) color = "#00d4ff";
                  else if (line.startsWith(">")) color = "rgba(255,255,255,0.92)";
                  else if (line.startsWith("$")) color = "rgba(255,255,255,0.85)";
                  else if (line.includes("[A]pply")) color = "#FFD700";
                  return <span key={i} style={{ color, display: "block" }}>{line || " "}</span>;
                })}
              </pre>
            </div>
          </Surface>
        </Reveal>

        {/* ── VS COMPARISON ─────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="default" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <p className="cm-label">Why CBM Code</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              CBM Code vs Claude Code
            </h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Same agentic coding experience. More providers. Lower cost. Better platform support.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[540px]">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Feature</th>
                    <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#00d4ff]">CBM Code</th>
                    <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Claude Code</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i < COMPARISON.length - 1 ? "border-b border-white/5" : ""}>
                      <td className="py-3.5 text-sm text-[var(--text-main)]">{row.feature}</td>
                      <td className="py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium ${
                          row.cbmWin
                            ? "bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20"
                            : "bg-white/5 text-[var(--text-soft)]"
                        }`}>
                          {row.cbmWin && <Check size={11} />}
                          {row.cbm}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="text-xs text-[var(--text-muted)]">{row.claude}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </Reveal>

        {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 text-center">
            <p className="cm-label">Everything you need</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              Built for professional developers
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <Surface variant="clay" tone="default" elevation="medium" motion="medium"
                    className="group relative rounded-[32px] p-6 h-full overflow-hidden">
                    {/* Subtle glow on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]"
                      style={{ background: `radial-gradient(circle at 30% 30%, ${f.accent}08, transparent 70%)` }} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className="inline-flex rounded-2xl p-3"
                          style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25`, color: f.accent }}>
                          <Icon size={18} />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border"
                          style={{ color: f.accent, borderColor: `${f.accent}30`, background: `${f.accent}10` }}>
                          {f.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                      <p className="mt-2.5 text-sm leading-7 text-[var(--text-soft)]">{f.desc}</p>
                    </div>
                  </Surface>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="default" elevation="high" className="rounded-[36px] p-6 md:p-10">
            <div className="text-center mb-10">
              <p className="cm-label">Workflow</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                From zero to AI-assisted coding in 2 minutes
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {WORKFLOW.map((step, i) => (
                <div key={step.n} className="relative flex flex-col items-center text-center">
                  {i < WORKFLOW.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-px bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00d4ff]/30 bg-[#00d4ff]/10 mb-4">
                    <span className="font-mono text-xs font-bold text-[#00d4ff]">{step.n}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[var(--text-soft)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </Surface>
        </Reveal>

        {/* ── INSTALL ───────────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="accent" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="cm-label">Install</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                  One command to get started
                </h2>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  Your API key is passed as an environment variable — never appears in shell history.
                </p>
              </div>
              <Link href="/dashboard" className="hidden md:flex cm-button-primary gap-2 text-sm flex-shrink-0">
                Get your key <ChevronRight size={14} />
              </Link>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {INSTALL_TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tab === t.id
                      ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                      : "text-[var(--text-soft)] hover:text-white border border-transparent"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Command box */}
            <Surface variant="skeuo" tone="cyan" elevation="low"
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5">
              <Terminal size={14} className="text-[#00d4ff] flex-shrink-0" />
              <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">
                {activeCmd}
              </code>
              <button onClick={copy}
                className="flex-shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
                {copied ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
              </button>
            </Surface>

            {/* After install */}
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                { label: "Launch CBM Code", cmd: "cybermind vibe" },
                { label: "Security scan", cmd: "cybermind vibe --cyber" },
                { label: "Check version", cmd: "cybermind --version" },
              ].map(item => (
                <Surface key={item.label} variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1.5">{item.label}</p>
                  <code className="font-mono text-sm text-[#00FF88]">{item.cmd}</code>
                </Surface>
              ))}
            </div>
          </Surface>
        </Reveal>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 text-center">
            <p className="cm-label">Community</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              Loved by developers
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <Surface variant="clay" tone="default" elevation="medium" className="rounded-[28px] p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={13} className="fill-[#FFD700] text-[#FFD700]" />
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-[var(--text-soft)]">"{t.text}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#00d4ff]">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </Surface>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <Reveal>
          <Surface variant="clay" tone="cyan" elevation="high" motion="hero"
            className="relative overflow-hidden rounded-[44px] p-8 text-center md:p-14">
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-[#00d4ff]/15 blur-[60px]" />
            <div className="relative">
              <p className="cm-label">Get started today</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
                Start building with CBM Code
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                Free tier with your own API keys. No credit card required.
                Full access during our free month promo — all features, no limits.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/auth/register" className="cm-button-primary gap-2 px-7 py-3 text-base">
                  Start Free <ArrowRight size={16} />
                </Link>
                <Link href="/plans" className="cm-button-secondary px-7 py-3 text-base">
                  View Plans
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--text-muted)]">
                🎉 Free Month active — all features unlimited until May 10, 2026
              </p>
            </div>
          </Surface>
        </Reveal>

      </main>
      <Footer />
    </div>
  );
}
