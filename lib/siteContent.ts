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
  "modes/doctor",
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
  { group: "Core Workflows", description: "The main command paths you will actually run.", routes: ["cli/interactive-chat", "modes/recon", "modes/hunt", "modes/abhimanyu"] },
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
  "modes/doctor": "Doctor",
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
  if (route === "get-started/installation") return "curl -sL https://cybermind.thecnical.dev/install.sh | bash";
  if (route === "get-started/windows") return "iwr https://cybermind.thecnical.dev/install.ps1 | iex";
  if (route === "cli/interactive-chat") return "cybermind";
  if (route === "modes/recon") return "cybermind /recon example.com";
  if (route === "modes/hunt") return "cybermind /hunt example.com";
  if (route === "modes/abhimanyu") return "cybermind /abhimanyu example.com";
  if (route === "modes/doctor") return "cybermind /doctor";
  return "cybermind --help";
}

const specificDocs: Partial<Record<DocRoute, DocPage>> = {
  "get-started": {
    eyebrow: "Start Here",
    title: "Get CyberMind CLI running without reading everything first",
    description:
      "Start with install, environment validation, and the first commands that prove your setup works.",
    command: "curl -sL https://cybermind.thecnical.dev/install.sh | bash",
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
    command: "curl -sL https://cybermind.thecnical.dev/install.sh | bash",
    sections: [
      {
        title: "What the installer does",
        body:
          "The install flow builds the CLI, places it on your path, and prepares the surrounding toolchain so the shell can move beyond chat-only use.",
        bullets: [
          "Installs the CyberMind CLI binary.",
          "Prepares the tool environment used by recon and hunt.",
          "Lets you verify health with /doctor after install.",
        ],
      },
      {
        title: "First commands after install",
        body: "Do these before you touch a real target.",
        code: "cybermind --version\ncybermind /doctor\ncybermind",
      },
    ],
  },
  "get-started/windows": {
    eyebrow: "Start Here",
    title: "Windows setup and realistic expectations",
    description:
      "Windows is the chat-first environment. The deepest automated offensive chains remain Linux-first.",
    command: "iwr https://cybermind.thecnical.dev/install.ps1 | iex",
    sections: [
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
    title: "Latest release signals that matter to operators",
    description: "The most relevant recent changes are the ones that affect install, tool health, and automated workflow depth.",
    command: "cybermind update",
    sections: [
      { title: "What to pay attention to", body: "When CyberMind changes, the highest-value checks are install behavior, doctor behavior, recon depth, and any version mismatch that affects expectations.", links: quickLinks },
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
