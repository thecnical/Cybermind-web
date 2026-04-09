export type ProjectMetric = {
  label: string;
  value: string;
  detail: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  commitUrl: string;
};

export const cybermindProjectMeta = {
  repoName: "CyberMind CLI",
  repoUrl: "https://cybermind.thecnical.dev",
  homepage: "https://cybermind.thecnical.dev",
  description:
    "AI-powered cybersecurity CLI tool for Kali Linux, ethical hacking, penetration testing, and bug bounty workflows.",
  language: "Go",
  createdAt: "2026",
  updatedAt: "2026",
};

export const cybermindProjectMetrics: ProjectMetric[] = [
  { label: "Stars",            value: "26",  detail: "GitHub stars (as of Apr 9, 2026)" },
  { label: "Forks",            value: "3",   detail: "Public forks on GitHub" },
  { label: "Open issues",      value: "1",   detail: "Active issue count" },
  { label: "Primary language", value: "Go",  detail: "Core CLI implementation language" },
];

export const cybermindProjectTopics = [
  "ethical-hacking",
  "red-team",
  "kali-linux",
  "bug-bounty",
  "osint",
  "security-tools",
  "penetration-testing",
  "ai-security",
  "offensive-security",
  "recon-automation",
  "exploit-engine",
  "cli-tool",
];

export const cybermindTimeline: TimelineItem[] = [
  {
    date: "2026",
    title: "Security audit and CLI UX hardening",
    description: "Backend safety improvements, startup API-key state display, and command UX fixes in the live shell.",
    commitUrl: "https://cybermind.thecnical.dev/changelog",
  },
  {
    date: "2026",
    title: "Supabase auth and API key integration",
    description: "Added key validation flow, --key support, and account-linked plan identity through backend integration.",
    commitUrl: "https://cybermind.thecnical.dev/changelog",
  },
  {
    date: "2026",
    title: "Cold-start resilience and retry strategy",
    description: "Implemented auto-retry behavior for backend wake-up conditions to avoid transient startup errors.",
    commitUrl: "https://cybermind.thecnical.dev/changelog",
  },
  {
    date: "2026",
    title: "Abhimanyu mode pipeline expansion",
    description: "Extended exploit workflow phases, strengthened doctor diagnostics, and improved offensive-mode execution.",
    commitUrl: "https://cybermind.thecnical.dev/changelog",
  },
  {
    date: "2026",
    title: "v2.5.0 mode and tool power upgrades",
    description: "Broader mode orchestration and stronger AI-assisted command sequencing across attack lifecycle phases.",
    commitUrl: "https://cybermind.thecnical.dev/changelog",
  },
];

// ─── Leadership (Creator + CEO) ───────────────────────────────────────────────
export const leadershipProfiles = [
  {
    name: "Chandan Pandey",
    role: "Creator & Lead Developer",
    badge: "Founder",
    summary:
      "Architect and primary builder of CyberMind CLI. Designed the full offensive security pipeline — recon, hunt, Abhimanyu exploit engine — and the AI-first CLI experience.",
    avatarUrl: "/team/chandan.jpg",
    githubUrl: "https://github.com/thecnical",
    websiteUrl: "https://cybermind.thecnical.dev",
    skills: ["Go", "Node.js", "AI/ML", "Offensive Security", "DevSecOps"],
    accent: "cyan" as const,
  },
  {
    name: "Sanjay Pandey",
    role: "CEO",
    badge: "Leadership",
    summary:
      "Leads product direction, execution strategy, and growth across cybersecurity and developer experience initiatives. Drives the vision for CyberMind as a production-grade security platform.",
    avatarUrl: "/team/sanjay.jpg",
    githubUrl: "",
    websiteUrl: "",
    skills: ["Product Strategy", "Business Development", "Security Operations", "Team Leadership"],
    accent: "purple" as const,
  },
];

// ─── Tech Team ────────────────────────────────────────────────────────────────
export const techTeamProfiles = [
  {
    name: "Omkar Vijay Gavali",
    role: "Tech Team",
    summary: "Core contributor to CyberMind's security toolchain and CLI infrastructure.",
    avatarUrl: "/team/omkar.jpg",
    githubUrl: "",
  },
  {
    name: "Divyanshu Upadhaya",
    role: "Tech Team",
    summary: "Contributes to backend systems, API design, and platform reliability for CyberMind.",
    avatarUrl: "/team/divyanshu.jpg",
    githubUrl: "",
  },
  {
    name: "Laxman Singh",
    role: "Tech Team",
    summary: "Works on recon automation, tool integration, and offensive security workflows.",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=Laxman%20Singh",
    githubUrl: "",
  },
];

// ─── Contributors tooltip (shown in Project Topics section) ───────────────────
export const contributorTooltipPeople = [
  {
    name: "Chandan Pandey",
    role: "Creator & Lead Developer",
    avatar: "/team/chandan.jpg",
  },
  {
    name: "Sanjay Pandey",
    role: "CEO",
    avatar: "/team/sanjay.jpg",
  },
  {
    name: "Omkar Vijay Gavali",
    role: "Tech Team",
    avatar: "/team/omkar.jpg",
  },
  {
    name: "Divyanshu Upadhaya",
    role: "Tech Team",
    avatar: "/team/divyanshu.jpg",
  },
  {
    name: "Laxman Singh",
    role: "Tech Team",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Laxman%20Singh",
  },
];
