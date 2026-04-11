// TODO: Replace with GET /admin/* API calls and realtime subscriptions.
// This file is intentionally verbose so every admin screen can render
// production-looking placeholder content without any backend dependency.

export type AdminRole = "boss" | "admin" | "support";
export type AdminSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IconName =
  | "layout-dashboard"
  | "users"
  | "line-chart"
  | "credit-card"
  | "bot"
  | "shield"
  | "settings"
  | "calendar"
  | "user-round"
  | "list-todo"
  | "forms"
  | "table"
  | "files"
  | "messages-square"
  | "inbox"
  | "receipt-text"
  | "bar-chart-3"
  | "sparkles"
  | "lock-keyhole"
  | "layers-3"
  | "bell";

export const adminSectionKeys = [
  "dashboard",
  "users",
  "analytics",
  "payments",
  "agents",
  "team",
  "support",
  "security",
  "settings",
  "calendar",
  "profile",
  "tasks",
  "forms",
  "tables",
  "pages",
  "messages",
  "inbox",
  "invoice",
  "charts",
  "ui-elements",
  "authentication",
] as const;

export type AdminSection = (typeof adminSectionKeys)[number];

export interface AdminNavItem {
  key: AdminSection;
  href: `/admin/${AdminSection}`;
  label: string;
  shortLabel: string;
  icon: IconName;
  group: "OPERATIONS" | "MAIN MENU" | "SUPPORT" | "OTHERS";
  roles: AdminRole[];
  badge?: string;
  pro?: boolean;
}

export interface StatMetric {
  label: string;
  value: number;
  change: number;
  suffix?: string;
  prefix?: string;
  hint: string;
  sparkline: number[];
  accent: "cyan" | "purple" | "green" | "orange" | "red";
  live?: boolean;
}

export interface FeedItem {
  id: string;
  time: string;
  route: string;
  user: string;
  status: "ok" | "warn" | "error";
  latency: number;
  region: string;
}

export interface ChartPoint {
  label: string;
  [key: string]: string | number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  page: string;
  action: string;
  online: boolean;
  lastSeen: string;
}

export interface AlertItem {
  id: string;
  subject: string;
  user: string;
  severity: AdminSeverity;
  createdAt: string;
  action: string;
}

export interface AdminUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  apiKey: string;
  usageToday: number;
  joinedAt: string;
  status: "Active" | "Banned" | "Suspended";
  country: string;
  company: string;
  sessions: number;
  mrr: number;
  abuseFlags: number;
}

export interface PaymentRow {
  id: string;
  user: string;
  plan: "Free" | "Pro" | "Enterprise";
  amount: number;
  status: "Succeeded" | "Failed" | "Refunded";
  date: string;
  stripeId: string;
}

export interface AgentSession {
  id: string;
  user: string;
  startedAt: string;
  currentTool: string;
  stepsCompleted: number;
  totalSteps: number;
  status: "running" | "completed" | "failed" | "killed";
  model: string;
}

export interface TicketMessage {
  id: string;
  author: string;
  side: "user" | "agent" | "system";
  body: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  avatar: string;
  plan: "Free" | "Pro" | "Enterprise";
  summary: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt: string;
  assignedAgent: string;
  status: "Open" | "In Progress" | "Resolved";
  userId: string;
}

export interface SecurityEvent {
  id: string;
  title: string;
  route: string;
  severity: AdminSeverity;
  time: string;
  detail: string;
}

export interface ConfigCard {
  title: string;
  description: string;
  items: { label: string; value: string; enabled?: boolean }[];
  bossOnly?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  time: string;
  owner: string;
  type: "review" | "incident" | "meeting" | "launch";
}

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  due: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  progress: number;
  lane: "Backlog" | "Ready" | "In Progress" | "Review" | "Done";
}

export interface FormTemplate {
  id: string;
  name: string;
  submissions: number;
  completionRate: number;
  owner: string;
  updatedAt: string;
}

export interface ContentPage {
  id: string;
  title: string;
  owner: string;
  audience: string;
  status: "Draft" | "Published" | "Needs Review";
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  unread: boolean;
  time: string;
}

export interface InboxItem {
  id: string;
  title: string;
  source: string;
  tag: string;
  time: string;
}

