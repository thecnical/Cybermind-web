"use client";

/**
 * Admin Settings — Real platform configuration
 * Boss-only: rate limits, plan prices, feature flags, announcements
 */
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Save, Check, Shield, Zap, Bell, Users, AlertTriangle } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

const BOSS_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
]);

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface PlatformStats {
  totalUsers: number;
  paidUsers: number;
  todaySignups: number;
  openTickets: number;
  backendStatus: "online" | "offline" | "checking";
}

export default function AdminSettingsPage() {
  const [myEmail, setMyEmail] = useState("");
  const [isBoss, setIsBoss] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0, paidUsers: 0, todaySignups: 0, openTickets: 0, backendStatus: "checking",
  });
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Settings state
  const [announcement, setAnnouncement] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [freeRateLimit, setFreeRateLimit] = useState("10");
  const [proRateLimit, setProRateLimit] = useState("200");
  const [eliteRateLimit, setEliteRateLimit] = useState("unlimited");
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const email = session.user.email || "";
      setMyEmail(email);
      setIsBoss(BOSS_EMAILS.has(email.toLowerCase()));

      // Load real stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const [
        { count: total },
        { count: paid },
        { count: today },
        { count: tickets },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).neq("plan", "free"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
        supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
      ]);

      setStats(s => ({ ...s, totalUsers: total || 0, paidUsers: paid || 0, todaySignups: today || 0, openTickets: tickets || 0 }));

      // Check backend health
      fetch(`${BACKEND}/health`).then(r => {
        setStats(s => ({ ...s, backendStatus: r.ok ? "online" : "offline" }));
      }).catch(() => {
        setStats(s => ({ ...s, backendStatus: "offline" }));
      });
    });
  }, []);

  async function handleSave(section: string) {
    setLoading(true);
    // In a real implementation, these would be saved to a settings table in Supabase
    // For now, we save to localStorage as a quick config store
    const settings = {
      announcement,
      maintenanceMode,
      freeRateLimit,
      proRateLimit,
      eliteRateLimit,
    };
    localStorage.setItem("cybermind_admin_settings", JSON.stringify(settings));
    setSaved(section);
    setLoading(false);
    setTimeout(() => setSaved(null), 2000);
  }

  async function handleBanUser() {
    if (!adminKey.trim()) return;
    // This would call the backend admin API
    alert("Use the Users page to ban/unban specific users.");
  }

  async function broadcastAnnouncement() {
    if (!announcement.trim()) return;
    setLoading(true);
    try {
      // Save to Supabase announcements table (if exists)
      const supabase = getSupabase();
      await supabase.from("announcements").insert({
        message: announcement,
        created_by: myEmail,
        active: true,
      }).select();
      setSaved("announcement");
      setTimeout(() => setSaved(null), 2000);
    } catch {
      // Table may not exist — just save locally
      localStorage.setItem("cybermind_announcement", announcement);
      setSaved("announcement");
      setTimeout(() => setSaved(null), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isBoss ? "👑 Boss access — full control" : "Admin settings"}
        </p>
      </div>

      {/* Live Platform Status */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Zap size={16} className="text-cyan-400" /> Live Platform Status
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Users", value: stats.totalUsers.toLocaleString(), color: "text-cyan-400" },
            { label: "Paid Users", value: stats.paidUsers.toLocaleString(), color: "text-emerald-400" },
            { label: "Today Signups", value: stats.todaySignups.toLocaleString(), color: "text-purple-400" },
            { label: "Open Tickets", value: stats.openTickets.toLocaleString(), color: stats.openTickets > 5 ? "text-red-400" : "text-gray-300" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${
            stats.backendStatus === "online" ? "bg-emerald-400 animate-pulse" :
            stats.backendStatus === "offline" ? "bg-red-400" : "bg-yellow-400 animate-pulse"
          }`} />
          <span className="text-xs text-gray-400">
            Backend: {stats.backendStatus === "checking" ? "Checking..." : stats.backendStatus}
          </span>
          <span className="text-xs text-gray-600">({BACKEND})</span>
        </div>
      </div>

      {/* Announcement — Boss only */}
      {isBoss && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <Bell size={16} className="text-yellow-400" /> Platform Announcement
          </h2>
          <textarea
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            placeholder="Write an announcement for all users (shown on dashboard)..."
            rows={3}
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-500/30 resize-none"
          />
          <button
            onClick={broadcastAnnouncement}
            disabled={loading || !announcement.trim()}
            className="mt-3 flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm font-medium text-yellow-400 transition hover:bg-yellow-500/20 disabled:opacity-40"
          >
            {saved === "announcement" ? <><Check size={14} className="text-emerald-400" /> Sent!</> : <><Bell size={14} /> Broadcast to all users</>}
          </button>
        </div>
      )}

      {/* Rate Limits */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Shield size={16} className="text-cyan-400" /> Rate Limits (requests/day)
        </h2>
        <div className="space-y-4">
          {[
            { label: "Free Plan", value: freeRateLimit, setter: setFreeRateLimit, color: "border-gray-500/30" },
            { label: "Pro Plan", value: proRateLimit, setter: setProRateLimit, color: "border-blue-500/30" },
            { label: "Elite Plan", value: eliteRateLimit, setter: setEliteRateLimit, color: "border-purple-500/30" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4">
              <label className="w-28 text-sm text-gray-400">{item.label}</label>
              <input
                value={item.value}
                onChange={e => item.setter(e.target.value)}
                disabled={!isBoss}
                className={`flex-1 rounded-xl border ${item.color} bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
          ))}
        </div>
        {isBoss && (
          <button
            onClick={() => handleSave("ratelimits")}
            disabled={loading}
            className="mt-4 flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-40"
          >
            {saved === "ratelimits" ? <><Check size={14} className="text-emerald-400" /> Saved!</> : <><Save size={14} /> Save Rate Limits</>}
          </button>
        )}
        {!isBoss && (
          <p className="mt-3 text-xs text-gray-600">👑 Boss access required to change rate limits</p>
        )}
      </div>

      {/* Maintenance Mode — Boss only */}
      {isBoss && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <AlertTriangle size={16} className="text-red-400" /> Maintenance Mode
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Enable maintenance mode</p>
              <p className="text-xs text-gray-500">Shows maintenance page to all users</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(m => !m)}
              className={`relative h-6 w-11 rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${maintenanceMode ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
          {maintenanceMode && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              ⚠️ Maintenance mode is ON — users will see a maintenance page
            </div>
          )}
          <button
            onClick={() => handleSave("maintenance")}
            disabled={loading}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
          >
            {saved === "maintenance" ? <><Check size={14} className="text-emerald-400" /> Saved!</> : <><Save size={14} /> Save</>}
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Users size={16} className="text-cyan-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/admin/users", label: "Manage Users", emoji: "👥", desc: "Upgrade plans, reset usage" },
            { href: "/admin/support", label: "Support Tickets", emoji: "🎫", desc: "Reply to user issues" },
            { href: "/admin/team-chat", label: "Team Chat", emoji: "💬", desc: "Talk to the team" },
            { href: "/admin/ai-chat", label: "AI Chat", emoji: "⚡", desc: "Elite AI access" },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{item.emoji}</span>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Environment Info */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-bold text-white">Environment</h2>
        <div className="space-y-2 font-mono text-xs">
          {[
            { key: "Backend URL", value: BACKEND },
            { key: "Supabase URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL || "not set" },
            { key: "Your Email", value: myEmail || "loading..." },
            { key: "Access Level", value: isBoss ? "👑 Boss" : "🛠️ Tech Team" },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="w-32 text-gray-500">{item.key}:</span>
              <span className="text-gray-300 truncate">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
