"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { RefreshCw, Search, Shield, Trash2, RotateCcw, ChevronDown } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";

// Use service role for admin operations
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const PLAN_BADGE: Record<string, string> = {
  elite:   "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  pro:     "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  starter: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  free:    "bg-gray-500/20 text-gray-300 border border-gray-500/30",
};

const PLANS = ["free", "starter", "pro", "elite"] as const;

interface User {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  email_verified: boolean;
  is_banned: boolean;
  requests_today: number;
  requests_month: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [actionUser, setActionUser] = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const supabase = getAdminSupabase();

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const loadUsers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, plan, email_verified, is_banned, requests_today, requests_month, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      setUsers(data || []);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function upgradePlan(email: string, plan: string) {
    setActionUser(email);
    try {
      const res = await fetch(`${BACKEND}/admin/upgrade-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": process.env.NEXT_PUBLIC_ADMIN_SECRET || "",
        },
        body: JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ ${email} → ${plan}`);
        await loadUsers();
      } else {
        showToast(data.error || "Failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionUser(null);
    }
  }

  async function resetUsage(email: string) {
    setActionUser(email);
    try {
      const res = await fetch(`${BACKEND}/admin/reset-usage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": process.env.NEXT_PUBLIC_ADMIN_SECRET || "",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Usage reset for ${email}`);
        await loadUsers();
      } else {
        showToast(data.error || "Failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionUser(null);
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.plan === filter ||
      (filter === "banned" && u.is_banned) ||
      (filter === "unverified" && !u.email_verified);
    return matchSearch && matchFilter;
  });

  const planCounts = users.reduce((acc, u) => {
    acc[u.plan || "free"] = (acc[u.plan || "free"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5 pb-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl transition-all ${
          toast.type === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">User Management</h1>
          <p className="mt-0.5 text-xs text-gray-500">{users.length} total users</p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-gray-400 transition hover:text-white disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Plan stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PLANS.map(plan => (
          <button
            key={plan}
            onClick={() => setFilter(filter === plan ? "all" : plan)}
            className={`rounded-xl border p-3 text-center transition ${
              filter === plan
                ? "border-cyan-500/30 bg-cyan-500/10"
                : "border-white/5 bg-white/[0.02] hover:border-white/10"
            }`}
          >
            <p className="text-xl font-bold text-white">{planCounts[plan] || 0}</p>
            <p className="mt-0.5 text-xs capitalize text-gray-500">{plan}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/30"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300 outline-none"
        >
          <option value="all">All users</option>
          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
          <option value="banned">Banned</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {["User", "Plan", "Usage", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(user => (
                  <tr key={user.id} className="transition hover:bg-white/[0.02]">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-xs font-bold text-white">
                          {(user.full_name || user.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.full_name || "—"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan with dropdown */}
                    <td className="px-4 py-3">
                      <div className="relative group">
                        <span className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${PLAN_BADGE[user.plan || "free"] || PLAN_BADGE.free}`}>
                          {user.plan || "free"}
                        </span>
                        {/* Upgrade dropdown */}
                        <div className="absolute left-0 top-full z-10 mt-1 hidden w-32 rounded-xl border border-white/10 bg-[#0a0f1a] py-1 shadow-xl group-hover:block">
                          {PLANS.filter(p => p !== user.plan).map(p => (
                            <button
                              key={p}
                              onClick={() => upgradePlan(user.email, p)}
                              disabled={actionUser === user.email}
                              className="w-full px-3 py-1.5 text-left text-xs capitalize text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                            >
                              → {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Usage */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-400">
                        {user.requests_today || 0} today
                      </p>
                      <p className="text-xs text-gray-600">
                        {user.requests_month || 0} month
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${user.is_banned ? "bg-red-400" : "bg-emerald-400"}`} />
                          <span className="text-xs text-gray-400">{user.is_banned ? "Banned" : "Active"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${user.email_verified ? "bg-cyan-400" : "bg-yellow-400"}`} />
                          <span className="text-xs text-gray-400">{user.email_verified ? "Verified" : "Unverified"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resetUsage(user.email)}
                          disabled={actionUser === user.email}
                          title="Reset usage"
                          className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5 text-gray-500 transition hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-40"
                        >
                          <RotateCcw size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
