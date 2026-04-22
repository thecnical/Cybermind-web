import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What's New — CyberMind CLI v4.3.0",
  description: "OSINT Deep (45 tools), Reverse Engineering (30 tools), Breach Intelligence (HIBP + RapidAPI), Geolocation Level 1-5 (SDR). The biggest CyberMind update ever.",
};

const features = [
  {
    badge: "NEW",
    badgeColor: "#00FFFF",
    icon: "🔍",
    title: "OSINT Deep — 45 Tools, 9 Phases",
    command: "cybermind /osint-deep <target>",
    description:
      "The most comprehensive OSINT pipeline in any CLI tool. Auto-detects target type (domain/email/username/phone/company) and runs the right tools automatically. Phase 0 in /plan runs OSINT before touching the target.",
    bullets: [
      "Phase 1: subfinder, amass, dnsx, theHarvester, sublist3r, crt.sh CT logs",
      "Phase 2: holehe (120+ sites), h8mail, emailfinder, HIBP API, LeakCheck (5B+ records)",
      "Phase 3: sherlock (400+ sites), maigret (3000+ sites), socialscan, WhatsMyName",
      "Phase 4: osintgram (Instagram), twscrape (Twitter/X), instaloader, Photon crawler",
      "Phase 5: recon-ng (76 modules), spiderfoot (200+ modules), crosslinked, linkedin2username, ghunt",
      "Phase 6: phoneinfoga, geoiplookup",
      "Phase 7: exiftool GPS, metagoofil document metadata",
      "Phase 8: trufflehog (GitHub secrets), gitdorker, onionsearch, torbot, pwndb (Tor)",
      "Phase 9: nmap OSINT scripts, shodan CLI, whois, dig",
      "Breach check auto-runs on all found emails",
      "AI: complete digital footprint, attack surface, MITRE ATT&CK mapping",
    ],
    link: "/features",
    linkLabel: "See full feature list →",
  },
  {
    badge: "NEW",
    badgeColor: "#FF6600",
    icon: "⚙️",
    title: "Reverse Engineering — 30 Tools, 6 Phases",
    command: "cybermind /reveng <binary> [--mode static|dynamic|decompile|malware|mobile]",
    description:
      "Full automated RE pipeline for ELF, PE, APK, firmware, and Mach-O binaries. Static analysis, dynamic tracing, decompilation, malware detection — all in one command.",
    bullets: [
      "Phase 1: file, sha256sum, strings, readelf, objdump, exiftool",
      "Phase 2: checksec (PIE/NX/canary/RELRO), radare2, rizin, binwalk, nm, ldd, floss, diec",
      "Phase 3: strace, ltrace, gdb+pwndbg, frida-trace, QEMU user mode",
      "Phase 4: ROPgadget (ROP/JOP chains), pwntools, angr (symbolic execution), cve-bin-tool",
      "Phase 5: yara, ssdeep, clamscan (malware analysis)",
      "Phase 6: Ghidra headless, retdec (C decompile), jadx (APK→Java), apktool, r2ghidra",
      "Session persistence: saves to /tmp/cybermind_reveng_*/session.json",
      "AI: binary purpose, vulnerabilities, exploit approach, CVEs for libraries",
    ],
    link: "/features",
    linkLabel: "See full feature list →",
  },
  {
    badge: "NEW",
    badgeColor: "#FF4444",
    icon: "🔓",
    title: "Breach Intelligence — HIBP + RapidAPI + Local SQLite",
    command: "cybermind /breach <email|domain|+phone>",
    description:
      "Multi-source breach intelligence. 90% API-based (HIBP, BreachDirectory, LeakCheck) + 10% local SQLite dump fallback. WhatsApp OSINT via RapidAPI.",
    bullets: [
      "HIBP v3 — 13B+ records, breach names + data types (free tier)",
      "BreachDirectory via RapidAPI — email:password plaintext lookup",
      "LeakCheck.io — 5B+ records, free public API",
      "WhatsApp OSINT — phone → name, about, photo, business status (RapidAPI)",
      "Local SQLite indexer — handles 100M+ line dumps (streaming, 50K batch commits)",
      "cybermind /breach --setup — save RapidAPI key interactively",
      "cybermind /breach --index /dump.txt — index any breach dump",
      "Auto-integrated in /osint-deep Phase 2 — runs on all found emails",
    ],
    link: "/features",
    linkLabel: "See full feature list →",
  },
  {
    badge: "NEW",
    badgeColor: "#00FF88",
    icon: "🌍",
    title: "Geolocation — Level 1 to Level 5 (SDR)",
    command: "cybermind /locate <target>  |  cybermind /locate-advanced <target>",
    description:
      "Multi-level geolocation from basic IP lookup to advanced SDR cell tower tracking. /locate works on all OS. /locate-advanced requires Linux + SDR hardware (Pro plan).",
    bullets: [
      "Level 1: geoiplookup, ipinfo API, shodan, whois",
      "Level 2: exiftool GPS from photos, metagoofil document metadata",
      "Level 3: tshark WiFi SSID capture → wigle.net → coordinates",
      "Level 4: Creepy social geolocation, osintgram geotags",
      "Level 5 (SDR): gr-gsm passive GSM sniffing → TAC/LAC → OpenCellID GPS",
      "Level 5: srsRAN 4G/5G fake BTS, YateBTS GSM tower, SigPloit SS7 simulation",
      "Hardware: RTL-SDR ($30), HackRF One ($300), BladeRF ($420)",
      "Hardware setup guide included: cli/locate/sdr_setup.md",
    ],
    link: "/features",
    linkLabel: "See full feature list →",
  },
  {
    badge: "NEW",
    badgeColor: "#00FF88",
    icon: "🤖",
    title: "GitHub Models + Cloudflare Workers AI",
    command: "Automatic — no setup needed",
    description:
      "Two new completely free AI providers added to the fallback chain. More providers means more reliability — if one fails or rate-limits, the next one picks up instantly.",
    bullets: [
      "GitHub Models: GPT-4o, Llama 3.3 70B, DeepSeek R1, Phi-4 — 150 req/day free",
      "Cloudflare Workers AI: Llama 70B, DeepSeek R1, Qwen 72B — 10,000 neurons/day free",
      "Total: 11 providers, 50+ models in the fallback chain",
      "Sequential fallback: Groq → Cerebras → OpenRouter → GitHub → Mistral → Cloudflare → ...",
    ],
    link: "/docs/reference/providers-and-models",
    linkLabel: "See all providers →",
  },
  {
    badge: "FIX",
    badgeColor: "#FFD700",
    icon: "🔄",
    title: "Cold Start Auto-Wake",
    command: "Just send your message — CLI handles the rest",
    description:
      "The most common frustration is gone. When the backend is sleeping (Render free tier cold start), the CLI now automatically wakes it and retries your request. You never need to manually resend.",
    bullets: [
      "Shows live progress: ⟳ Backend waking up... (3s)",
      "Auto-retries after wake — no manual action needed",
      "Works on Windows, Linux, and macOS",
      "3 attempts total before showing an error",
    ],
    link: "/docs/resources/troubleshooting",
    linkLabel: "Troubleshooting guide →",
  },
  {
    badge: "SECURITY",
    badgeColor: "#FF6B6B",
    icon: "🔐",
    title: "Full Security Audit Applied",
    command: "Automatic — all fixes are live",
    description:
      "A complete end-to-end security audit was performed. Critical vulnerabilities fixed, performance improved, and new protections added.",
    bullets: [
      "SSRF protection on all URL fetching — blocks internal IP access",
      "AI output sanitization — strips leaked secrets from LLM responses",
      "Blocked device enforcement — 403 response instead of log-only",
      "Exponential backoff on API key brute force attempts",
      "GDPR data export endpoint added (/auth/export-data)",
      "SQL ambiguous column bug fixed in increment_and_check_limit",
    ],
    link: "/docs/reference/privacy-and-security",
    linkLabel: "Security posture →",
  },
];

