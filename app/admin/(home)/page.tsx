import {
  getOverviewData,
  getRecentUsers,
  getPlanDistribution,
  getRecentActivity,
} from "./fetch";

const PLAN_CONFIG = {
  elite:   { color: "from-purple-500 to-purple-700", badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30", dot: "bg-purple-400" },
  pro:     { color: "from-blue-500 to-blue-700",     badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",       dot: "bg-blue-400"   },
  starter: { color: "from-emerald-500 to-emerald-700", badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", dot: "bg-emerald-400" },
  free:    { color: "from-gray-500 to-gray-700",     badge: "bg-gray-500/20 text-gray-300 border border-gray-500/30",       dot: "bg-gray-400"   },
};

function PlanBadge({ plan }: { plan: string }) {
  const cfg = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cfg.badge}`}>
      {plan}
    </span>
  );
}

function StatCard({ label, value, growth, icon, gradient }: {
  label: string; value: string; growth: number; icon: string; gradient: string;
}) {
  const isPos = growth >= 0;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 sm:p-6">
      <div className={`absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br ${gradient} opacity-10 sm:h-24 sm:w-24`} />
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">{value}</p>
        </div>
        <div className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-lg sm:h-12 sm:w-12 sm:text-xl`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 sm:mt-4">
        <span className={`flex items-center gap-0.5 text-xs font-semibold sm:text-sm ${isPos ? "text-emerald-500" : "text-red-500"}`}>
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

  const totalPaid = planDist.filter((p) => p.plan !== "free").reduce((s, p) => s + p.count, 0);
  const totalAll = planDist.reduce((s, p) => s + p.count, 0);

  return (
    <div className="space-y-5 pb-10 sm:space-y-6 sm:pb-12">

      {/* Page Header — stacks on mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
            ⚡ CyberMind Admin
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:mt-1 sm:text-sm">
            Platform overview ·{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400 sm:text-sm">System Online</span>
        </div>
      </div>

      {/* Stat Cards — 1 col → 2 col → 4 col */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users"   value={overview.totalUsers.value.toLocaleString()} growth={overview.totalUsers.growthRate} icon="👥" gradient="from-blue-500 to-blue-700" />
        <StatCard label="Paid Members"  value={totalPaid.toLocaleString()}                  growth={overview.activeKeys.growthRate}  icon="🔑" gradient="from-emerald-500 to-emerald-700" />
        <StatCard label="Elite Members" value={overview.eliteUsers.value.toLocaleString()}  growth={0}                               icon="⚡" gradient="from-purple-500 to-purple-700" />
        <StatCard label="Est. MRR"      value={`$${overview.revenue.value.toLocaleString()}`} growth={overview.revenue.growthRate}  icon="💰" gradient="from-amber-500 to-orange-600" />
      </div>

      {/* Main Grid — stacks on mobile, side-by-side on xl */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Plan Distribution */}
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5">
          <h2 className="mb-4 text-sm font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-base">
            Plan Distribution
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {planDist.map((p) => {
              const cfg = PLAN_CONFIG[p.plan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
              const pct = totalAll > 0 ? Math.round((p.count / totalAll) * 100) : 0;
              return (
                <div key={p.plan}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${cfg.dot} sm:h-2.5 sm:w-2.5`} />
                      <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300 sm:text-sm">{p.plan}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white sm:text-sm">{p.count}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/5">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-center sm:mt-5">
            <p className="text-xs text-gray-500 dark:text-gray-400">Conversion rate</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              {totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Recent Signups — full width on mobile, 2 cols on xl */}
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">Recent Signups</h2>
            <a href="/admin/users" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {recentUsers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No users yet</p>
            ) : recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                    {(user.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                      {user.full_name || user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="ml-2 flex shrink-0 items-center gap-2">
                  <PlanBadge plan={user.plan || "free"} />
                  <span className="hidden text-xs text-gray-400 md:block">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-base">Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No recent activity</p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:h-8 sm:w-8 sm:text-sm">✓</div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">{a.user}</span>
                    {" "}signed up · <span className="font-semibold capitalize">{a.plan}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{new Date(a.time).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
