import {
  getOverviewData,
  getRecentUsers,
  getPlanDistribution,
  getRecentActivity,
} from "./fetch";

const PLAN_CONFIG = {
  elite: {
    color: "from-purple-500 to-purple-700",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    dot: "bg-purple-400",
  },
  pro: {
    color: "from-blue-500 to-blue-700",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  starter: {
    color: "from-emerald-500 to-emerald-700",
    badge:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  free: {
    color: "from-gray-500 to-gray-700",
    badge: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
    dot: "bg-gray-400",
  },
};

function PlanBadge({ plan }: { plan: string }) {
  const cfg =
    PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cfg.badge}`}
    >
      {plan}
    </span>
  );
}

function StatCard({
  label,
  value,
  growth,
  icon,
  gradient,
}: {
  label: string;
  value: string;
  growth: number;
  icon: string;
  gradient: string;
}) {
  const isPos = growth >= 0;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${gradient} opacity-10`}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white text-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        <span
          className={`flex items-center gap-0.5 text-sm font-semibold ${isPos ? "text-emerald-500" : "text-red-500"}`}
        >
          {isPos ? "↑" : "↓"} {Math.abs(growth)}%
        </span>
        <span className="text-xs text-gray-400">vs last 30 days</span>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const [overview, recentUsers, planDist, activity] = await Promise.all([
    getOverviewData(),
    getRecentUsers(),
    getPlanDistribution(),
    getRecentActivity(),
  ]);

  const totalPaid = planDist
    .filter((p) => p.plan !== "free")
    .reduce((s, p) => s + p.count, 0);
  const totalAll = planDist.reduce((s, p) => s + p.count, 0);

  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⚡ CyberMind Admin
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform overview ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">
            System Online
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={overview.totalUsers.value.toLocaleString()}
          growth={overview.totalUsers.growthRate}
          icon="👥"
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard
          label="Paid Members"
          value={totalPaid.toLocaleString()}
          growth={overview.activeKeys.growthRate}
          icon="🔑"
          gradient="from-emerald-500 to-emerald-700"
        />
        <StatCard
          label="Elite Members"
          value={overview.eliteUsers.value.toLocaleString()}
          growth={0}
          icon="⚡"
          gradient="from-purple-500 to-purple-700"
        />
        <StatCard
          label="Est. MRR"
          value={`$${overview.revenue.value.toLocaleString()}`}
          growth={overview.revenue.growthRate}
          icon="💰"
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Plan Distribution — 1 col */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5">
          <h2 className="mb-5 text-base font-bold text-gray-900 dark:text-white">
            Plan Distribution
          </h2>
          <div className="space-y-4">
            {planDist.map((p) => {
              const cfg =
                PLAN_CONFIG[p.plan as keyof typeof PLAN_CONFIG] ||
                PLAN_CONFIG.free;
              const pct =
                totalAll > 0 ? Math.round((p.count / totalAll) * 100) : 0;
              return (
                <div key={p.plan}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`}
                      />
                      <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                        {p.plan}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {p.count}
                      </span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/5">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conversion rate
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Recent Signups — 2 cols */}
        <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Signups
            </h2>
            <a
              href="/admin/users"
              className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">
                No users yet
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                      {(user.full_name || user.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.full_name ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PlanBadge plan={user.plan || "free"} />
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5">
        <h2 className="mb-5 text-base font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        {activity.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-sm">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {a.user}
                    </span>{" "}
                    signed up with{" "}
                    <span className="font-semibold capitalize">{a.plan}</span>{" "}
                    plan
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(a.time).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
