"use client";

import Link from "next/link";
import { ArrowRight, Download, Shield, Code2, Zap, Terminal, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Surface, Reveal } from "@/components/DesignPrimitives";
import { useAuth } from "@/components/AuthProvider";

const features = [
  { icon: Shield, title: "Security Agent", desc: "OWASP Top 10, secrets detection, SQL injection & XSS scanning with inline diagnostics" },
  { icon: Code2, title: "8 AI Agents", desc: "Security, Code, Unit Test, Bug Fix, Explain, Refactor, Docs — each optimized for its task" },
  { icon: Zap, title: "Real File Editing", desc: "AI edits open a diff view — accept or reject before any file is changed" },
  { icon: Terminal, title: "Terminal Execution", desc: "Safe commands run automatically; dangerous commands require your confirmation" },
];

export default function ExtensionsPage() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
        <Surface variant="glass" tone="cyan" elevation="high" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
          <div className="cm-hero-beams" />
          <div className="relative grid gap-8 xl:grid-cols-2 xl:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-3 py-1.5">
                <span className="text-xs font-semibold text-[var(--accent-cyan)] uppercase tracking-wider">VSCode Extension</span>
              </div>
              <h1 className="cm-heading-shift mt-2 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                CyberMind AI for VSCode
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-soft)]">
                AI-powered security and coding assistant. OWASP scanning, 8 specialized agents, real file editing, and inline completions — all connected to your CyberMind account.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/vscode-extension/cybermind-vscode-1.0.0.vsix"
                  download
                  className="cm-button-primary gap-2"
                >
                  <Download size={16} /> Download .vsix
                </a>
                {user ? (
                  <Link href="/dashboard" className="cm-button-secondary gap-2">
                    Get API Key <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link href="/auth/register" className="cm-button-secondary gap-2">
                    Sign up free <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Free tier available — no account required for basic chat
              </p>
            </div>

            {/* Terminal preview */}
            <div className="hidden xl:block">
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 font-mono text-xs">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <p className="text-[#777]">CYBERMIND</p>
                  <p className="text-[#00ffff] font-bold">⚡ CyberMind AI</p>
                  <p className="text-[#777] mt-2">All Chats ▾                    ···</p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-white/10 p-2">
                      <p className="text-[#00ffff] text-[10px]">🔒 Security</p>
                      <p className="text-[#777] text-[10px]">OWASP scanning</p>
                    </div>
                    <div className="rounded-lg border border-white/10 p-2">
                      <p className="text-white text-[10px]">&lt;/&gt; Code</p>
                      <p className="text-[#777] text-[10px]">Multi-file generation</p>
                    </div>
                  </div>
                  <p className="text-[#777] mt-3">Ask CyberMind...</p>
                  <p className="text-[#777]">[@] [/] [Security ▾] [cybermindcli ▾] [➤]</p>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        {/* Features */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.04}>
                <Surface variant="glass" elevation="medium" className="cm-spotlight-card rounded-[28px] p-6">
                  <div className="mb-4 inline-flex rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.14)] p-3 text-[var(--accent-cyan)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{f.desc}</p>
                </Surface>
              </Reveal>
            );
          })}
        </section>

        {/* Install steps */}
        <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <p className="cm-label">Installation</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Install in 3 steps</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "Download .vsix", body: "Click the download button above to get the extension file." },
              { n: "02", title: "Install in VSCode", body: "Open VSCode → Extensions (Ctrl+Shift+X) → ··· menu → Install from VSIX..." },
              { n: "03", title: "Sign in", body: "Click the ⚡ icon in the Activity Bar → Sign in with your CyberMind account or API key." },
            ].map(step => (
              <div key={step.n} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-cyan)]">{step.n}</p>
                <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{step.body}</p>
              </div>
            ))}
          </div>
        </Surface>

        {/* Plan comparison */}
        <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
          <p className="cm-label">Plans</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">What you get</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Free", price: "₹0", color: "border-white/10",
                features: ["AI chat (cybermindcli model)", "Basic code actions", "20 requests/day", "No account needed"],
              },
              {
                name: "Pro", price: "₹1,149/mo", color: "border-[var(--accent-cyan)]/30",
                features: ["All 8 agents", "Inline completions", "Security scanning", "200 requests/day", "Real file editing"],
                highlight: true,
              },
              {
                name: "Elite", price: "₹2,399/mo", color: "border-[var(--accent-strong)]/30",
                features: ["Claude 3.7 Sonnet (AWS Bedrock)", "Unlimited requests", "All Pro features", "Priority routing"],
              },
            ].map(plan => (
              <div key={plan.name} className={`rounded-2xl border ${plan.color} p-5 ${plan.highlight ? 'bg-[var(--accent-cyan)]/5' : 'bg-white/[0.02]'}`}>
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                      <Check size={13} className="text-[#00FF88] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.highlight && (
                  <Link href="/plans" className="mt-4 block text-center cm-button-primary text-sm">
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Surface>

        {/* CTA */}
        <Surface variant="clay" tone="cyan" elevation="high" className="rounded-[36px] p-7 text-center md:p-10">
          <h2 className="cm-heading-shift text-4xl font-semibold tracking-[-0.05em]">
            Start using CyberMind in VSCode
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-soft)]">
            Download the extension, sign in with your existing CyberMind account, and start coding with AI security superpowers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/vscode-extension/cybermind-vscode-1.0.0.vsix" download className="cm-button-primary gap-2">
              <Download size={16} /> Download .vsix
            </a>
            <Link href="/plans" className="cm-button-secondary">View Plans</Link>
          </div>
        </Surface>

      </main>
      <Footer />
    </div>
  );
}
