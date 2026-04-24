import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModesList from "./ModesList";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata = PAGE_META.linuxModes;

const modes = [
  // Core / Cross-platform
  {
    command: "cybermind",
    syntax: "cybermind",
    title: "AI Security Chat",
    desc: "Interactive AI security assistant. Ask anything about vulnerabilities, exploits, or security concepts.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "GPT-5, Claude, DeepSeek, Qwen3",
    category: "Core",
  },
  {
    command: "/plan",
    syntax: "sudo cybermind /plan <target>",
    title: "OMEGA Plan Mode",
    desc: "10-phase autonomous attack pipeline. Auto-detects target type (web/IP/email/phone/binary/APK) and runs the right pipeline.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "reconftw, subfinder, nuclei, sqlmap, metasploit, 50+ tools",
    category: "Core",
  },
  {
    command: "/doctor",
    syntax: "sudo cybermind /doctor",
    title: "Doctor — Tool Installer",
    desc: "Self-updates CLI binary, then installs all 80+ security tools with isolated Python venv. No more pip errors.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "apt, go install, pip3, cargo, git clone",
    category: "Core",
  },
  // Recon
  {
    command: "/recon",
    syntax: "sudo cybermind /recon <target>",
    title: "Full Recon Chain",
    desc: "20-tool recon pipeline: subdomain enum, port scan, HTTP fingerprint, directory discovery, vuln scan.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "subfinder, amass, nmap, httpx, nuclei, ffuf, feroxbuster, whatweb",
    category: "Recon",
  },
  {
    command: "/hunt",
    syntax: "sudo cybermind /hunt <target>",
    title: "Hunt Mode",
    desc: "30+ tool web vulnerability hunting pipeline: XSS, SQLi, SSRF, IDOR, SSTI, CRLF, HTTP smuggling.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "dalfox, gau, gospider, ssrfmap, tplmap, arjun, x8, corsy, kxss",
    category: "Recon",
  },
  {
    command: "/osint",
    syntax: "cybermind /osint <target>",
    title: "OSINT Deep",
    desc: "45 tools, 9 phases. Auto-detects target type: domain/email/username/phone/company.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "sherlock, maigret, holehe, spiderfoot, recon-ng, theHarvester, h8mail",
    category: "Recon",
  },
  {
    command: "/reveng",
    syntax: "cybermind /reveng <binary>",
    title: "Reverse Engineering",
    desc: "30 tools, 6 phases. Static + dynamic + decompilation + malware analysis for ELF, PE, APK, firmware.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "radare2, ghidra, gdb, frida, yara, jadx, apktool, angr, binwalk",
    category: "Recon",
  },
  // Security
  {
    command: "/abhimanyu",
    syntax: "sudo cybermind /abhimanyu <target>",
    title: "Abhimanyu Exploit Mode",
    desc: "Full exploitation pipeline with 25+ tools. JWT attacks, cloud misconfigs, C2 frameworks, post-exploitation.",
    plan: "Elite",
    planColor: "#7c3aed",
    tools: "sqlmap, metasploit, hydra, jwt_tool, pacu, roadrecon, sliver, havoc",
    category: "Security",
  },
  {
    command: "/breach",
    syntax: "cybermind /breach <email|phone>",
    title: "Breach Intelligence",
    desc: "Multi-source breach lookup: HIBP, BreachDirectory, LeakCheck. WhatsApp OSINT for phone numbers.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "HIBP API, BreachDirectory (RapidAPI), LeakCheck, local SQLite",
    category: "Security",
  },
  {
    command: "/locate",
    syntax: "cybermind /locate <target>",
    title: "Geolocation",
    desc: "Level 1-4: IP/domain, EXIF metadata, WiFi SSID, social media geotags.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "geoiplookup, exiftool, tshark, wigle.net, creepy",
    category: "Security",
  },
  {
    command: "/locate-advanced",
    syntax: "sudo cybermind /locate-advanced <phone>",
    title: "SDR Cell Tower Locate",
    desc: "Level 5: Passive GSM sniffing via SDR hardware → TAC/LAC → OpenCellID GPS coordinates.",
    plan: "Elite",
    planColor: "#7c3aed",
    tools: "gr-gsm, srsRAN, YateBTS, RTL-SDR, HackRF",
    category: "Security",
  },
  // New v4.4.0 modes
  {
    command: "/devsec",
    syntax: "cybermind /devsec <github-url|path>",
    title: "Developer Security Scanner",
    desc: "Scan GitHub repos and local paths for secrets, SAST vulnerabilities, and vulnerable dependencies.",
    plan: "Starter+",
    planColor: "#FFD700",
    tools: "trufflehog, gitleaks, semgrep, trivy, npm audit, pip-audit",
    category: "New v4.4.0",
    isNew: true,
  },
  {
    command: "/vibe-hack",
    syntax: "cybermind /vibe-hack <target>",
    title: "Real-time AI Hacking",
    desc: "Autonomous AI hacking session. AI decides the next attack step, streams live via SSE, saves full transcript.",
    plan: "Pro+",
    planColor: "#00d4ff",
    tools: "AI loop, SSE streaming, all recon/hunt/exploit tools",
    category: "New v4.4.0",
    isNew: true,
  },
  {
    command: "/chain",
    syntax: "cybermind /chain <target>",
    title: "Vulnerability Chaining Engine",
    desc: "Reads Brain_Memory findings and suggests multi-step exploit chains with PoC generation and CVSS uplift.",
    plan: "Pro+",
    planColor: "#00d4ff",
    tools: "Brain_Memory, AI chain analysis, PoC generator",
    category: "New v4.4.0",
    isNew: true,
  },
  {
    command: "/red-team",
    syntax: "cybermind /red-team <target> --duration 7d",
    title: "Multi-Day Red Team Campaign",
    desc: "Structured 7-day campaign: OSINT → Phishing → Initial Access → Lateral Movement → Persistence → Report.",
    plan: "Elite",
    planColor: "#7c3aed",
    tools: "Full OMEGA pipeline, phishing templates, C2 frameworks, PDF report",
    category: "New v4.4.0",
    isNew: true,
  },
  // Utilities
  {
    command: "/scan",
    syntax: "cybermind /scan <target>",
    title: "Network Scan",
    desc: "Native network scan — no external tools required. Works on all platforms.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "Built-in Go scanner",
    category: "Utilities",
  },
  {
    command: "/cve",
    syntax: "cybermind /cve <query>",
    title: "CVE Intelligence",
    desc: "Search and analyze CVEs from NVD. Get CVSS scores, affected versions, and remediation guidance.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "NVD API, AI analysis",
    category: "Utilities",
  },
  {
    command: "/payload",
    syntax: "cybermind /payload <type>",
    title: "AI Payload Generator",
    desc: "Generate custom payloads for XSS, SQLi, SSRF, RCE, and more. No msfvenom required.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "AI generation, WAF bypass variants",
    category: "Utilities",
  },
  {
    command: "/wordlist",
    syntax: "cybermind /wordlist <context>",
    title: "Custom Wordlist Generator",
    desc: "Generate context-aware wordlists for directory fuzzing, password attacks, and parameter discovery.",
    plan: "Free",
    planColor: "#8b949e",
    tools: "AI generation, SecLists integration",
    category: "Utilities",
  },
  {
    command: "report",
    syntax: "cybermind report",
    title: "Bug Bounty Report",
    desc: "Auto-generate professional pentest/bug bounty report from all findings. HackerOne-ready template.",
    plan: "Pro+",
    planColor: "#00d4ff",
    tools: "AI report generation, PDF export (Elite)",
    category: "Utilities",
  },
];