export interface InvoiceRow {
  id: string;
  customer: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export const roleLabels: Record<AdminRole, string> = {
  boss: "Boss",
  admin: "Admin",
  support: "Support Agent",
};

export const roleDescriptions: Record<AdminRole, string> = {
  boss: "Full operational visibility, approvals, billing, and team controls.",
  admin: "Assigned pages only with elevated operational actions.",
  support: "Support desk, profile context, and user lookup only.",
};

export const routeColors: Record<string, string> = {
  "/chat": "#00d4ff",
  "/scan": "#ff9f43",
  "/hunt": "#8b5cf6",
  "/exploit": "#ff5d73",
  "/recon": "#22c55e",
  "/analyze": "#38bdf8",
  "/abhimanyu": "#7c3aed",
  "/cve": "#f97316",
  "/report": "#a855f7",
  "/wordlist": "#10b981",
  "/plan": "#f59e0b",
  "/payment": "#06b6d4",
  "/license": "#64748b",
};

export const adminPageMeta: Record<
  AdminSection,
  { title: string; subtitle: string; eyebrow: string }
> = {
  dashboard: {
    title: "Boss Overview",
    subtitle: "Live platform health, revenue, threat pressure, and operator visibility.",
    eyebrow: "Mission Control",
  },
  users: {
    title: "Users",
    subtitle: "Lookup, filter, and act on accounts, access keys, and subscriptions.",
    eyebrow: "Identity Operations",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Traffic, provider performance, latency, and route-level behavior.",
    eyebrow: "Realtime Telemetry",
  },
  payments: {
    title: "Payments",
    subtitle: "Subscription health, revenue, retries, refunds, and failed collections.",
    eyebrow: "Billing Intelligence",
  },
  agents: {
    title: "Agents",
    subtitle: "Track Abhimanyu sessions, live tool calls, and model efficiency.",
    eyebrow: "Agent Runtime",
  },
  team: {
    title: "Team",
    subtitle: "Operator presence, pending approvals, and the audit trail.",
    eyebrow: "Operator Desk",
  },
  support: {
    title: "Support",
    subtitle: "24/7 ticket handling, customer context, and AI-assisted suggestions.",
    eyebrow: "Support Operations",
  },
  security: {
    title: "Security",
    subtitle: "Blocked entities, abuse activity, rate violations, and live alerts.",
    eyebrow: "Threat Watch",
  },
  settings: {
    title: "Settings",
    subtitle: "Routing, limits, rate control, origins, and maintenance controls.",
    eyebrow: "System Configuration",
  },
  calendar: {
    title: "Calendar",
    subtitle: "Incident reviews, launches, retro sessions, and team rituals.",
    eyebrow: "Planning Grid",
  },
  profile: {
    title: "Profile",
    subtitle: "Operator identity, workspace preferences, and access posture.",
    eyebrow: "Personal Console",
  },
  tasks: {
    title: "Tasks",
    subtitle: "Execution lanes for incidents, releases, and customer commitments.",
    eyebrow: "Execution Board",
  },
  forms: {
    title: "Forms",
    subtitle: "Internal workflows for overrides, approvals, and customer intake.",
    eyebrow: "Structured Workflows",
  },
  tables: {
    title: "Tables",
    subtitle: "Reusable data surfaces for API keys, incidents, and license states.",
    eyebrow: "Data Surfaces",
  },
  pages: {
    title: "Pages",
    subtitle: "Operational docs, release notes, trust pages, and playbooks.",
    eyebrow: "Content Hub",
  },
  messages: {
    title: "Messages",
    subtitle: "Team announcements, unread internal chatter, and escalations.",
    eyebrow: "Communication Stream",
  },
  inbox: {
    title: "Inbox",
    subtitle: "Priority work items and approvals waiting for action.",
    eyebrow: "Executive Queue",
  },
  invoice: {
    title: "Invoice",
    subtitle: "Receivables, collections, and finance follow-up actions.",
    eyebrow: "Finance Queue",
  },
  charts: {
    title: "Charts",
    subtitle: "Visual sandbox for platform KPIs, anomaly patterns, and usage curves.",
    eyebrow: "Visualization Lab",
  },
  "ui-elements": {
    title: "UI Elements",
    subtitle: "Buttons, pills, toggles, and status treatments used across the dashboard.",
    eyebrow: "Design System",
  },
  authentication: {
    title: "Authentication",
    subtitle: "Identity flows, provider health, and session assurance settings.",
    eyebrow: "Access Control",
  },
};

export const adminNav: AdminNavItem[] = [
  {
    key: "dashboard",
    href: "/admin/dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    icon: "layout-dashboard",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "users",
    href: "/admin/users",
    label: "User Lookup",
    shortLabel: "Users",
    icon: "users",
    group: "OPERATIONS",
    roles: ["boss", "admin", "support"],
  },
  {
    key: "analytics",
    href: "/admin/analytics",
    label: "Analytics",
    shortLabel: "Stats",
    icon: "line-chart",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "payments",
    href: "/admin/payments",
    label: "Payments",
    shortLabel: "Pay",
    icon: "credit-card",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "agents",
    href: "/admin/agents",
    label: "Agents",
    shortLabel: "Agents",
    icon: "bot",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "team",
    href: "/admin/team",
    label: "Team",
    shortLabel: "Team",
    icon: "layers-3",
    group: "OPERATIONS",
    roles: ["boss"],
  },
  {
    key: "support",
    href: "/admin/support",
    label: "Support",
    shortLabel: "Help",
    icon: "shield",
    group: "OPERATIONS",
    roles: ["boss", "admin", "support"],
  },
  {
    key: "security",
    href: "/admin/security",
    label: "Security",
    shortLabel: "Secure",
    icon: "shield",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "settings",
    href: "/admin/settings",
    label: "Settings",
    shortLabel: "Set",
    icon: "settings",
    group: "OPERATIONS",
    roles: ["boss", "admin"],
  },
  {
    key: "calendar",
    href: "/admin/calendar",
    label: "Calendar",
    shortLabel: "Cal",
    icon: "calendar",
    group: "MAIN MENU",
    roles: ["boss", "admin"],
  },
  {
    key: "profile",
    href: "/admin/profile",
    label: "Profile",
    shortLabel: "Me",
    icon: "user-round",
    group: "MAIN MENU",
    roles: ["boss", "admin", "support"],
  },
  {
    key: "tasks",
    href: "/admin/tasks",
    label: "Tasks",
    shortLabel: "Tasks",
    icon: "list-todo",
    group: "MAIN MENU",
    roles: ["boss", "admin"],
  },
  {
    key: "forms",
    href: "/admin/forms",
    label: "Forms",
    shortLabel: "Forms",
    icon: "forms",
    group: "MAIN MENU",
    roles: ["boss", "admin"],
  },
  {
    key: "tables",
    href: "/admin/tables",
    label: "Tables",
    shortLabel: "Tables",
    icon: "table",
    group: "MAIN MENU",
    roles: ["boss", "admin"],
  },
  {
    key: "pages",
    href: "/admin/pages",
    label: "Pages",
    shortLabel: "Pages",
    icon: "files",
    group: "MAIN MENU",
    roles: ["boss"],
  },
  {
    key: "messages",
    href: "/admin/messages",
    label: "Messages",
    shortLabel: "Msgs",
    icon: "messages-square",
    group: "SUPPORT",
    roles: ["boss", "admin", "support"],
    badge: "9",
  },
  {
    key: "inbox",
    href: "/admin/inbox",
    label: "Inbox",
    shortLabel: "Inbox",
    icon: "inbox",
    group: "SUPPORT",
    roles: ["boss"],
    pro: true,
  },
  {
    key: "invoice",
    href: "/admin/invoice",
    label: "Invoice",
    shortLabel: "Bill",
    icon: "receipt-text",
    group: "SUPPORT",
    roles: ["boss"],
    pro: true,
  },
  {
    key: "charts",
    href: "/admin/charts",
    label: "Charts",
    shortLabel: "Charts",
    icon: "bar-chart-3",
    group: "OTHERS",
    roles: ["boss", "admin"],
  },
  {
    key: "ui-elements",
    href: "/admin/ui-elements",
    label: "UI Elements",
    shortLabel: "UI",
    icon: "sparkles",
    group: "OTHERS",
    roles: ["boss", "admin"],
  },
  {
    key: "authentication",
    href: "/admin/authentication",
    label: "Authentication",
    shortLabel: "Auth",
    icon: "lock-keyhole",
    group: "OTHERS",
    roles: ["boss", "admin"],
  },
];

export function getNavForRole(role: AdminRole) {
  return adminNav.filter((item) => item.roles.includes(role));
}

export function getDefaultSectionForRole(role: AdminRole): AdminSection {
  return role === "support" ? "support" : "dashboard";
}

const dashboardSparkMap = [
  [112, 128, 124, 130, 145, 150, 166],
  [890, 904, 912, 944, 960, 978, 992],
  [1.9, 2.05, 2.1, 2.14, 2.22, 2.31, 2.4],
  [640000, 710000, 690000, 750000, 790000, 812000, 845000],
  [88, 92, 95, 98, 104, 109, 114],
  [7, 6, 8, 9, 10, 11, 9],
];

export const dashboardStats: StatMetric[] = [
  {
    label: "Total Users",
    value: 18240,
    change: 164,
    hint: "+164 today",
    sparkline: dashboardSparkMap[0],
    accent: "cyan",
  },
  {
    label: "Active Subscriptions",
    value: 2849,
    change: 6.8,
    hint: "Renewal rate 94.1%",
    sparkline: dashboardSparkMap[1],
    accent: "purple",
  },
  {
    label: "MRR",
    value: 2400,
    prefix: "$",
    change: 12.6,
    hint: "vs last month",
    sparkline: dashboardSparkMap[2],
    accent: "green",
  },
  {
    label: "API Requests Today",
    value: 845000,
    change: 18.2,
    hint: "Across all routes",
    sparkline: dashboardSparkMap[3],
    accent: "orange",
    live: true,
  },
  {
    label: "Active AI Agent Sessions",
    value: 114,
    change: 8.1,
    hint: "Realtime runtime state",
    sparkline: dashboardSparkMap[4],
    accent: "cyan",
    live: true,
  },
  {
    label: "Abuse Flags",
    value: 9,
    change: -12.4,
    hint: "Last 24 hours",
    sparkline: dashboardSparkMap[5],
    accent: "red",
  },
];

export const realtimeFeed: FeedItem[] = [
  { id: "feed-1", time: "09:42:11", route: "/chat", user: "deepak@acme.io", status: "ok", latency: 641, region: "Mumbai" },
  { id: "feed-2", time: "09:42:19", route: "/scan", user: "tina@pulse.so", status: "warn", latency: 1210, region: "Frankfurt" },
  { id: "feed-3", time: "09:42:28", route: "/hunt", user: "ops@verse.app", status: "ok", latency: 842, region: "Virginia" },
  { id: "feed-4", time: "09:42:41", route: "/exploit", user: "sec@vault.one", status: "error", latency: 1680, region: "Singapore" },
  { id: "feed-5", time: "09:43:01", route: "/recon", user: "rhythm@atlas.dev", status: "ok", latency: 411, region: "Bengaluru" },
  { id: "feed-6", time: "09:43:17", route: "/analyze", user: "shawn@delta.ai", status: "ok", latency: 503, region: "London" },
  { id: "feed-7", time: "09:43:31", route: "/abhimanyu", user: "hunter@redgrid.com", status: "warn", latency: 1442, region: "Tokyo" },
  { id: "feed-8", time: "09:43:49", route: "/cve", user: "samir@arclabs.io", status: "ok", latency: 386, region: "Sydney" },
  { id: "feed-9", time: "09:44:10", route: "/report", user: "ops@safefox.com", status: "ok", latency: 558, region: "Toronto" },
  { id: "feed-10", time: "09:44:23", route: "/wordlist", user: "rohan@signalx.ai", status: "ok", latency: 301, region: "Mumbai" },
  { id: "feed-11", time: "09:44:34", route: "/chat", user: "rhea@northwind.io", status: "ok", latency: 522, region: "Virginia" },
  { id: "feed-12", time: "09:44:50", route: "/recon", user: "infra@mod.ai", status: "warn", latency: 902, region: "Bengaluru" },
];

export const requestBreakdownSeries: ChartPoint[] = [
  { label: "Mon", chat: 120000, scan: 86000, hunt: 54000, exploit: 10000, recon: 92000 },
  { label: "Tue", chat: 132000, scan: 91000, hunt: 51000, exploit: 12000, recon: 98000 },
  { label: "Wed", chat: 140000, scan: 95000, hunt: 56000, exploit: 11000, recon: 102000 },
  { label: "Thu", chat: 144000, scan: 98000, hunt: 63000, exploit: 13000, recon: 109000 },
  { label: "Fri", chat: 158000, scan: 101000, hunt: 68000, exploit: 15000, recon: 114000 },
  { label: "Sat", chat: 149000, scan: 93000, hunt: 61000, exploit: 14000, recon: 110000 },
  { label: "Sun", chat: 164000, scan: 106000, hunt: 72000, exploit: 17000, recon: 118000 },
];

export const modelUsageDistribution = [
  { name: "Groq", value: 28, fill: "#00d4ff" },
  { name: "Mistral", value: 18, fill: "#7c3aed" },
  { name: "OpenRouter", value: 16, fill: "#8b5cf6" },
  { name: "Cerebras", value: 11, fill: "#10b981" },
  { name: "NVIDIA", value: 14, fill: "#f59e0b" },
  { name: "SambaNova", value: 13, fill: "#fb7185" },
];

export const revenueLastSixMonths: ChartPoint[] = [
  { label: "Nov", revenue: 1720 },
  { label: "Dec", revenue: 1840 },
  { label: "Jan", revenue: 1955 },
  { label: "Feb", revenue: 2110 },
  { label: "Mar", revenue: 2230 },
  { label: "Apr", revenue: 2400 },
];

export const liveTeamActivity: TeamMember[] = [
  { id: "tm-1", name: "Chandan Pandey", role: "Boss", avatar: "CP", page: "/admin/dashboard", action: "reviewed critical abuse flag", online: true, lastSeen: "just now" },
  { id: "tm-2", name: "Asha Verma", role: "Admin", avatar: "AV", page: "/admin/payments", action: "retried failed subscription charge", online: true, lastSeen: "1m ago" },
  { id: "tm-3", name: "Nikhil Rao", role: "Admin", avatar: "NR", page: "/admin/security", action: "blocked 3 suspicious IPs", online: true, lastSeen: "3m ago" },
  { id: "tm-4", name: "Mia Flores", role: "Support Agent", avatar: "MF", page: "/admin/support", action: "resolved ticket SUP-1042", online: true, lastSeen: "just now" },
  { id: "tm-5", name: "Jade Carter", role: "Support Agent", avatar: "JC", page: "/admin/users", action: "looked up revoked API key status", online: false, lastSeen: "12m ago" },
  { id: "tm-6", name: "Ishaan Patel", role: "Admin", avatar: "IP", page: "/admin/agents", action: "terminated stalled Abhimanyu run", online: true, lastSeen: "2m ago" },
];

export const abuseAlerts: AlertItem[] = [
  { id: "al-1", subject: "Prompt injection burst on /chat", user: "deepak@acme.io", severity: "LOW", createdAt: "5m ago", action: "Added to watchlist" },
  { id: "al-2", subject: "Excessive recon fan-out", user: "ops@verse.app", severity: "MEDIUM", createdAt: "9m ago", action: "Throttled account" },
  { id: "al-3", subject: "Abhimanyu exploit chain matched exploit-kit signature", user: "hunter@redgrid.com", severity: "CRITICAL", createdAt: "13m ago", action: "Session killed, Boss notified" },
  { id: "al-4", subject: "Failed payment linked to continued enterprise traffic", user: "rhea@northwind.io", severity: "HIGH", createdAt: "18m ago", action: "Grace period shortened" },
  { id: "al-5", subject: "Shared key detected across 7 devices", user: "samir@arclabs.io", severity: "HIGH", createdAt: "31m ago", action: "API key revoked" },
];

const userSeed = [
  ["Aarav Mehta", "am", "aarav@pentestlabs.io", "Enterprise", 48210, "2024-05-11", "Active", "India", "Pentest Labs", 4, 299, 0],
  ["Emily Chen", "ec", "emily@northwind.io", "Pro", 18240, "2024-08-04", "Active", "United States", "Northwind", 2, 49, 1],
  ["Vikram Shah", "vs", "vikram@atlasops.ai", "Enterprise", 71200, "2023-12-19", "Active", "India", "AtlasOps", 6, 299, 0],
  ["Riya Sood", "rs", "riya@safegrid.dev", "Free", 920, "2025-02-16", "Suspended", "India", "SafeGrid", 1, 0, 2],
  ["Marcus Hill", "mh", "marcus@vectorsec.com", "Pro", 12040, "2024-11-08", "Active", "Canada", "VectorSec", 3, 49, 0],
  ["Sara Khan", "sk", "sara@cipherstack.io", "Enterprise", 66280, "2024-03-09", "Banned", "UAE", "CipherStack", 0, 299, 4],
  ["Dev Patel", "dp", "dev@redforge.ai", "Pro", 14010, "2024-07-21", "Active", "India", "RedForge", 2, 49, 0],
  ["Nina Brooks", "nb", "nina@trailshield.com", "Enterprise", 54220, "2024-01-17", "Active", "United Kingdom", "TrailShield", 5, 299, 1],
  ["Kabir Joshi", "kj", "kabir@cloudward.ai", "Free", 430, "2025-01-12", "Active", "India", "CloudWard", 1, 0, 0],
  ["Owen Price", "op", "owen@ironveil.io", "Pro", 20130, "2024-09-30", "Active", "Australia", "IronVeil", 2, 49, 0],
  ["Fatima Noor", "fn", "fatima@zenops.ai", "Enterprise", 78810, "2023-10-25", "Active", "Singapore", "ZenOps", 7, 299, 2],
  ["Noah Reed", "nr", "noah@crimsonfox.dev", "Pro", 13210, "2024-06-13", "Suspended", "United States", "CrimsonFox", 0, 49, 2],
] as const;

export const adminUsers: AdminUser[] = userSeed.map((entry, index) => ({
  id: `usr-${index + 1}`,
  name: entry[0],
  avatar: entry[1].toUpperCase(),
  email: entry[2],
  plan: entry[3],
  apiKey: `cm_${entry[1]}••••••••${1000 + index}`,
  usageToday: entry[4],
  joinedAt: entry[5],
  status: entry[6],
  country: entry[7],
  company: entry[8],
  sessions: entry[9],
  mrr: entry[10],
  abuseFlags: entry[11],
}));

export const userUsageHistory: Record<string, { day: string; usage: number }[]> = Object.fromEntries(
  adminUsers.map((user, index) => [
    user.id,
    Array.from({ length: 30 }, (_, day) => ({
      day: `${day + 1}`,
      usage: Math.max(120, Math.round(user.usageToday / 1.8 + Math.sin(day / 3 + index) * 1200 + day * 40)),
    })),
  ]),
);

export const userPaymentHistory: Record<
  string,
  { label: string; amount: number; status: "Succeeded" | "Refunded" | "Failed" }[]
> = Object.fromEntries(
  adminUsers.map((user) => [
    user.id,
    [
      { label: "Jan", amount: user.plan === "Enterprise" ? 299 : user.plan === "Pro" ? 49 : 0, status: "Succeeded" },
      { label: "Feb", amount: user.plan === "Enterprise" ? 299 : user.plan === "Pro" ? 49 : 0, status: "Succeeded" },
      { label: "Mar", amount: user.plan === "Enterprise" ? 299 : user.plan === "Pro" ? 49 : 0, status: user.status === "Suspended" ? "Failed" : "Succeeded" },
      { label: "Apr", amount: user.plan === "Enterprise" ? 299 : user.plan === "Pro" ? 49 : 0, status: user.status === "Banned" ? "Refunded" : "Succeeded" },
    ],
  ]),
);

export const routeBreakdown = [
  { route: "/chat", requests: 312450, avgLatency: 642, errorRate: 0.9, sparkline: [20, 22, 23, 24, 25, 26, 27] },
  { route: "/scan", requests: 168120, avgLatency: 1108, errorRate: 1.8, sparkline: [11, 12, 14, 15, 15, 17, 18] },
  { route: "/recon", requests: 205440, avgLatency: 484, errorRate: 0.6, sparkline: [15, 16, 18, 19, 21, 22, 23] },
  { route: "/hunt", requests: 120830, avgLatency: 812, errorRate: 1.2, sparkline: [9, 10, 10, 11, 13, 13, 14] },
  { route: "/exploit", requests: 32890, avgLatency: 1532, errorRate: 4.2, sparkline: [3, 4, 4, 5, 5, 6, 7] },
  { route: "/analyze", requests: 82320, avgLatency: 558, errorRate: 0.8, sparkline: [6, 7, 7, 8, 9, 10, 10] },
  { route: "/abhimanyu", requests: 28410, avgLatency: 1460, errorRate: 3.9, sparkline: [2, 2, 3, 4, 4, 5, 5] },
  { route: "/cve", requests: 61950, avgLatency: 332, errorRate: 0.5, sparkline: [5, 6, 7, 7, 8, 8, 9] },
  { route: "/report", requests: 41810, avgLatency: 690, errorRate: 1.1, sparkline: [4, 4, 5, 5, 6, 6, 7] },
  { route: "/wordlist", requests: 26890, avgLatency: 278, errorRate: 0.4, sparkline: [2, 2, 3, 3, 3, 4, 4] },
];

export const aiProviderUsage = [
  { name: "Groq", requests: 231200, successRate: 99.2, latency: 438 },
  { name: "Mistral", requests: 145920, successRate: 98.4, latency: 502 },
  { name: "OpenRouter", requests: 128100, successRate: 97.8, latency: 690 },
  { name: "Cerebras", requests: 75220, successRate: 99.1, latency: 361 },
  { name: "NVIDIA", requests: 84200, successRate: 98.9, latency: 404 },
  { name: "SambaNova", requests: 68200, successRate: 98.2, latency: 516 },
  { name: "HuggingFace", requests: 41410, successRate: 96.8, latency: 820 },
  { name: "Bytez", requests: 22350, successRate: 95.9, latency: 912 },
];

export const geographicHotspots = [
  { country: "India", x: 70, y: 52, sessions: 322 },
  { country: "United States", x: 22, y: 42, sessions: 286 },
  { country: "United Kingdom", x: 46, y: 30, sessions: 91 },
  { country: "Germany", x: 50, y: 33, sessions: 84 },
  { country: "Singapore", x: 74, y: 58, sessions: 72 },
  { country: "Australia", x: 82, y: 72, sessions: 58 },
  { country: "Brazil", x: 33, y: 69, sessions: 41 },
  { country: "UAE", x: 58, y: 43, sessions: 39 },
];

export const errorRateTimeline: ChartPoint[] = [
  { label: "00:00", rate: 0.6 },
  { label: "04:00", rate: 0.8 },
  { label: "08:00", rate: 1.1 },
  { label: "12:00", rate: 1.9 },
  { label: "16:00", rate: 1.4 },
  { label: "20:00", rate: 1.2 },
  { label: "24:00", rate: 0.9 },
];

export const responseTimeHeatmap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => ({
  day,
  values: Array.from({ length: 12 }, (_, hourIndex) => 220 + dayIndex * 45 + hourIndex * 34 + ((hourIndex + dayIndex) % 3) * 55),
}));

