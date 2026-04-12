export type PageLink = {
  href: string;
  label: string;
  description?: string;
};

export type PageSection = {
  title: string;
  body: string;
  bullets?: string[];
  links?: PageLink[];
  code?: string;
};

export type MarketingPage = {
  title: string;
  eyebrow: string;
  description: string;
  command?: string;
  sections: PageSection[];
};

export type DocPage = MarketingPage;

export const cybermindDocRoutes = [
  "get-started",
  "get-started/installation",
  "get-started/windows",
  "cli/interactive-chat",
  "cli/cli-reference",
  "modes/recon",
  "modes/hunt",
  "modes/abhimanyu",
  "modes/planning",
  "modes/doctor",
  "vibe-coder",
  "reference/commands",
  "reference/providers-and-models",
  "reference/privacy-and-security",
  "reference/repo-status",
  "resources/faq",
  "resources/tools-hub",
  "resources/troubleshooting",
  "resources/terms-and-disclaimer",
  "changelogs",
  "changelogs/latest",
] as const;

export const geminiDocRoutes = cybermindDocRoutes;

type DocRoute = (typeof cybermindDocRoutes)[number];

type SidebarGroup = {
  group: string;
  description: string;
  routes: readonly DocRoute[];
};

const sharedFacts = [
  "CyberMind is a Go CLI with AI chat plus offensive workflows.",
  "Kali Linux unlocks recon, hunt, doctor, and Abhimanyu automation.",
  "Windows supports the chat-first CLI experience.",
  "The upstream product posture advertises 9 providers and 40+ models.",
];

const quickLinks: PageLink[] = [
  { href: "/install", label: "Install page", description: "Generate a platform-specific command with your API key." },
  { href: "/plans", label: "Plans", description: "Compare Free, Pro, and Elite tiers." },
  { href: "/dashboard", label: "Dashboard", description: "Manage keys, usage, billing, and settings." },
  { href: "/contact", label: "Contact", description: "Reach support, partnership, or onboarding team quickly." },
];

const sidebarGroups: SidebarGroup[] = [
  { group: "Start Here", description: "Install, platform support, and first-run validation.", routes: ["get-started", "get-started/installation", "get-started/windows"] },
  { group: "Core Workflows", description: "The main command paths you will actually run.", routes: ["cli/interactive-chat", "modes/recon", "modes/hunt", "modes/abhimanyu", "modes/planning"] },
  { group: "Vibe Coder (AI Coding)", description: "CyberMind Neural — the AI coding assistant that beats Claude Code.", routes: ["vibe-coder"] },
  { group: "Commands and Safety", description: "Commands, providers, privacy posture, and doctor checks.", routes: ["reference/commands", "modes/doctor", "reference/providers-and-models", "reference/privacy-and-security"] },
  { group: "Help and Updates", description: "Troubleshooting, tools hub, legal framing, release notes, and repo status.", routes: ["resources/faq", "resources/tools-hub", "resources/troubleshooting", "resources/terms-and-disclaimer", "reference/repo-status", "changelogs/latest"] },
];

const routeLabels: Record<DocRoute, string> = {
  "get-started": "Get started",
  "get-started/installation": "Installation",
  "get-started/windows": "Windows setup",
  "cli/interactive-chat": "Interactive chat",
  "cli/cli-reference": "CLI reference",
  "modes/recon": "Recon mode",
  "modes/hunt": "Hunt mode",
  "modes/abhimanyu": "Abhimanyu mode",
  "modes/planning": "OMEGA Planning mode",
  "modes/doctor": "Doctor",
  "vibe-coder": "Vibe Coder (CyberMind Neural)",
  "reference/commands": "Commands",
  "reference/providers-and-models": "Providers and models",
  "reference/privacy-and-security": "Privacy and security",
  "reference/repo-status": "Repository status",
  "resources/faq": "FAQ",
  "resources/tools-hub": "Tools hub",
  "resources/troubleshooting": "Troubleshooting",
  "resources/terms-and-disclaimer": "Terms and disclaimer",
  changelogs: "Changelog",
  "changelogs/latest": "Latest release",
};

function commandFor(route: DocRoute) {
  if (route === "get-started/installation") return "curl -sL https://cybermindcli1.vercel.app/install.sh | bash";
  if (route === "vibe-coder") return "cybermind vibe";
  if (route === "get-started/windows") return "(iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex";
  if (route === "cli/interactive-chat") return "cybermind";
  if (route === "modes/recon") return "cybermind /recon example.com";
  if (route === "modes/hunt") return "cybermind /hunt example.com";
  if (route === "modes/abhimanyu") return "cybermind /abhimanyu example.com";
  if (route === "modes/planning") return "cybermind /plan example.com";
  if (route === "modes/doctor") return "cybermind /doctor";
  return "cybermind --help";
}

