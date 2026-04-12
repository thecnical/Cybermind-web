import Link from "next/link";
import { Surface } from "@/components/DesignPrimitives";
import { CommandBar } from "@/components/SitePrimitives";

export const metadata = {
  title: "CBM Code â€” CBM Code | CyberMind Docs",
  description: "Complete guide to CBM Code â€” the AI coding assistant built into CyberMind CLI.",
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: `CBM Code (also called CBM Code) is a terminal-based AI coding assistant built into the CyberMind CLI. It is a Claude Code alternative that works on Windows, macOS, and Linux using free AI models from multiple providers.

Launch it with:`,
    command: "cybermind vibe",
    commandNote: "or: CBM Code",
  },
  {
    id: "providers",
    title: "AI Providers",
    content: `CBM Code supports 11+ AI providers. It automatically routes to the best model for your task:

Free tier (bring your own key):
â€¢ OpenRouter â€” DeepSeek R1, Qwen3 Coder, Llama 3.3 70B (free models)
â€¢ Groq â€” Kimi K2, Llama 3.3 70B (fast, free tier)
â€¢ Mistral â€” Codestral, Mistral Large
â€¢ DeepSeek â€” DeepSeek Chat, DeepSeek Coder
â€¢ Nvidia, SambaNova, Bytez

Paid tier (managed keys):
â€¢ All free tier providers
â€¢ GPT-5.4 Pro, Claude Opus 4 Thinking (Elite)
â€¢ Gemini 2.5 Flash (Elite)

Configure a provider key:`,
    command: "cybermind vibe --key YOUR_OPENROUTER_KEY --provider openrouter",
    commandNote: "Supported providers: openrouter, groq, mistral, deepseek, nvidia, sambanova, bytez",
  },
  {
    id: "edit-modes",
    title: "Edit Modes",
    content: `CBM Code has 5 edit modes that control how autonomously it edits files:

â€¢ Guard (default) â€” asks approval before every file edit and command
â€¢ AutoEdit â€” applies edits automatically, still shows diff preview
â€¢ Blueprint â€” explores codebase and presents a plan before any edits
â€¢ Autopilot â€” smart auto-approve: low-risk actions auto, high-risk asks
â€¢ Unleashed â€” executes everything without asking

Switch modes with Tab key or:`,
    command: "cybermind vibe --mode guard",
    commandNote: "Modes: guard, auto_edit, blueprint, autopilot, unleashed",
  },
  {
    id: "commands",
    title: "Slash Commands",
    content: `Type / in the CBM Code TUI to open the command menu. Key commands:

File commands:
  /init          â€” Generate CYBERMIND.md project memory
  /add <file>    â€” Add file(s) to context
  /undo          â€” Undo last file change

Session commands:
  /clear         â€” Reset context window
  /compress      â€” Compress old context to free space
  /resume        â€” Resume a previous session
  /exit          â€” End session

Mode commands:
  /mode agent    â€” Switch to agent mode (autonomous)
  /mode chat     â€” Switch to chat mode (conversational)
  /effort max    â€” Set effort level (low/medium/max)
  /model <id>    â€” Override active model

Cyber Mode commands:
  /scan          â€” Vulnerability scan of workspace
  /cve-check     â€” Check dependencies for CVEs
  /fix-vuln      â€” Fix detected vulnerability
  /audit         â€” Generate SECURITY_AUDIT.md`,
    command: null,
    commandNote: null,
  },
  {
    id: "flags",
    title: "CLI Flags",
    content: `All flags for cybermind vibe:`,
    command: "cybermind vibe --help",
    commandNote: null,
    flags: [
      ["--key <key>",           "Set API key for a provider"],
      ["--provider <name>",     "Set active provider (openrouter, groq, etc.)"],
      ["--model <model-id>",    "Override model for this session"],
      ["--theme <name>",        "UI theme: cyber (default), matrix, minimal"],
      ["--resume",              "Resume most recent session"],
      ["--no-exec",             "Disable all command execution"],
      ["--debug",               "Enable debug mode"],
      ["--whoami",              "Show current tier, provider, model, key"],
      ["--providers",           "List all configured providers"],
      ["--model-profile <p>",   "Model profile: speed, quality, balanced, free-only"],
    ],
  },
  {
    id: "cyber-mode",
    title: "Cyber Mode",
    content: `Cyber Mode activates security-focused tools and a red-accent TUI theme. Activate with:`,
    command: "cybermind vibe --cyber",
    commandNote: "or type /mode cyber inside the TUI",
    extra: `Cyber Mode features:
â€¢ /scan â€” scans all workspace files for SQL injection, hardcoded secrets, path traversal, weak crypto, XSS, command injection
â€¢ /cve-check â€” reads package.json, go.mod, requirements.txt, Cargo.toml and cross-references CVE database
â€¢ /fix-vuln â€” generates secure replacement with diff preview and plain-language explanation
â€¢ /audit â€” generates SECURITY_AUDIT.md with all findings and remediation priorities
â€¢ EthicalFilter â€” blocks prompts matching unauthorized-access/malware/DDoS patterns`,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    content: `Common issues and fixes:

No response / timeout:
  The backend may be waking up (Render free tier sleeps after 15 min).
  Wait 30 seconds and try again. The CLI shows a progress indicator.

"No AI providers configured":
  Run: cybermind vibe --key YOUR_KEY --provider openrouter
  Or set your CyberMind key: cybermind --key cp_live_xxxxx

"Auth error (401)":
  Your API key is invalid or expired. Get a new one from your provider dashboard.

"Rate limit (429)":
  You've hit the rate limit for this provider. CBM Code will automatically
  try the next provider in the chain.

TUI not rendering correctly:
  Try a different terminal. Recommended: Windows Terminal, iTerm2, or any
  terminal with ANSI escape code support.`,
    command: null,
    commandNote: null,
  },
];