export const topApiUsers = adminUsers
  .slice()
  .sort((a, b) => b.usageToday - a.usageToday)
  .slice(0, 10)
  .map((user, index) => ({
    rank: index + 1,
    name: user.name,
    email: user.email,
    requests: user.usageToday,
    plan: user.plan,
  }));

export const paymentStats = [
  { label: "MRR", value: 2400, change: 12.4, prefix: "$", hint: "New enterprise renewals" },
  { label: "Active subscriptions", value: 2849, change: 4.2, hint: "Across paid plans" },
  { label: "Churn rate", value: 2.4, change: -0.6, suffix: "%", hint: "This month" },
  { label: "New subscriptions today", value: 31, change: 8.8, hint: "Compared to yesterday" },
];

export const transactions: PaymentRow[] = [
  { id: "txn-1", user: "Aarav Mehta", plan: "Enterprise", amount: 299, status: "Succeeded", date: "2026-04-11 09:03", stripeId: "pi_3Q11AA" },
  { id: "txn-2", user: "Emily Chen", plan: "Pro", amount: 49, status: "Succeeded", date: "2026-04-11 08:47", stripeId: "pi_3Q11AB" },
  { id: "txn-3", user: "Vikram Shah", plan: "Enterprise", amount: 299, status: "Refunded", date: "2026-04-11 08:21", stripeId: "pi_3Q11AC" },
  { id: "txn-4", user: "Riya Sood", plan: "Free", amount: 0, status: "Succeeded", date: "2026-04-11 08:02", stripeId: "pi_3Q11AD" },
  { id: "txn-5", user: "Marcus Hill", plan: "Pro", amount: 49, status: "Failed", date: "2026-04-11 07:49", stripeId: "pi_3Q11AE" },
  { id: "txn-6", user: "Sara Khan", plan: "Enterprise", amount: 299, status: "Succeeded", date: "2026-04-11 07:20", stripeId: "pi_3Q11AF" },
  { id: "txn-7", user: "Dev Patel", plan: "Pro", amount: 49, status: "Succeeded", date: "2026-04-11 06:55", stripeId: "pi_3Q11AG" },
  { id: "txn-8", user: "Nina Brooks", plan: "Enterprise", amount: 299, status: "Succeeded", date: "2026-04-11 06:22", stripeId: "pi_3Q11AH" },
  { id: "txn-9", user: "Kabir Joshi", plan: "Free", amount: 0, status: "Succeeded", date: "2026-04-11 05:56", stripeId: "pi_3Q11AI" },
  { id: "txn-10", user: "Owen Price", plan: "Pro", amount: 49, status: "Succeeded", date: "2026-04-11 05:28", stripeId: "pi_3Q11AJ" },
  { id: "txn-11", user: "Fatima Noor", plan: "Enterprise", amount: 299, status: "Failed", date: "2026-04-11 05:03", stripeId: "pi_3Q11AK" },
  { id: "txn-12", user: "Noah Reed", plan: "Pro", amount: 49, status: "Succeeded", date: "2026-04-11 04:42", stripeId: "pi_3Q11AL" },
];

