import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What's New — CyberMind CLI v4.4.0",
  description:
    "v4.4.0: Four new offensive modes — /devsec, /vibe-hack, /chain, /red-team. Plus OMEGA smart target-type pipeline, isolated Python venv, brain self-learning, 12 new exploit tools, and usage monitoring.",
};

const features = [
  {
    badge: "MAJOR",
    badgeColor: "#00FFFF",
    icon: "⚡",
    title: "v4.4.0 — Four New Offensive Modes",
    command: "cybermind /devsec | /vibe-hack | /chain | /red-team",
    description: "CyberMind v4.4.0 introduces four new specialized offensive security modes: DevSec scanning, autonomous AI hacking, vulnerability chaining, and multi-day red team campaigns.",
    bullets: [
      "/devsec [Starter+] — Scan GitHub repos for secrets (trufflehog/gitleaks), SAST (semgrep), and vulnerable deps (trivy/npm audit/pip-audit)",
      "/vibe-hack [Pro+] — Autonomous AI hacking session: AI decides next attack step, streams live via SSE, saves full transcript",
      "/chain [Pro+] — Reads Brain_Memory findings and suggests multi-step exploit chains (e.g., SSRF+IDOR → PII leak) with PoC",
      "/red-team [Elite] — Structured 7-day campaign: OSINT → Phishing → Initial Access → Lateral Movement → Persistence → Report",
    ],
    link: "/features",
    linkLabel: "See all features →",
  },
  {
    badge: "MAJOR",
    badgeColor: "#00FFFF",
    icon: "🎯",
    title: "OMEGA Smart Target-Type Pipeline",
    command: "cybermind /plan <any-target>",
    description:
      "OMEGA now auto-detects what kind of target you gave it and runs the right pipeline automatically. No more manually picking modes — just give it a target and it figures out the rest.",
    bullets: [
      "Web/domain → OSINT Deep → Recon → Hunt → BizLogic → Abhimanyu → Cloud → Aegis → Report",
      "IP address → OSINT → Port scan → CVE Feed → Abhimanyu network → Report",
      "Email → Breach check (HIBP + BreachDir) → OSINT Deep → Threat Intel",
      "Phone (+91...) → WhatsApp OSINT → OSINT Deep → Locate",
      "Username/person → OSINT Deep (3000+ sites) → Breach check",
      "Company name → OSINT → Cloud misconfigs → Breach → Recon",
      "Binary/ELF/PE → RevEng (static + dynamic + decompile) → Malware scan",
      "APK file → Mobile analysis → RevEng mobile mode",
      "MD5/SHA hash → VirusTotal + MalwareBazaar + OTX threat intel",
      "Non-web targets auto-run their pipeline — web/IP continue to full OMEGA flow",
    ],
    link: "/docs/modes/planning",
    linkLabel: "Planning mode docs →",
  },
  {
    badge: "MAJOR",
    badgeColor: "#00FF88",
    icon: "🐍",
    title: "Isolated Python Venv — Zero System Pollution",
    command: "cybermind /doctor  |  sudo cybermind /plan <target>",
    description:
      "Every Python tool now installs in a fully isolated environment. No more 'externally-managed-environment' errors on Kali 2024+, Ubuntu 23+, or Debian 12+. Three-layer fallback ensures tools always install.",
    bullets: [
      "Layer 1: pipx with PIPX_BIN_DIR=/usr/local/bin — best isolation, binary auto-lands in PATH",
      "Layer 2: /opt/<toolname>-venv — dedicated venv per tool, symlinked to /usr/local/bin",
      "Layer 3: pip3 --break-system-packages — last resort for old systems only",
      "Git tools: .venv inside installDir, wrapper script uses venv python",
      "C2 tools (sliver, havoc): document-only — setup guide saved to /tmp/cybermind_c2_setup.txt",
      "installOmegaToolAlt upgraded: uses isolated venv instead of raw pip3",
      "Abhimanyu InstallTool: Python tools use venv, C2 tools skip with clear message",
      "Fixes: 'externally-managed-environment', requirements.txt conflicts, version clashes",
    ],
    link: "/docs/resources/troubleshooting",
    linkLabel: "Troubleshooting guide →",
  },
  {
    badge: "NEW",
    badgeColor: "#FF6600",
    icon: "🧠",
    title: "Brain Self-Learning Feedback Loop",
    command: "Automatic — runs after every scan",
    description:
      "The brain now learns from every single tool run. Confidence scores update in real-time. Future scans automatically prioritize tools that found things before. The system gets smarter with every target.",
    bullets: [
      "RecordToolRun() called after every recon and hunt tool — success/failure/duration tracked",
      "RecordScanComplete() after full session — bug types, tech stack, WAF vendor saved",
      "Tool confidence scores: +10-20 on success (more output = bigger boost), -5 on failure",
      "Self-model: best tools, weak tools, best vuln types, best tech targets — all updated live",
      "GetAdaptiveToolOrder() — future scans run highest-confidence tools first",
      "SelfReflect() — generates insights: success rate, avg bugs/scan, recommendations",
      "Brain memory: ~/.cybermind/brain/targets/<target>.json + self_model.json",
      "Cross-session: patterns that worked, false positives to skip, tech stack remembered",
    ],
    link: "/features",
    linkLabel: "See all features →",
  },
  {
    badge: "NEW",
    badgeColor: "#FF4444",
    icon: "⚔️",
    title: "12 New Exploit Tools in Abhimanyu",
    command: "cybermind /abhimanyu <target>  |  sudo cybermind /plan <target>",
    description:
      "Research-backed additions from 2025-2026 offensive security landscape. Every tool is real, installable, and integrated into the exploit pipeline with proper fallback args.",
    bullets: [
      "interactsh-client — OOB/blind detection: blind SSRF, blind XSS, blind RCE, Log4Shell",
      "ffuf — IDOR fuzzing (numeric IDs), auth bypass, API endpoint discovery",
      "ghauri — modern SQLi tool: WAF bypass, JSON injection, GraphQL SQLi (better than sqlmap for modern apps)",
      "puredns — 10M+ subdomains/hour, wildcard filtering, faster than amass",
      "jwt_tool — none algorithm, RS256→HS256 confusion, key injection, claim tampering",
      "cloud_enum — AWS S3, Azure blobs, GCP storage misconfigs",
      "pacu — AWS post-exploit: IAM privesc, Lambda backdoors, EC2 SSRF",
      "roadrecon — Azure AD recon: users, groups, apps, conditional access policies",
      "trufflehog — leaked AWS keys, GitHub tokens, Stripe keys in source code",
      "sliver — modern C2 framework (documented, not auto-installed)",
      "havoc — advanced C2 with AMSI/ETW bypass (documented, not auto-installed)",
      "nuclei-fuzz — fuzzing templates mode, finds logic bugs nuclei misses",
    ],
    link: "/features",
    linkLabel: "Full tool list →",
  },
  {
    badge: "NEW",
    badgeColor: "#8A2BE2",
    icon: "📊",
    title: "Backend Usage Monitoring",
    command: "GET /usage-stats  (admin only)",
    description:
      "Real-time per-user usage tracking across all API endpoints. Anomaly detection for abuse patterns. Admin dashboard endpoint for visibility into who's using what.",
    bullets: [
      "Per-user hourly/daily request counts with plan-based limits",
      "Expensive endpoints (recon/hunt/abhimanyu) count double toward daily limit",
      "Anomaly detection: hourly spikes (>3x plan limit), near-limit warnings (>80%)",
      "Scan abuse detection: free plan >3 scan jobs, starter >10 scan jobs",
      "Endpoint diversity detection: >8 different endpoints in <20 requests (scraping)",
      "/usage-stats admin endpoint: real-time per-user data, sorted by daily usage",
      "Async Supabase logging: usage_logs table (fire-and-forget, non-blocking)",
      "Wired into: chat, recon, hunt, abhimanyu, plan, cve, report, wordlist routes",
    ],
    link: "/docs/reference/privacy-and-security",
    linkLabel: "Security posture →",
  },
  {
    badge: "FIX",
    badgeColor: "#FFD700",
    icon: "🔧",
    title: "portListOrDefault + appendUniqueStr Fixes",
    command: "Automatic — fixes MSF resource script generation",
    description:
      "Two missing helper functions that were silently breaking features. portListOrDefault was referenced in abhimanyu/engine.go but never defined — MSF resource scripts were generating with empty port lists.",
    bullets: [
      "portListOrDefault() added to omega/plan.go — MSF scripts now include correct port list",
      "appendUniqueStr() added to hunt/engine.go — bug type deduplication in brain recording",
      "Both functions were referenced but undefined — silent failures now fixed",
      "go vet passes clean — zero warnings across all packages",
    ],
    link: "/what-is-new",
    linkLabel: "Full changelog →",
  },
];

