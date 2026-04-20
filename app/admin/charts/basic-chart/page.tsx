/**
 * Revenue & Analytics — REAL data from Supabase
 * Replaces fake demo charts with live platform metrics
 */
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Revenue & Analytics" };

const PLAN_PRICE: Record<string, number> = {
  elite: 2399, pro: 1149, starter: 85, free: 0,
};

async function getRevenueData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);

  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Last 6 months revenue
  const monthlyRevenue: { month: string; revenue: number; signups: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .gte("created_at", start)
      .lt("created_at", end);
    const rev = (data || []).reduce((s, u) => s + (PLAN_PRICE[u.plan || "free"] || 0), 0);
    monthlyRevenue.push({ month: months[d.getMonth()], revenue: rev, signups: data?.length || 0 });
  }

  // Plan distribution
  const plans = ["free", "starter", "pro", "elite"];
  const planCounts: Record<string, number> = {};
  for (const plan of plans) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", plan);
    planCounts[plan] = count || 0;
  }

  // Total stats
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // This month vs last month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const { data: thisMonthUsers } = await supabase
    .from("profiles")
    .select("plan")
    .gte("created_at", thisMonthStart);
  const { data: lastMonthUsers } = await supabase
    .from("profiles")
    .select("plan")
    .gte("created_at", lastMonthStart)
    .lt("created_at", thisMonthStart);

  const thisMonthRev = (thisMonthUsers || []).reduce((s, u) => s + (PLAN_PRICE[u.plan || "free"] || 0), 0);
  const lastMonthRev = (lastMonthUsers || []).reduce((s, u) => s + (PLAN_PRICE[u.plan || "free"] || 0), 0);
  const totalRev = Object.entries(planCounts).reduce((s, [plan, count]) => s + (PLAN_PRICE[plan] || 0) * count, 0);

  return {
    monthlyRevenue,
    planCounts,
    totalUsers: totalUsers || 0,
    thisMonthRev,
    lastMonthRev,
    totalRev,
    revenueGrowth: lastMonthRev > 0
      ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100)
      : 0,
  };
}

const PLAN_COLORS: Record<string, string> = {
  elite: "bg-purple-500",
  pro: "bg-blue-500",
  starter: "bg-emerald-500",
  free: "bg-gray-500",
};

const PLAN_TEXT: Record<string, string> = {
  elite: "text-purple-400",
  pro: "text-blue-400",
  starter: "text-emerald-400",
  free: "text-gray-400",
};

export default async function RevenueAnalyticsPage() {
  const data = await getRevenueData();

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.</p>
      </div>
    );
  }

  const maxRev = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1);
  const maxSignups = Math.max(...data.monthlyRevenue.map(m => m.signups), 1);
  const totalPaid = Object.entries(data.planCounts)
    .filter(([p]) => p !== "free")
    .reduce((s, [, c]) => s + c, 0);
  const totalAll = Object.values(data.planCounts).reduce((s, c) => s + c, 0);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Revenue & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Real-time platform metrics from Supabase</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Revenue (Est.)", value: `₹${data.totalRev.toLocaleString("en-IN")}`, sub: "All time", color: "text-emerald-400" },
          { label: "This Month", value: `₹${data.thisMonthRev.toLocaleString("en-IN")}`, sub: `${data.revenueGrowth >= 0 ? "+" : ""}${data.revenueGrowth}% vs last month`, color: data.revenueGrowth >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Total Users", value: data.totalUsers.toLocaleString(), sub: `${totalPaid} paid`, color: "text-cyan-400" },
          { label: "Conversion Rate", value: `${totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0}%`, sub: `${totalPaid} of ${totalAll}`, color: "text-purple-400" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`mt-1.5 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-gray-600">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="mb-5 text-base font-bold text-white">Monthly Revenue (₹)</h2>
        <div className="flex items-end gap-3 h-48">
          {data.monthlyRevenue.map(m => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-gray-500">₹{(m.revenue / 100).toFixed(0)}k</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all"
                style={{ height: `${Math.max((m.revenue / maxRev) * 160, 4)}px` }} />
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signups Chart */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="mb-5 text-base font-bold text-white">Monthly Signups</h2>
        <div className="flex items-end gap-3 h-40">
          {data.monthlyRevenue.map(m => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-gray-500">{m.signups}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400 transition-all"
                style={{ height: `${Math.max((m.signups / maxSignups) * 120, 4)}px` }} />
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-base font-bold text-white">Plan Distribution</h2>
          <div className="space-y-4">
            {["elite", "pro", "starter", "free"].map(plan => {
              const count = data.planCounts[plan] || 0;
              const pct = totalAll > 0 ? Math.round((count / totalAll) * 100) : 0;
              return (
                <div key={plan}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`text-sm font-medium capitalize ${PLAN_TEXT[plan]}`}>{plan}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{count}</span>
                      <span className="text-xs text-gray-500">{pct}%</span>
                      <span className="text-xs text-gray-600">
                        ₹{((PLAN_PRICE[plan] || 0) * count).toLocaleString("en-IN")}/mo
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5">
                    <div className={`h-2 rounded-full ${PLAN_COLORS[plan]} transition-all`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-base font-bold text-white">Revenue Breakdown</h2>
          <div className="space-y-3">
            {["elite", "pro", "starter"].map(plan => {
              const count = data.planCounts[plan] || 0;
              const rev = (PLAN_PRICE[plan] || 0) * count;
              const pct = data.totalRev > 0 ? Math.round((rev / data.totalRev) * 100) : 0;
              return (
                <div key={plan} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${PLAN_COLORS[plan]}`} />
                    <span className="text-sm capitalize text-gray-300">{plan}</span>
                    <span className="text-xs text-gray-600">{count} users</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">₹{rev.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-600">{pct}% of total</p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
              <span className="text-sm font-bold text-cyan-400">Total MRR</span>
              <span className="text-sm font-bold text-white">₹{data.totalRev.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
