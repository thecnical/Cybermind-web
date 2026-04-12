"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Accordion from "@/components/Accordion";
import { Surface } from "@/components/DesignPrimitives";
import { Check, Copy, Terminal, ArrowRight, Shield, Code2 } from "lucide-react";

// ─── CyberMind CLI — Hacking/Security (Linux/Kali primary, Windows/Mac chat-only)
const HACKING_TABS = [
  {
    id: "linux",
    label: "🐧 Linux / Kali",
    cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
    note: "Full pipeline: recon → hunt → Abhimanyu exploit mode. Kali Linux recommended.",
    features: ["20-tool recon chain", "11-tool hunt engine", "Abhimanyu exploit mode", "Omega plan mode", "AI security chat"],
  },
  {
    id: "windows-hack",
    label: "🪟 Windows",
    cmd: '$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex',
    note: "AI chat mode only on Windows. Use Kali Linux for full recon/hunt/exploit pipeline.",
    features: ["AI security chat", "CVE intel", "Payload generator", "Report writer"],
  },
  {
    id: "macos-hack",
    label: "🍎 macOS",
    cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash",
    note: "AI chat mode on macOS. Use Kali Linux VM for full offensive security pipeline.",
    features: ["AI security chat", "CVE intel", "Payload generator", "Report writer"],
  },
];

// ─── CBM Code — AI Coding Assistant (Windows + macOS)
const CBM_TABS = [
  {
    id: "windows-cbm",
    label: "🪟 Windows",
    cmd: '$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex',
    note: "PowerShell 5.1+ required. Full CBM Code support — agent mode, MCP, all AI providers.",
    features: ["Agent mode (autonomous)", "MiniMax M2.5 + 11 providers", "MCP integrations", "Project scaffolding"],
  },
  {
    id: "macos-cbm",
    label: "🍎 macOS",
    cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash",
    note: "macOS 12 Monterey or later. Full CBM Code support.",
    features: ["Agent mode (autonomous)", "MiniMax M2.5 + 11 providers", "MCP integrations", "Project scaffolding"],
  },
];

const HACKING_TROUBLESHOOT = [
  { title: "Recon/hunt tools not found on Linux", body: "Run: cybermind doctor — it auto-installs missing tools (subfinder, nuclei, nmap, etc.)." },
  { title: "Permission denied on Linux", body: "Run: chmod +x ~/.cybermind/cybermind && sudo ln -s ~/.cybermind/cybermind /usr/local/bin/cybermind" },
  { title: "Windows — only chat mode available", body: "This is expected. Full recon/hunt/exploit pipeline requires Linux. Use Kali Linux (WSL2 or VM) for the full experience." },
  { title: "API key rejected", body: "Re-copy from dashboard. Keys start with cp_live_ — no extra spaces or quotes." },
];

const CBM_TROUBLESHOOT = [
  { title: "PowerShell ExecutionPolicy error", body: "Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" },
  { title: "TUI not rendering on Windows", body: "Use Windows Terminal (not cmd.exe). Enable ANSI: Set-ItemProperty HKCU:\\Console VirtualTerminalLevel 1" },
  { title: "Command not found after install", body: "Close and reopen terminal. On macOS: source ~/.zshrc" },
  { title: "MCP servers not starting", body: "Install Node.js 16+ first: nodejs.org. MCP servers require npx." },
];

function CopyBox({ cmd, copied, onCopy }: { cmd: string; copied: boolean; onCopy: () => void }) {
  return (
    <Surface variant="skeuo" tone="cyan" elevation="low" className="flex items-center gap-3 rounded-2xl px-4 py-3.5">
      <Terminal size={14} className="text-[#00d4ff] flex-shrink-0" />
      <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">{cmd}</code>
      <button onClick={onCopy} className="flex-shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
        {copied ? <Check size={14} className="text-[#00FF88]" /> : <Copy size={14} />}
      </button>
    </Surface>
  );
}

