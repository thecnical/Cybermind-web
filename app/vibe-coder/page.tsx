"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  Globe,
  Shield,
  Sparkles,
  Terminal,
  Zap,
  Check,
  X,
  Copy,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Reveal, Surface } from "@/components/DesignPrimitives";

const comparisonRows = [
  { feature: "Free tier", cyber: "✓ (own keys)", claude: "✗ (paid only)", cyberGood: true, claudeGood: false },
  { feature: "Models", cyber: "11+ providers (GPT-5, DeepSeek, Qwen Coder)", claude: "Claude only", cyberGood: true, claudeGood: false },
  { feature: "Context", cyber: "128k tokens", claude: "200k tokens", cyberGood: false, claudeGood: true },
  { feature: "Platforms", cyber: "Windows + macOS + Linux", claude: "macOS + Linux", cyberGood: true, claudeGood: false },
  { feature: "Cyber Mode", cyber: "✓", claude: "✗", cyberGood: true, claudeGood: false },
  { feature: "Image Gen", cyber: "✓", claude: "✗", cyberGood: true, claudeGood: false },
  { feature: "Price", cyber: "Free / ₹85/mo", claude: "$20/mo", cyberGood: true, claudeGood: false },
];

const featureCards = [
  {
    icon: Brain,
    title: "11+ AI Providers",
    body: "GPT-5, Claude, DeepSeek, Qwen Coder, Kimi K2, Groq, Mistral, and more — all in one CLI.",
    color: "#00d4ff",
  },
  {
    icon: Shield,
    title: "Cyber Mode",
    body: "Built-in vulnerability scanner, CVE checker, and ethical filter for security-aware coding.",
    color: "#8A2BE2",
  },
  {
    icon: Zap,
    title: "Smart Router",
    body: "Auto-routes to the best model based on task complexity, cost, and context requirements.",
    color: "#00FF88",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    body: "Windows, macOS, Linux with native shell integration and platform-aware install scripts.",
    color: "#00d4ff",
  },
  {
    icon: Sparkles,
    title: "Free Tier",
    body: "Use your own API keys from OpenRouter, Groq, or any provider — no subscription required.",
    color: "#8A2BE2",
  },
  {
    icon: Code2,
    title: "Neural Knowledge Base",
    body: "27+ library docs built-in: GSAP, shadcn, Three.js, React, Next.js, and more.",
    color: "#00FF88",
  },
];

const installTabs = [
  {
    id: "linux",
    label: "Linux",
    command: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
  },
  {
    id: "windows",
    label: "Windows",
    command: "iwr https://cybermindcli1.vercel.app/install.ps1 | iex",
  },
  {
    id: "macos",
    label: "macOS",
    command: "curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Install CyberMind CLI",
    body: "Run the one-line install script for your platform. Takes under 30 seconds.",
  },
  {
    step: "02",
    title: "Add your API key",
    body: "Use OpenRouter, Groq, or any provider key — or use your CyberMind key for instant access.",
  },
  {
    step: "03",
    title: "Run cybermind vibe",
    body: "Launch the vibe coder in your project directory and let it read your codebase.",
  },
  {
    step: "04",
    title: "Start coding with AI",
    body: "File edits, terminal commands, semantic search — all from a single intelligent shell.",
  },
];

const terminalDemo = `$ cybermind vibe

  ██████╗██╗   ██╗██████╗ ███████╗██████╗
 ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
 ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝
 ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
 ╚██████╗   ██║   ██████╔╝███████╗██║  ██║
  ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝

⚡ CyberMind Neural v2.5.0 — Vibe Coder
  Workspace: ~/my-project (1,247 files indexed)
  Model: DeepSeek R1 (auto-selected)
  Provider: OpenRouter

🛡 ⟩ add JWT authentication to the Express API

◆ Neural [deepseek-r1]: Reading project structure...
  ✓ Found: src/routes/auth.js, src/middleware/
  ✓ Plan ready — 4 files to edit, 2 to create

  Changes:
  + src/middleware/jwt.js        (new)
  + src/utils/tokenHelper.js     (new)
  ~ src/routes/auth.js           (modified)
  ~ src/app.js                   (modified)

  [A]pply  [S]kip  [E]dit  [P]review

🛡 ⟩ A
  ✓ Applied 4 changes successfully
  ✓ Tests passing (12/12)`;

