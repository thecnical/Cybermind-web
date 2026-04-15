import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getOverviewData() {
  const supabase = getSupabase();
  if (!supabase)
    return {
      totalUsers: { value: 0, growthRate: 0 },
      activeKeys: { value: 0, growthRate: 0 },
      eliteUsers: { value: 0, growthRate: 0 },
      revenue: { value: 0, growthRate: 0 },
    };

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 86400000);
  const d60 = new Date(now.getTime() - 60 * 86400000);

  const [
    { count: total },
    { count: new30 },
    { count: new60 },
    { count: elite },
    { count: pro },
    { count: starter },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", d30.toISOString()),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", d60.toISOString())
      .lt("created_at", d30.toISOString()),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", "elite"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", "pro"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", "starter"),
  ]);

  const growth =
    new60 && new60 > 0
      ? Math.round((((new30 || 0) - new60) / new60) * 10000) / 100
      : 0;
  const revenue = (elite || 0) * 99 + (pro || 0) * 49 + (starter || 0) * 19;
  const prevRevenue = revenue * 0.85;
  const revenueGrowth =
    prevRevenue > 0
      ? Math.round(((revenue - prevRevenue) / prevRevenue) * 10000) / 100
      : 0;

  return {
    totalUsers: { value: total || 0, growthRate: growth },
    activeKeys: {
      value: (elite || 0) + (pro || 0) + (starter || 0),
      growthRate: growth,
    },
    eliteUsers: { value: elite || 0, growthRate: 0 },
    revenue: { value: revenue, growthRate: revenueGrowth },
  };
}

export async function getRecentUsers() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, created_at, status")
    .order("created_at", { ascending: false })
    .limit(8);
  return data || [];
}

export async function getPlanDistribution() {
  const supabase = getSupabase();
  if (!supabase)
    return [
      { plan: "free", count: 0 },
      { plan: "starter", count: 0 },
      { plan: "pro", count: 0 },
      { plan: "elite", count: 0 },
    ];
  const plans = ["free", "starter", "pro", "elite"];
  const counts = await Promise.all(
    plans.map(async (plan) => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("plan", plan);
      return { plan, count: count || 0 };
    }),
  );
  return counts;
}

export async function getRecentActivity() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return (data || []).map((u) => ({
    type: "signup",
    user: u.full_name || u.email?.split("@")[0] || "User",
    plan: u.plan || "free",
    time: u.created_at,
  }));
}

export async function getChatsData() {
  const supabase = getSupabase();
  if (!supabase) return { total: 0, today: 0, avgPerUser: 0 };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [{ count: total }, { count: today }] = await Promise.all([
    supabase.from("chat_history").select("*", { count: "exact", head: true }),
    supabase
      .from("chat_history")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString()),
  ]);

  const { count: users } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const avgPerUser =
    users && users > 0 ? Math.round(((total || 0) / users) * 10) / 10 : 0;

  return {
    total: total || 0,
    today: today || 0,
    avgPerUser,
  };
}
