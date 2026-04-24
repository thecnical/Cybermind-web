import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";
import NewModesGrid from "./NewModesGrid";

export const metadata: Metadata = PAGE_META.features;

const page = {
  title: "Features",
  eyebrow: "Full Capabilities",
  description:
    "CyberMind CLI — AI-powered offensive security CLI with OMEGA plan mode, 50+ tool recon/hunt pipeline, auto PoC generation, HackerOne integration, VSCode AI extension, and full Linux hacking workflow.",
  command: "sudo cybermind /plan --auto-target --focus idor,xss",
  sections: [
    {
      title: "OMEGA Plan Mode — 10-Phase Autonomous Attack Pipeline",
      body:
        "The most powerful feature: give CyberMind a target and it runs a complete 10-phase attack pipeline autonomously. No manual steps. Runs for hours if needed.",
      bullets: [
        "Phase 1: Passive OSINT — whois, theHarvester, dig, shodan CLI, h8mail (breach data), exiftool (metadata), metagoofil (document harvest), spiderfoot (200+ OSINT modules), recon-ng",
        "Phase 2: Subdomain Enum — reconftw -a --deep --parallel (6h exhaustive), subfinder, amass, dnsx",
        "Phase 3: Port Scan — rustscan (all 65535 ports), nmap vuln scripts, masscan, naabu",
        "Phase 4: HTTP Fingerprint — httpx (500 threads), whatweb, tlsx (JA3), wafw00f",
        "Phase 5: Directory Discovery — ffuf (recursive depth 4), feroxbuster, gobuster",
        "Phase 6: Vuln Scan — nuclei (ALL templates, all severities), nikto, crlfuzz, sstimap",
        "Phase 7: Hunt Mode — 30+ tools: dalfox, kxss, bxss, ssrfmap, smuggler, corsy, arjun, x8",
        "Phase 8: Secret Hunting — trufflehog, mantra, subjs, cariddi, gitxray",
        "Phase 9: JWT + GraphQL — jwt_tool (all attacks), graphw00f (schema dump)",
        "Phase 10: Exploitation — sqlmap, commix, wpscan, hydra, tplmap, liffy, nosqlmap",
      ],
    },
    {
      title: "HackerOne Integration + Auto-Target Selection",
      body:
        "CyberMind connects to HackerOne to find the best bug bounty targets for you. No more manual research.",
      bullets: [
        "cybermind /plan --auto-target — AI selects best program with wide scope",
        "cybermind /plan --auto-target --skill beginner --focus xss — beginner-friendly XSS targets",
        "cybermind /plan shopify.com --focus idor,ssrf — focus on specific bug types",
        "Curated programs: Shopify, GitLab, GitHub, Uber, Twitter, PayPal, Mozilla and more",
        "Shows scope, min/max bounty, best bug types, and why each target is good right now",
      ],
    },
    {
      title: "Auto Bug Detection + PoC Generation",
      body:
        "When a vulnerability is confirmed, CyberMind automatically generates a complete Proof-of-Concept and bug bounty report.",
      bullets: [
        "Parses nuclei, dalfox, sqlmap, ssrfmap, commix output for confirmed bugs",
        "Detects: XSS, SQLi, SSRF, LFI, RCE, IDOR, SSTI, CRLF, HTTP smuggling",
        "Auto-generates PoC: curl commands, reproduction steps, expected output",
        "Calculates CVSS score and maps to CWE",
        "Generates HackerOne-ready report template",
        "Saves full report: cybermind_bugs_target_date.md",
        "Continuous loop: if no bugs found, suggests next best target automatically",
      ],
    },
    {
      title: "reconftw — Full Exhaustive Mode",
      body:
        "CyberMind uses reconftw in its most powerful configuration — every module enabled, no shortcuts.",
      bullets: [
        "reconftw -a --deep --parallel — ALL mode (50+ internal tools)",
        "--subs-bruteforce-threads 50 — aggressive DNS brute force",
        "--nuclei-templates-all — every nuclei template",
        "--dalfox --all — XSS on every discovered endpoint",
        "--waf-detect --waf-bypass — WAF fingerprint + bypass",
        "--screenshotting — visual recon of all subdomains",
        "--paramspider — parameter extraction from JS/source",
        "--ffuf — directory fuzzing on all live hosts",
        "--loots — save all findings to structured output",
        "6-hour timeout — we wait as long as it takes",
      ],
    },
    {
      title: "Hunt Mode — 30+ Tools",
      body:
        "The most comprehensive web vulnerability hunting pipeline available in any CLI tool.",
      bullets: [
        "URL Collection: waymore, gau, waybackurls, hakrawler, urlfinder, httprobe",
        "Deep Crawl: gospider, katana (depth 10), cariddi, subjs, trufflehog, mantra",
        "Parameter Discovery: paramspider, arjun, x8 (high level, 100 threads)",
        "XSS Hunting: xsstrike, dalfox (WAF bypass), kxss, bxss (blind XSS), corsy (CORS)",
        "Vuln Scan: nuclei (1000 concurrency, all tags), gf patterns, ssrfmap, tplmap, liffy, gopherus",
        "Network: nmap vuln scripts on all open ports",
        "New 2025-2026 Kali tools: crlfuzz, tinja, sstimap, wpprobe, gitxray",
      ],
    },
    {
      title: "AI Coding Assistant",
      body:
        "Terminal-native AI coding assistant. Free Claude Code alternative. Works on Windows, macOS, Linux.",
      bullets: [
        "11+ AI providers: MiniMax M2.5, DeepSeek R1, Qwen3 Coder, GPT-5, Claude, Groq",
        "Skills system: /review, /commit, /security, /test, /document, /refactor, /debug",
        "Hooks: auto-run linter on file save, tests on edit, security checks",
        "Real subagents: parallel isolated execution for complex tasks",
        "MCP support: GitHub, Playwright, Figma, 300+ external services",
        "Agent loop: generate → write → run → fix errors → repeat",
        "CYBERMIND.md project memory — context persists across sessions",
      ],
    },
    {
      title: "Doctor Command — Auto-Update + Tool Install",
      body:
        "cybermind /doctor first updates the CLI binary to the latest version, then checks and installs all 80+ security tools.",
      bullets: [
        "Step 1: Self-update — downloads latest binary from GitHub, replaces in-place",
        "Step 2: Checks all recon tools (28+): shodan, h8mail, exiftool, metagoofil, spiderfoot, recon-ng, subfinder, amass, reconftw, nmap, httpx, nuclei...",
        "Step 3: Checks all hunt tools (30+): dalfox, gau, gospider, ssrfmap, tplmap...",
        "Step 4: Checks all exploit tools (25+): sqlmap, metasploit, hydra, sliver, empire, commix...",
        "Auto-installs missing tools: apt, go install, pip3, cargo, git clone",
        "New Kali 2025-2026 tools: crlfuzz, sstimap, wpprobe, adaptixc2, rubeus, ldeep",
        "AI diagnosis: if install fails, AI suggests exact fix commands",
        "Note: shodan requires API key — run 'shodan init YOUR_KEY' after install",
      ],
    },
    {
      title: "Cross-Platform Commands (Windows/macOS/Linux)",
      body:
        "Core features work on every platform — no Linux required.",
      bullets: [
        "/scan — native network scan (no tools needed)",
        "/portscan — port scan + netstat analysis",
        "/osint — DNS + Shodan InternetDB (free, no key)",
        "/breach — breach intelligence (HIBP + BreachDirectory + LeakCheck + local SQLite)",
        "/breach +91XXXXXXXXXX — WhatsApp OSINT (name, about, photo via RapidAPI)",
        "/locate — IP/EXIF/WiFi/Social geolocation (Level 1-4)",
        "/payload — AI payload generator (no msfvenom)",
        "/cve — CVE intelligence from NVD",
        "/wordlist — custom wordlist generator",
        "AI coding assistant (Windows/macOS/Linux)",
        "AI chat — interactive security assistant",
      ],
    },
    {
      title: "OSINT Deep — 45 Tools, 9 Phases",
      body:
        "The most comprehensive OSINT pipeline available in any CLI. Auto-detects target type (domain/email/username/phone/company) and runs the right tools automatically.",
      bullets: [
        "Phase 1 — Domain/Subdomain: subfinder, amass, dnsx, theHarvester, sublist3r, crt.sh CT logs",
        "Phase 2 — Email + Breach: holehe (120+ sites), h8mail, emailfinder, HIBP API, LeakCheck (5B+ records)",
        "Phase 3 — Username/People: sherlock (400+ sites), maigret (3000+ sites), socialscan, WhatsMyName",
        "Phase 4 — Social Media: osintgram (Instagram), twscrape (Twitter/X), instaloader, Photon crawler",
        "Phase 5 — Company Intel: recon-ng (76 modules), spiderfoot (200+ modules), crosslinked, linkedin2username, ghunt",
        "Phase 6 — Phone OSINT: phoneinfoga (carrier/location/social), geoiplookup",
        "Phase 7 — Metadata: exiftool (GPS from photos), metagoofil (document metadata)",
        "Phase 8 — Dark Web: trufflehog (GitHub secrets), gitdorker, onionsearch, torbot, pwndb (Tor)",
        "Phase 9 — Network Intel: nmap OSINT scripts, shodan CLI, whois, dig",
        "Breach check auto-runs on all found emails — HIBP + BreachDirectory (RapidAPI) + LeakCheck",
        "AI analysis: complete digital footprint, attack surface, MITRE ATT&CK mapping",
        "Phase 0 in /plan: OSINT Deep runs automatically before active recon",
      ],
    },
    {
      title: "Reverse Engineering — 30 Tools, 6 Phases",
      body:
        "Full automated RE pipeline for ELF, PE, APK, firmware, and Mach-O binaries. Static + dynamic + decompilation + malware analysis.",
      bullets: [
        "Phase 1 — File ID: file, sha256sum, strings (-n 6 -t x), readelf, objdump, exiftool",
        "Phase 2 — Static: checksec (PIE/NX/canary/RELRO), radare2 (aaa;afl;iz;ii), rizin, binwalk (firmware extraction), nm, ldd, floss (obfuscated strings), diec (packer detection)",
        "Phase 3 — Dynamic: strace (syscalls), ltrace (library calls), gdb+pwndbg, frida-trace (runtime hooks), QEMU user mode (foreign arch emulation)",
        "Phase 4 — Vuln Discovery: ROPgadget (ROP/JOP chains), pwntools checksec, angr (symbolic execution), cve-bin-tool (embedded CVEs)",
        "Phase 5 — Malware: yara (pattern matching), ssdeep (fuzzy hash), clamscan (AV scan)",
        "Phase 6 — Decompile: Ghidra headless (NSA decompiler), retdec (C output), jadx (APK→Java), apktool (smali), r2ghidra",
        "Modes: --mode static | dynamic | decompile | malware | mobile | all",
        "Session persistence: saves to /tmp/cybermind_reveng_*/session.json",
        "AI analysis: binary purpose, vulnerabilities (BOF/format string/UAF), exploit approach, CVEs",
      ],
    },
    {
      title: "Breach Intelligence — HIBP + RapidAPI + Local SQLite",
      body:
        "Multi-source breach intelligence with 90% API + 10% local dump fallback. Integrated into /osint-deep automatically.",
      bullets: [
        "HIBP v3 — 13B+ records, breach names + data types (free tier), full details with API key",
        "BreachDirectory via RapidAPI — email:password plaintext lookup (your RapidAPI key)",
        "LeakCheck.io — 5B+ records, free public API, source names + dates",
        "WhatsApp OSINT via RapidAPI — phone → name, about, profile photo, business status",
        "Local SQLite indexer — index any dump file (email:password, email:hash, plain emails)",
        "Streaming indexer — handles 100M+ line dumps without OOM (50K batch commits)",
        "cybermind /breach --setup — interactive RapidAPI key save",
        "cybermind /breach --index /dump.txt — index local breach dump",
        "cybermind /breach user@email.com — check all sources concurrently (4 goroutines)",
        "cybermind /breach +91XXXXXXXXXX — WhatsApp OSINT",
        "Auto-runs on all emails found during /osint-deep Phase 2",
      ],
    },
    {
      title: "Geolocation — Level 1 to Level 5 (SDR)",
      body:
        "Multi-level geolocation from basic IP lookup to advanced SDR cell tower tracking. /locate works on all OS, /locate-advanced requires Linux + SDR hardware.",
      bullets: [
        "Level 1 — IP/Domain: geoiplookup, ipinfo API (city/ISP/ASN), shodan host, whois",
        "Level 2 — EXIF/Metadata: exiftool GPS extraction from photos, metagoofil document metadata",
        "Level 3 — WiFi: tshark SSID capture → wigle.net lookup → coordinates, kismet passive monitoring",
        "Level 4 — Social Geo: Creepy (Twitter/Instagram location aggregator), osintgram geotags",
        "Level 5 — SDR Cell Tower (/locate-advanced, Pro plan): gr-gsm passive GSM sniffing → TAC/LAC → OpenCellID GPS",
        "Level 5 — srsRAN 4G/5G fake BTS (IMSI catcher), YateBTS GSM fake tower, SigPloit SS7 simulation",
        "Hardware guide: RTL-SDR ($30), HackRF One ($300), BladeRF ($420) — see cli/locate/sdr_setup.md",
        "Auto-detects target type: IP → Level 1, file → Level 2, username → Level 4, phone → Level 5",
        "AI analysis: physical location, network infrastructure, attack surface, privacy exposure",
      ],
    },
  ],
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />

      {/* New in v4.4.0 section */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{
          background: "rgba(0,255,255,0.03)",
          border: "1px solid rgba(0,255,255,0.12)",
          borderRadius: 20,
          padding: "32px",
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "inline-block",
              background: "rgba(0,255,255,0.08)",
              border: "1px solid rgba(0,255,255,0.2)",
              borderRadius: 20,
              padding: "3px 14px",
              fontSize: 11,
              color: "#00FFFF",
              marginBottom: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}>
              New in v4.4.0
            </div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
              Four New Offensive Modes
            </h2>
            <p style={{ color: "#8b949e", fontSize: 14, marginTop: 8 }}>
              CyberMind v4.4.0 introduces four new specialized offensive security modes.
            </p>
          </div>
          <NewModesGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
}
