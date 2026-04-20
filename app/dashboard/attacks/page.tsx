"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Crosshair, TrendingUp, Zap, Target, Shield, AlertTriangle } from "lucide-react";

interface AttackTarget {
  id: string;
  target: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  bugs_found: number;
  tools_ran: number;
  finding_chance: number; // 0-100
  status: "running" | "completed" | "failed";
}

export default function AttacksPage() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<AttackTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_attacks: 0,
    total_bugs: 0,
    avg_finding_chance: 0,
    total_tools_used: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Fetch attack history from backend
    // For now, show mock data — backend endpoint needs to be created
    const mockTargets: AttackTarget[] = [
      {
        id: "1",
        target: "example.com",
        mode: "omega",
        started_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        completed_at: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
        bugs_found: 3,
        tools_ran: 45,
        finding_chance: 78,
        status: "completed",
      },
      {
        id: "2",
        target: "testsite.io",
        mode: "recon",
        started_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000 + 3600000).toISOString(),
        bugs_found: 0,
        tools_ran: 12,
        finding_chance: 34,
        status: "completed",
      },
      {
        id: "3",
        target: "bugbounty.example",
        mode: "hunt",
        started_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: null,
        bugs_found: 1,
        tools_ran: 28,
        finding_chance: 62,
        status: "running",
      },
    ];

    setTargets(mockTargets);
    setStats({
      total_attacks: mockTargets.length,
      total_bugs: mockTargets.reduce((sum, t) => sum + t.bugs_found, 0),
      avg_finding_chance: Math.round(
        mockTargets.reduce((sum, t) => sum + t.finding_chance, 0) / mockTargets.length
      ),
      total_tools_used: mockTargets.reduce((sum, t) => sum + t.tools_ran, 0),
    });
    setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-white">Linux Attack Targets</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">
          Track your OMEGA, Recon, Hunt, and Abhimanyu attack sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[rgba(138,43,226,0.2)] p-2.5">
              <Target className="h-5 w-5 text-[var(--accent-strong)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_attacks}</p>
              <p className="text-xs text-[var(--text-muted)]">Total Attacks</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[rgba(255,68,68,0.2)] p-2.5">
              <AlertTriangle className="h-5 w-5 text-[#FF4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_bugs}</p>
              <p className="text-xs text-[var(--text-muted)]">Bugs Found</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[rgba(0,255,255,0.2)] p-2.5">
              <TrendingUp className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avg_finding_chance}%</p>
              <p className="text-xs text-[var(--text-muted)]">Avg Finding Chance</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[rgba(0,255,136,0.2)] p-2.5">
              <Zap className="h-5 w-5 text-[#00FF88]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_tools_used}</p>
              <p className="text-xs text-[var(--text-muted)]">Tools Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Targets Table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Attack History</h2>

        {targets.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <Crosshair className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">
              No attack sessions yet. Run <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">cybermind /plan target.com</code> to start.
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
                {targets.map((target) => (
                  <tr key={target.id} className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[var(--accent-cyan)]" />
                        <span className="font-mono text-white">{target.target}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex rounded-full bg-[rgba(138,43,226,0.2)] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[var(--accent-strong)]">
                        {target.mode}
                      </span>
                    </td>
                    <td className="py-4">
                      {target.status === "running" && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-cyan)]">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-cyan)]" />
                          Running
                        </span>
                      )}
                      {target.status === "completed" && (
                        <span className="text-xs text-[#00FF88]">✓ Completed</span>
                      )}
                      {target.status === "failed" && (
                        <span className="text-xs text-[#FF4444]">✗ Failed</span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${target.bugs_found > 0 ? "text-[#FF4444]" : "text-[var(--text-muted)]"}`}>
                        {target.bugs_found}
                      </span>
                    </td>
                    <td className="py-4 text-[var(--text-soft)]">{target.tools_ran}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all ${
                              target.finding_chance >= 70
                                ? "bg-[#00FF88]"
                                : target.finding_chance >= 40
                                ? "bg-[#FFD700]"
                                : "bg-[#FF4444]"
                            }`}
                            style={{ width: `${target.finding_chance}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-soft)]">{target.finding_chance}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-[var(--text-muted)]">
                      {new Date(target.started_at).toLocaleDateString()} {new Date(target.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-2xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.05)] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[rgba(0,255,255,0.2)] p-2">
            <Crosshair className="h-5 w-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Linux CLI Only</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Attack sessions are tracked from the Linux CLI. Run <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">cybermind /plan target.com</code> to start an OMEGA attack.
              Results will appear here automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