const specificDocs: Partial<Record<DocRoute, DocPage>> = {
  "get-started": {
    eyebrow: "Start Here",
    title: "Get CyberMind CLI running without reading everything first",
    description:
      "Start with install, environment validation, and the first commands that prove your setup works.",
    command: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
    sections: [
      {
        title: "What CyberMind actually is",
        body:
          "CyberMind CLI combines AI chat and automated offensive workflows in one shell. The fastest mental model is simple: install it, verify the environment, then decide whether you need chat, recon, hunt, or the Linux-only exploit path.",
        bullets: sharedFacts,
      },
      {
        title: "Recommended order",
        body:
          "Most users should follow this order instead of opening random pages.",
        bullets: [
          "Install the CLI on your platform.",
          "Run /doctor to confirm the environment.",
          "Use interactive chat to verify provider routing.",
          "Move into /recon and /hunt only when you need automation.",
        ],
        links: [
          {
            href: "/docs/get-started/installation",
            label: "Installation",
            description: "Linux and Kali setup.",
          },
          {
            href: "/docs/get-started/windows",
            label: "Windows setup",
            description: "What works on Windows and what stays Linux-only.",
          },
          {
            href: "/docs/modes/doctor",
            label: "Doctor",
            description: "Repair missing tools and environment drift.",
          },
        ],
      },
    ],
  },
  "get-started/installation": {
    eyebrow: "Start Here",
    title: "Installation on Linux and Kali",
    description:
      "The main installation path targets Kali and Linux because that is where the automated recon, hunt, and Abhimanyu workflows are strongest.",
    command: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
    sections: [
      {
        title: "One-command install (recommended)",
        body:
          "This downloads the binary, installs it to /usr/local/bin, and optionally saves your API key if you pass it via environment variable.",
        code: "# Basic install\ncurl -sL https://cybermindcli1.vercel.app/install.sh | bash\n\n# Install with API key pre-saved\nCYBERMIND_KEY=cp_live_xxxxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
      },
      {
        title: "Manual install (if curl fails)",
        body:
          "Download the binary directly and install it yourself.",
        code: "# Download binary\nwget https://cybermindcli1.vercel.app/cybermind-linux-amd64 -O /tmp/cybermind\n\n# Make executable\nchmod +x /tmp/cybermind\n\n# Install to PATH\nsudo mv /tmp/cybermind /usr/local/bin/cybermind\n\n# Save your API key\nmkdir -p ~/.cybermind\necho '{\"key\":\"cp_live_xxxxx\"}' > ~/.cybermind/config.json\nchmod 600 ~/.cybermind/config.json",
      },
      {
        title: "Set or update your API key after install",
        body:
          "If you need to change your API key at any time, run this command. It overwrites the saved key immediately.",
        code: "cybermind --key cp_live_xxxxx\n\n# Verify it worked\ncybermind whoami",
      },
      {
        title: "First commands after install",
        body: "Do these before you touch a real target.",
        code: "cybermind --version\ncybermind /doctor\ncybermind",
      },
      {
        title: "Uninstall",
        body:
          "To fully remove CyberMind CLI from your Linux system:",
        code: "# Built-in command (recommended)\ncybermind uninstall\n\n# Manual removal (if binary is already gone)\nsudo rm -f /usr/local/bin/cybermind /usr/bin/cybermind\nrm -rf ~/.cybermind",
      },
    ],
  },
  "get-started/windows": {
    eyebrow: "Start Here",
    title: "Windows setup and realistic expectations",
    description:
      "Windows is the chat-first environment. The deepest automated offensive chains remain Linux-first.",
    command: "(iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex",
    sections: [
      {
        title: "One-command install",
        body: "Run this in PowerShell (Admin recommended for System32 install):",
        code: "# Basic install\n(iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex\n\n# Install with API key pre-saved\n$env:CYBERMIND_KEY=\"cp_live_xxxxx\"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex",
      },
      {
        title: "Set or update your API key after install",
        body: "Run this in any terminal to update your saved key:",
        code: "cybermind --key cp_live_xxxxx\n\n# Verify\ncybermind whoami",
      },
      {
        title: "What Windows supports well",
        body:
          "Use Windows when you primarily want the CLI shell, AI guidance, local history, and model routing without the full Linux attack chain.",
        bullets: [
          "Interactive AI chat.",
          "Command guidance and payload ideation.",
          "History and prompt-first workflows.",
          "General operator support before you switch into Linux.",
        ],
      },
      {
        title: "What stays Linux-only",
        body:
          "The upstream product posture is clear about the split, so the docs stay clear too.",
        bullets: [
          "/recon",
          "/hunt",
          "Abhimanyu mode",
          "Broader toolchain orchestration",
        ],
      },
      {
        title: "Uninstall on Windows",
        body: "Run in PowerShell:",
        code: "# Built-in command\ncybermind uninstall\n\n# Manual removal\nRemove-Item -Force \"$env:SystemRoot\\System32\\cybermind.exe\" -ErrorAction SilentlyContinue\nRemove-Item -Recurse -Force \"$env:USERPROFILE\\.cybermind\" -ErrorAction SilentlyContinue",
      },
    ],
  },
  "cli/interactive-chat": {
    eyebrow: "Core Workflows",
    title: "Interactive chat is the fastest way to validate the product",
    description:
      "Start with interactive chat before you open the heavier automation modes.",
    command: "cybermind",
    sections: [
      {
        title: "Why chat comes first",
        body:
          "Interactive chat is the cleanest first-run workflow because it tests the shell, provider routing, history, and prompt handling without requiring the full Kali toolchain.",
        bullets: [
          "Ask general cybersecurity questions.",
          "Request payloads and exploit guidance.",
          "Check that providers and models respond correctly.",
          "Use it as the control room before deeper offensive workflows.",
        ],
      },
    ],
  },
  "reference/commands": {
    eyebrow: "Commands and Safety",
    title: "Command reference grouped by what you are trying to do",
    description:
      "Instead of a raw command dump, this page organizes the main CyberMind commands by intent.",
    command: "cybermind --help",
    sections: [
      {
        title: "Start and verify",
        body: "Use these commands first when you are setting up or checking a machine.",
        code: "cybermind\ncybermind --version\ncybermind /doctor\ncybermind /tools",
      },
      {
        title: "Automated workflows",
        body: "These are the deeper Linux-first commands.",
        code: "cybermind /recon example.com\ncybermind /hunt example.com\ncybermind /abhimanyu example.com",
      },
      {
        title: "Support commands",
        body: "These keep the operator loop clean and recoverable.",
        code: "cybermind history\ncybermind clear\ncybermind update",
      },
    ],
  },
  "modes/planning": {
    eyebrow: "Core Workflows",
    title: "OMEGA Planning Mode — AI builds your full attack plan before you run a single tool",
    description:
      "Planning mode is the most intelligent entry point on Linux. It runs passive recon first, sends all intelligence to AI, and returns a deep 9-phase attack plan tailored to your exact target.",
    command: "cybermind /plan example.com",
    sections: [
      {
        title: "What OMEGA Planning Mode does",
        body:
          "Instead of running tools blindly, /plan first collects passive intelligence about the target — DNS records, Shodan data, HTTP headers, tech stack, open ports — then sends everything to AI. The AI returns a structured JSON attack plan with exact tool flags, skip lists, timing strategy, and CVE pre-detection. CyberMind then executes that plan automatically.",
        bullets: [
          "Passive recon first — zero active probing before the plan is built.",
          "AI analyzes target intelligence and builds a 9-phase plan.",
          "Every phase has exact tool flags, not just tool names.",
          "WAF-aware — Cloudflare, Akamai, Imperva bypass strategies built in.",
          "Target-specific — WordPress gets wpscan, GraphQL gets graphw00f, JWT gets jwt_tool.",
          "Auto-doctor runs before execution — missing tools are installed automatically.",
          "System resource check — warns if RAM or disk is low before starting.",
        ],
      },
      {
        title: "The 9-phase attack plan",
        body:
          "OMEGA Planning Mode produces a plan across 9 phases. Each phase is executed in priority order based on the target type.",
        bullets: [
          "Phase 1 — Passive OSINT: whois, theHarvester, dig (all DNS records, emails, org intel).",
          "Phase 2 — Subdomain Enumeration: reconftw (50+ tools), subfinder, amass, dnsx, puredns.",
          "Phase 3 — Port Scanning: rustscan → nmap → naabu → masscan (full 65535 ports).",
          "Phase 4 — HTTP Fingerprinting: httpx, whatweb, tlsx, wafw00f (tech stack + TLS + WAF).",
          "Phase 5 — Directory Discovery: ffuf, feroxbuster, gobuster (recursive, 13 extensions).",
          "Phase 6 — Vulnerability Scanning: nuclei (500 threads, all CVE tags), nikto, katana.",
          "Phase 7 — Hunt Mode: waymore, gau, gospider, x8, arjun, dalfox, kxss, ssrfmap, tplmap.",
          "Phase 8 — Secret Hunting: trufflehog, secretfinder, subjs, mantra, cariddi.",
          "Phase 9 — Exploitation: sqlmap, commix, wpscan, hydra, metasploit, jwt_tool, graphw00f.",
        ],
      },
      {
        title: "How to use it — step by step",
        body: "Planning mode is Linux-only. Run it on Kali or any Debian-based system.",
        code: `# Basic usage — AI builds full plan for target
cybermind /plan example.com

# What happens automatically:
# 1. System resource check (RAM, disk, CPU)
# 2. Auto-doctor — checks and installs all tools
# 3. Passive recon — DNS, Shodan, HTTP headers collected
# 4. AI analysis — 9-phase plan generated
# 5. Plan displayed — you confirm before execution
# 6. Execution — phases run in priority order
# 7. Results — AI analysis after each phase`,
      },
      {
        title: "Full Linux workflow — from zero to exploitation",
        body:
          "This is the complete recommended flow on Kali Linux. Planning mode chains into recon, hunt, and Abhimanyu automatically.",
        code: `# Step 1: Install CyberMind
curl -sL https://cybermindcli1.vercel.app/install.sh | bash

# Step 2: Save your API key
cybermind --key cp_live_xxxxx

# Step 3: Install all tools (one time)
cybermind /install-tools

# Step 4: Run OMEGA Planning Mode
cybermind /plan target.com

# --- Planning mode auto-runs phases ---
# After plan completes, you can also run individually:

# Step 5: Deep recon (if you want manual control)
cybermind /recon target.com

# Step 6: Vulnerability hunt
cybermind /hunt target.com

# Step 7: Exploit confirmed vulnerabilities (Elite plan)
cybermind /abhimanyu target.com

# Step 8: Generate professional pentest report
cybermind report`,
      },
      {
        title: "Difference between /plan, /recon, /hunt, and /abhimanyu",
        body:
          "Each mode has a specific role. Use them in order for maximum coverage.",
        bullets: [
          "/plan — AI-first. Builds the strategy before running anything. Best starting point.",
          "/recon — Execution-first. Runs all 20 recon tools immediately. Use when you already know the target type.",
          "/hunt — Vulnerability-focused. Runs after recon. Finds XSS, SQLi, SSRF, hidden params.",
          "/abhimanyu — Exploitation. Runs after hunt. Exploits confirmed vulnerabilities. Elite plan only.",
        ],
      },
      {
        title: "Tool flags used in each phase",
        body:
          "Planning mode uses the most powerful flags for every tool — not defaults.",
        bullets: [
          "nuclei: -c 500 -rl 100 -tags cve,xss,sqli,ssrf,lfi,rce,xxe,idor,misconfig,exposure,takeover",
          "subfinder: -all -t 500 (all passive sources, 500 threads)",
          "ffuf: -t 300 -recursion -recursion-depth 4 -ac (recursive, auto-calibrate)",
          "nmap: -sS -sV -sC -T4 -p- --min-rate 10000 --script vuln,auth,http-vuln*",
          "sqlmap: --batch --level 5 --risk 3 --dbs --dump-all --tamper space2comment,between,randomcase",
          "dalfox: --waf-bypass --trigger alert(1) --follow-redirects",
        ],
      },
      {
        title: "WAF bypass strategy",
        body:
          "If a WAF is detected during passive recon, the AI automatically adjusts the plan.",
        bullets: [
          "Cloudflare detected → stealth mode, slow nuclei rate, Cloudflare-specific bypass payloads.",
          "Akamai detected → header manipulation, rate limiting, Akamai bypass techniques.",
          "Imperva detected → encoding variations, slow scan mode.",
          "No WAF → aggressive mode, full speed, all tools at maximum threads.",
        ],
      },
      {
        title: "Requirements",
        body: "Planning mode requires Linux (Kali recommended) and an active API key.",
        bullets: [
          "OS: Linux or Kali Linux (not available on Windows or macOS).",
          "API key: any plan — free plan gets AI chat + planning, Elite gets full exploitation.",
          "Tools: /install-tools installs everything automatically.",
          "RAM: 2GB minimum recommended for full pipeline.",
          "Internet: required for passive recon and AI analysis.",
        ],
        links: [
          { href: "/docs/get-started/installation", label: "Installation", description: "Install CyberMind on Linux." },
          { href: "/docs/modes/recon", label: "Recon mode", description: "Run recon without planning mode." },
          { href: "/docs/modes/hunt", label: "Hunt mode", description: "Vulnerability hunting after recon." },
          { href: "/docs/modes/abhimanyu", label: "Abhimanyu mode", description: "Exploitation engine." },
        ],
      },
    ],
  },
  "modes/recon": {
    eyebrow: "Core Workflows",
    title: "Recon mode maps the surface before you attack it",
    description:
      "The recon pipeline is a six-phase discovery chain that moves from passive intel to hosts, ports, HTTP fingerprinting, directories, and vulnerability scanning.",
    command: "cybermind /recon example.com",
    sections: [
      {
        title: "The six phases in plain language",
        body:
          "Think of recon as progressive narrowing. Each phase gives the next phase better input.",
        bullets: [
          "Passive OSINT: domain and DNS context.",
          "Subdomain enum: find more reachable assets.",
          "Port scan: identify exposed services.",
          "HTTP fingerprinting: learn the tech stack and live URLs.",
          "Directory discovery: expand hidden paths and files.",
          "Vulnerability scanning: check exposures after the map is built.",
        ],
      },
      {
        title: "When to stop and when to continue",
        body:
          "Use recon when you need breadth first. If recon confirms promising URLs or services, move into hunt. If hunt confirms exploitable paths, then consider Abhimanyu.",
        links: [
          {
            href: "/docs/modes/hunt",
            label: "Hunt mode",
            description: "Move from mapping to targeted vulnerability hunting.",
          },
          {
            href: "/docs/modes/abhimanyu",
            label: "Abhimanyu",
            description: "The Linux-only exploit engine.",
          },
        ],
      },
    ],
  },
  "modes/hunt": {
    eyebrow: "Core Workflows",
    title: "Hunt mode narrows the attack surface into likely findings",
    description:
      "Hunt mode is the bridge between recon output and concrete vulnerability work.",
    command: "cybermind /hunt example.com",
    sections: [
      {
        title: "What hunt is for",
        body:
          "Use hunt only after you already know enough about the target to focus effort.",
        bullets: [
          "Collect historical URLs.",
          "Deep-crawl for APIs, JS endpoints, and forms.",
          "Expand hidden parameters.",
          "Probe XSS and template-driven vulnerabilities.",
          "Check network-level weakness on exposed services.",
        ],
      },
    ],
  },
  "modes/abhimanyu": {
    eyebrow: "Core Workflows",
    title: "Abhimanyu is the exploit engine and should be treated that way",
    description: "This is the sharpest edge of the product and it is Linux-only.",
    command: "cybermind /abhimanyu example.com",
    sections: [
      {
        title: "What this mode actually covers",
        body:
          "The upstream README presents six exploit-oriented phases. This is not a beginner mode and it should never be described as casual scanning.",
        bullets: [
          "Web exploitation",
          "Authentication attacks",
          "Exploit and CVE search",
          "Post-exploitation",
          "Lateral movement",
          "Persistence and exfiltration",
        ],
      },
      {
        title: "Use boundary",
        body:
          "CyberMind explicitly frames the product for authorized security research, pentesting with written permission, CTF competition, and education.",
      },
    ],
  },
  "modes/doctor": {
    eyebrow: "Commands and Safety",
    title: "Doctor is the recovery path when anything feels wrong",
    description:
      "If commands fail, tools are missing, or the environment drifted after an update, /doctor should be the first recovery move.",
    command: "cybermind /doctor",
    sections: [
      {
        title: "Use doctor when",
        body: "Run doctor before you start debugging by hand.",
        bullets: [
          "A tool command is missing.",
          "The install completed but a workflow does not run.",
          "You updated the CLI and want to verify the machine state.",
          "You want a fast health check before a longer session.",
        ],
      },
    ],
  },
  "reference/providers-and-models": {
    eyebrow: "Commands and Safety",
    title: "Providers and models: what the shell is actually routing across",
    description: "The practical takeaway is that the CLI should keep responding even if one provider fails or rate-limits.",
    command: "cybermind",
    sections: [
      {
        title: "What matters operationally",
        body: "You do not need to memorize every model. You need to know that CyberMind routes across multiple providers and falls back when needed.",
        bullets: ["9 providers advertised upstream.", "40+ models advertised upstream.", "Parallel execution and auto-fallback are part of the product posture.", "Interactive chat is the easiest place to validate routing behavior."],
      },
    ],
  },
  "reference/privacy-and-security": {
    eyebrow: "Commands and Safety",
    title: "Privacy and security posture in plain language",
    description: "This page pulls together the privacy and security statements the product makes so users can quickly understand where data lives and what protections are claimed.",
    command: "cybermind history",
    sections: [
      { title: "Privacy posture", body: "The upstream README says the service processes chats statelessly, stores history locally on the user machine, and avoids accounts, analytics, and tracking in the core product flow.", bullets: ["Local chat history path: ~/.cybermind/history.json.", "No accounts or tracking claimed in the core product statement.", "Tor and proxychains compatibility is explicitly mentioned."] },
      { title: "Security controls described upstream", body: "The CLI also presents safeguards around input handling and tool execution.", bullets: ["Target validation to reduce malicious flag injection.", "Tools executed without shell interpolation.", "Output sanitization before AI submission.", "Tool exhaustion and fallback instead of silent skipping."] },
    ],
  },
  "reference/repo-status": {
    eyebrow: "Help and Updates",
    title: "Repository status and source-of-truth notes",
    description: "This page exists so the website stays honest when the upstream files disagree or when the release posture needs clarification.",
    command: "cybermind --version",
    sections: [
      { title: "Current known mismatch", body: "The current public product files do not all agree on versioning, so the site should say that directly.", bullets: ["README advertises version 2.5.0.", "cli/main.go also hardcodes 2.5.0.", "Top-level VERSION still reports 2.4.0."] },
    ],
  },
  "resources/faq": {
    eyebrow: "Help and Updates",
    title: "Frequently asked questions",
    description: "These are the questions that unblock most users fastest: where to start, what works on Windows, where data lives, and when to use each mode.",
    command: "cybermind",
    sections: [
      { title: "Short answers", body: "Use this page as the quick answer sheet.", bullets: ["Start with install, doctor, then interactive chat.", "Use Kali/Linux for the deepest automated workflows.", "Use Windows primarily for chat-first operation.", "Move into recon before hunt, and hunt before Abhimanyu.", "Local history lives on your machine."] },
    ],
  },
  "resources/tools-hub": {
    eyebrow: "Help and Updates",
    title: "Tools and release hub inside docs",
    description: "All tool-related discovery links are centralized here so navigation stays clean and direct.",
    command: "cybermind /tools",
    sections: [
      {
        title: "Tools and extensions",
        body: "Use these pages when you want tool bundles, extension information, and release updates.",
        links: [
          {
            href: "/get-tools",
            label: "Get tools",
            description: "Tool bundles, tracks, and waitlist access.",
          },
          {
            href: "/extensions",
            label: "Extensions",
            description: "Extension overview and integration guidance.",
          },
          {
            href: "/docs/reference/commands",
            label: "Command tools",
            description: "Command-level tooling reference.",
          },
          {
            href: "/docs/changelogs/latest",
            label: "Latest changelog",
            description: "Most recent release notes and direction.",
          },
          {
            href: "/contact",
            label: "Contact support",
            description: "Send product, support, or enterprise query to the team.",
          },
        ],
      },
    ],
  },
  "resources/troubleshooting": {
    eyebrow: "Help and Updates",
    title: "Troubleshooting without getting lost in the whole docs tree",
    description: "When something fails, start here instead of opening random reference pages.",
    command: "cybermind /doctor",
    sections: [
      { title: "Fast troubleshooting order", body: "This order keeps recovery practical.", bullets: ["Confirm your platform supports the workflow you are trying to run.", "Run /doctor to check the local toolchain.", "Retry with interactive chat if provider behavior is the issue.", "Check the API key and install command if setup looks wrong.", "Check repository status if version output looks inconsistent."] },
      { title: "Need more context?", body: "Use these pages next, in this order.", links: [
        { href: "/docs/modes/doctor", label: "Doctor", description: "Machine state and missing tool recovery." },
        { href: "/docs/reference/privacy-and-security", label: "Privacy and security", description: "Local data and input-handling posture." },
        { href: "/docs/reference/repo-status", label: "Repository status", description: "Version mismatches and release posture." },
      ] },
    ],
  },
  "resources/terms-and-disclaimer": {
    eyebrow: "Help and Updates",
    title: "Terms and authorized-use boundary",
    description: "CyberMind is framed for authorized security research, written-permission pentesting, CTF work, and education. This page keeps that boundary visible inside the docs.",
    command: "cybermind /abhimanyu example.com",
    sections: [
      { title: "Use boundary", body: "The upstream disclaimer is direct: do not use the product against systems you do not own or do not have explicit written authorization to test.", bullets: ["Authorized security research", "Pentesting with written permission", "CTF competition", "Cybersecurity education"] },
      { title: "Legal pages", body: "For fuller legal details, use the dedicated public legal pages.", links: [
        { href: "/terms", label: "Terms of use", description: "Detailed terms and acceptable-use framing." },
        { href: "/privacy", label: "Privacy policy", description: "How site and product data are described." },
        { href: "/cookies", label: "Cookie policy", description: "How the website remembers consent and preferences." },
      ] },
    ],
  },
  changelogs: {
    eyebrow: "Help and Updates",
    title: "Release narrative at a glance",
    description: "The public change log shows the product moving through major milestones: broader Kali workflows, provider expansion, and a deeper recon engine rewrite.",
    command: "cybermind update",
    sections: [
      { title: "Recent direction", body: "Treat the change log as the high-level narrative, then use repository status if specific version files do not line up.", bullets: ["2.3.0: recon engine rewrite and richer structured analysis flow.", "2.0.0: command mode expansion and more provider coverage.", "Current release posture still needs version consistency across repo files."] },
    ],
  },
  "changelogs/latest": {
    eyebrow: "Help and Updates",
    title: "v2.5.2 — OMEGA Planning Mode + GitHub Models + Cloudflare AI",
    description: "The biggest update since launch. Planning mode, 2 new free AI providers, cold start fix, and full security audit.",
    command: "cybermind /plan example.com",
    sections: [
      {
        title: "New: OMEGA Planning Mode",
        body: "The most intelligent entry point on Linux. AI builds a 9-phase attack plan before running a single tool.",
        bullets: [
          "cybermind /plan <target> — AI-first attack planning.",
          "9 phases: OSINT → Subdomain → Ports → HTTP → Dirs → Vulns → Hunt → Secrets → Exploit.",
          "WAF-aware: Cloudflare, Akamai, Imperva bypass strategies built in.",
          "Target-specific: WordPress, GraphQL, JWT, AD, Cloud all handled differently.",
          "Auto-doctor runs before execution — missing tools installed automatically.",
          "System resource check before starting.",
        ],
        links: [{ href: "/docs/modes/planning", label: "Planning mode docs", description: "Full guide with step-by-step instructions." }],
      },
      {
        title: "New: GitHub Models + Cloudflare Workers AI",
        body: "Two new completely free AI providers added. More providers = more reliability.",
        bullets: [
          "GitHub Models: GPT-4o, Llama 3.3 70B, DeepSeek R1, Phi-4 — 150 req/day free.",
          "Cloudflare Workers AI: Llama 70B, DeepSeek R1, Qwen 72B — 10,000 neurons/day free.",
          "Total: 11 providers, 50+ models in the fallback chain.",
          "Sequential fallback: Groq → Cerebras → OpenRouter → GitHub → Mistral → Cloudflare → ...",
        ],
      },
      {
        title: "Fix: Cold start auto-wake",
        body: "CLI now automatically wakes the backend and retries — no more manual resend.",
        bullets: [
          "Shows live progress: ⟳ Backend waking up... (3s)",
          "Auto-retries after wake — user never needs to resend manually.",
          "Works on Windows, Linux, and macOS.",
        ],
      },
      {
        title: "Security audit applied",
        body: "Full security audit completed. Critical fixes applied.",
        bullets: [
          "SSRF protection on all URL fetching.",
          "AI output sanitization — strips leaked secrets from LLM responses.",
          "Blocked device enforcement — 403 instead of log-only.",
          "Exponential backoff on API key brute force.",
          "GDPR data export endpoint added.",
          "SQL ambiguous column bug fixed.",
        ],
      },
      {
        title: "What to do now",
        body: "Update your CLI binary and try planning mode.",
        code: "# Update CLI\ncurl -sL https://cybermindcli1.vercel.app/install.sh | bash\n\n# Try planning mode\ncybermind /plan example.com",
        links: quickLinks,
      },
    ],
  },
};