const fullFlow = [
  { step: "1", cmd: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash", desc: "Install or update CLI (v4.4.0)" },
  { step: "2", cmd: "cybermind --key cp_live_xxxxx", desc: "Save your API key" },
  { step: "3", cmd: "sudo cybermind /doctor", desc: "Install ALL tools with isolated venv (one time)" },
  { step: "4", cmd: "sudo cybermind /plan target.com", desc: "OMEGA auto-detects target type + builds plan" },
  { step: "5", cmd: "sudo cybermind /recon target.com", desc: "Full recon — brain learns from every tool" },
  { step: "6", cmd: "sudo cybermind /hunt target.com", desc: "Hunt for vulnerabilities" },
  { step: "7", cmd: "cybermind /devsec https://github.com/owner/repo", desc: "DevSec scan — secrets, SAST, deps [Starter+]" },
  { step: "8", cmd: "cybermind /vibe-hack target.com", desc: "Autonomous AI hacking session [Pro+]" },
  { step: "9", cmd: "cybermind /chain target.com", desc: "Vulnerability chaining engine [Pro+]" },
  { step: "10", cmd: "sudo cybermind /abhimanyu target.com", desc: "Exploit with 12 new tools (Elite)" },
  { step: "11", cmd: "cybermind report", desc: "Generate professional pentest report" },
];

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8">

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/10 px-3 py-1 text-xs font-semibold text-[#00FFFF] uppercase tracking-wider mb-4">
            v4.4.0 — May 2026
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            What&apos;s new in CyberMind
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--text-soft)]">
            Four new offensive modes: /devsec, /vibe-hack, /chain, /red-team. Plus OMEGA smart pipeline, isolated Python venv, brain self-learning, and 12 new exploit tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/install"
              className="cm-button-primary px-5 py-2.5 text-sm">
              Update CLI
            </Link>
            <Link href="/docs/modes/planning"
              className="cm-button-secondary px-5 py-2.5 text-sm">
              OMEGA docs
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6">
          {features.map((f) => (
            <div key={f.title}
              className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${f.badgeColor}20`, color: f.badgeColor }}>
                      {f.badge}
                    </span>
                    <h2 className="text-xl font-semibold text-white">{f.title}</h2>
                  </div>
                  <code className="text-xs text-[#00FFFF] font-mono bg-white/5 px-2 py-1 rounded-lg">
                    {f.command}
                  </code>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{f.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-[var(--text-main)]">
                        <span className="text-[#00FF88] mt-0.5 flex-shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={f.link}
                    className="mt-4 inline-flex items-center text-sm text-[#00FFFF] hover:underline">
                    {f.linkLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Linux Flow */}
        <div className="mt-12 rounded-[28px] border border-[#8A2BE2]/30 bg-[radial-gradient(circle_at_top,rgba(138,43,226,0.1),transparent_50%)] p-6 md:p-8">
          <p className="cm-label text-[#8A2BE2]">Linux Full Flow — v4.4.0</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            From install to exploitation — the complete workflow
          </h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Recommended order on Kali Linux using all new features.
          </p>
          <div className="mt-6 space-y-3">
            {fullFlow.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 flex items-center justify-center text-xs font-bold text-[#8A2BE2]">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <code className="text-xs text-[#00FFFF] font-mono">{item.cmd}</code>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-[28px] border border-white/8 bg-white/[0.02] p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Ready to try it?</h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Update your CLI and run your first OMEGA smart pipeline session.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/install" className="cm-button-primary px-6 py-2.5 text-sm">
              Update CLI
            </Link>
            <Link href="/docs/modes/planning" className="cm-button-secondary px-6 py-2.5 text-sm">
              OMEGA docs
            </Link>
            <Link href="/docs/changelogs/latest" className="cm-button-secondary px-6 py-2.5 text-sm">
              Full changelog
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