export const revenueLastTwelveMonths: ChartPoint[] = [
  { label: "May", value: 980 },
  { label: "Jun", value: 1120 },
  { label: "Jul", value: 1240 },
  { label: "Aug", value: 1460 },
  { label: "Sep", value: 1540 },
  { label: "Oct", value: 1680 },
  { label: "Nov", value: 1720 },
  { label: "Dec", value: 1840 },
  { label: "Jan", value: 1955 },
  { label: "Feb", value: 2110 },
  { label: "Mar", value: 2230 },
  { label: "Apr", value: 2400 },
];

export const failedPayments = transactions.filter((row) => row.status === "Failed");

export const subscriptionBreakdown = [
  { name: "Free", value: 61, fill: "#334155" },
  { name: "Pro", value: 29, fill: "#00d4ff" },
  { name: "Enterprise", value: 10, fill: "#7c3aed" },
];

export const agentSessions: AgentSession[] = [
  { id: "abh-2011", user: "Aarav Mehta", startedAt: "09:04", currentTool: "nuclei", stepsCompleted: 9, totalSteps: 12, status: "running", model: "Groq" },
  { id: "abh-2010", user: "Emily Chen", startedAt: "08:50", currentTool: "subfinder", stepsCompleted: 12, totalSteps: 12, status: "completed", model: "Mistral" },
  { id: "abh-2009", user: "Vikram Shah", startedAt: "08:41", currentTool: "assetfinder", stepsCompleted: 6, totalSteps: 12, status: "running", model: "OpenRouter" },
  { id: "abh-2008", user: "Marcus Hill", startedAt: "08:21", currentTool: "amass", stepsCompleted: 3, totalSteps: 12, status: "failed", model: "SambaNova" },
  { id: "abh-2007", user: "Sara Khan", startedAt: "08:04", currentTool: "sqlmap", stepsCompleted: 5, totalSteps: 12, status: "killed", model: "NVIDIA" },
  { id: "abh-2006", user: "Dev Patel", startedAt: "07:47", currentTool: "httpx", stepsCompleted: 12, totalSteps: 12, status: "completed", model: "Groq" },
  { id: "abh-2005", user: "Nina Brooks", startedAt: "07:30", currentTool: "dalfox", stepsCompleted: 7, totalSteps: 12, status: "running", model: "Cerebras" },
  { id: "abh-2004", user: "Owen Price", startedAt: "07:13", currentTool: "katana", stepsCompleted: 4, totalSteps: 12, status: "running", model: "HuggingFace" },
  { id: "abh-2003", user: "Fatima Noor", startedAt: "06:57", currentTool: "ffuf", stepsCompleted: 11, totalSteps: 12, status: "completed", model: "Bytez" },
  { id: "abh-2002", user: "Noah Reed", startedAt: "06:40", currentTool: "naabu", stepsCompleted: 2, totalSteps: 12, status: "failed", model: "OpenRouter" },
];

