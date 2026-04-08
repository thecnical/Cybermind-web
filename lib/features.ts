export interface FeatureData {
  id: string
  eyebrow: string
  heading: string
  description: string
  badge?: string
  reverse: boolean
}

export const FEATURES: FeatureData[] = [
  {
    id: "recon",
    eyebrow: "RECON MODE",
    heading: "/recon â€” 16-Tool Automated Recon Pipeline",
    description: `Fully automated 16-tool recon pipeline across 6 phases. Each phase feeds its output into the next, building a complete attack surface map.

Phase 1 â€” Passive OSINT: whois, theHarvester, dig â€” registration data, emails, DNS records.
Phase 2 â€” Subdomain Enum: subfinder, amass, dnsx â€” subdomains resolved to live hosts.
Phase 3 â€” Port Scanning: rustscan â†’ naabu â†’ nmap cascade, masscan â€” open ports, services, WAF detection.
Phase 4 â€” HTTP Fingerprint: httpx, whatweb, tlsx â€” live URLs, tech stack, TLS certificates.
Phase 5 â€” Dir Discovery: ffuf â†’ feroxbuster â†’ gobuster cascade â€” hidden endpoints and directories.
Phase 6 â€” Vuln Scanning: nuclei, nikto, katana â€” CVEs, misconfigs, crawled endpoints.

Adaptive behavior: WAF detected â†’ Phase 5 rate-limited to 10 req/s, nuclei excludes aggressive templates. No open ports after Phase 3 â†’ Phases 4â€“6 skipped. IP targets â†’ domain-only tools skipped automatically. After recon completes, CyberMind prompts to start Hunt Mode using the recon context.`,
    badge: "Kali Linux Only",
    reverse: false,
  },
  {
    id: "hunt",
    eyebrow: "HUNT MODE",
    heading: "/hunt â€” 6-Phase Vulnerability Hunt Engine",
    description: `6-phase vulnerability hunting pipeline. Chains directly from recon output or runs standalone against any target.

Phase 1 â€” URL Collection: gau, waybackurls â€” historical URLs from Wayback Machine and AlienVault OTX.
Phase 2 â€” Deep Crawl: katana â€” JS endpoints, forms, API paths crawled to depth 5.
Phase 3 â€” Parameter Discovery: x8 â€” hidden GET/POST parameters (IDOR/SSRF/LFI surface).
Phase 4 â€” XSS Hunting: dalfox â€” automated XSS with DOM verification.
Phase 5 â€” Vuln Scan: nuclei â€” full template coverage (critical/high/medium/low).
Phase 6 â€” Network Vulns: nmap --script vuln on known open ports.

Context chaining: recon live URLs feed into dalfox and nuclei. Crawled URLs merge with recon live URLs for deeper coverage. Recon WAF status causes dalfox to add delay and nuclei to exclude aggressive templates. Recon open ports mean nmap scans only known ports â€” much faster.

AI output: confirmed vulnerabilities with PoCs, XSS payloads, hidden parameter analysis, and a ready-to-submit bug bounty report template.`,
    badge: "Kali Linux Only",
    reverse: true,
  },
  {
    id: "ai",
    eyebrow: "AI CHAT",
    heading: "AI Chat â€” 9 Providers, 40+ Models, Zero Restrictions",
    description: `All cybersecurity questions answered â€” no filters, no refusals. CyberMind routes your query through 9 AI providers in parallel and returns the best response.

Providers: OpenRouter, Groq, Cerebras, Mistral, SambaNova, NVIDIA, ai.cc, Bytez, HuggingFace â€” 40+ models total.

Uncensored models are tried first, then all providers are raced in parallel with automatic fallback if any provider fails or rate-limits.

Features: adaptive skill detection (beginner â†’ expert), language detection (responds in Hindi/Urdu if you write in it), exploit generation, payload crafting, CVE analysis, tool guidance.

Example commands:
  cybermind "how to exploit CVE-2021-44228"
  cybermind exploit CVE-2021-44228 10.0.0.1
  cybermind payload windows x64
  cybermind tool sqlmap "find SQLi in login form"`,
    reverse: false,
  },
  {
    id: "platform",
    eyebrow: "CROSS-PLATFORM",
    heading: "Cross-Platform â€” Kali Linux + Windows",
    description: `CyberMind runs on both Kali Linux and Windows, with full capabilities on Linux.

Kali Linux: full 16-tool recon pipeline + 6-phase hunt engine + AI chat. The install script builds the CLI, installs it to /usr/local/bin, and automatically installs all 23 recon + hunt tools. No manual setup needed.

Windows: full AI chat experience. /recon and /hunt require Kali Linux. Install via go build or through the Windows install flow documented on this site.

Privacy model: no accounts, no tracking, no data collection. The server is stateless â€” it processes and immediately forgets. Chat history is saved only on your machine at ~/.cybermind/history.json. Tor and proxychains compatible:
  torsocks cybermind "your question"
  proxychains cybermind /recon target`,
    reverse: true,
  },
  {
    id: "doctor",
    eyebrow: "TOOL MANAGEMENT",
    heading: "/doctor â€” Auto Tool Health Check & Install",
    description: `Run /doctor as your first step after installing CyberMind. It checks all 23 recon + hunt tools, shows installed/missing status for each, and automatically installs any that are missing.

Tools checked include: whois, theHarvester, dig, subfinder, amass, dnsx, rustscan, naabu, nmap, masscan, httpx, whatweb, tlsx, ffuf, feroxbuster, gobuster, nuclei, nikto, katana, gau, waybackurls, x8, dalfox.

Commands:
  cybermind /doctor          â€” check all 23 tools, auto-install missing ones
  cybermind /install-tools   â€” one-shot installer for all recon + hunt tools
  cybermind /tools           â€” quick status check

The /install-tools command is a one-shot installer that sets up the entire tool suite in a single run â€” ideal for fresh Kali installs or CI environments.`,
    reverse: false,
  },
]

