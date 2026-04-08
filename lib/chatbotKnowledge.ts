import { installCommands, planDetails } from "@/lib/mockData";
import {
  cybermindDocRoutes,
  getDocPage,
  marketingPages,
  type MarketingPage,
} from "@/lib/siteContent";

export type AssistantKnowledgeItem = {
  id: string;
  title: string;
  href: string;
  content: string;
  command?: string;
  keywords: string[];
};

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function extractPageText(page: MarketingPage) {
  const chunks: string[] = [page.eyebrow, page.title, page.description];
  for (const section of page.sections) {
    chunks.push(section.title, section.body);
    if (section.code) chunks.push(section.code);
    if (section.bullets?.length) chunks.push(section.bullets.join(" "));
    if (section.links?.length) {
      chunks.push(section.links.map((link) => `${link.label} ${link.description ?? ""}`).join(" "));
    }
  }
  if (page.command) chunks.push(page.command);
  return compact(chunks.join(" "));
}

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = value.toLowerCase().trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function docKnowledge(): AssistantKnowledgeItem[] {
  return cybermindDocRoutes.map((route) => {
    const page = getDocPage(route);
    return {
      id: `doc-${route}`,
      title: page.title,
      href: `/docs/${route}`,
      content: extractPageText(page),
      command: page.command,
      keywords: unique([
        route,
        page.eyebrow,
        page.title,
        page.description,
        ...page.sections.map((section) => section.title),
      ]),
    };
  });
}

function marketingKnowledge(): AssistantKnowledgeItem[] {
  return Object.entries(marketingPages).map(([href, page]) => ({
    id: `marketing-${href}`,
    title: page.title,
    href,
    content: extractPageText(page),
    command: page.command,
    keywords: unique([
      page.eyebrow,
      page.title,
      page.description,
      ...page.sections.map((section) => section.title),
    ]),
  }));
}

function planKnowledge(): AssistantKnowledgeItem[] {
  const rows = Object.entries(planDetails);
  return rows.map(([tier, info]) => ({
    id: `plan-${tier}`,
    title: `${info.name} plan`,
    href: "/plans",
    content: compact(
      `${info.name} pricing. Monthly ${info.priceMonthly}. Annual ${info.priceAnnual}. ${info.description}. ${info.features.join(
        ". ",
      )}.`,
    ),
    keywords: unique([tier, info.name, "pricing", "plan", ...info.features]),
  }));
}

function installKnowledge(): AssistantKnowledgeItem[] {
  return [
    {
      id: "install-linux",
      title: "Install on Linux or Kali",
      href: "/install",
      command: installCommands.linux.replace("{key}", "sk_live_cm_xxxxxxxxxxxxxxxx"),
      content:
        "Linux and Kali are the primary install path for recon, hunt, doctor, and Abhimanyu automation.",
      keywords: ["linux", "kali", "install", "bash", "recon", "hunt", "abhimanyu"],
    },
    {
      id: "install-windows",
      title: "Install on Windows",
      href: "/install",
      command: installCommands.windows.replace("{key}", "sk_live_cm_xxxxxxxxxxxxxxxx"),
      content:
        "Windows supports the chat-first CyberMind CLI workflow and command guidance. Deep offensive chains remain Linux-first.",
      keywords: ["windows", "install", "powershell", "chat", "cli"],
    },
    {
      id: "install-macos",
      title: "Install on macOS",
      href: "/install",
      command: installCommands.mac.replace("{key}", "sk_live_cm_xxxxxxxxxxxxxxxx"),
      content:
        "macOS install uses Homebrew and then key registration through the cybermind command.",
      keywords: ["mac", "macos", "brew", "install", "homebrew"],
    },
  ];
}

