import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const PLAN_BADGE: Record<string, string> = {
  elite:   "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  pro:     "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  starter: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  free:    "bg-gray-500/20 text-gray-300 border border-gray-500/30",
};

export default async function UsersPage() {
  const supabase = getSupabase();
  const users = supabase
    ? (await supabase.from("profiles").select("id, email, full_name, plan, created_at, status").order("created_at", { ascending: false }).limit(100)).data || []
    : [];

  const planCounts = users.reduce((acc, u) => {
    const p = u.plan || "free";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5 pb-10 sm:space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">User Management</h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{users.length} users total</p>
      </div>

      {/* Plan quick-stats — 2 col mobile, 4 col sm+ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {["elite", "pro", "starter", "free"].map((plan) => (
          <div key={plan} className="rounded-xl bg-white p-3 shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 text-center sm:p-4">
            <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{planCounts[plan] || 0}</p>
            <p className="mt-0.5 text-xs font-medium capitalize text-gray-500 dark:text-gray-400">{plan}</p>
          </div>
        ))}
      </div>

      {/* Mobile: card list | Desktop: table */}
      <div className="rounded-2xl bg-white shadow-sm dark:bg-[#0f1a2e] border border-gray-100 dark:border-white/5 overflow-hidden">

        {/* Mobile card list (hidden on md+) */}
        <div className="divide-y divide-gray-50 dark:divide-white/5 md:hidden">
          {users.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">No users found</p>
          ) : users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                  {(user.full_name || user.email || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.full_name || "—"}</p>
                  <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${PLAN_BADGE[user.plan || "free"] || PLAN_BADGE.free}`}>
                  {user.plan || "free"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table (hidden on mobile) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">No users found</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                        {(user.full_name || user.email || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.full_name || "—"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${PLAN_BADGE[user.plan || "free"] || PLAN_BADGE.free}`}>
                      {user.plan || "free"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === "suspended" ? "bg-red-400" : "bg-emerald-400"}`} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">{user.status || "active"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
