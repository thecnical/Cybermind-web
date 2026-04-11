"use client";

import {
  Ban,
  Check,
  Download,
  Eye,
  KeyRound,
  RefreshCw,
  Send,
  Sparkles,
  UserRoundSearch,
  WandSparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  abuseAlerts,
  abuseEventsTimeline,
  adminPageMeta,
  adminUsers,
  agentPerformance,
  agentSessions,
  aiProviderUsage,
  aiSupportSuggestions,
  auditLog,
  authenticationProviders,
  blockedIps,
  calendarEvents,
  chartShowcaseStats,
  contentPages,
  errorRateTimeline,
  failedPayments,
  formTemplates,
  formatCompactNumber,
  formatCurrency,
  geographicHotspots,
  inboxItems,
  invoices,
  liveTeamActivity,
  messageThreads,
  modelUsageDistribution,
  modelUsagePerSession,
  dashboardStats,
  paymentStats,
  pendingRequests,
  rateLimitViolations,
  realtimeFeed,
  requestBreakdownSeries,
  responseTimeHeatmap,
  revenueLastSixMonths,
  revenueLastTwelveMonths,
  routeBreakdown,
  routeColors,
  securityAbuseFlags,
  securityFeed,
  subscriptionBreakdown,
  supportStats,
  supportTickets,
  systemConfigCards,
  tableExamples,
  taskBoard,
  teamMembers,
  ticketMessages,
  topApiUsers,
  topFlaggedRoutes,
  toolCallFeed,
  transactions,
  uiShowcaseStates,
  userPaymentHistory,
  userUsageHistory,
  type AdminSection,
} from "@/lib/mock-data";
import { useAdminDemo } from "@/components/admin/admin-context";
import {
  DonutUsageChart,
  ErrorTimelineChart,
  Heatmap,
  RequestsLineChart,
  RevenueAreaChart,
  RevenueBarChart,
  SimpleBarChart,
  TinyTrend,
  WorldMapPlaceholder,
} from "@/components/admin/admin-charts";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  DataTable,
  LivePill,
  MetricList,
  PageTransition,
  Panel,
  Pill,
  SearchInput,
  SectionHeading,
  SkeletonBlock,
  StatCard,
  SurfaceTabs,
  useMockReady,
  type TableColumn,
} from "@/components/admin/admin-primitives";
import { cn } from "@/lib/utils";

export function AdminSectionPage({ section }: { section: string }) {
  return <AdminSectionContent section={section as AdminSection} />;
}

function AdminSectionContent({ section }: { section: AdminSection }) {
  const meta = adminPageMeta[section];

  return (
    <PageTransition className="space-y-6">
      {section === "dashboard" ? <DashboardPage meta={meta} /> : null}
      {section === "users" ? <UsersPage meta={meta} /> : null}
      {section === "analytics" ? <AnalyticsPage meta={meta} /> : null}
      {section === "payments" ? <PaymentsPage meta={meta} /> : null}
      {section === "agents" ? <AgentsPage meta={meta} /> : null}
      {section === "team" ? <TeamPage meta={meta} /> : null}
      {section === "support" ? <SupportPage meta={meta} /> : null}
      {section === "security" ? <SecurityPage meta={meta} /> : null}
      {section === "settings" ? <SettingsPage meta={meta} /> : null}
      {section === "calendar" ? <CalendarPage meta={meta} /> : null}
      {section === "profile" ? <ProfilePage meta={meta} /> : null}
      {section === "tasks" ? <TasksPage meta={meta} /> : null}
      {section === "forms" ? <FormsPage meta={meta} /> : null}
      {section === "tables" ? <TablesPage meta={meta} /> : null}
      {section === "pages" ? <PagesLibraryPage meta={meta} /> : null}
      {section === "messages" ? <MessagesPage meta={meta} /> : null}
      {section === "inbox" ? <InboxPage meta={meta} /> : null}
      {section === "invoice" ? <InvoicePage meta={meta} /> : null}
      {section === "charts" ? <ChartsShowcasePage meta={meta} /> : null}
      {section === "ui-elements" ? <UiElementsPage meta={meta} /> : null}
      {section === "authentication" ? <AuthenticationPage meta={meta} /> : null}
    </PageTransition>
  );
}

function DashboardPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();

  return (
    <>
      <SectionHeading
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.subtitle}
        actions={
          <>
            <LivePill />
            <AdminButton variant="secondary">
              <Ban className="size-4" />
              Ban User
            </AdminButton>
            <AdminButton variant="secondary">
              <KeyRound className="size-4" />
              Revoke Key
            </AdminButton>
            <AdminButton>
              <Send className="size-4" />
              Send Announcement
            </AdminButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-6">
        {ready
          ? dashboardStats.map((item) => <StatCard key={item.label} {...item} />)
          : Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[168px] rounded-[28px]" />
            ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Realtime API request feed</p>
              <p className="text-xs text-slate-500">Mock placeholder stream. Replace with Supabase or websocket realtime feed.</p>
            </div>
            <LivePill />
          </div>
          <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
            {realtimeFeed.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * index }}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{item.time}</span>
                  <span style={{ color: routeColors[item.route] }} className="font-semibold">
                    {item.route}
                  </span>
                  <span className="text-slate-400">{item.user}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>{item.region}</span>
                  <span>{item.latency}ms</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4" glow="purple">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Live team activity</p>
            <Pill tone="purple">6 online</Pill>
          </div>
          <div className="space-y-3">
            {liveTeamActivity.map((member) => (
              <div key={member.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold">
                    {member.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white">{member.name}</p>
                      {member.online ? <LivePill label="LIVE" /> : <Pill>Idle</Pill>}
                    </div>
                    <p className="truncate text-xs text-slate-500">{member.page}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{member.action}</p>
                <p className="mt-1 text-xs text-slate-500">{member.lastSeen}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">API requests over last 7 days</p>
              <p className="text-xs text-slate-500">TODO: Replace with GET /admin/analytics/routes API call.</p>
            </div>
            <Pill tone="cyan">Per route</Pill>
          </div>
          {ready ? <RequestsLineChart data={requestBreakdownSeries} /> : <SkeletonBlock className="h-[280px]" />}
        </Panel>

        <Panel className="space-y-4" glow="purple">
          <div>
            <p className="text-sm font-medium text-white">AI model usage</p>
            <p className="text-xs text-slate-500">Provider distribution for the last rolling 24h.</p>
          </div>
          {ready ? <DonutUsageChart data={modelUsageDistribution} /> : <SkeletonBlock className="h-[280px]" />}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel className="space-y-4">
          <div>
            <p className="text-sm font-medium text-white">Revenue last 6 months</p>
            <p className="text-xs text-slate-500">Mock placeholder revenue series for finance API integration.</p>
          </div>
          {ready ? <RevenueBarChart data={revenueLastSixMonths} /> : <SkeletonBlock className="h-[280px]" />}
        </Panel>
        <Panel className="space-y-4" glow="red">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Recent abuse alerts</p>
            <Pill tone="red">Priority queue</Pill>
          </div>
          <div className="space-y-3">
            {abuseAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "rounded-2xl border p-3",
                  alert.severity === "CRITICAL"
                    ? "border-rose-400/30 bg-rose-500/10 shadow-[0_0_24px_rgba(244,63,94,0.16)]"
                    : "border-white/8 bg-white/[0.03]",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{alert.subject}</p>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{alert.user}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{alert.createdAt}</span>
                  <span>{alert.action}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function UsersPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();
  const { role } = useAdminDemo();
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(adminUsers[0]?.id ?? null);
  const selectedUser = adminUsers.find((user) => user.id === selectedUserId) ?? adminUsers[0];

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.company}`.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = plan === "all" || user.plan.toLowerCase() === plan;
    const matchesStatus = status === "all" || user.status.toLowerCase() === status;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const columns: TableColumn<(typeof filteredUsers)[number]>[] = [
    {
      key: "user",
      label: "User",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold">
            {row.avatar}
          </div>
          <div>
            <p className="font-medium text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      sortable: true,
      sortValue: (row) => row.plan,
      render: (row) => <Pill tone={row.plan === "Enterprise" ? "purple" : row.plan === "Pro" ? "cyan" : "default"}>{row.plan}</Pill>,
    },
    {
      key: "apiKey",
      label: "API Key",
      render: (row) => <span className="font-mono text-xs text-slate-300">{row.apiKey}</span>,
    },
    {
      key: "usage",
      label: "Usage Today",
      sortable: true,
      sortValue: (row) => row.usageToday,
      render: (row) => <span>{formatCompactNumber(row.usageToday)}</span>,
    },
    {
      key: "joined",
      label: "Joined",
      sortable: true,
      sortValue: (row) => row.joinedAt,
      render: (row) => row.joinedAt,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => <StatusPill label={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <AdminButton variant="ghost" className="px-3 py-2 text-xs">
            <Eye className="size-4" />
            View
          </AdminButton>
          <AdminButton variant="ghost" className="px-3 py-2 text-xs">
            <Ban className="size-4" />
            {row.status === "Banned" ? "Unban" : "Ban"}
          </AdminButton>
          {role === "boss" ? (
            <AdminButton variant="ghost" className="px-3 py-2 text-xs">
              <UserRoundSearch className="size-4" />
              Impersonate
            </AdminButton>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <SectionHeading
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.subtitle}
        actions={
          <>
            <Pill tone="cyan">12 accounts</Pill>
            <AdminButton variant="secondary">
              <Download className="size-4" />
              Export CSV
            </AdminButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users, company, or email..." />
        <AdminSelect value={plan} onChange={(event) => setPlan(event.target.value)}>
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </AdminSelect>
        <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
        </AdminSelect>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <DataTable
          rows={filteredUsers}
          columns={columns}
          rowKey={(row) => row.id}
          loading={!ready}
          pageSize={6}
          bulkActions={(selectedIds) => (
            <div className="flex flex-wrap gap-2">
              <AdminButton variant="secondary" className="px-3 py-2 text-xs">
                <Ban className="size-4" />
                Ban all
              </AdminButton>
              <AdminButton variant="secondary" className="px-3 py-2 text-xs">
                <RefreshCw className="size-4" />
                Change plan
              </AdminButton>
              <AdminButton variant="secondary" className="px-3 py-2 text-xs">
                <Download className="size-4" />
                Export {selectedIds.length}
              </AdminButton>
            </div>
          )}
          onRowClick={(row) => setSelectedUserId(row.id)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUser.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            className="space-y-6"
          >
            <Panel className="space-y-4" glow="purple">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-lg font-semibold">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <Pill tone={selectedUser.plan === "Enterprise" ? "purple" : selectedUser.plan === "Pro" ? "cyan" : "default"}>{selectedUser.plan}</Pill>
              </div>
              <MetricList
                items={[
                  { label: "Company", value: selectedUser.company },
                  { label: "Country", value: selectedUser.country },
                  { label: "Active sessions", value: selectedUser.sessions },
                  { label: "Abuse flags", value: selectedUser.abuseFlags },
                  { label: "Monthly revenue", value: selectedUser.mrr ? formatCurrency(selectedUser.mrr) : "$0" },
                ]}
              />
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Usage history (30 days)</p>
                {ready ? <RevenueAreaChart data={userUsageHistory[selectedUser.id]} /> : <SkeletonBlock className="h-[300px]" />}
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Payment history</p>
                <div className="space-y-2">
                  {userPaymentHistory[selectedUser.id].map((payment) => (
                    <div key={`${selectedUser.id}-${payment.label}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm text-white">{payment.label}</p>
                        <p className="text-xs text-slate-500">{payment.status}</p>
                      </div>
                      <span className="font-medium text-white">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <AdminButton variant="secondary">
                  <KeyRound className="size-4" />
                  Revoke key
                </AdminButton>
                <AdminButton variant={selectedUser.status === "Banned" ? "secondary" : "danger"}>
                  <Ban className="size-4" />
                  {selectedUser.status === "Banned" ? "Unban user" : "Ban user"}
                </AdminButton>
              </div>
            </Panel>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function AnalyticsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();

  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />

      <Panel className="space-y-4 p-6" glow="cyan">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Realtime request counter</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.08em] text-white">
              {formatCompactNumber(845000)}
            </p>
          </div>
          <LivePill />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {chartShowcaseStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DataTable
          rows={routeBreakdown}
          rowKey={(row) => row.route}
          enableSelection={false}
          pageSize={10}
          loading={!ready}
          columns={[
            {
              key: "route",
              label: "Route",
              sortable: true,
              sortValue: (row) => row.route,
              render: (row) => (
                <span className="font-mono font-medium" style={{ color: routeColors[row.route] }}>
                  {row.route}
                </span>
              ),
            },
            {
              key: "requests",
              label: "Requests",
              sortable: true,
              sortValue: (row) => row.requests,
              render: (row) => formatCompactNumber(row.requests),
            },
            {
              key: "latency",
              label: "Avg response",
              sortable: true,
              sortValue: (row) => row.avgLatency,
              render: (row) => `${row.avgLatency}ms`,
            },
            {
              key: "error",
              label: "Error rate",
              sortable: true,
              sortValue: (row) => row.errorRate,
              render: (row) => `${row.errorRate}%`,
            },
            {
              key: "spark",
              label: "Sparkline",
              render: (row) => <TinyTrend values={row.sparkline} color={routeColors[row.route]} />,
            },
          ]}
        />

        <div className="space-y-6">
          <Panel className="space-y-4" glow="purple">
            <p className="text-sm font-medium text-white">AI provider usage</p>
            <div className="grid gap-3">
              {aiProviderUsage.map((provider) => (
                <div key={provider.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{provider.name}</p>
                    <Pill tone="cyan">{provider.successRate}%</Pill>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-2xl font-semibold text-white">{formatCompactNumber(provider.requests)}</p>
                    <p className="text-sm text-slate-500">{provider.latency}ms avg</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="space-y-4">
            <p className="text-sm font-medium text-white">World traffic hotspots</p>
            <WorldMapPlaceholder dots={geographicHotspots} />
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Error rate timeline</p>
          {ready ? <ErrorTimelineChart data={errorRateTimeline} /> : <SkeletonBlock className="h-[260px]" />}
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Response time heatmap</p>
          <Heatmap days={responseTimeHeatmap} />
        </Panel>
      </div>

      <DataTable
        rows={topApiUsers}
        rowKey={(row) => row.email}
        enableSelection={false}
        loading={!ready}
        pageSize={5}
        columns={[
          { key: "rank", label: "#", sortable: true, sortValue: (row) => row.rank, render: (row) => row.rank },
          { key: "name", label: "User", sortable: true, sortValue: (row) => row.name, render: (row) => row.name },
          { key: "email", label: "Email", render: (row) => <span className="text-slate-400">{row.email}</span> },
          { key: "plan", label: "Plan", sortable: true, sortValue: (row) => row.plan, render: (row) => <Pill tone={row.plan === "Enterprise" ? "purple" : row.plan === "Pro" ? "cyan" : "default"}>{row.plan}</Pill> },
          { key: "requests", label: "Requests", sortable: true, sortValue: (row) => row.requests, render: (row) => formatCompactNumber(row.requests) },
        ]}
      />
    </>
  );
}

function PaymentsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();
  const { role } = useAdminDemo();

  return (
    <>
      <SectionHeading
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.subtitle}
        actions={
          <>
            <Pill tone="green">Stripe feel</Pill>
            {role === "boss" ? (
              <AdminButton>
                <RefreshCw className="size-4" />
                Trigger refund
              </AdminButton>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {paymentStats.map((stat) => (
          <Panel key={stat.label} className="space-y-2">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-3xl font-semibold text-white">
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </p>
            <Pill tone={stat.change >= 0 ? "green" : "red"}>
              {stat.change >= 0 ? "+" : ""}
              {stat.change}%
            </Pill>
            <p className="text-xs text-slate-500">{stat.hint}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DataTable
          rows={transactions}
          rowKey={(row) => row.id}
          loading={!ready}
          pageSize={6}
          columns={[
            { key: "user", label: "User", sortable: true, sortValue: (row) => row.user, render: (row) => row.user },
            { key: "plan", label: "Plan", sortable: true, sortValue: (row) => row.plan, render: (row) => <Pill tone={row.plan === "Enterprise" ? "purple" : row.plan === "Pro" ? "cyan" : "default"}>{row.plan}</Pill> },
            { key: "amount", label: "Amount", sortable: true, sortValue: (row) => row.amount, render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status", sortable: true, sortValue: (row) => row.status, render: (row) => <StatusPill label={row.status} /> },
            { key: "date", label: "Date", sortable: true, sortValue: (row) => row.date, render: (row) => row.date },
            { key: "id", label: "Stripe ID", render: (row) => <span className="font-mono text-xs text-slate-400">{row.stripeId}</span> },
          ]}
        />

        <div className="space-y-6">
          <Panel className="space-y-4">
            <p className="text-sm font-medium text-white">Revenue last 12 months</p>
            {ready ? <RevenueAreaChart data={revenueLastTwelveMonths} /> : <SkeletonBlock className="h-[300px]" />}
          </Panel>
          <Panel className="space-y-4" glow="red">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Failed payments</p>
              <Pill tone="red">{failedPayments.length}</Pill>
            </div>
            {failedPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-rose-400/18 bg-rose-500/8 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{payment.user}</p>
                    <p className="text-xs text-slate-400">{payment.date}</p>
                  </div>
                  <span className="font-medium text-white">{formatCurrency(payment.amount)}</span>
                </div>
                <AdminButton variant="secondary" className="mt-3 w-full">
                  Retry payment
                </AdminButton>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Subscription breakdown</p>
          {ready ? <DonutUsageChart data={subscriptionBreakdown} /> : <SkeletonBlock className="h-[280px]" />}
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Manual actions</p>
          <div className="grid gap-3">
            <ActionRow title="Trigger refund" description="Issue a Stripe refund after policy review." />
            <ActionRow title="Upgrade plan" description="Apply new entitlements immediately." />
            <ActionRow title="Downgrade plan" description="Queue plan downgrade for next billing cycle." />
            <ActionRow title="Send payment notice" description="Nudge overdue or failed payments via in-app message." />
          </div>
        </Panel>
      </div>
    </>
  );
}

function AgentsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();
  const { role } = useAdminDemo();
  const [selectedSessionId, setSelectedSessionId] = useState(agentSessions[0]?.id ?? "");
  const selectedSession = agentSessions.find((session) => session.id === selectedSessionId) ?? agentSessions[0];

  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-4 md:grid-cols-4">
        {agentPerformance.map((item) => (
          <Panel key={item.label}>
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {item.value}
              {item.suffix}
            </p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <DataTable
          rows={agentSessions}
          rowKey={(row) => row.id}
          loading={!ready}
          pageSize={6}
          columns={[
            { key: "id", label: "Session ID", sortable: true, sortValue: (row) => row.id, render: (row) => <span className="font-mono text-xs">{row.id}</span> },
            { key: "user", label: "User", sortable: true, sortValue: (row) => row.user, render: (row) => row.user },
            { key: "startedAt", label: "Started", sortable: true, sortValue: (row) => row.startedAt, render: (row) => row.startedAt },
            { key: "tool", label: "Current Tool", render: (row) => row.currentTool },
            { key: "steps", label: "Steps", sortable: true, sortValue: (row) => row.stepsCompleted, render: (row) => `${row.stepsCompleted}/${row.totalSteps}` },
            { key: "status", label: "Status", sortable: true, sortValue: (row) => row.status, render: (row) => <SessionStatus status={row.status} /> },
          ]}
          onRowClick={(row) => setSelectedSessionId(row.id)}
        />
        <div className="space-y-6">
          <Panel className="space-y-4" glow="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Tool call feed</p>
                <p className="text-xs text-slate-500">{selectedSession.id} · {selectedSession.user}</p>
              </div>
              {role !== "support" ? (
                <AdminButton variant="danger">
                  <X className="size-4" />
                  Kill session
                </AdminButton>
              ) : null}
            </div>
            <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
              {toolCallFeed[selectedSession.id]?.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span style={{ color: routeColors[item.route] }}>{item.route}</span>
                    <span className="text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-2 text-slate-300">{item.user}</p>
                  <p className="mt-1 text-slate-500">{item.latency}ms · {item.region}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="space-y-4">
            <p className="text-sm font-medium text-white">Model usage per session</p>
            {ready ? <SimpleBarChart data={modelUsagePerSession} dataKey="value" color="#8b5cf6" /> : <SkeletonBlock className="h-[260px]" />}
          </Panel>
        </div>
      </div>
    </>
  );
}

function TeamPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();

  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />

      <div className="grid gap-4 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Panel key={member.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold">
                {member.avatar}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{member.name}</p>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            </div>
            <MetricList
              items={[
                { label: "Current page", value: member.page },
                { label: "Last action", value: member.action },
                { label: "Presence", value: member.online ? "Online" : `Offline · ${member.lastSeen}` },
              ]}
            />
            <AdminButton variant="secondary" className="w-full">
              View live activity
            </AdminButton>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Panel className="space-y-4" glow="orange">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Pending requests</p>
            <Pill tone="orange">{pendingRequests.length}</Pill>
          </div>
          {pendingRequests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{request.type}</p>
                  <p className="text-sm text-slate-500">{request.requester} → {request.target}</p>
                </div>
                <Pill tone="orange">{request.createdAt}</Pill>
              </div>
              <p className="mt-3 text-sm text-slate-300">{request.detail}</p>
              <div className="mt-4 flex gap-2">
                <AdminButton className="flex-1">
                  <Check className="size-4" />
                  Approve
                </AdminButton>
                <AdminButton variant="secondary" className="flex-1">
                  <X className="size-4" />
                  Reject
                </AdminButton>
              </div>
            </div>
          ))}
          <AdminButton variant="secondary" className="w-full">
            Invite team member
          </AdminButton>
        </Panel>

        <DataTable
          rows={auditLog}
          rowKey={(row) => row.id}
          enableSelection={false}
          loading={!ready}
          pageSize={6}
          columns={[
            { key: "actor", label: "Who", sortable: true, sortValue: (row) => row.actor, render: (row) => row.actor },
            { key: "action", label: "Action", sortable: true, sortValue: (row) => row.action, render: (row) => row.action },
            { key: "resource", label: "Resource", render: (row) => <span className="font-mono text-xs text-slate-400">{row.resource}</span> },
            { key: "when", label: "When", sortable: true, sortValue: (row) => row.when, render: (row) => row.when },
          ]}
        />
      </div>
    </>
  );
}

function SupportPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();
  const [tab, setTab] = useState<"Open" | "In Progress" | "Resolved">("Open");
  const [selectedTicketId, setSelectedTicketId] = useState(supportTickets[0]?.id ?? "");
  const selectedTicket = supportTickets.find((ticket) => ticket.id === selectedTicketId) ?? supportTickets[0];
  const activeMessages = ticketMessages[selectedTicket.id] ?? [];
  const filteredTickets = supportTickets.filter((ticket) => ticket.status === tab);

  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-4 md:grid-cols-4">
        {supportStats.map((stat) => (
          <Panel key={stat.label}>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stat.value}
              {stat.suffix}
            </p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
        <Panel className="space-y-4">
          <SurfaceTabs
            items={[
              { value: "Open", label: "Open" },
              { value: "In Progress", label: "In Progress" },
              { value: "Resolved", label: "Resolved" },
            ]}
            active={tab}
            onChange={(value) => setTab(value as typeof tab)}
          />
          <div className="space-y-3">
            {(ready ? filteredTickets : supportTickets.slice(0, 5)).map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicketId(ticket.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedTicketId === ticket.id
                    ? "border-cyan-300/25 bg-cyan-300/[0.06]"
                    : "border-white/8 bg-white/[0.03] hover:border-white/12",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold">
                      {ticket.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-white">{ticket.name}</p>
                      <p className="text-sm text-slate-400">{ticket.summary}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={ticket.priority} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{ticket.assignedAgent}</span>
                  <span>{ticket.createdAt}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4" glow="purple">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{selectedTicket.id} · {selectedTicket.summary}</p>
                <p className="text-xs text-slate-500">
                  {selectedTicket.name} · {selectedTicket.plan} · Assigned to {selectedTicket.assignedAgent}
                </p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="secondary" className="px-3 py-2 text-xs">Assign</AdminButton>
                <AdminButton variant="secondary" className="px-3 py-2 text-xs">Resolve</AdminButton>
                <AdminButton className="px-3 py-2 text-xs">Escalate to Boss</AdminButton>
              </div>
            </div>
            <div className="space-y-3 rounded-[24px] border border-white/8 bg-black/20 p-4">
              {activeMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[86%] rounded-2xl px-4 py-3 text-sm",
                    message.side === "user"
                      ? "bg-white/[0.05] text-white"
                      : message.side === "agent"
                      ? "ml-auto bg-cyan-300/10 text-cyan-100"
                      : "border border-violet-400/18 bg-violet-500/10 text-violet-100",
                  )}
                >
                  <p>{message.body}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{message.author} · {message.timestamp}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <AdminTextarea rows={3} placeholder="Reply to the ticket..." />
              <AdminButton className="h-full min-h-[72px]">
                <Send className="size-4" />
                Send
              </AdminButton>
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{aiSupportSuggestions.title}</p>
              <Sparkles className="size-4 text-cyan-300" />
            </div>
            <AdminInput placeholder={aiSupportSuggestions.placeholder} />
            <div className="space-y-3">
              {aiSupportSuggestions.responses.map((response, index) => (
                <motion.div
                  key={response}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <p className="text-sm text-slate-200">{response}</p>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function SecurityPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();

  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <DataTable
            rows={blockedIps}
            rowKey={(row) => row.ip}
            loading={!ready}
            pageSize={5}
            columns={[
              { key: "ip", label: "IP", sortable: true, sortValue: (row) => row.ip, render: (row) => <span className="font-mono text-xs">{row.ip}</span> },
              { key: "reason", label: "Reason", render: (row) => row.reason },
              { key: "blockedAt", label: "Blocked At", sortable: true, sortValue: (row) => row.blockedAt, render: (row) => row.blockedAt },
              { key: "actor", label: "Actor", render: (row) => row.actor },
              { key: "action", label: "Action", render: () => <AdminButton variant="ghost" className="px-3 py-2 text-xs">Unblock</AdminButton> },
            ]}
          />

          <DataTable
            rows={rateLimitViolations}
            rowKey={(row) => `${row.user}-${row.timestamp}`}
            loading={!ready}
            pageSize={5}
            columns={[
              { key: "user", label: "User", sortable: true, sortValue: (row) => row.user, render: (row) => row.user },
              { key: "route", label: "Route", render: (row) => <span style={{ color: routeColors[row.route] }} className="font-mono">{row.route}</span> },
              { key: "count", label: "Count", sortable: true, sortValue: (row) => row.count, render: (row) => row.count },
              { key: "time", label: "Timestamp", render: (row) => row.timestamp },
            ]}
          />
        </div>
        <Panel className="space-y-4" glow="red">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Realtime alert feed</p>
            <LivePill />
          </div>
          <div className="space-y-3">
            {securityFeed.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "rounded-2xl border p-4",
                  event.severity === "CRITICAL"
                    ? "border-rose-400/30 bg-rose-500/10 shadow-[0_0_28px_rgba(244,63,94,0.18)]"
                    : "border-white/8 bg-white/[0.03]",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="font-mono text-xs" style={{ color: routeColors[event.route] }}>
                      {event.route}
                    </p>
                  </div>
                  <SeverityBadge severity={event.severity} />
                </div>
                <p className="mt-3 text-sm text-slate-300">{event.detail}</p>
                <p className="mt-2 text-xs text-slate-500">{event.time}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Abuse events over time</p>
          {ready ? <SimpleBarChart data={abuseEventsTimeline} dataKey="value" color="#fb7185" /> : <SkeletonBlock className="h-[260px]" />}
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Top flagged routes</p>
          {ready ? <SimpleBarChart data={topFlaggedRoutes.map((item) => ({ label: item.route, value: item.value }))} dataKey="value" color="#fb923c" /> : <SkeletonBlock className="h-[260px]" />}
        </Panel>
      </div>

      <DataTable
        rows={securityAbuseFlags}
        rowKey={(row) => `${row.user}-${row.triggeredAt}`}
        loading={!ready}
        pageSize={5}
        columns={[
          { key: "user", label: "User", sortable: true, sortValue: (row) => row.user, render: (row) => row.user },
          { key: "type", label: "Flag Type", render: (row) => row.type },
          { key: "severity", label: "Severity", sortable: true, sortValue: (row) => row.severity, render: (row) => <SeverityBadge severity={row.severity} /> },
          { key: "time", label: "Triggered", render: (row) => row.triggeredAt },
          { key: "action", label: "Action taken", render: (row) => row.actionTaken },
        ]}
      />
    </>
  );
}

function SettingsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { role } = useAdminDemo();

  return (
    <>
      <SectionHeading
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.subtitle}
        actions={
          <AdminButton onClick={() => setConfirmOpen(true)}>
            <Check className="size-4" />
            Save changes
          </AdminButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {systemConfigCards
          .filter((card) => !card.bossOnly || role === "boss")
          .map((card) => (
            <Panel key={card.title} className="space-y-4" glow="purple">
              <div>
                <p className="text-lg font-semibold text-white">{card.title}</p>
                <p className="mt-1 text-sm text-slate-400">{card.description}</p>
              </div>
              <div className="space-y-3">
                {card.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.value}</p>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "relative h-7 w-12 rounded-full transition",
                        item.enabled ? "bg-cyan-400/80" : "bg-white/10",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 h-5 w-5 rounded-full bg-white transition",
                          item.enabled ? "left-6" : "left-1",
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
      </div>

      <AnimatePresence>
        {confirmOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 px-4 py-10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto max-w-lg"
            >
              <Panel className="space-y-4 p-6" glow="cyan">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
                    <WandSparkles className="size-5 text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Save configuration changes?</p>
                    <p className="text-sm text-slate-400">Mock confirmation modal. Replace with PATCH /admin/settings when backend is ready.</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <AdminButton onClick={() => setConfirmOpen(false)}>
                    Confirm save
                  </AdminButton>
                  <AdminButton variant="secondary" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </AdminButton>
                </div>
              </Panel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function CalendarPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Panel className="space-y-4">
          <div className="grid grid-cols-7 gap-3 text-center text-xs uppercase tracking-[0.24em] text-slate-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {days.map((day) => {
              const event = calendarEvents.find((item) => item.day === day);
              return (
                <div key={day} className="min-h-[94px] rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-sm font-medium text-white">{day}</p>
                  {event ? (
                    <div className="mt-3 space-y-2">
                      <Pill tone={event.type === "incident" ? "red" : event.type === "launch" ? "purple" : "cyan"}>{event.time}</Pill>
                      <p className="text-xs text-slate-300">{event.title}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel className="space-y-4" glow="purple">
          <p className="text-sm font-medium text-white">Upcoming agenda</p>
          {calendarEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{event.title}</p>
                <Pill tone="cyan">Day {event.day}</Pill>
              </div>
              <p className="mt-2 text-sm text-slate-400">{event.owner} · {event.time}</p>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

function ProfilePage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const { role } = useAdminDemo();
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="space-y-4" glow="purple">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05] text-xl font-semibold">
              {role === "boss" ? "CP" : role === "admin" ? "AV" : "MF"}
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{role === "boss" ? "Chandan Pandey" : role === "admin" ? "Asha Verma" : "Mia Flores"}</p>
              <p className="text-sm text-slate-500">{role} workspace</p>
            </div>
          </div>
          <MetricList
            items={[
              { label: "Role", value: role },
              { label: "Workspace", value: "CyberMind Control" },
              { label: "Last login", value: "Apr 11, 2026 · 09:15 IST" },
              { label: "Security posture", value: "MFA required" },
            ]}
          />
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Preferences</p>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminInput defaultValue="Chandan Pandey" />
            <AdminInput defaultValue="ops@cybermind.ai" />
            <AdminSelect defaultValue="IST">
              <option>IST</option>
              <option>UTC</option>
              <option>PST</option>
            </AdminSelect>
            <AdminSelect defaultValue="dark">
              <option>Dark</option>
              <option>Light</option>
            </AdminSelect>
          </div>
          <AdminTextarea rows={4} defaultValue="Responsible for platform operations, billing approvals, and launch comms." />
          <AdminButton>Update profile</AdminButton>
        </Panel>
      </div>
    </>
  );
}

function TasksPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const lanes = ["Backlog", "Ready", "In Progress", "Review", "Done"] as const;
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-4 xl:grid-cols-5">
        {lanes.map((lane) => (
          <Panel key={lane} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">{lane}</p>
              <Pill>{taskBoard.filter((item) => item.lane === lane).length}</Pill>
            </div>
            {taskBoard.filter((item) => item.lane === lane).map((task) => (
              <div key={task.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="mt-2 text-sm text-slate-500">{task.assignee} · {task.due}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </>
  );
}

function FormsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Workflow templates</p>
          {formTemplates.map((form) => (
            <div key={form.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{form.name}</p>
                <Pill tone="cyan">{form.submissions} submissions</Pill>
              </div>
              <p className="mt-2 text-sm text-slate-500">{form.owner} · updated {form.updatedAt}</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-violet-400" style={{ width: `${form.completionRate}%` }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel className="space-y-4" glow="purple">
          <p className="text-sm font-medium text-white">Form preview</p>
          <div className="grid gap-3">
            <AdminInput placeholder="Request title" />
            <AdminSelect defaultValue="High">
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </AdminSelect>
            <AdminTextarea rows={6} placeholder="Context, reason, and expected outcome..." />
            <AdminButton>Submit request</AdminButton>
          </div>
        </Panel>
      </div>
    </>
  );
}

function TablesPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <DataTable
        rows={tableExamples}
        rowKey={(row) => row.id}
        pageSize={5}
        columns={[
          { key: "entity", label: "Entity", sortable: true, sortValue: (row) => row.entity, render: (row) => row.entity },
          { key: "rows", label: "Rows", sortable: true, sortValue: (row) => row.rows, render: (row) => formatCompactNumber(row.rows) },
          { key: "freshness", label: "Freshness", render: (row) => <Pill tone={row.freshness === "Live" ? "green" : "default"}>{row.freshness}</Pill> },
          { key: "owner", label: "Owner", render: (row) => row.owner },
          { key: "actions", label: "Actions", render: () => <AdminButton variant="ghost" className="px-3 py-2 text-xs">Inspect</AdminButton> },
        ]}
      />
    </>
  );
}

function PagesLibraryPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="space-y-4">
          {contentPages.map((page) => (
            <div key={page.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{page.title}</p>
                  <p className="text-sm text-slate-500">{page.owner} · {page.audience}</p>
                </div>
                <StatusPill label={page.status} />
              </div>
              <p className="mt-3 text-xs text-slate-500">Updated {page.updatedAt}</p>
            </div>
          ))}
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Editor preview</p>
          <AdminInput defaultValue="Enterprise onboarding guide" />
          <AdminTextarea rows={12} defaultValue="This production-style mock content block shows where your editor content would appear. Replace with CMS-backed page data later." />
          <div className="flex gap-2">
            <AdminButton>Publish</AdminButton>
            <AdminButton variant="secondary">Save draft</AdminButton>
          </div>
        </Panel>
      </div>
    </>
  );
}

function MessagesPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel className="space-y-3">
          {messageThreads.map((thread) => (
            <div key={thread.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{thread.subject}</p>
                {thread.unread ? <Pill tone="red">Unread</Pill> : null}
              </div>
              <p className="mt-2 text-sm text-slate-400">{thread.preview}</p>
              <p className="mt-2 text-xs text-slate-500">{thread.sender} · {thread.time}</p>
            </div>
          ))}
        </Panel>
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Compose announcement</p>
          <AdminInput placeholder="Subject" />
          <AdminTextarea rows={10} placeholder="Draft an internal message..." />
          <div className="flex gap-2">
            <AdminButton>
              <Send className="size-4" />
              Send
            </AdminButton>
            <AdminButton variant="secondary">Save draft</AdminButton>
          </div>
        </Panel>
      </div>
    </>
  );
}

function InboxPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-4">
        {inboxItems.map((item) => (
          <Panel key={item.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-slate-500">{item.source} · {item.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="orange">{item.tag}</Pill>
              <AdminButton variant="secondary">Open</AdminButton>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}

function InvoicePage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <DataTable
        rows={invoices}
        rowKey={(row) => row.id}
        enableSelection={false}
        pageSize={5}
        columns={[
          { key: "id", label: "Invoice", sortable: true, sortValue: (row) => row.id, render: (row) => <span className="font-mono text-xs">{row.id}</span> },
          { key: "customer", label: "Customer", sortable: true, sortValue: (row) => row.customer, render: (row) => row.customer },
          { key: "amount", label: "Amount", sortable: true, sortValue: (row) => row.amount, render: (row) => formatCurrency(row.amount) },
          { key: "status", label: "Status", sortable: true, sortValue: (row) => row.status, render: (row) => <StatusPill label={row.status} /> },
          { key: "dueDate", label: "Due date", sortable: true, sortValue: (row) => row.dueDate, render: (row) => row.dueDate },
        ]}
      />
    </>
  );
}

function ChartsShowcasePage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  const ready = useMockReady();
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>{ready ? <RequestsLineChart data={requestBreakdownSeries} /> : <SkeletonBlock className="h-[280px]" />}</Panel>
        <Panel>{ready ? <RevenueBarChart data={revenueLastSixMonths} /> : <SkeletonBlock className="h-[280px]" />}</Panel>
        <Panel>{ready ? <ErrorTimelineChart data={errorRateTimeline} /> : <SkeletonBlock className="h-[260px]" />}</Panel>
        <Panel>{ready ? <DonutUsageChart data={modelUsageDistribution} /> : <SkeletonBlock className="h-[280px]" />}</Panel>
      </div>
    </>
  );
}

function UiElementsPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Buttons and states</p>
          <div className="flex flex-wrap gap-3">
            <AdminButton>Primary</AdminButton>
            <AdminButton variant="secondary">Secondary</AdminButton>
            <AdminButton variant="ghost">Ghost</AdminButton>
            <AdminButton variant="danger">Danger</AdminButton>
          </div>
          <div className="flex flex-wrap gap-3">
            {uiShowcaseStates.map((state) => (
              <Pill key={state.label} tone={state.tone as "cyan" | "red" | "green" | "orange"}>
                {state.label}
              </Pill>
            ))}
          </div>
        </Panel>
        <Panel className="space-y-4" glow="purple">
          <p className="text-sm font-medium text-white">Inputs</p>
          <AdminInput placeholder="API key label" />
          <AdminSelect defaultValue="Pro">
            <option>Free</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </AdminSelect>
          <AdminTextarea rows={6} placeholder="System note or escalation context..." />
        </Panel>
      </div>
    </>
  );
}

function AuthenticationPage({ meta }: { meta: (typeof adminPageMeta)[AdminSection] }) {
  return (
    <>
      <SectionHeading eyebrow={meta.eyebrow} title={meta.title} description={meta.subtitle} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="space-y-4">
          <p className="text-sm font-medium text-white">Identity provider health</p>
          {authenticationProviders.map((provider) => (
            <div key={provider.provider} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{provider.provider}</p>
                <StatusPill label={provider.status} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>Uptime {provider.uptime}</span>
                <span>{provider.lastIncident}</span>
              </div>
            </div>
          ))}
        </Panel>
        <Panel className="space-y-4" glow="purple">
          <p className="text-sm font-medium text-white">Login experience preview</p>
          <AdminInput placeholder="name@company.com" />
          <AdminInput type="password" placeholder="Password" />
          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            <span>Require MFA on high-risk sign-ins</span>
            <Pill tone="green">Enabled</Pill>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <AdminButton>Sign in</AdminButton>
            <AdminButton variant="secondary">Send magic link</AdminButton>
          </div>
        </Panel>
      </div>
    </>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const normalized = severity.toUpperCase();
  const tone =
    normalized === "LOW"
      ? "green"
      : normalized === "MEDIUM"
      ? "cyan"
      : normalized === "HIGH"
      ? "orange"
      : "red";
  return <Pill tone={tone}>{normalized}</Pill>;
}

function StatusPill({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const tone =
    normalized.includes("active") || normalized.includes("published") || normalized.includes("paid") || normalized.includes("healthy")
      ? "green"
      : normalized.includes("failed") || normalized.includes("banned") || normalized.includes("overdue") || normalized.includes("critical")
      ? "red"
      : normalized.includes("pending") || normalized.includes("review") || normalized.includes("refunded") || normalized.includes("suspended") || normalized.includes("degraded")
      ? "orange"
      : "cyan";
  return <Pill tone={tone}>{label}</Pill>;
}

function SessionStatus({ status }: { status: "running" | "completed" | "failed" | "killed" }) {
  if (status === "running") {
    return (
      <Pill tone="green">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </span>
        running
      </Pill>
    );
  }
  return <StatusPill label={status} />;
}

function ActionRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <AdminButton variant="secondary">Open</AdminButton>
    </div>
  );
}