const categories = ["New v4.4.0", "Core", "Recon", "Security", "Utilities"];

export default function LinuxModesPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0" }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 20px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,255,255,0.08)",
            border: "1px solid rgba(0,255,255,0.2)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 12,
            color: "#00FFFF",
            marginBottom: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}>
            v4.4.0
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #ffffff 0%, #00FFFF 50%, #8A2BE2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Linux Modes
          </h1>
          <p style={{ color: "#8b949e", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Every CLI mode available on Linux — from free AI chat to Elite red team campaigns.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            {[
              { label: "Free", color: "#8b949e" },
              { label: "Starter+", color: "#FFD700" },
              { label: "Pro+", color: "#00d4ff" },
              { label: "Elite", color: "#7c3aed" },
            ].map((tier) => (
              <span key={tier.label} style={{
                background: `${tier.color}15`,
                border: `1px solid ${tier.color}40`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                color: tier.color,
                fontWeight: 600,
              }}>
                {tier.label}
              </span>
            ))}
          </div>
        </div>

        {/* Modes by category */}
        <ModesList modes={modes} categories={categories} />

        {/* CTA */}
        <div style={{
          textAlign: "center",
          background: "rgba(0,255,255,0.03)",
          border: "1px solid rgba(0,255,255,0.1)",
          borderRadius: 20,
          padding: "40px 32px",
        }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
            Ready to get started?
          </h2>
          <p style={{ color: "#8b949e", fontSize: 15, margin: "0 0 24px" }}>
            Install CyberMind CLI and run your first scan in under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/install" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #00FFFF, #8A2BE2)",
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}>
              Install CLI →
            </Link>
            <Link href="/plans" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}>
              View Plans
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
