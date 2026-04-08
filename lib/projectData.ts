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
  repoName: "thecnical/cybermind",
  repoUrl: "https://github.com/thecnical/cybermind",
  homepage: "https://thecnical.github.io/cybermind/",
  description:
    "AI-powered cybersecurity CLI tool for Kali Linux, ethical hacking, penetration testing, and bug bounty workflows.",
  language: "Go",
  createdAt: "2026-03-30",
  updatedAt: "2026-04-08",
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
    date: "Apr 8, 2026",
    title: "Security audit and CLI UX hardening",
    description:
      "Repository updates included backend safety improvements, startup API-key state display, and command UX fixes in the live shell.",
    commitUrl: "https://github.com/thecnical/cybermind/commit/a9017318e50496586484b0261aea7c2bbbca8fe7",
  },
  {
    date: "Apr 8, 2026",
    title: "Supabase auth and API key integration",
    description:
      "Added key validation flow, `--key` support, and account-linked plan identity through backend integration paths.",
    commitUrl: "https://github.com/thecnical/cybermind/commit/e5ff6a1148c66772a9cbc171fc5eddeda3a987d4",
  },
  {
    date: "Apr 8, 2026",
    title: "Cold-start resilience and retry strategy",
    description:
      "Implemented auto-retry behavior for backend wake-up conditions to avoid non-JSON and transient startup errors.",
    commitUrl: "https://github.com/thecnical/cybermind/commit/3f8c3c31c5de4b7d0a988d81ba64e0d505781498",
  },
  {
    date: "Apr 8, 2026",
    title: "Abhimanyu mode pipeline expansion",
    description:
      "Extended exploit workflow phases, strengthened doctor diagnostics, and improved offensive-mode execution chaining.",
    commitUrl: "https://github.com/thecnical/cybermind/commit/3c99e6469d81e39d65cfb220eda893b5299c9ebf",
  },
  {
    date: "Apr 8, 2026",
    title: "v2.6.0 mode and tool power upgrades",
    description:
      "Introduced broader mode orchestration and stronger AI-assisted command sequencing across attack lifecycle phases.",
    commitUrl: "https://github.com/thecnical/cybermind/commit/b5f9a65e8d7194365c8ea5ef116df524f138fec1",
  },
];

export const leadershipProfiles = [
  {
    name: "Chandan Pandey",
    role: "Creator",
    summary:
      "Founder and primary builder of CyberMind CLI, focused on secure AI-driven offensive security tooling.",
    avatarUrl: "https://avatars.githubusercontent.com/u/141616063?v=4",
    githubUrl: "https://github.com/thecnical",
    websiteUrl: "https://chandanpandeyprot.netlify.app/",
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