export const toolCallFeed: Record<string, FeedItem[]> = Object.fromEntries(
  agentSessions.map((session, index) => [
    session.id,
    Array.from({ length: 8 }, (_, itemIndex) => {
      const route = Object.keys(routeColors)[(index + itemIndex) % Object.keys(routeColors).length];
      return {
        id: `${session.id}-${itemIndex}`,
        time: `09:${10 + itemIndex}:${12 + itemIndex}`,
        route,
        user: session.user.toLowerCase().replace(" ", "."),
        status: itemIndex === 6 && session.status === "failed" ? "error" : itemIndex === 5 ? "warn" : "ok",
        latency: 260 + itemIndex * 90 + index * 20,
        region: ["Mumbai", "Virginia", "Frankfurt", "Singapore"][itemIndex % 4],
      };
    }),
  ]),
);

export const agentPerformance = [
  { label: "Avg session duration", value: 18.4, suffix: "m" },
  { label: "Tools per session", value: 11.7 },
  { label: "Success rate", value: 93.2, suffix: "%" },
  { label: "Parallel sessions", value: 14 },
];

export const modelUsagePerSession = [
  { label: "Groq", value: 31 },
  { label: "Mistral", value: 16 },
  { label: "OpenRouter", value: 19 },
  { label: "Cerebras", value: 11 },
  { label: "NVIDIA", value: 9 },
  { label: "SambaNova", value: 7 },
  { label: "HuggingFace", value: 4 },
  { label: "Bytez", value: 3 },
];

export const teamMembers = liveTeamActivity;

export const pendingRequests = [
  { id: "req-1", requester: "Asha Verma", type: "Refund approval", target: "Vikram Shah", detail: "Refund 1 month after duplicated enterprise invoice", createdAt: "6m ago" },
  { id: "req-2", requester: "Nikhil Rao", type: "Ban request", target: "Sara Khan", detail: "Exploit chain bypassed guardrails twice", createdAt: "10m ago" },
  { id: "req-3", requester: "Mia Flores", type: "Plan override", target: "Emily Chen", detail: "Temporary enterprise limit increase for launch week", createdAt: "18m ago" },
];

export const auditLog = [
  { id: "audit-1", actor: "Chandan Pandey", action: "Approved refund", resource: "txn-3", when: "09:01" },
  { id: "audit-2", actor: "Asha Verma", action: "Retried failed charge", resource: "txn-11", when: "08:55" },
  { id: "audit-3", actor: "Nikhil Rao", action: "Revoked API key", resource: "usr-6", when: "08:49" },
  { id: "audit-4", actor: "Mia Flores", action: "Resolved support ticket", resource: "SUP-1042", when: "08:30" },
  { id: "audit-5", actor: "Ishaan Patel", action: "Killed agent session", resource: "abh-2007", when: "08:11" },
  { id: "audit-6", actor: "Chandan Pandey", action: "Changed plan limits", resource: "settings.plan-limits", when: "07:58" },
  { id: "audit-7", actor: "Asha Verma", action: "Impersonated user", resource: "usr-2", when: "07:33" },
  { id: "audit-8", actor: "Jade Carter", action: "Escalated ticket", resource: "SUP-1034", when: "07:18" },
  { id: "audit-9", actor: "Nikhil Rao", action: "Blocked IP", resource: "91.203.11.24", when: "06:56" },
  { id: "audit-10", actor: "Chandan Pandey", action: "Sent announcement", resource: "system.banner", when: "06:12" },
];

