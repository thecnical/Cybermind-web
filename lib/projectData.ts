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
  { label: "Stars", value: "26", detail: "GitHub stars (as of Apr 9, 2026)" },
  { label: "Forks", value: "3", detail: "Public forks on GitHub" },
  { label: "Open issues", value: "1", detail: "Active issue count" },
  { label: "Primary language", value: "Go", detail: "Core CLI implementation language" },
];

export const cybermindProjectTopics = [
  "ethical-hacking",
  "red-team",
  "kali-linux",
  "bug-bounty",
  "osint",
  "security-tools",
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

export const leadershipProfiles = [
  {
    name: "Chandan Pandey",
    role: "Creator & Lead Developer",
    summary:
      "Founder and primary builder of CyberMind CLI, focused on secure AI-driven offensive security tooling.",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=Chandan%20Pandey",
    githubUrl: "",
    websiteUrl: "https://cybermind.thecnical.dev",
  },
  {
    name: "Sanjay Pandey",
    role: "CEO",
    summary:
      "Leads product direction, execution strategy, and growth across cybersecurity and developer experience initiatives.",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=Sanjay%20Pandey",
    githubUrl: "",
    websiteUrl: "",
  },
];

export const contributorTooltipPeople = [
  {
    name: "Chandan Pandey",
    role: "Creator",
    avatar: "https://avatars.githubusercontent.com/u/141616063?v=4",
  },
  {
    name: "Security Research Team",
    role: "Recon and exploit testing",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=CyberMind%20Research",
  },
  {
    name: "Platform Engineering",
    role: "CLI and backend reliability",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=CyberMind%20Platform",
  },
  {
    name: "DX Team",
    role: "Docs and onboarding",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=CyberMind%20DX",
  },
];
