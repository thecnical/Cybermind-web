import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getOverviewData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Total active users (profiles table)
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // New users last 30 days
  const { count: newUsers30 } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());

  // New users 30-60 days ago (for growth rate)
  const { count: newUsers60 } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sixtyDaysAgo.toISOString())
    .lt("created_at", thirtyDaysAgo.toISOString());

  // Active API keys
  const { count: activeKeys } = await supabase
    .from("api_keys")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Elite plan users
  const { count: eliteUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "elite");

  // Pro plan users
  const { count: proUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "pro");

  const userGrowth =
    newUsers60 && newUsers60 > 0
      ? Math.round(
          (((newUsers30 || 0) - newUsers60) / newUsers60) * 100 * 100
        ) / 100
      : 0;

  return {
    totalUsers: { value: totalUsers || 0, growthRate: userGrowth },
    activeKeys: { value: activeKeys || 0, growthRate: 0 },
    eliteUsers: { value: eliteUsers || 0, growthRate: 0 },
    proUsers: { value: proUsers || 0, growthRate: 0 },
  };
}

export async function getRecentUsers() {
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, created_at, status")
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

export async function getPlanDistribution() {
  const plans = ["free", "starter", "pro", "elite"];
  const counts = await Promise.all(
    plans.map(async (plan) => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("plan", plan);
      return { plan, count: count || 0 };
    })
  );
  return counts;
}

export async function getSupportTickets() {
  const { data } = await supabase
    .from("support_tickets")
    .select("id, subject, status, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}
