import { getOverviewData, getRecentUsers, getPlanDistribution } from "./fetch";

export default async function AdminDashboard() {
  const [overview, recentUsers, planDist] = await Promise.all([
    getOverviewData(),
    getRecentUsers(),
    getPlanDistribution(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">CyberMind Dashboard</h1>
        <p className="text-sm text-dark-6 mt-1">Platform overview and user management</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={overview.totalUsers.value} growth={overview.totalUsers.growthRate} icon="👥" color="blue" />
        <StatCard label="Active API Keys" value={overview.activeKeys.value} growth={overview.activeKeys.growthRate} icon="🔑" color="green" />
        <StatCard label="Elite Members" value={overview.eliteUsers.value} growth={overview.eliteUsers.growthRate} icon="⚡" color="purple" />
        <StatCard label="Pro Members" value={overview.proUsers.value} growth={overview.proUsers.growthRate} icon="🚀" color="cyan" />
      </div>

      {/* Plan Distribution + Recent Users */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Plan Distribution */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Plan Distribution</h2>
          <div className="space-y-3">
            {planDist.map((p) => (
              <div key={p.plan} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      p.plan === "elite"
                        ? "bg-purple-500"
                        : p.plan === "pro"
                          ? "bg-blue-500"
                          : p.plan === "starter"
                            ? "bg-green-500"
                            : "bg-gray-400"
                    }`}
                  />
                  <span className="capitalize text-sm font-medium text-dark dark:text-white">
                    {p.plan}
                  </span>
                </div>
                <span className="text-sm font-bold text-dark dark:text-white">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recent Signups</h2>
          <div className="space-y-3">
            {recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {user.full_name || user.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-dark-6">{user.email}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.plan === "elite"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : user.plan === "pro"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {user.plan || "free"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  growth,
  icon,
}: {
  label: string;
  value: number;
  growth: number;
  icon: string;
  color: string;
}) {
  const isPositive = growth >= 0;
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium ${isPositive ? "text-green" : "text-red"}`}>
          {isPositive ? "+" : ""}
          {growth}%
        </span>
      </div>
      <p className="text-2xl font-bold text-dark dark:text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-dark-6 mt-1">{label}</p>
    </div>
  );
}