export default function InstallPage() {
  const [hackTab, setHackTab] = useState("linux");
  const [cbmTab, setCbmTab] = useState("windows-cbm");
  const [copiedHack, setCopiedHack] = useState(false);
  const [copiedCbm, setCopiedCbm] = useState(false);

  const activeHack = HACKING_TABS.find(t => t.id === hackTab)!;
  const activeCbm  = CBM_TABS.find(t => t.id === cbmTab)!;

  function copyHack() {
    navigator.clipboard.writeText(activeHack.cmd);
    setCopiedHack(true);
    setTimeout(() => setCopiedHack(false), 2000);
  }
  function copyCbm() {
    navigator.clipboard.writeText(activeCbm.cmd);
    setCopiedCbm(true);
    setTimeout(() => setCopiedCbm(false), 2000);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-24 pt-28 md:px-8">

        {/* Hero */}
        <Surface variant="glass" tone="cyan" elevation="high" motion="hero" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
          <div className="cm-hero-beams" />
          <div className="relative">
            <p className="cm-label">Install</p>
            <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Two tools. One install command.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
              CyberMind CLI includes both the <strong className="text-white">hacking/security pipeline</strong> and
              <strong className="text-white"> CBM Code AI coding assistant</strong>. Same binary, same key.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#FF4444]/30 bg-[#FF4444]/10 px-3 py-1.5">
                <Shield size={12} className="text-[#FF4444]" />
                <span className="text-xs font-semibold text-[#FF4444]">Hacking CLI — Linux/Kali (full) + Windows/Mac (chat)</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1.5">
                <Code2 size={12} className="text-[#00d4ff]" />
                <span className="text-xs font-semibold text-[#00d4ff]">CBM Code — Windows + macOS (full AI coding)</span>
              </div>
            </div>
          </div>
        </Surface>

        {/* Step 0 — get key */}
        <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 flex-shrink-0">
              <span className="text-sm font-bold text-[#00d4ff]">0</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Get your free API key first</h2>
          </div>
          <p className="text-sm leading-7 text-[var(--text-soft)] mb-4 ml-11">
            One key works for both tools. Looks like <code className="font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1.5 py-0.5 rounded">cp_live_xxxxxxxxxxxx</code>
          </p>
          <div className="ml-11">
            <Link href="/dashboard" className="cm-button-primary text-sm gap-2 inline-flex">
              Get your key → Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </Surface>

        {/* ── SECTION 1: CyberMind CLI Hacking ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 rounded-full border border-[#FF4444]/30 bg-[#FF4444]/10 px-3 py-1.5">
              <Shield size={12} className="text-[#FF4444]" />
              <span className="text-xs font-bold text-[#FF4444] uppercase tracking-wider">CyberMind CLI — Hacking & Security</span>
            </div>
          </div>

          <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-white">Install the security CLI</h2>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Full pipeline on Linux/Kali. AI chat mode on Windows/macOS.
                </p>
              </div>
              <Link href="/docs/installation" className="hidden md:block cm-button-secondary text-sm flex-shrink-0">
                Full guide →
              </Link>
            </div>

            {/* What you get per platform */}
            <div className="mt-4 mb-5 grid gap-3 md:grid-cols-3">
              {[
                { icon: "🐧", platform: "Linux / Kali", color: "#00FF88", items: ["Recon (20 tools)", "Hunt (11 tools)", "Abhimanyu exploit", "Omega plan mode", "AI security chat"] },
                { icon: "🪟", platform: "Windows", color: "#FFD700", items: ["AI security chat", "CBM Code ✓", "CVE intel", "Payload gen", "Report writer"] },
                { icon: "🍎", platform: "macOS", color: "#FFD700", items: ["AI security chat", "CBM Code ✓", "CVE intel", "Payload gen", "Report writer"] },
              ].map(p => (
                <div key={p.platform} className="rounded-2xl border border-white/8 p-4">
                  <p className="text-sm font-semibold text-white mb-2">{p.icon} {p.platform}</p>
                  <ul className="space-y-1">
                    {p.items.map(item => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-[var(--text-soft)]">
                        <span style={{ color: p.color }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {HACKING_TABS.map(t => (
                <button key={t.id} onClick={() => setHackTab(t.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${hackTab === t.id ? "bg-[#FF4444]/15 text-[#FF4444] border border-[#FF4444]/30" : "text-[var(--text-soft)] hover:text-white border border-transparent"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <CopyBox cmd={activeHack.cmd} copied={copiedHack} onCopy={copyHack} />
            <p className="mt-2 text-xs text-[var(--text-muted)]">{activeHack.note}</p>

            {/* After install commands */}
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {[
                { label: "Verify install", cmd: "cybermind --version" },
                { label: "AI security chat", cmd: "cybermind chat" },
                { label: hackTab === "linux" ? "Start recon" : "Run diagnostics", cmd: hackTab === "linux" ? "cybermind recon -t example.com" : "cybermind doctor" },
              ].map(item => (
                <Surface key={item.label} variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1.5">{item.label}</p>
                  <code className="font-mono text-sm text-[#00FF88]">{item.cmd}</code>
                </Surface>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[var(--text-soft)] mb-3">Troubleshooting</p>
              <Accordion items={HACKING_TROUBLESHOOT} />
            </div>
          </Surface>
        </div>

        {/* ── SECTION 2: CBM Code ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1.5">
              <Code2 size={12} className="text-[#00d4ff]" />
              <span className="text-xs font-bold text-[#00d4ff] uppercase tracking-wider">CBM Code — AI Coding Assistant</span>
            </div>
          </div>

          <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-white">Launch CBM Code</h2>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Same binary — run <code className="font-mono text-[#00d4ff]">cybermind vibe</code> after install. Full support on Windows + macOS.
                </p>
              </div>
              <Link href="/docs/cbm-code" className="hidden md:block cm-button-secondary text-sm flex-shrink-0">
                CBM Code docs →
              </Link>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-3 flex-wrap mt-5">
              {CBM_TABS.map(t => (
                <button key={t.id} onClick={() => setCbmTab(t.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${cbmTab === t.id ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30" : "text-[var(--text-soft)] hover:text-white border border-transparent"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <CopyBox cmd={activeCbm.cmd} copied={copiedCbm} onCopy={copyCbm} />
            <p className="mt-2 text-xs text-[var(--text-muted)]">{activeCbm.note}</p>

            {/* After install */}
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {[
                { label: "Launch CBM Code", cmd: "cybermind vibe" },
                { label: "Security scan mode", cmd: "cybermind vibe --cyber" },
                { label: "Check providers", cmd: "cybermind vibe --providers" },
              ].map(item => (
                <Surface key={item.label} variant="skeuo" elevation="low" className="rounded-2xl px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1.5">{item.label}</p>
                  <code className="font-mono text-sm text-[#00FF88]">{item.cmd}</code>
                </Surface>
              ))}
            </div>

            {/* CBM Code features */}
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {activeCbm.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                  <span className="text-[#00d4ff]">✓</span> {f}
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[var(--text-soft)] mb-3">Troubleshooting</p>
              <Accordion items={CBM_TROUBLESHOOT} />
            </div>
          </Surface>
        </div>

        {/* Quick reference */}
        <Surface variant="skeuo" elevation="low" className="rounded-[24px] p-5">
          <p className="text-sm font-semibold text-white mb-3">Quick reference — same binary, two modes</p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            {[
              { cmd: "cybermind chat",              desc: "AI security chat (all platforms)" },
              { cmd: "cybermind recon -t TARGET",   desc: "Automated recon (Linux only)" },
              { cmd: "cybermind hunt -t TARGET",    desc: "Hunt engine (Linux only)" },
              { cmd: "cybermind vibe",              desc: "CBM Code AI coding (all platforms)" },
              { cmd: "cybermind abhimanyu",         desc: "Exploit mode (Linux, Elite plan)" },
              { cmd: "cybermind doctor",            desc: "Diagnose + fix setup issues" },
            ].map(item => (
              <div key={item.cmd} className="flex items-center gap-3 rounded-xl border border-white/8 px-3 py-2">
                <code className="font-mono text-xs text-[#00d4ff] flex-shrink-0">{item.cmd}</code>
                <span className="text-xs text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>
        </Surface>

      </main>
      <Footer />
    </div>
  );
}