export const supportStats = [
  { label: "Open tickets", value: 42 },
  { label: "Avg response time", value: 6.1, suffix: "m" },
  { label: "Resolved today", value: 67 },
  { label: "CSAT", value: 96.2, suffix: "%" },
];

export const supportTickets: SupportTicket[] = [
  { id: "SUP-1047", name: "Aarav Mehta", avatar: "AM", plan: "Enterprise", summary: "Abhimanyu session stopped before report export", priority: "HIGH", createdAt: "8m ago", assignedAgent: "Mia Flores", status: "Open", userId: "usr-1" },
  { id: "SUP-1046", name: "Emily Chen", avatar: "EC", plan: "Pro", summary: "Need API key regeneration guidance", priority: "MEDIUM", createdAt: "17m ago", assignedAgent: "Jade Carter", status: "In Progress", userId: "usr-2" },
  { id: "SUP-1045", name: "Vikram Shah", avatar: "VS", plan: "Enterprise", summary: "Charge duplicated after manual retry", priority: "URGENT", createdAt: "28m ago", assignedAgent: "Asha Verma", status: "Open", userId: "usr-3" },
  { id: "SUP-1044", name: "Riya Sood", avatar: "RS", plan: "Free", summary: "Account suspended after failed scan burst", priority: "HIGH", createdAt: "34m ago", assignedAgent: "Mia Flores", status: "In Progress", userId: "usr-4" },
  { id: "SUP-1043", name: "Marcus Hill", avatar: "MH", plan: "Pro", summary: "Plan upgrade invoice missing in inbox", priority: "LOW", createdAt: "49m ago", assignedAgent: "Jade Carter", status: "Resolved", userId: "usr-5" },
  { id: "SUP-1042", name: "Sara Khan", avatar: "SK", plan: "Enterprise", summary: "Ban appeal after exploit signature match", priority: "URGENT", createdAt: "55m ago", assignedAgent: "Chandan Pandey", status: "Resolved", userId: "usr-6" },
  { id: "SUP-1041", name: "Dev Patel", avatar: "DP", plan: "Pro", summary: "Recon limits reached earlier than expected", priority: "MEDIUM", createdAt: "1h ago", assignedAgent: "Mia Flores", status: "Open", userId: "usr-7" },
  { id: "SUP-1040", name: "Nina Brooks", avatar: "NB", plan: "Enterprise", summary: "Payment method expired before renewal", priority: "HIGH", createdAt: "1h ago", assignedAgent: "Asha Verma", status: "In Progress", userId: "usr-8" },
  { id: "SUP-1039", name: "Kabir Joshi", avatar: "KJ", plan: "Free", summary: "Login loop after magic link sign-in", priority: "MEDIUM", createdAt: "1h ago", assignedAgent: "Jade Carter", status: "Open", userId: "usr-9" },
  { id: "SUP-1038", name: "Owen Price", avatar: "OP", plan: "Pro", summary: "Need report attachment in PDF format", priority: "LOW", createdAt: "2h ago", assignedAgent: "Mia Flores", status: "Resolved", userId: "usr-10" },
];

export const ticketMessages: Record<string, TicketMessage[]> = {
  "SUP-1047": [
    { id: "m-1", author: "Aarav Mehta", side: "user", body: "The agent completed most of the flow but the export step never finished.", timestamp: "09:08" },
    { id: "m-2", author: "Mia Flores", side: "agent", body: "I’m checking the session logs and your payment state now.", timestamp: "09:10" },
    { id: "m-3", author: "CyberMind AI Agent", side: "system", body: "Context: Enterprise plan active. Last 5 actions show report render timeout after API key rotation.", timestamp: "09:10" },
  ],
  "SUP-1046": [
    { id: "m-4", author: "Emily Chen", side: "user", body: "I revoked my key by mistake. Can I regenerate without losing the active session?", timestamp: "08:55" },
    { id: "m-5", author: "Jade Carter", side: "agent", body: "Yes. I’m confirming whether the session token is still valid.", timestamp: "08:57" },
  ],
  "SUP-1045": [
    { id: "m-6", author: "Vikram Shah", side: "user", body: "I see two charges for the same enterprise renewal. Please reverse one.", timestamp: "08:43" },
    { id: "m-7", author: "Asha Verma", side: "agent", body: "Escalating for refund approval because the duplicate charge is confirmed.", timestamp: "08:48" },
  ],
};

export const aiSupportSuggestions = {
  title: "AI Support Agent",
  placeholder: "Ask AI Agent about this user...",
  responses: [
    "User's API key was revoked 2h ago. Suggest regenerating a key from the Users panel.",
    "Payment status is active, but the last Stripe retry failed on a backup card.",
    "Last 5 actions show a recon burst from two new devices. Recommend session review before unbanning.",
  ],
};

export const blockedIps = [
  { ip: "91.203.11.24", reason: "Credential stuffing", blockedAt: "09:01", actor: "Nikhil Rao" },
  { ip: "113.88.27.18", reason: "Exploit route fuzzing", blockedAt: "08:48", actor: "Auto policy" },
  { ip: "172.90.14.3", reason: "Abhimanyu misuse", blockedAt: "08:40", actor: "Auto policy" },
  { ip: "201.14.98.62", reason: "Tor exit node", blockedAt: "08:11", actor: "Nikhil Rao" },
  { ip: "77.188.10.14", reason: "Rate-limit bypass", blockedAt: "07:44", actor: "Auto policy" },
  { ip: "139.71.8.201", reason: "Suspicious webhook replay", blockedAt: "07:26", actor: "Auto policy" },
  { ip: "45.67.188.18", reason: "Payment brute force", blockedAt: "07:12", actor: "Asha Verma" },
  { ip: "181.23.19.42", reason: "Repeated key theft probe", blockedAt: "06:58", actor: "Auto policy" },
  { ip: "198.17.41.87", reason: "API scraping", blockedAt: "06:24", actor: "Auto policy" },
  { ip: "63.91.2.144", reason: "Credential replay", blockedAt: "05:55", actor: "Auto policy" },
];

export const rateLimitViolations = [
  { user: "Aarav Mehta", route: "/exploit", count: 38, timestamp: "09:06" },
  { user: "Emily Chen", route: "/chat", count: 16, timestamp: "08:52" },
  { user: "Vikram Shah", route: "/scan", count: 24, timestamp: "08:46" },
  { user: "Riya Sood", route: "/recon", count: 43, timestamp: "08:37" },
  { user: "Marcus Hill", route: "/report", count: 15, timestamp: "08:14" },
  { user: "Sara Khan", route: "/abhimanyu", count: 31, timestamp: "08:02" },
  { user: "Dev Patel", route: "/chat", count: 14, timestamp: "07:45" },
  { user: "Nina Brooks", route: "/scan", count: 22, timestamp: "07:29" },
  { user: "Kabir Joshi", route: "/wordlist", count: 18, timestamp: "06:58" },
  { user: "Owen Price", route: "/hunt", count: 21, timestamp: "06:35" },
];