function fallbackPage(route: DocRoute): DocPage {
  return {
    eyebrow: "Documentation",
    title: routeLabels[route],
    description: "This page is part of the CyberMind CLI docs tree and follows the same simplified product-first documentation model as the rest of the site.",
    command: commandFor(route),
    sections: [
      { title: "What this page is for", body: "Use this route when you need more detail on a specific part of the command surface, but start with the grouped docs index if you are still orienting yourself.", bullets: sharedFacts },
      { title: "Useful next steps", body: "Jump back to the clearest entry points if you need context.", links: [
        { href: "/docs/get-started", label: "Get started", description: "Fastest orientation path." },
        { href: "/docs/reference/commands", label: "Commands", description: "Grouped by intent instead of raw dumping." },
        { href: "/docs/resources/troubleshooting", label: "Troubleshooting", description: "Recovery path when things fail." },
      ] },
    ],
  };
}

export function getDocPage(route: string): DocPage {
  const page = (specificDocs as Record<string, DocPage>)[route];
  if (page) return page;
  if ((cybermindDocRoutes as readonly string[]).includes(route)) return fallbackPage(route as DocRoute);
  return specificDocs["get-started"] as DocPage;
}

export function getSidebarGroups(): Array<{ group: string; description: string; items: Array<{ href: string; label: string }> }> {
  return sidebarGroups.map((group) => ({
    group: group.group,
    description: group.description,
    items: group.routes.map((route) => ({ href: `/docs/${route}`, label: routeLabels[route] })),
  }));
}

