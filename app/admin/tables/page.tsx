/**
 * Admin Tables — REAL data from Supabase
 * Shows: API key usage, top users by requests, payment history
 */
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Platform Tables" };

const PLAN_BADGE: Record<string, string> = {
  elite:   "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  pro:     "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  starter: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  free:    "bg-gray-500/20 text-gray-300 border border-gray-500/30",
};

async function getTableData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);

  const [
    { data: topUsers },
    { data: recentKeys },
    { data: recentTickets },
    { data: planStats },
  ] = await Promise.all([
    // Top users by request count
    supabase
      .from("profiles")
      .select("id, email, full_name, plan, requests_today, requests_month, created_at")
      .order("requests_month", { ascending: false })
      .limit(10),

    // Recent API keys
    supabase
      .from("api_keys")
      .select("id, key_prefix, plan, created_at, last_used_at, is_active")
      .order("created_at", { ascending: false })
      .limit(10),

    // Recent support tickets
    supabase
      .from("support_tickets")
      .select("id, email, subject, status, priority, created_at")
      .order("created_at", { ascending: false })
      .limit(10),

    // Plan stats
    supabase
      .from("profiles")
      .select("plan"),
  ]);

  const planCounts: Record<string, number> = {};
  for (const p of planStats || []) {
    planCounts[p.plan || "free"] = (planCounts[p.plan || "free"] || 0) + 1;
  }

  return { topUsers, recentKeys, recentTickets, planCounts };
}

export default async function TablesPage() {
  const data = await getTableData();

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Database not configured.</p>
      </div>
    );
  }

  const { topUsers, recentKeys, recentTickets } = data;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Tables</h1>
        <p className="mt-1 text-sm text-gray-500">Live data from Supabase</p>
      </div>

      {/* Top Users by Usage */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <h2 className="text-base font-bold text-white">Top Users by Usage</h2>
          <p className="text-xs text-gray-500 mt-0.5">Ranked by monthly requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["#", "User", "Plan", "Today", "This Month", "Joined"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(topUsers || []).length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-500">No users yet</td></tr>
              ) : (topUsers || []).map((u, i) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 text-sm text-gray-500">#{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-xs font-bold text-white">
                        {(u.full_name || u.email || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{u.full_name || "—"}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${PLAN_BADGE[u.plan || "free"] || PLAN_BADGE.free}`}>
                      {u.plan || "free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{u.requests_today || 0}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{u.requests_month || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent API Keys */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <h2 className="text-base font-bold text-white">Recent API Keys</h2>
          <p className="text-xs text-gray-500 mt-0.5">Latest generated keys</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["Key Prefix", "Plan", "Status", "Last Used", "Created"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(recentKeys || []).length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">No API keys yet</td></tr>
              ) : (recentKeys || []).map((k) => (
                <tr key={k.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3">
                    <code className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-cyan-400">
                      {k.key_prefix || "cp_live_****"}...
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${PLAN_BADGE[k.plan || "free"] || PLAN_BADGE.free}`}>
                      {k.plan || "free"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${k.is_active !== false ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span className="text-xs text-gray-400">{k.is_active !== false ? "Active" : "Revoked"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(k.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Support Tickets */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Support Tickets</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest user issues</p>
          </div>
          <a href="/admin/support" className="text-xs text-cyan-400 hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["User", "Subject", "Priority", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(recentTickets || []).length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-500">No tickets yet</td></tr>
              ) : (recentTickets || []).map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 text-sm text-gray-300">{t.email}</td>
                  <td className="px-4 py-3 text-sm text-white max-w-[200px] truncate">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold uppercase ${
                      t.priority === "urgent" ? "text-red-400" :
                      t.priority === "high" ? "text-orange-400" :
                      t.priority === "normal" ? "text-gray-300" : "text-gray-500"
                    }`}>{t.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      t.status === "open" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" :
                      t.status === "resolved" ? "bg-blue-500/15 text-blue-400 border-blue-500/25" :
                      "bg-white/10 text-gray-400 border-white/10"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