export const securityAbuseFlags = [
  { user: "Sara Khan", type: "Exploit signature", severity: "CRITICAL", triggeredAt: "08:04", actionTaken: "User banned" },
  { user: "Riya Sood", type: "Recon flood", severity: "HIGH", triggeredAt: "08:32", actionTaken: "Session throttled" },
  { user: "Emily Chen", type: "Prompt injection", severity: "MEDIUM", triggeredAt: "08:58", actionTaken: "Logged for review" },
  { user: "Aarav Mehta", type: "Key sharing", severity: "HIGH", triggeredAt: "09:06", actionTaken: "API key rotated" },
  { user: "Dev Patel", type: "License bypass", severity: "LOW", triggeredAt: "07:41", actionTaken: "Warning sent" },
  { user: "Nina Brooks", type: "Failed auth burst", severity: "MEDIUM", triggeredAt: "07:21", actionTaken: "Challenge enforced" },
  { user: "Kabir Joshi", type: "Scraping pattern", severity: "LOW", triggeredAt: "06:57", actionTaken: "Watchlist updated" },
  { user: "Owen Price", type: "Geo mismatch", severity: "MEDIUM", triggeredAt: "06:29", actionTaken: "Session challenged" },
  { user: "Fatima Noor", type: "Token replay", severity: "HIGH", triggeredAt: "06:12", actionTaken: "All sessions revoked" },
  { user: "Noah Reed", type: "Chargeback risk", severity: "HIGH", triggeredAt: "05:48", actionTaken: "Billing hold" },
];

export const securityFeed: SecurityEvent[] = [
  { id: "sec-1", title: "Exploit route anomaly", route: "/exploit", severity: "CRITICAL", time: "09:08", detail: "Payload family matched known exploit-kit pattern." },
  { id: "sec-2", title: "Burst auth failures", route: "/auth/login", severity: "HIGH", time: "08:56", detail: "38 failures from 3 IPs within 90s." },
  { id: "sec-3", title: "Key theft attempt", route: "/license", severity: "HIGH", time: "08:40", detail: "Replay detected against revoked token." },
  { id: "sec-4", title: "Prompt injection cluster", route: "/chat", severity: "MEDIUM", time: "08:18", detail: "Sanitizer caught 14 multi-message attempts." },
  { id: "sec-5", title: "Recon abuse spike", route: "/recon", severity: "HIGH", time: "07:59", detail: "Burst across 2 enterprise workspaces." },
  { id: "sec-6", title: "Payment fraud screen", route: "/payment", severity: "LOW", time: "07:14", detail: "Manual review queued for 1 duplicate card fingerprint." },
];

export const abuseEventsTimeline: ChartPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 10 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 18 },
  { label: "Fri", value: 13 },
  { label: "Sat", value: 9 },
  { label: "Sun", value: 11 },
];

export const topFlaggedRoutes = [
  { route: "/exploit", value: 34 },
  { route: "/recon", value: 28 },
  { route: "/chat", value: 17 },
  { route: "/payment", value: 9 },
  { route: "/license", value: 7 },
];

export const systemConfigCards: ConfigCard[] = [
  {
    title: "AI Model Routing",
    description: "Control active providers and their failover order.",
    items: [
      { label: "Groq", value: "Priority 1", enabled: true },
      { label: "Mistral", value: "Priority 2", enabled: true },
      { label: "OpenRouter", value: "Priority 3", enabled: true },
      { label: "Cerebras", value: "Priority 4", enabled: false },
    ],
  },
  {
    title: "Plan Limits",
    description: "Requests and session limits per paid tier.",
    items: [
      { label: "Free", value: "1,000 req/day" },
      { label: "Pro", value: "25,000 req/day" },
      { label: "Enterprise", value: "Custom contract" },
    ],
  },
  {
    title: "Rate Limiter",
    description: "Request ceilings by plan and burst windows.",
    items: [
      { label: "Free", value: "40 rpm" },
      { label: "Pro", value: "120 rpm" },
      { label: "Enterprise", value: "300 rpm" },
    ],
  },
  {
    title: "CORS Origins",
    description: "Trusted frontends allowed to call the platform.",
    items: [
      { label: "app.cybermind.ai", value: "Allowed" },
      { label: "dashboard.cybermind.ai", value: "Allowed" },
      { label: "admin.cybermind.ai", value: "Allowed" },
    ],
  },
  {
    title: "Maintenance Mode",
    description: "Pause interactive traffic while preserving readonly access.",
    items: [
      { label: "Current state", value: "Off", enabled: false },
      { label: "Grace period", value: "10 minutes" },
      { label: "Audience", value: "All tenants" },
    ],
    bossOnly: true,
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "cal-1", title: "Threat review", day: 2, time: "10:00", owner: "Boss", type: "review" },
  { id: "cal-2", title: "Launch war-room", day: 5, time: "14:30", owner: "Admin", type: "launch" },
  { id: "cal-3", title: "Security sync", day: 8, time: "16:00", owner: "Admin", type: "meeting" },
  { id: "cal-4", title: "Incident retro", day: 12, time: "18:15", owner: "Boss", type: "incident" },
  { id: "cal-5", title: "Billing review", day: 15, time: "11:00", owner: "Boss", type: "review" },
  { id: "cal-6", title: "Support QA", day: 18, time: "09:30", owner: "Support", type: "meeting" },
  { id: "cal-7", title: "Provider routing tune", day: 21, time: "13:00", owner: "Admin", type: "launch" },
  { id: "cal-8", title: "Monthly incident review", day: 27, time: "17:00", owner: "Boss", type: "incident" },
];

export const taskBoard: TaskItem[] = [
  { id: "tsk-1", title: "Approve enterprise refund for duplicate charge", assignee: "Boss", due: "Today", priority: "Critical", progress: 88, lane: "Review" },
  { id: "tsk-2", title: "Update exploit route abuse heuristics", assignee: "Nikhil Rao", due: "Today", priority: "High", progress: 62, lane: "In Progress" },
  { id: "tsk-3", title: "Prepare launch announcement for Groq failover", assignee: "Asha Verma", due: "Tomorrow", priority: "Medium", progress: 25, lane: "Ready" },
  { id: "tsk-4", title: "Resolve missing invoice PDF attachment issue", assignee: "Mia Flores", due: "Tomorrow", priority: "High", progress: 72, lane: "In Progress" },
  { id: "tsk-5", title: "Audit support macros for payment disputes", assignee: "Jade Carter", due: "Apr 14", priority: "Low", progress: 12, lane: "Backlog" },
  { id: "tsk-6", title: "Refresh blocked IP export automation", assignee: "Ishaan Patel", due: "Apr 14", priority: "Medium", progress: 44, lane: "Ready" },
  { id: "tsk-7", title: "Tune response-time alert thresholds", assignee: "Nikhil Rao", due: "Apr 15", priority: "High", progress: 51, lane: "In Progress" },
  { id: "tsk-8", title: "Rewrite enterprise onboarding steps", assignee: "Boss", due: "Apr 15", priority: "Low", progress: 95, lane: "Done" },
  { id: "tsk-9", title: "Validate enterprise key rotation runbook", assignee: "Asha Verma", due: "Apr 16", priority: "Medium", progress: 14, lane: "Backlog" },
  { id: "tsk-10", title: "Review support access scope for lookup-only role", assignee: "Boss", due: "Apr 16", priority: "Critical", progress: 37, lane: "Review" },
];

