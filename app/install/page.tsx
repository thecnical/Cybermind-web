"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Accordion from "@/components/Accordion";
import { Surface } from "@/components/DesignPrimitives";
import { Check, Copy, Terminal, ArrowRight } from "lucide-react";

// CBM Code is Windows + macOS only (not Linux — security recon tools are Linux-first)
const INSTALL_TABS = [
  {
    id: "windows",
    label: "🪟 Windows",
    cmd: '$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex',
    note: "PowerShell 5.1+ required. Run as Administrator for best results.",
  },
  {
    id: "macos",
    label: "🍎 macOS",
    cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash",
    note: "macOS 12 Monterey or later. Xcode Command Line Tools required.",
  },
];

const requirements = [
  "Windows 10/11 (PowerShell 5.1+) or macOS 12 Monterey or later",
  "Internet access for installer fetch and provider setup",
  "A valid CyberMind CLI API key — get yours free from the dashboard",
  "Node.js 16+ (optional — only needed for MCP server integrations)",
];

const troubleshooting = [
  {
    title: "PowerShell ExecutionPolicy error on Windows",
    body: 'Run this first, then retry: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser',
  },
  {
    title: "Windows Defender blocks the download",
    body: "Add an exclusion for the CyberMind install directory in Windows Security settings, or download the binary directly from the install page.",
  },
  {
    title: "Command not found after install",
    body: "Close and reopen your terminal. The PATH update requires a new session. On macOS, run: source ~/.zshrc",
  },
  {
    title: "My API key is rejected",
    body: "Re-copy the key from your dashboard. Make sure no extra spaces or quotes were added. Keys start with cp_live_",
  },
  {
    title: "CBM Code TUI not rendering correctly on Windows",
    body: "Use Windows Terminal (not the old cmd.exe). Enable ANSI: Set-ItemProperty HKCU:\\Console VirtualTerminalLevel 1",
  },
];

export default function InstallPage() {
  const [tab, setTab] = useState("windows");
  const [copied, setCopied] = useState(false);
  const active = INSTALL_TABS.find(t => t.id === tab)!;

  function copy() {
    navigator.clipboard.writeText(active.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
        <Surface variant="glass" tone="cyan" elevation="high" motion="hero" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
          <div className="cm-hero-beams" />
          <div className="relative">
            <p className="cm-label">Install</p>
            <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Install CyberMind CLI on Windows or macOS in under 2 minutes.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
              One command. Your API key is passed as an environment variable — never stored in shell history.
              CBM Code AI coding assistant launches immediately after install.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff]">🪟 Windows 10/11</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff]">🍎 macOS 12+</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10 px-3 py-1 text-xs font-semibold text-[#00FF88]">⚡ 2 min setup</span>
            </div>
          </div>
        </Surface>

        {/* Step 0 — get key */}
        <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 flex-shrink-0">
              <span className="text-sm font-bold text-[#00d4ff]">0</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Get your free API key first</h2>
          </div>
          <p className="text-sm leading-7 text-[var(--text-soft)] mb-4">
            Your key looks like <code className="font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1.5 py-0.5 rounded">cp_live_xxxxxxxxxxxx</code>.
            Free account — no credit card required.
          </p>
          <Link href="/dashboard" className="cm-button-primary text-sm gap-2 inline-flex">
            Get your key → Dashboard <ArrowRight size={14} />
          </Link>
        </Surface>

        {/* Install command */}
        <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <p className="cm-label">Install command</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">One command to get started</h2>
            </div>
            <Link href="/docs/installation" className="cm-button-secondary text-sm">
              Full install guide →
            </Link>
          </div>

          {/* Platform tabs */}
          <div className="flex gap-2 mb-4">
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
          <Surface variant="skeuo" tone="cyan" elevation="low" className="flex items-center gap-3 rounded-2xl px-4 py-3.5">
            <Terminal size={14} className="text-[#00d4ff] flex-shrink-0" />
            <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">
              {active.cmd}
            </code>
            <button onClick={copy} className="flex-shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
              {copied ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
            </button>
          </Surface>
          <p className="mt-2 text-xs text-[var(--text-muted)]">{active.note}</p>

          {/* After install */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { label: "Verify install", cmd: "cybermind --version" },
              { label: "Launch CBM Code", cmd: "cybermind vibe" },
              { label: "Run diagnostics", cmd: "cybermind doctor" },
            ].map(item => (
              <Surface key={item.label} variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] mb-1.5">{item.label}</p>
                <code className="font-mono text-sm text-[#00FF88]">{item.cmd}</code>
              </Surface>
            ))}
          </div>
        </Surface>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Surface variant="clay" tone="accent" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">System requirements</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Before you run the installer</h2>
            <div className="mt-6 grid gap-3">
              {requirements.map((item) => (
                <Surface key={item} variant="skeuo" elevation="low" className="rounded-2xl p-4 text-sm leading-7 text-[var(--text-soft)]">
                  {item}
                </Surface>
              ))}
            </div>
          </Surface>

          <div className="grid gap-4">
            <div>
              <p className="cm-label">Troubleshooting</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Common install issues</h2>
            </div>
            <Accordion items={troubleshooting} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
