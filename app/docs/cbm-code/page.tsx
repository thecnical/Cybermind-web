import Link from "next/link";
import { Surface } from "@/components/DesignPrimitives";
import { CommandBar } from "@/components/SitePrimitives";

export const metadata = {
  title: "AI Coding Assistant — Complete Guide | MCP, Models, Commands | CyberMind",
  description: "Complete guide to CyberMind AI coding assistant. MiniMax M2.5, DeepSeek R1, Qwen3 Coder support. MCP integration, slash commands, edit modes, Windows & macOS.",
};

export default function CBMCodeDocsPage() {
  return (
    <div className="grid gap-6">

      {/* Header */}
      <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">
            AI Coding Assistant
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">AI Coding Assistant — Complete Guide</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] max-w-2xl">
          Terminal-based AI coding assistant. Supports MiniMax M2.5, DeepSeek R1, Qwen3 Coder, and 11+ providers.
          Works on Windows and macOS. Free tier with your own API keys.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/extensions" className="cm-button-primary text-sm">Product page</Link>
          <Link href="/docs/installation" className="cm-button-secondary text-sm">Install guide</Link>
          <Link href="/auth/register" className="cm-button-secondary text-sm">Get started free</Link>
        </div>
      </Surface>

      {/* Quick start */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <p className="cm-label">Quick start</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Running in 2 minutes</h2>
        <div className="mt-5 grid gap-3">
          {[
            { step: "1", label: "Install CyberMind CLI (Windows)", cmd: '$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex' },
            { step: "1", label: "Install CyberMind CLI (macOS)", cmd: "CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash" },
            { step: "2", label: "Navigate to your project", cmd: "cd my-project" },
            { step: "3", label: "Launch AI Coding Assistant", cmd: "cybermind vibe" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00d4ff]/15 border border-[#00d4ff]/30 flex items-center justify-center">
                <span className="text-xs font-bold text-[#00d4ff]">{item.step}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white mb-1.5">{item.label}</p>
                <CommandBar command={item.cmd} variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
            </div>
          ))}
        </div>
      </Surface>

      {/* AI Models */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white" id="models">AI Models & Providers</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
          AI Coding Assistant auto-routes to the best model for your task. For coding tasks, it prioritizes MiniMax M2.5 and Qwen3 Coder.
          For reasoning tasks, it uses DeepSeek R1. You can override the model at any time.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/8">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Model</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Provider</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Best for</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["MiniMax M2.5", "OpenRouter", "Code generation, refactoring", "Free"],
                ["Qwen3 Coder", "OpenRouter", "Code completion, debugging", "Free"],
                ["DeepSeek R1", "OpenRouter / Groq", "Complex reasoning, architecture", "Free"],
                ["Gemma 4 31B", "OpenRouter", "General coding tasks", "Free"],
                ["Llama 3.3 70B", "Groq / OpenRouter", "Fast responses, chat", "Free"],
                ["Kimi K2", "Groq", "Long context, analysis", "Free"],
                ["GPT-5", "AICC (Elite)", "Best quality, complex tasks", "Elite plan"],
                ["Claude Opus 4", "AICC (Elite)", "Best reasoning", "Elite plan"],
              ].map(([model, provider, use, cost]) => (
                <tr key={model}>
                  <td className="py-3 font-mono text-sm text-[#00d4ff]">{model}</td>
                  <td className="py-3 text-sm text-[var(--text-soft)]">{provider}</td>
                  <td className="py-3 text-sm text-[var(--text-soft)]">{use}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cost === "Free" ? "bg-[#00FF88]/10 text-[#00FF88]" : "bg-[#8A2BE2]/10 text-[#8A2BE2]"}`}>
                      {cost}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="text-sm text-[var(--text-soft)] mb-2">Override the model for a session:</p>
          <CommandBar command="cybermind vibe --model minimax/minimax-m2.5:free --provider openrouter" variant="skeuo" tone="cyan" className="max-w-full" />
        </div>
      </Surface>

      {/* Edit Modes */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white" id="modes">Edit Modes</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
          AI Coding Assistant has 5 edit modes that control how autonomously it edits your files. Switch with <kbd className="font-mono text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5">Tab</kbd> or the <code className="font-mono text-[#00d4ff]">/mode</code> command.
        </p>
        <div className="mt-5 grid gap-3">
          {[
            { mode: "guard", desc: "Asks approval before every file edit and command. Safest — recommended for new users.", default: true },
            { mode: "auto_edit", desc: "Applies file edits automatically but still shows a diff preview. Commands still require approval." },
            { mode: "blueprint", desc: "Explores your codebase and presents a full plan before making any edits. Good for large refactors." },
            { mode: "autopilot", desc: "Smart auto-approve: low-risk actions (reads, small edits) auto-apply. High-risk actions ask." },
            { mode: "unleashed", desc: "Executes everything without asking. Maximum speed. Use only when you trust the task fully." },
          ].map(item => (
            <div key={item.mode} className="flex gap-3 rounded-2xl border border-white/8 p-4">
              <code className="font-mono text-sm text-[#00d4ff] flex-shrink-0 w-24">{item.mode}</code>
              <p className="text-sm text-[var(--text-soft)]">
                {item.desc}
                {item.default && <span className="ml-2 text-xs text-[#00FF88] font-semibold">(default)</span>}
              </p>
            </div>
          ))}
        </div>
      </Surface>

      {/* Slash Commands */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white" id="commands">Slash Commands</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
          Type <code className="font-mono text-[#00d4ff]">/</code> inside AI Coding Assistant to open the command menu. All commands:
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <tbody className="divide-y divide-white/5">
              {[
                ["/init",           "Generate CYBERMIND.md project memory file"],
                ["/add <file>",     "Add file(s) to the AI context window"],
                ["/undo",           "Undo the last file change"],
                ["/clear",          "Reset the context window (keeps files)"],
                ["/compress",       "Compress old context to free token space"],
                ["/resume",         "Resume a previous session from checkpoint"],
                ["/exit",           "End the session and save checkpoint"],
                ["/mode agent",     "Switch to agent mode (autonomous task execution)"],
                ["/mode chat",      "Switch to chat mode (conversational)"],
                ["/effort max",     "Set effort level: low / medium / max"],
                ["/model <id>",     "Override the active model for this session"],
                ["/scan",           "Vulnerability scan of all workspace files"],
                ["/cve-check",      "Check dependencies for known CVEs"],
                ["/fix-vuln",       "Fix a detected vulnerability with diff preview"],
                ["/audit",          "Generate SECURITY_AUDIT.md with all findings"],
                ["/mcp list",       "List all configured MCP servers"],
                ["/mcp enable <n>", "Enable an MCP server by name"],
              ].map(([cmd, desc]) => (
                <tr key={cmd}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-[#00d4ff] whitespace-nowrap">{cmd}</td>
                  <td className="py-2.5 text-sm text-[var(--text-soft)]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      {/* -- MCP INTEGRATION ----------------------------------------------- */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 px-3 py-1 text-xs font-semibold text-[#8A2BE2] uppercase tracking-wider">
            MCP
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white" id="mcp">MCP — Model Context Protocol</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] max-w-2xl">
          AI Coding Assistant has built-in MCP support. MCP servers extend AI Coding Assistant with external tools — GitHub, Figma, Playwright, databases, and more.
          Configure them in <code className="font-mono text-[#00d4ff]">~/.cybermind/mcp.json</code>.
        </p>

        {/* How MCP works */}
        <div className="mt-6 rounded-2xl border border-[#8A2BE2]/20 bg-[#8A2BE2]/5 p-5">
          <p className="text-sm font-semibold text-[#8A2BE2] mb-3">How MCP works in AI Coding Assistant</p>
          <div className="grid gap-2 text-sm text-[var(--text-soft)]">
            <p>1. You configure MCP servers in <code className="font-mono text-[#00d4ff]">~/.cybermind/mcp.json</code></p>
            <p>2. AI Coding Assistant starts each enabled server as a subprocess when you launch <code className="font-mono text-[#00d4ff]">cybermind vibe</code></p>
            <p>3. The AI can call MCP tools just like built-in tools (read_file, run_command, etc.)</p>
            <p>4. MCP tools appear in the AI context automatically — no extra prompting needed</p>
          </div>
        </div>

        {/* mcp.json config */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Step 1 — Create ~/.cybermind/mcp.json</h3>
          <p className="text-sm text-[var(--text-soft)] mb-3">
            Create this file at <code className="font-mono text-[#00d4ff]">~/.cybermind/mcp.json</code> (Windows: <code className="font-mono text-[#00d4ff]">C:\Users\YourName\.cybermind\mcp.json</code>):
          </p>
          <div className="rounded-2xl border border-white/8 bg-[#030508] p-4 overflow-x-auto">
            <pre className="font-mono text-xs leading-6 text-[rgba(255,255,255,0.7)]">{`{
  "servers": [
    {
      "name": "github",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "enabled": true,
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
      "enabled": true
    },
    {
      "name": "playwright",
      "command": "npx",
      "args": ["@playwright/mcp"],
      "enabled": false
    },
    {
      "name": "figma",
      "command": "npx",
      "args": ["figma-mcp"],
      "enabled": false,
      "env": {
        "FIGMA_API_KEY": "your_figma_key"
      }
    },
    {
      "name": "21st-magic-ui",
      "command": "npx",
      "args": ["@21st-dev/magic-mcp"],
      "enabled": false,
      "env": {
        "API_KEY": "your_21st_key"
      }
    }
  ]
}`}</pre>
          </div>
        </div>

        {/* Available MCP servers */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Step 2 — Install MCP server packages</h3>
          <p className="text-sm text-[var(--text-soft)] mb-3">
            MCP servers are npm packages. Install the ones you want to use (Node.js required):
          </p>
          <div className="grid gap-2">
            {[
              { name: "GitHub", pkg: "npx @modelcontextprotocol/server-github", desc: "Read/write repos, issues, PRs" },
              { name: "Filesystem", pkg: "npx @modelcontextprotocol/server-filesystem", desc: "Extended file access beyond workspace" },
              { name: "Playwright", pkg: "npx @playwright/mcp", desc: "Browser automation, web scraping" },
              { name: "Figma", pkg: "npx figma-mcp", desc: "Read Figma designs, extract components" },
              { name: "21st Magic UI", pkg: "npx @21st-dev/magic-mcp", desc: "Generate UI components from prompts" },
              { name: "Fetch", pkg: "npx @modelcontextprotocol/server-fetch", desc: "Fetch web pages into context" },
            ].map(item => (
              <div key={item.name} className="rounded-xl border border-white/8 p-3">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                </div>
                <CommandBar command={item.pkg} variant="skeuo" tone="cyan" className="max-w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Using MCP in session */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Step 3 — Use MCP tools in AI Coding Assistant</h3>
          <p className="text-sm text-[var(--text-soft)] mb-3">
            Once configured, MCP tools are available automatically. You can also manage them with slash commands:
          </p>
          <div className="grid gap-2">
            <CommandBar command="/mcp list" variant="skeuo" tone="cyan" className="max-w-full" />
            <CommandBar command="/mcp enable github" variant="skeuo" tone="cyan" className="max-w-full" />
            <CommandBar command="/mcp disable playwright" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>
          <div className="mt-4 rounded-2xl border border-white/8 bg-[#030508] p-4">
            <p className="font-mono text-xs text-[var(--text-muted)] mb-2"># Example: using GitHub MCP in a session</p>
            <p className="font-mono text-xs text-white">&gt; create a GitHub issue for the bug we just fixed in auth.js</p>
            <p className="font-mono text-xs text-[#8A2BE2] mt-1">? AI Coding Assistant: Using github.create_issue tool...</p>
            <p className="font-mono text-xs text-[#00FF88]">  ? Issue #47 created: "Fix JWT validation bypass in auth.js"</p>
          </div>
        </div>

        {/* Windows MCP note */}
        <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm font-semibold text-yellow-400 mb-2">Windows note</p>
          <p className="text-sm text-[var(--text-soft)]">
            MCP servers require Node.js on Windows. Install from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline">nodejs.org</a>.
            Use <code className="font-mono text-[#00d4ff]">node --version</code> to verify. npx comes bundled with Node.js 16+.
          </p>
        </div>
      </Surface>

      {/* CLI Flags */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white" id="flags">CLI Flags</h2>
        <p className="mt-3 text-sm text-[var(--text-soft)] mb-5">All flags for <code className="font-mono text-[#00d4ff]">cybermind vibe</code>:</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <tbody className="divide-y divide-white/5">
              {[
                ["--key <key>",           "Set API key for a provider"],
                ["--provider <name>",     "Set active provider (openrouter, groq, mistral, deepseek...)"],
                ["--model <model-id>",    "Override model for this session"],
                ["--mode <mode>",         "Edit mode: guard, auto_edit, blueprint, autopilot, unleashed"],
                ["--cyber",              "Launch in Cyber Mode (security scanner + red theme)"],
                ["--theme <name>",        "UI theme: cyber (default), matrix, minimal"],
                ["--resume",              "Resume most recent session from checkpoint"],
                ["--no-exec",             "Disable all command execution (read-only mode)"],
                ["--debug",               "Enable debug logging"],
                ["--whoami",              "Show current tier, provider, model, masked key"],
                ["--providers",           "List all configured providers and their keys"],
                ["--version",             "Show AI Coding Assistant version"],
              ].map(([flag, desc]) => (
                <tr key={flag}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-[#00d4ff] whitespace-nowrap">{flag}</td>
                  <td className="py-2.5 text-sm text-[var(--text-soft)]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      {/* Troubleshooting */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white" id="troubleshooting">Troubleshooting</h2>
        <div className="mt-5 grid gap-4 text-sm">
          {[
            {
              q: "No response / server sleeping",
              a: "The backend may be waking up (Render free tier sleeps after 15 min). Wait 30 seconds — AI Coding Assistant shows a progress bar while it wakes.",
            },
            {
              q: "\"No AI providers configured\"",
              a: "Run: cybermind vibe --key YOUR_KEY --provider openrouter\nOr set your CyberMind key: cybermind --key cp_live_xxxxx",
            },
            {
              q: "Auth error (401)",
              a: "Your API key is invalid or expired. Get a new one from your dashboard or provider.",
            },
            {
              q: "Rate limit (429)",
              a: "You hit the rate limit for this provider. AI Coding Assistant automatically tries the next provider in the chain.",
            },
            {
              q: "TUI not rendering correctly on Windows",
              a: "Use Windows Terminal (not the old cmd.exe). Enable ANSI support: Set-ItemProperty HKCU:\\Console VirtualTerminalLevel 1",
            },
            {
              q: "MCP server not starting",
              a: "Check Node.js is installed (node --version). Check the mcp.json path is correct. Run /mcp list to see status.",
            },
          ].map(item => (
            <div key={item.q} className="rounded-2xl border border-white/8 p-4">
              <p className="font-semibold text-white mb-2">{item.q}</p>
              <p className="text-[var(--text-soft)] whitespace-pre-line">{item.a}</p>
            </div>
          ))}
        </div>
      </Surface>

      {/* Related */}
      <Surface variant="skeuo" elevation="low" className="rounded-[24px] p-5">
        <p className="text-sm font-semibold text-white mb-3">Related</p>
        <div className="flex flex-wrap gap-3">
          {[
            ["/extensions", "AI Coding Assistant product page"],
            ["/docs/installation", "Installation guide"],
            ["/plans", "Pricing & plans"],
            ["/dashboard", "Get your API key"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-[#00d4ff] hover:underline">
              {label} ?
            </Link>
          ))}
        </div>
      </Surface>

    </div>
  );
}