export const marketingPages: Record<string, MarketingPage> = {
  "/extensions": {
    eyebrow: "Extensions",
    title: "CyberMind CLI is focused on the command surface first",
    description: "This section frames integrations as wrappers around the CLI workflow, not as a fictional marketplace.",
    command: 'cybermind tool nmap "scan for SMB vulnerabilities"',
    sections: [{ title: "How to think about extensions", body: "Treat extensions as workflow glue around installation, account setup, operator habits, and team automation. The primary product remains the CyberMind CLI shell and its built-in command surface." }],
  },
  "/extensions/about": {
    eyebrow: "Extensions",
    title: "Why the website keeps this section narrow",
    description: "The site should not promise an extension platform that the product itself does not ship.",
    command: "cybermind history",
    sections: [{ title: "Use this page for workflow glue", body: "Document team wrappers, internal helpers, and environment patterns here rather than inventing a public plugin ecosystem." }],
  },
  "/brand-kit": {
    eyebrow: "Brand Kit",
    title: "Visual language for CyberMind CLI",
    description: "The site identity mirrors the live shell: cyan-to-violet gradients, terminal framing, glass surfaces, and a CLI-first wordmark.",
    command: "cybermind",
    sections: [{ title: "What the identity should communicate", body: "Users should immediately understand that CyberMind is a terminal-native offensive security product with account, install, and docs layers built around that shell." }],
  },
  "/debugz": {
    eyebrow: "Diagnostics",
    title: "Operational debugging starts with the CLI, not guesswork",
    description: "This page routes users toward doctor checks, install validation, platform clarification, and repository-status notes before they spiral into manual debugging.",
    command: "cybermind /doctor",
    sections: [{ title: "Debug in this order", body: "Confirm the platform, run doctor, validate the API key and provider path, then check the release posture if outputs still look inconsistent.", links: [
      { href: "/docs/modes/doctor", label: "Doctor", description: "Environment verification and repair." },
      { href: "/install", label: "Install", description: "Rebuild the platform-specific setup flow." },
      { href: "/docs/reference/repo-status", label: "Repository status", description: "Version mismatch and source-of-truth notes." },
    ] }],
  },
  "/terms": {
    eyebrow: "Legal",
    title: "Terms of use for CyberMind CLI",
    description: "These terms govern use of the website, account system, install surfaces, and CyberMind CLI service features presented here.",
    sections: [
      { title: "1. Scope", body: "These terms apply to the CyberMind CLI website, account dashboard, install pages, documentation, and any hosted services or account-linked features exposed through this site." },
      { title: "2. Authorized use only", body: "CyberMind is intended for authorized security research, penetration testing with written permission, CTF participation, and cybersecurity education. You must not use the product or website to target systems, networks, applications, or accounts without explicit authorization.", bullets: ["Do not use the product for unlawful intrusion or disruption.", "Do not use generated commands or guidance against unauthorized targets.", "You are responsible for confirming that every workflow you run is lawful in your jurisdiction and contract scope."] },
      { title: "3. Accounts and keys", body: "You are responsible for maintaining the confidentiality of your login credentials and API keys. You must promptly rotate keys and close access if you suspect compromise.", bullets: ["Do not share keys outside the intended team or machine boundary.", "You are responsible for activity performed through your account or keys.", "Preview UI states do not reduce the security expectations for real deployments."] },
      { title: "4. Product limits", body: "Certain workflows are platform-specific. The deepest automated offensive chains are Linux-first, while Windows supports the chat-first experience. You are responsible for using workflows only where they are supported and safe." },
      { title: "5. Warranty and liability", body: "To the maximum extent permitted by law, the software and website are provided as-is and as-available without warranties. CyberMind and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from use or misuse of the product." },
      { title: "6. Third-party tools and changes", body: "CyberMind may coordinate or guide third-party security tools and open-source software. Those tools remain subject to their own licenses and risks. These terms may be updated as the account and website surfaces evolve." },
    ],
  },
  "/privacy": {
    eyebrow: "Legal",
    title: "Privacy policy for CyberMind CLI",
    description: "This policy explains how the website and product surfaces described here handle personal data, session state, and local CLI history.",
    sections: [
      { title: "1. Product data posture", body: "The upstream product documentation describes the AI service as stateless, with local chat history saved on the user machine at ~/.cybermind/history.json. The website account layer may also store account-facing data such as email, plan selection, API keys, and dashboard preferences." },
      { title: "2. Data categories", body: "Depending on how you use the site, CyberMind may process account identifiers, authentication credentials, API keys, billing-related records, support requests, cookie preferences, and usage metadata needed to operate the account surfaces." },
      { title: "3. Storage and retention", body: "The CLI stores local history on the user device. The website stores preference and session data needed for account navigation, consent handling, and dashboard continuity. Data should be retained only as long as necessary for account operation, legal compliance, abuse prevention, and billing or support obligations." },
      { title: "4. Your choices", body: "You may update profile data, rotate API keys, change consent preferences, or request account deletion subject to operational and legal constraints. Use the dashboard and cookie controls provided on the site whenever possible." },
    ],
  },
  "/cookies": {
    eyebrow: "Legal",
    title: "Cookie policy for CyberMind CLI",
    description: "This page explains how the website uses essential and optional cookies or equivalent local browser storage for consent, preferences, and session continuity.",
    sections: [
      { title: "1. Essential cookies", body: "Essential cookies or equivalent local storage may be used to preserve session continuity, security state, and the minimum functionality required to operate account surfaces safely." },
      { title: "2. Functional cookies", body: "Functional cookies may store interface preferences such as consent state, remembered UI choices, and other non-essential usability settings that improve continuity across visits." },
      { title: "3. Analytics cookies", body: "Analytics cookies are reserved for future measurement and product insight workflows. If analytics are enabled in the future, users should be able to accept or reject them through the consent controls surfaced on the website." },
      { title: "4. Consent controls", body: "The website provides a cookie preferences popup that lets users accept all optional cookies, reject optional cookies, or save granular preferences. Essential storage remains enabled because the site requires it for safe basic operation." },
      { title: "5. More information", body: "For broader data-handling terms, review the privacy policy and terms of use.", links: [
        { href: "/privacy", label: "Privacy policy", description: "Website and product data-handling summary." },
        { href: "/terms", label: "Terms of use", description: "Authorized-use and liability framing." },
      ] },
    ],
  },
};