export default function VibeCoderPage() {
  const [activeTab, setActiveTab] = useState("linux");
  const [copied, setCopied] = useState(false);

  const activeInstall = installTabs.find((t) => t.id === activeTab)!;

  function handleCopy() {
    navigator.clipboard.writeText(activeInstall.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
        <Reveal>
          <Surface
            variant="clay"
            tone="accent"
            elevation="high"
            motion="hero"
            className="relative overflow-hidden rounded-[42px] px-6 py-12 md:px-12 md:py-16 text-center"
          >
            <div className="absolute inset-0 cm-grid-bg opacity-10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-1.5 mb-6">
                <Terminal size={12} className="text-[#00d4ff]" />
                <span className="text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">CyberMind Neural</span>
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl xl:text-7xl">
                CyberMind Neural
              </h1>
              <p className="mt-4 text-xl font-medium text-[#00d4ff] md:text-2xl">
                The AI Coding Assistant That Beats Claude Code
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                Terminal-based AI coding assistant with 11+ providers, free tier, and built-in Cyber Mode.
                Edit files, run commands, and understand your entire codebase.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Surface variant="skeuo" tone="cyan" elevation="low" className="flex items-center gap-3 rounded-2xl px-4 py-3">
                  <span className="font-mono text-sm text-[#00d4ff]">$</span>
                  <code className="font-mono text-sm text-[var(--text-main)]">cybermind vibe</code>
                </Surface>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/auth/register" className="cm-button-primary gap-2">
                  Start Free <ArrowRight size={14} />
                </Link>
                <Link href="/docs" className="cm-button-secondary">
                  View Docs
                </Link>
              </div>
            </div>
          </Surface>
        </Reveal>

        {/* Comparison Table */}
        <Reveal>
          <Surface variant="clay" tone="default" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <p className="cm-label">Why switch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              CyberMind Neural vs Claude Code
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr>
                    <th className="pb-4 text-left text-sm font-semibold text-[var(--text-soft)]">Feature</th>
                    <th className="pb-4 text-center text-sm font-semibold text-[#00d4ff]">CyberMind Neural</th>
                    <th className="pb-4 text-center text-sm font-semibold text-[var(--text-soft)]">Claude Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-3.5 text-sm text-[var(--text-main)]">{row.feature}</td>
                      <td className="py-3.5 text-center">
                        <Surface variant="skeuo" elevation="low" className="inline-block rounded-xl px-3 py-1.5">
                          <span className={`text-xs font-medium ${row.cyberGood ? "text-[#00FF88]" : "text-[var(--text-soft)]"}`}>
                            {row.cyber}
                          </span>
                        </Surface>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`text-xs ${row.claudeGood ? "text-[var(--text-main)]" : "text-[var(--text-soft)]"}`}>
                          {row.claude}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </Reveal>

        {/* Feature Cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.04}>
                <Surface variant="clay" tone="default" elevation="medium" motion="medium" className="rounded-[32px] p-6 h-full">
                  <div
                    className="inline-flex rounded-2xl p-3 mb-5"
                    style={{
                      background: `${card.color}18`,
                      border: `1px solid ${card.color}30`,
                      color: card.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{card.body}</p>
                </Surface>
              </Reveal>
            );
          })}
        </section>

        {/* Install Section */}
        <Reveal>
          <Surface variant="clay" tone="accent" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <p className="cm-label">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Install in seconds</h2>

            {/* Tabs */}
            <div className="mt-6 flex gap-2">
              {installTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30"
                      : "text-[var(--text-soft)] hover:text-white border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Command */}
            <Surface variant="skeuo" tone="cyan" elevation="low" className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="font-mono text-sm text-[#00d4ff]">$</span>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">
                {activeInstall.command}
              </code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 rounded-lg p-1.5 text-[var(--text-soft)] hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
              </button>
            </Surface>

            {/* Then steps */}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Surface variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                <p className="text-xs text-[var(--text-soft)] mb-1">Then configure your key:</p>
                <code className="font-mono text-sm text-[#00d4ff]">cybermind --key YOUR_KEY</code>
              </Surface>
              <Surface variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                <p className="text-xs text-[var(--text-soft)] mb-1">Then launch vibe coder:</p>
                <code className="font-mono text-sm text-[#00FF88]">cybermind vibe</code>
              </Surface>
            </div>
          </Surface>
        </Reveal>

        {/* How it works */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Surface variant="clay" tone="default" elevation="medium" className="rounded-[32px] p-6 md:p-8 h-full">
              <p className="cm-label">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">How it works</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
                From install to your first AI-assisted code edit in under two minutes.
              </p>
            </Surface>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {howItWorksSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.04}>
                <Surface variant="skeuo" elevation="low" motion="fast" className="rounded-2xl p-5 h-full">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#00d4ff]">{item.step}</p>
                  <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{item.body}</p>
                </Surface>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Terminal Demo */}
        <Reveal>
          <Surface variant="clay" tone="default" elevation="high" className="rounded-[36px] p-6 md:p-8">
            <p className="cm-label">Live demo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white mb-6">See it in action</h2>
            <div className="rounded-2xl border border-white/10 bg-[#050508] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-xs text-[var(--text-soft)]">cybermind vibe — ~/my-project</span>
              </div>
              <pre className="p-5 font-mono text-xs leading-6 overflow-x-auto">
                {terminalDemo.split("\n").map((line, i) => {
                  let color = "rgba(255,255,255,0.55)";
                  if (line.includes("CyberMind Neural") || line.includes("⚡")) color = "#00d4ff";
                  else if (line.includes("◆ Neural") || line.includes("██")) color = "#8A2BE2";
                  else if (line.includes("✓") || line.includes("[A]pply")) color = "#00FF88";
                  else if (line.startsWith("$") || line.includes("🛡 ⟩")) color = "rgba(255,255,255,0.9)";
                  else if (line.includes("+")) color = "#00FF88";
                  else if (line.includes("~")) color = "#00d4ff";
                  return (
                    <span key={i} style={{ color, display: "block" }}>{line}</span>
                  );
                })}
              </pre>
            </div>
          </Surface>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <Surface variant="clay" tone="cyan" elevation="high" motion="hero" className="rounded-[36px] p-7 text-center md:p-10">
            <p className="cm-label">Get started today</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Start coding with CyberMind Neural today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
              Free tier available with your own API keys. No credit card required.
              Join thousands of developers already using CyberMind Neural.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/auth/register" className="cm-button-primary gap-2">
                Start Free <ArrowRight size={16} />
              </Link>
              <Link href="/docs" className="cm-button-secondary">
                View Docs
              </Link>
            </div>
          </Surface>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
