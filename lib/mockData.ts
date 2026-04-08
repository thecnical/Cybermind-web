export type PlanTier = "free" | "pro" | "elite";

export type ActivityItem = {
  id: string;
  timestamp: string;
  endpoint: string;
  status: "success" | "warning" | "error";
};

export type ApiKeyRecord = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
  permission: "read" | "write";
};

export type InvoiceRecord = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
};

export const mockUser = {
  name: "Chandan Pandey",
  email: "chandan@cybermind.dev",
  avatar: "CP",
  plan: "free" as PlanTier,
  apiKey: "cp_live_xxxxxxxxxxxxxxxx",
  requestsToday: 12,
  requestsTodayLimit: 20,
  requestsMonth: 188,
  requestsMonthLimit: 600,
};

export const installCommands = {
  linux:
    "curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key {key}",
  windows:
    "iwr https://cybermind.thecnical.dev/install.ps1 | iex; cybermind --key {key}",
  mac: "curl -sL https://cybermind.thecnical.dev/install-mac.sh | bash -s -- --key {key}",
};

export const mockActivities: ActivityItem[] = [
  {
    id: "act-1",
    timestamp: "2 mins ago",
    endpoint: "POST /v1/chat/completions",
    status: "success",
  },
  {
    id: "act-2",
    timestamp: "11 mins ago",
    endpoint: "POST /v1/recon/run",
    status: "success",
  },
  {
    id: "act-3",
    timestamp: "38 mins ago",
    endpoint: "POST /v1/hunt/analyze",
    status: "warning",
  },
  {
    id: "act-4",
    timestamp: "1 hour ago",
    endpoint: "GET /v1/account/usage",
    status: "success",
  },
  {
    id: "act-5",
    timestamp: "3 hours ago",
    endpoint: "POST /v1/reports/export",
    status: "error",
  },
];

export const mockApiKeys: ApiKeyRecord[] = [
  {
    id: "key-1",
    name: "Primary CLI",
    key: "cp_live_xxxxxxxxxxxxxxxx",
    createdAt: "Apr 08, 2026",
    lastUsed: "2 mins ago",
    status: "active",
    permission: "write",
  },
  {
    id: "key-2",
    name: "Read-only analytics",
    key: "cp_live_readonlyxxxxxx",
    createdAt: "Apr 04, 2026",
    lastUsed: "Yesterday",
    status: "active",
    permission: "read",
  },
  {
    id: "key-3",
    name: "Old laptop",
    key: "cp_live_revokedxxxxxxx",
    createdAt: "Mar 28, 2026",
    lastUsed: "5 days ago",
    status: "revoked",
    permission: "write",
  },
];

export const mockInvoices: InvoiceRecord[] = [
  { id: "inv-01", date: "Apr 01, 2026", amount: "$9.00", status: "paid" },
  { id: "inv-02", date: "Mar 01, 2026", amount: "$9.00", status: "paid" },
  { id: "inv-03", date: "Feb 01, 2026", amount: "$9.00", status: "paid" },
];

export const planDetails: Record<
  PlanTier,
  {
    name: string;
    priceMonthly: string;
    priceAnnual: string;
    description: string;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    description: "A prompt-first entry point for trying CyberMind CLI.",
    features: [
      "20 requests per day",
      "AI chat only",
      "5 recon tools",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    priceMonthly: "$9",
    priceAnnual: "$90",
    description: "The main Linux operator workflow with priority backend routing.",
    features: [
      "200 requests per day",
      "Full 20-tool recon",
      "Full 11-tool hunt",
      "Priority backend and email support",
    ],
  },
  elite: {
    name: "Elite",
    priceMonthly: "$29",
    priceAnnual: "$290",
    description: "Full product surface with persistence, reports, and priority support.",
    features: [
      "Unlimited requests",
      "All modes including Abhimanyu",
      "Session persistence and PDF reports",
      "Priority support and early access",
    ],
  },
};

export function maskApiKey(key: string) {
  return `${key.slice(0, 10)}********`;
}

export function withApiKey(command: string, key: string) {
  return command.replace("{key}", key);
}