export const formTemplates: FormTemplate[] = [
  { id: "frm-1", name: "Refund Approval Request", submissions: 18, completionRate: 86, owner: "Finance Ops", updatedAt: "2h ago" },
  { id: "frm-2", name: "Plan Override Intake", submissions: 27, completionRate: 92, owner: "Support", updatedAt: "4h ago" },
  { id: "frm-3", name: "Security Escalation", submissions: 11, completionRate: 94, owner: "Security", updatedAt: "6h ago" },
  { id: "frm-4", name: "Access Review", submissions: 34, completionRate: 79, owner: "Identity", updatedAt: "8h ago" },
  { id: "frm-5", name: "Enterprise Trial Extension", submissions: 14, completionRate: 88, owner: "Sales", updatedAt: "10h ago" },
];

export const tableExamples = [
  { id: "tbl-1", entity: "API Keys", rows: 1842, freshness: "Live", owner: "Platform" },
  { id: "tbl-2", entity: "Incidents", rows: 148, freshness: "2m", owner: "Security" },
  { id: "tbl-3", entity: "License Status", rows: 2849, freshness: "15m", owner: "Billing" },
  { id: "tbl-4", entity: "Model Routing", rows: 18, freshness: "30m", owner: "Platform" },
  { id: "tbl-5", entity: "Webhook Deliveries", rows: 5640, freshness: "Live", owner: "Infra" },
  { id: "tbl-6", entity: "Fraud Reviews", rows: 73, freshness: "8m", owner: "Finance" },
  { id: "tbl-7", entity: "Support SLAs", rows: 412, freshness: "10m", owner: "Support" },
  { id: "tbl-8", entity: "Audit Events", rows: 12034, freshness: "Live", owner: "Security" },
  { id: "tbl-9", entity: "Plan Entitlements", rows: 36, freshness: "1h", owner: "Growth" },
  { id: "tbl-10", entity: "Abuse Signals", rows: 286, freshness: "4m", owner: "Security" },
];

export const contentPages: ContentPage[] = [
  { id: "pg-1", title: "Enterprise onboarding guide", owner: "Boss", audience: "Customers", status: "Published", updatedAt: "1h ago" },
  { id: "pg-2", title: "Abhimanyu escalation runbook", owner: "Security", audience: "Internal", status: "Needs Review", updatedAt: "2h ago" },
  { id: "pg-3", title: "Refund policy update", owner: "Finance", audience: "Customers", status: "Draft", updatedAt: "3h ago" },
  { id: "pg-4", title: "SOC incident checklist", owner: "Security", audience: "Internal", status: "Published", updatedAt: "4h ago" },
  { id: "pg-5", title: "Provider routing changelog", owner: "Platform", audience: "Customers", status: "Published", updatedAt: "6h ago" },
];

export const messageThreads: MessageThread[] = [
  { id: "msg-1", sender: "Product Ops", subject: "Provider failover window", preview: "Shift Groq fallback to Mistral for EU traffic after 18:00 UTC.", unread: true, time: "3m ago" },
  { id: "msg-2", sender: "Finance", subject: "Chargeback review batch", preview: "Need Boss approval on two enterprise disputes before payout close.", unread: true, time: "9m ago" },
  { id: "msg-3", sender: "Security", subject: "Exploit route watchlist expanded", preview: "Added three new signatures and tightened /exploit anomaly scoring.", unread: true, time: "15m ago" },
  { id: "msg-4", sender: "Support", subject: "Top ticket macros updated", preview: "Key regeneration and payment duplicate replies have new wording.", unread: false, time: "28m ago" },
  { id: "msg-5", sender: "Growth", subject: "Enterprise launch brief", preview: "Announcement draft ready for review in Pages.", unread: false, time: "43m ago" },
];

export const inboxItems: InboxItem[] = [
  { id: "inb-1", title: "Approve duplicate enterprise refund", source: "Finance", tag: "Money", time: "6m ago" },
  { id: "inb-2", title: "Review exploit signature ban appeal", source: "Security", tag: "Critical", time: "11m ago" },
  { id: "inb-3", title: "Confirm maintenance mode schedule", source: "Infra", tag: "Ops", time: "18m ago" },
  { id: "inb-4", title: "Sign off April provider routing memo", source: "Platform", tag: "Decision", time: "23m ago" },
  { id: "inb-5", title: "Approve enterprise trial extension", source: "Sales", tag: "Growth", time: "31m ago" },
];

export const invoices: InvoiceRow[] = [
  { id: "INV-2301", customer: "Pentest Labs", amount: 299, status: "Paid", dueDate: "2026-04-03" },
  { id: "INV-2302", customer: "Northwind", amount: 49, status: "Paid", dueDate: "2026-04-05" },
  { id: "INV-2303", customer: "AtlasOps", amount: 299, status: "Pending", dueDate: "2026-04-12" },
  { id: "INV-2304", customer: "VectorSec", amount: 49, status: "Overdue", dueDate: "2026-04-06" },
  { id: "INV-2305", customer: "ZenOps", amount: 299, status: "Pending", dueDate: "2026-04-13" },
];

export const chartShowcaseStats = [
  { label: "MRR Growth", value: 12.4, suffix: "%" },
  { label: "Error reduction", value: 18.8, suffix: "%" },
  { label: "Session throughput", value: 24.1, suffix: "%" },
  { label: "AI success rate", value: 98.9, suffix: "%" },
];

export const uiShowcaseStates = [
  { label: "Primary button", tone: "cyan" },
  { label: "Critical action", tone: "red" },
  { label: "Success badge", tone: "green" },
  { label: "Pending approval", tone: "orange" },
];

export const authenticationProviders = [
  { provider: "Email + Password", status: "Healthy", uptime: "99.99%", lastIncident: "34d ago" },
  { provider: "Magic Link", status: "Healthy", uptime: "99.94%", lastIncident: "12d ago" },
  { provider: "Google OAuth", status: "Healthy", uptime: "99.97%", lastIncident: "49d ago" },
  { provider: "GitHub OAuth", status: "Degraded", uptime: "99.72%", lastIncident: "2h ago" },
  { provider: "Session Refresh", status: "Healthy", uptime: "99.98%", lastIncident: "18d ago" },
];

export const commandPaletteEntries = [
  ...adminUsers.slice(0, 6).map((user) => ({
    id: user.id,
    title: user.name,
    subtitle: `User • ${user.email}`,
    href: "/admin/users" as const,
  })),
  ...supportTickets.slice(0, 4).map((ticket) => ({
    id: ticket.id,
    title: ticket.id,
    subtitle: `Ticket • ${ticket.summary}`,
    href: "/admin/support" as const,
  })),
  ...agentSessions.slice(0, 4).map((session) => ({
    id: session.id,
    title: session.id,
    subtitle: `Session • ${session.user}`,
    href: "/admin/agents" as const,
  })),
];

export const notifications = [
  { id: "n-1", title: "Critical exploit alert escalated", body: "Boss approval required for account ban.", time: "2m ago" },
  { id: "n-2", title: "Failed enterprise payment retried", body: "Retry succeeded for ZenOps invoice.", time: "8m ago" },
  { id: "n-3", title: "Support queue exceeded SLA target", body: "3 urgent tickets are older than 15 minutes.", time: "14m ago" },
  { id: "n-4", title: "Provider routing change saved", body: "Mistral is now priority 2 for EU traffic.", time: "26m ago" },
];

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