const fullFlow = [
  { step: "1", cmd: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash", desc: "Install or update CLI" },
  { step: "2", cmd: "cybermind --key cp_live_xxxxx", desc: "Save your API key" },
  { step: "3", cmd: "cybermind /install-tools", desc: "Install all recon tools (one time)" },
  { step: "4", cmd: "cybermind /plan target.com", desc: "AI builds your attack plan" },
  { step: "5", cmd: "cybermind /recon target.com", desc: "Run full recon pipeline" },
  { step: "6", cmd: "cybermind /hunt target.com", desc: "Hunt for vulnerabilities" },
  { step: "7", cmd: "cybermind /abhimanyu target.com", desc: "Exploit confirmed vulns (Elite)" },
  { step: "8", cmd: "cybermind report", desc: "Generate pentest report" },
];

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8">

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/10 px-3 py-1 text-xs font-semibold text-[#00FFFF] uppercase tracking-wider mb-4">
            v2.5.2 — April 2026
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            What&apos;s new in CyberMind
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--text-soft)]">
            OMEGA Planning Mode, 2 new free AI providers, cold start fix, and a full security audit.
            The biggest update since launch.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/docs/modes/planning"
              className="cm-button-primary px-5 py-2.5 text-sm">
              Read planning mode docs
            </Link>
            <Link href="/install"
              className="cm-button-secondary px-5 py-2.5 text-sm">
              Update CLI
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
          <p className="cm-label text-[#8A2BE2]">Linux Full Flow</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            From install to exploitation — the complete Linux workflow
          </h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            This is the recommended order on Kali Linux using all new features.
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
            Update your CLI and run your first planning mode session.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/install" className="cm-button-primary px-6 py-2.5 text-sm">
              Update CLI
            </Link>
            <Link href="/docs/modes/planning" className="cm-button-secondary px-6 py-2.5 text-sm">
              Planning mode docs
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