export default function VibeCoderDocsPage() {
  return (
    <div className="grid gap-6">
      {/* Header */}
      <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">
            New Feature
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">CBM Code (CBM Code)</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] max-w-2xl">
          A terminal-based AI coding assistant built into CyberMind CLI. Edit files, run commands,
          and understand your entire codebase â€” powered by 11+ AI providers.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/cbm-code" className="cm-button-primary text-sm">
            Product page
          </Link>
          <Link href="/auth/register" className="cm-button-secondary text-sm">
            Get started free
          </Link>
        </div>
      </Surface>

      {/* Quick start */}
      <Surface variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <p className="cm-label">Quick start</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Get running in 2 minutes</h2>
        <div className="mt-5 grid gap-3">
          {[
            { step: "1", label: "Install CyberMind CLI", cmd: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash" },
            { step: "2", label: "Set your API key", cmd: "cybermind --key cp_live_xxxxx" },
            { step: "3", label: "Launch CBM Code", cmd: "cybermind vibe" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
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

      {/* Sections */}
      {sections.map((section) => (
        <Surface key={section.id} variant="clay" tone="default" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white" id={section.id}>{section.title}</h2>
          <div className="mt-4 text-sm leading-7 text-[var(--text-soft)] whitespace-pre-line">
            {section.content}
          </div>
          {section.command && (
            <div className="mt-4">
              <CommandBar command={section.command} variant="skeuo" tone="cyan" className="max-w-full" />
              {section.commandNote && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">{section.commandNote}</p>
              )}
            </div>
          )}
          {section.extra && (
            <div className="mt-4 text-sm leading-7 text-[var(--text-soft)] whitespace-pre-line">
              {section.extra}
            </div>
          )}
          {section.flags && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <tbody className="divide-y divide-white/5">
                  {section.flags.map(([flag, desc]) => (
                    <tr key={flag}>
                      <td className="py-2.5 pr-4 font-mono text-xs text-[#00d4ff] whitespace-nowrap">{flag}</td>
                      <td className="py-2.5 text-sm text-[var(--text-soft)]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Surface>
      ))}

      {/* Related links */}
      <Surface variant="skeuo" elevation="low" className="rounded-[24px] p-5">
        <p className="text-sm font-semibold text-white mb-3">Related</p>
        <div className="flex flex-wrap gap-3">
          {[
            ["/cbm-code", "CBM Code product page"],
            ["/plans", "Pricing & plans"],
            ["/docs/get-started", "CLI quick start"],
            ["/docs/reference/commands", "Commands reference"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-[#00d4ff] hover:underline">
              {label} â†’
            </Link>
          ))}
        </div>
      </Surface>
    </div>
  );
}