function accountKnowledge(): AssistantKnowledgeItem[] {
  return [
    {
      id: "account-create",
      title: "Create an account",
      href: "/auth/register",
      content:
        "Create a CyberMind account, choose Free, Pro, or Elite plan, and continue to dashboard.",
      keywords: ["signup", "register", "account", "free", "pro", "elite"],
    },
    {
      id: "account-login",
      title: "Login and reset password",
      href: "/auth/login",
      content:
        "Use login for dashboard access. Forgot-password and reset-password routes are available for credential recovery.",
      keywords: ["login", "sign in", "password", "reset", "forgot"],
    },
    {
      id: "account-dashboard",
      title: "Dashboard and API key management",
      href: "/dashboard",
      content:
        "Dashboard includes API keys, billing, usage, settings, and platform install commands with key embedding.",
      keywords: ["dashboard", "api key", "billing", "usage", "settings"],
    },
    {
      id: "company-about",
      title: "About CyberMind CLI",
      href: "/about",
      content:
        "About page explains mission, design pillars, and why CyberMind is built as command-first security infrastructure.",
      keywords: ["about", "mission", "company", "cybermind"],
    },
    {
      id: "company-careers",
      title: "CyberMind careers",
      href: "/careers",
      content:
        "Careers page lists open roles and a dynamic waitlist for the talent network.",
      keywords: ["careers", "jobs", "hiring", "roles", "waitlist"],
    },
    {
      id: "tools-waitlist",
      title: "Get tools waitlist",
      href: "/get-tools",
      content:
        "Get tools page includes tool bundle previews and waitlist for early access tracks.",
      keywords: ["tools", "bundle", "waitlist", "preview"],
    },
  ];
}

export const assistantKnowledgeBase: AssistantKnowledgeItem[] = [
  ...docKnowledge(),
  ...marketingKnowledge(),
  ...planKnowledge(),
  ...installKnowledge(),
  ...accountKnowledge(),
];

export const assistantQuickPrompts = [
  "How do I install CyberMind on Kali Linux?",
  "What is included in the Pro plan?",
  "How do I create and rotate API keys?",
  "Which modes are Linux-only?",
  "Show me the recon command flow.",
  "How can I fix setup issues quickly?",
];

export function getContextualPrompts(pathname: string) {
  if (pathname.startsWith("/install")) {
    return [
      "Give me Linux install steps with API key.",
      "What should I do if the installer fails?",
      "Does Windows support hunt mode?",
    ];
  }

  if (pathname.startsWith("/plans")) {
    return [
      "Compare Free, Pro, and Elite quickly.",
      "Is annual billing discounted?",
      "Which plan unlocks Abhimanyu mode?",
    ];
  }

  if (pathname.startsWith("/docs")) {
    return [
      "What should I read first in docs?",
      "Where is the command reference?",
      "How do I troubleshoot environment issues?",
    ];
  }

  if (pathname.startsWith("/dashboard")) {
    return [
      "Where can I create a new API key?",
      "How do plan limits affect usage?",
      "Where can I update account settings?",
    ];
  }

  return [
    "How do I get started in 3 steps?",
    "What can I do on Windows vs Linux?",
    "Where should I begin in docs?",
  ];
}

function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function scoreItem(item: AssistantKnowledgeItem, query: string, queryTokens: string[]) {
  const normalized = query.toLowerCase().trim();
  const title = item.title.toLowerCase();
  const content = item.content.toLowerCase();
  const href = item.href.toLowerCase();
  const keywords = item.keywords.join(" ");

  let score = 0;
  if (title.includes(normalized)) score += 12;
  if (content.includes(normalized)) score += 8;
  if (href.includes(normalized)) score += 6;

  for (const token of queryTokens) {
    if (title.includes(token)) score += 5;
    if (keywords.includes(token)) score += 4;
    if (content.includes(token)) score += 2;
    if (href.includes(token)) score += 2;
    if (item.command?.toLowerCase().includes(token)) score += 2;
  }

  return score;
}

export function findAssistantMatches(query: string, limit = 3) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];
  const tokens = tokenize(cleanQuery);

  return assistantKnowledgeBase
    .map((item) => ({
      item,
      score: scoreItem(item, cleanQuery, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
