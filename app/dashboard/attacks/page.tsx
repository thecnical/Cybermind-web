"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Crosshair, TrendingUp, Zap, Target, Shield, AlertTriangle, RefreshCw } from "lucide-react";

interface AttackTarget {
  id: string;
  user_id: string;
  target: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  bugs_found: number;
  tools_ran: number;
  finding_chance: number;
  status: "running" | "completed" | "failed";
}

export default function AttacksPage() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<AttackTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    total_attacks: targets.length,
    total_bugs: targets.reduce((s, t) => s + (t.bugs_found || 0), 0),
    avg_finding_chance: targets.length > 0
      ? Math.round(targets.reduce((s, t) => s + (t.finding_chance || 0), 0) / targets.length)
      : 0,
    total_tools_used: targets.reduce((s, t) => s + (t.tools_ran || 0), 0),
  };

  async function loadTargets() {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from attack_sessions table
      const { data, error: dbErr } = await supabase
        .from("attack_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(100);

      if (dbErr) {
        // Table may not exist yet — show empty state
        if (dbErr.code === "42P01") {
          setTargets([]);
          setError(null);
        } else {
          setError(dbErr.message);
        }
      } else {
        setTargets(data || []);
      }
    } catch (err) {
      setError("Failed to load attack history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTargets();
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("attack_sessions_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attack_sessions", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTargets(prev => [payload.new as AttackTarget, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTargets(prev => prev.map(t => t.id === payload.new.id ? payload.new as AttackTarget : t));
          } else if (payload.eventType === "DELETE") {
            setTargets(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent-cyan)] border-t-transparent" />
          <span className="font-mono text-sm">Loading attack history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Linux Attack Targets</h1>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            Real-time OMEGA, Recon, Hunt, and Abhimanyu sessions
          </p>
        </div>
        <button
          onClick={loadTargets}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--text-muted)] transition hover:text-white disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Target,        value: stats.total_attacks,      label: "Total Attacks",      color: "bg-[rgba(138,43,226,0.2)]",  iconColor: "text-[var(--accent-strong)]" },
          { icon: AlertTriangle, value: stats.total_bugs,         label: "Bugs Found",         color: "bg-[rgba(255,68,68,0.2)]",   iconColor: "text-[#FF4444]" },
          { icon: TrendingUp,    value: `${stats.avg_finding_chance}%`, label: "Avg Finding Chance", color: "bg-[rgba(0,255,255,0.2)]",   iconColor: "text-[var(--accent-cyan)]" },
          { icon: Zap,           value: stats.total_tools_used,   label: "Tools Used",         color: "bg-[rgba(0,255,136,0.2)]",   iconColor: "text-[#00FF88]" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl ${s.color} p-2.5`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Targets Table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Attack History</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-cyan)]" />
            <span className="text-xs text-[var(--text-muted)]">Live</span>
          </div>
        </div>

        {error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-10 w-10 text-[#FF4444]" />
            <p className="text-sm text-[#FF4444]">{error}</p>
            <button onClick={loadTargets} className="text-xs text-[var(--accent-cyan)] hover:underline">Try again</button>
          </div>
        ) : targets.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <Crosshair className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-soft)]">No attack sessions yet</p>
            <p className="text-xs text-[var(--text-muted)]">
              Run <code className="rounded bg-white/10 px-2 py-0.5 font-mono">cybermind /plan target.com</code> on Linux to start
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="pb-3">Target</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Bugs</th>
                  <th className="pb-3">Tools</th>
                  <th className="pb-3">Finding Chance</th>
                  <th className="pb-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {targets.map((t) => (
                  <tr key={t.id} className="text-sm transition hover:bg-white/[0.02]">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 flex-shrink-0 text-[var(--accent-cyan)]" />
                        <span className="font-mono text-white">{t.target}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex rounded-full bg-[rgba(138,43,226,0.2)] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[var(--accent-strong)]">
                        {t.mode}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {t.status === "running" && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-cyan)]">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-cyan)]" />
                          Running
                        </span>
                      )}
                      {t.status === "completed" && <span className="text-xs text-[#00FF88]">✓ Completed</span>}
                      {t.status === "failed"    && <span className="text-xs text-[#FF4444]">✗ Failed</span>}
                    </td>
                    <td className="py-3.5">
                      <span className={`font-semibold ${(t.bugs_found || 0) > 0 ? "text-[#FF4444]" : "text-[var(--text-muted)]"}`}>
                        {t.bugs_found || 0}
                      </span>
                    </td>
                    <td className="py-3.5 text-[var(--text-soft)]">{t.tools_ran || 0}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all ${
                              (t.finding_chance || 0) >= 70 ? "bg-[#00FF88]" :
                              (t.finding_chance || 0) >= 40 ? "bg-[#FFD700]" : "bg-[#FF4444]"
                            }`}
                            style={{ width: `${t.finding_chance || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-soft)]">{t.finding_chance || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-[var(--text-muted)]">
                      {new Date(t.started_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}{" "}
                      {new Date(t.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.05)] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[rgba(0,255,255,0.2)] p-2">
            <Crosshair className="h-5 w-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Linux CLI Only</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Attack sessions are tracked from the Linux CLI and synced here in real-time.
              Run <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">cybermind /plan target.com</code> to start an OMEGA attack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
