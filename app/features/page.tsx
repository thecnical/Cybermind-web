import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.features;

const page = {
  title: "Features",
  eyebrow: "Full Capabilities",
  description:
    "CyberMind CLI — AI-powered offensive security CLI with OMEGA plan mode, 50+ tool recon/hunt pipeline, auto PoC generation, HackerOne integration, CBM Code AI coding assistant, and full Linux hacking workflow.",
  command: "sudo cybermind /plan --auto-target --focus idor,xss",
  sections: [
    {
      title: "OMEGA Plan Mode — 10-Phase Autonomous Attack Pipeline",
      body:
        "The most powerful feature: give CyberMind a target and it runs a complete 10-phase attack pipeline autonomously. No manual steps. Runs for hours if needed.",
      bullets: [
        "Phase 1: Passive OSINT — whois, theHarvester, dig (DNS/MX/TXT/NS)",
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
      title: "CBM Code — AI Coding Assistant",
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
        "cybermind /doctor first updates the CLI binary to the latest version, then checks and installs all 70+ security tools.",
      bullets: [
        "Step 1: Self-update — downloads latest binary from GitHub, replaces in-place",
        "Step 2: Checks all recon tools (20+): subfinder, amass, reconftw, nmap, httpx, nuclei...",
        "Step 3: Checks all hunt tools (30+): dalfox, gau, gospider, ssrfmap, tplmap...",
        "Step 4: Checks all exploit tools (20+): sqlmap, metasploit, hydra, sliver, empire...",
        "Auto-installs missing tools: apt, go install, pip3, cargo, git clone",
        "New Kali 2025-2026 tools: crlfuzz, sstimap, wpprobe, adaptixc2, rubeus, ldeep",
        "AI diagnosis: if install fails, AI suggests exact fix commands",
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
        "/payload — AI payload generator (no msfvenom)",
        "/cve — CVE intelligence from NVD",
        "/wordlist — custom wordlist generator",
        "CBM Code — AI coding assistant (Windows/macOS/Linux)",
        "AI chat — interactive security assistant",
      ],
    },
  ],
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
