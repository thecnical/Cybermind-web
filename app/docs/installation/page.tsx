import Link from "next/link";
import { Surface } from "@/components/DesignPrimitives";
import { CommandBar } from "@/components/SitePrimitives";

export const metadata = {
  title: "Install CyberMind CLI — Windows & macOS Guide | CyberMind",
  description: "Step-by-step installation guide for CyberMind CLI on Windows (PowerShell) and macOS. Install CBM Code AI coding assistant in under 2 minutes.",
};

export default function InstallationDocsPage() {
  return (
    <div className="grid gap-6">

      {/* Header */}
      <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Installation Guide</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] max-w-2xl">
          CyberMind CLI works on <strong className="text-white">Windows</strong> and <strong className="text-white">macOS</strong>.
          Install in under 2 minutes with a single command. Your API key is passed as an environment variable — never stored in shell history.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff]">🪟 Windows 10/11</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff]">🍎 macOS 12+</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10 px-3 py-1 text-xs font-semibold text-[#00FF88]">⚡ 2 min setup</span>
        </div>
      </Surface>

      {/* Step 0: Get your key */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30">
            <span className="text-sm font-bold text-[#00d4ff]">0</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Get your API key first</h2>
        </div>
        <p className="text-sm leading-7 text-[var(--text-soft)] mb-4">
          Before installing, get your CyberMind API key from the dashboard. It looks like <code className="font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1.5 py-0.5 rounded">cp_live_xxxxxxxxxxxx</code>
        </p>
        <Link href="/dashboard" className="cm-button-primary text-sm gap-2 inline-flex">
          Get your key → Dashboard
        </Link>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Free account — no credit card required. Free month promo active until May 10, 2026.
        </p>
      </Surface>

      {/* ── WINDOWS ─────────────────────────────────────────────────────── */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🪟</span>
          <div>
            <h2 className="text-2xl font-semibold text-white">Windows Installation</h2>
            <p className="text-sm text-[var(--text-soft)]">Windows 10 / Windows 11 — PowerShell required</p>
          </div>
        </div>

        {/* Step 1 */}
        <div className="grid gap-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Open PowerShell as Administrator</h3>
              <p className="text-sm text-[var(--text-soft)] mb-3">
                Press <kbd className="font-mono text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5">Win</kbd> + <kbd className="font-mono text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5">X</kbd> → click <strong className="text-white">Windows PowerShell (Admin)</strong> or <strong className="text-white">Terminal (Admin)</strong>
              </p>
              <Surface variant="skeuo" elevation="low" className="rounded-xl p-3">
                <p className="text-xs text-[var(--text-muted)]">Verify PowerShell version (must be 5.1+):</p>
                <code className="font-mono text-sm text-[#00d4ff]">$PSVersionTable.PSVersion</code>
              </Surface>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Run the install command</h3>
              <p className="text-sm text-[var(--text-soft)] mb-3">
                Replace <code className="font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1 rounded">YOUR_KEY</code> with your actual API key from the dashboard:
              </p>
              <CommandBar
                command='$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex'
                variant="skeuo" tone="cyan" className="max-w-full"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                The key is passed as an environment variable — it never appears in your shell history or <code className="font-mono">ps aux</code> output.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Verify installation</h3>
              <p className="text-sm text-[var(--text-soft)] mb-3">After install completes, verify it works:</p>
              <div className="grid gap-2">
                <CommandBar command="cybermind --version" variant="skeuo" tone="cyan" className="max-w-full" />
                <CommandBar command="cybermind --whoami" variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00FF88]">4</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Launch CBM Code</h3>
              <p className="text-sm text-[var(--text-soft)] mb-3">
                Navigate to your project folder and launch CBM Code:
              </p>
              <div className="grid gap-2">
                <CommandBar command="cd C:\Users\YourName\my-project" variant="skeuo" tone="cyan" className="max-w-full" />
                <CommandBar command="cybermind vibe" variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
              <p className="mt-2 text-xs text-[#00FF88]">
                ✓ CBM Code will index your project and launch the interactive TUI
              </p>
            </div>
          </div>
        </div>

        {/* Windows troubleshooting */}
        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm font-semibold text-yellow-400 mb-3">⚠️ Windows Troubleshooting</p>
          <div className="grid gap-3 text-sm text-[var(--text-soft)]">
            <div>
              <p className="font-medium text-white">ExecutionPolicy error?</p>
              <p className="mt-1">Run this first, then retry the install:</p>
              <CommandBar command="Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" variant="skeuo" tone="cyan" className="max-w-full mt-1.5" />
            </div>
            <div>
              <p className="font-medium text-white">Command not found after install?</p>
              <p className="mt-1">Close and reopen PowerShell. The PATH update requires a new session.</p>
            </div>
            <div>
              <p className="font-medium text-white">Windows Defender blocks the download?</p>
              <p className="mt-1">Add an exclusion for the CyberMind install directory, or download manually from <Link href="/install" className="text-[#00d4ff] hover:underline">the install page</Link>.</p>
            </div>
          </div>
        </div>
      </Surface>

      {/* ── macOS ─────────────────────────────────────────────────────────── */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🍎</span>
          <div>
            <h2 className="text-2xl font-semibold text-white">macOS Installation</h2>
            <p className="text-sm text-[var(--text-soft)]">macOS 12 Monterey or later — Terminal required</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Open Terminal</h3>
              <p className="text-sm text-[var(--text-soft)]">
                Press <kbd className="font-mono text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5">⌘</kbd> + <kbd className="font-mono text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5">Space</kbd> → type <strong className="text-white">Terminal</strong> → Enter.
                Or use iTerm2 for a better experience.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Run the install command</h3>
              <p className="text-sm text-[var(--text-soft)] mb-3">
                Replace <code className="font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1 rounded">YOUR_KEY</code> with your API key:
              </p>
              <CommandBar
                command="CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash"
                variant="skeuo" tone="cyan" className="max-w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00d4ff]">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Verify installation</h3>
              <div className="grid gap-2">
                <CommandBar command="cybermind --version" variant="skeuo" tone="cyan" className="max-w-full" />
                <CommandBar command="cybermind --whoami" variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 mt-0.5">
              <span className="text-xs font-bold text-[#00FF88]">4</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2">Launch CBM Code</h3>
              <div className="grid gap-2">
                <CommandBar command="cd ~/my-project" variant="skeuo" tone="cyan" className="max-w-full" />
                <CommandBar command="cybermind vibe" variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* macOS troubleshooting */}
        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm font-semibold text-yellow-400 mb-3">⚠️ macOS Troubleshooting</p>
          <div className="grid gap-3 text-sm text-[var(--text-soft)]">
            <div>
              <p className="font-medium text-white">"Cannot be opened because the developer cannot be verified"?</p>
              <p className="mt-1">Go to System Settings → Privacy & Security → click "Allow Anyway" next to the cybermind binary.</p>
            </div>
            <div>
              <p className="font-medium text-white">curl not found?</p>
              <p className="mt-1">Install Xcode Command Line Tools first:</p>
              <CommandBar command="xcode-select --install" variant="skeuo" tone="cyan" className="max-w-full mt-1.5" />
            </div>
            <div>
              <p className="font-medium text-white">Command not found after install?</p>
              <p className="mt-1">Reload your shell config:</p>
              <CommandBar command="source ~/.zshrc" variant="skeuo" tone="cyan" className="max-w-full mt-1.5" />
            </div>
          </div>
        </div>
      </Surface>

      {/* ── What you can do after install ─────────────────────────────── */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white mb-5">What to do after installing</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { title: "Launch CBM Code (AI coding)", cmd: "cybermind vibe", desc: "Opens the AI coding assistant in your current directory" },
            { title: "AI chat (security mode)", cmd: "cybermind chat", desc: "Interactive AI chat with security context" },
            { title: "Check your plan & key", cmd: "cybermind --whoami", desc: "Shows your tier, provider, model, and masked key" },
            { title: "Run diagnostics", cmd: "cybermind doctor", desc: "Checks your setup and fixes common issues" },
            { title: "Security scan (CBM Code)", cmd: "cybermind vibe --cyber", desc: "Launches CBM Code in security mode" },
            { title: "Update to latest version", cmd: "cybermind update", desc: "Downloads and installs the latest release" },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-white/8 p-4">
              <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
              <CommandBar command={item.cmd} variant="skeuo" tone="cyan" className="max-w-full mb-1.5" />
              <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </Surface>

      {/* ── CBM Code quick start ───────────────────────────────────────── */}
      <Surface variant="clay" tone="accent" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">CBM Code — First session</h2>
        <p className="text-sm text-[var(--text-soft)] mb-5">
          Once CBM Code launches, here is what you will see and how to use it:
        </p>
        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/8 bg-[#030508] p-4 font-mono text-xs leading-6">
            <p className="text-[#00d4ff]">⚡ CBM Code v2.5.0  |  Workspace: ~/my-project (1,247 files)</p>
            <p className="text-[rgba(255,255,255,0.5)]">   Model: MiniMax M2.5  |  Provider: OpenRouter  |  Mode: Guard</p>
            <p className="text-white mt-2">&gt; add JWT authentication to the Express API</p>
            <p className="text-[#8A2BE2] mt-1">◆ CBM Code: Reading project structure...</p>
            <p className="text-[#00FF88]">  ✓ Found: src/routes/auth.js, src/middleware/</p>
            <p className="text-[#00FF88]">  ✓ Plan ready — 3 files to edit, 1 to create</p>
            <p className="text-[#FFD700] mt-1">  [A]pply  [S]kip  [P]review  [E]xplain</p>
          </div>
          <div className="grid gap-2 text-sm text-[var(--text-soft)]">
            <p><strong className="text-white">Type your task</strong> in plain English — CBM Code reads your codebase and makes targeted edits.</p>
            <p><strong className="text-white">Press A</strong> to apply changes, <strong className="text-white">S</strong> to skip, <strong className="text-white">P</strong> to preview the diff first.</p>
            <p><strong className="text-white">Type /</strong> to open the command menu — add files, change mode, undo, compress context.</p>
            <p><strong className="text-white">Press Tab</strong> to cycle through edit modes (Guard → AutoEdit → Blueprint → Autopilot).</p>
          </div>
        </div>
      </Surface>

      {/* Related */}
      <Surface variant="skeuo" elevation="low" className="rounded-[24px] p-5">
        <p className="text-sm font-semibold text-white mb-3">Next steps</p>
        <div className="flex flex-wrap gap-3">
          {[
            ["/docs/cbm-code", "CBM Code full guide"],
            ["/docs/cbm-code#commands", "Slash commands reference"],
            ["/docs/cbm-code#mcp", "MCP integration"],
            ["/plans", "Upgrade your plan"],
            ["/dashboard", "Get your API key"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-[#00d4ff] hover:underline">
              {label} →
            </Link>
          ))}
        </div>
      </Surface>

    </div>
  );
}
