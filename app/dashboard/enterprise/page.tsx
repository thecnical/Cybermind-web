"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const BACKEND = "https://cybermind-backend-8yrt.onrender.com";

interface CASMStats {
  active_targets: number;
  total_critical: number;
  total_high: number;
  scans_last_24h: number;
  scans_last_7d: number;
  new_findings_24h: number;
  open_findings: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface CASMTarget {
  id: string;
  target: string;
  scan_mode: string;
  schedule: string;
  status: string;
  customer_name?: string;
  last_scan_at?: string;
  next_scan_at?: string;
  findings_count: number;
  critical_count: number;
  high_count: number;
  created_at: string;
}

interface CASMFinding {
  id: string;
  target: string;
  url?: string;
  title: string;
  severity: string;
  category?: string;
  description?: string;
  cve?: string;
  tool?: string;
  status: string;
  created_at: string;
}

const SEV_COLOR: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10 border-red-400/30",
  high:     "text-orange-400 bg-orange-400/10 border-orange-400/30",
  medium:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  low:      "text-blue-400 bg-blue-400/10 border-blue-400/30",
  info:     "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

function SevBadge({ sev }: { sev: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${SEV_COLOR[sev] ?? SEV_COLOR.info}`}>
      {sev}
    </span>
  );
}

function StatCard({ label, value, sub, color = "cyan" }: { label: string; value: number | string; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    cyan:   "text-cyan-400",
    red:    "text-red-400",
    orange: "text-orange-400",
    green:  "text-green-400",
    purple: "text-purple-400",
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color] ?? colorMap.cyan}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

export default function EnterpriseDashboard() {
  const [stats, setStats] = useState<CASMStats | null>(null);
  const [targets, setTargets] = useState<CASMTarget[]>([]);
  const [findings, setFindings] = useState<CASMFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "targets" | "findings">("overview");
  const [addingTarget, setAddingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ target: "", scan_mode: "full", schedule: "daily", customer_name: "" });
  const [saving, setSaving] = useState(false);

  const adminSecret = typeof window !== "undefined"
    ? (localStorage.getItem("adminSecret") ?? process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "")
    : "";

  const headers = { "Content-Type": "application/json", "x-admin-secret": adminSecret };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, targetsRes, findingsRes] = await Promise.all([
        fetch(`${BACKEND}/casm/stats`, { headers }),
        fetch(`${BACKEND}/casm/targets`, { headers }),
        fetch(`${BACKEND}/casm/findings?limit=50`, { headers }),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.success) setStats(d.stats);
      }
      if (targetsRes.ok) {
        const d = await targetsRes.json();
        if (d.success) setTargets(d.targets ?? []);
      }
      if (findingsRes.ok) {
        const d = await findingsRes.json();
        if (d.success) setFindings(d.findings ?? []);
      }
    } catch (e) {
      setError("Failed to load CASM data. Backend may be sleeping.");
    } finally {
      setLoading(false);
    }
  }, [adminSecret]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  async function addTarget() {
    if (!newTarget.target.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND}/casm/targets`, {
        method: "POST",
        headers,
        body: JSON.stringify(newTarget),
      });
      const d = await res.json();
      if (d.success) {
        setTargets(prev => [d.target, ...prev]);
        setNewTarget({ target: "", scan_mode: "full", schedule: "daily", customer_name: "" });
        setAddingTarget(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteTarget(id: string) {
    if (!confirm("Remove this target from CASM?")) return;
    await fetch(`${BACKEND}/casm/targets/${id}`, { method: "DELETE", headers });
    setTargets(prev => prev.filter(t => t.id !== id));
  }

  function fmt(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  }

  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Enterprise CASM</h1>
            <p className="text-xs text-white/40">Continuous Attack Surface Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              ↻ Refresh
            </button>
            <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          {(["overview", "targets", "findings"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                  : "border border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
                ))}
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatCard label="Active Targets" value={stats.active_targets} color="cyan" />
                  <StatCard label="Critical Findings" value={stats.total_critical} color="red" />
                  <StatCard label="High Findings" value={stats.total_high} color="orange" />
                  <StatCard label="Open Findings" value={stats.open_findings} color="purple" />
                  <StatCard label="Scans (24h)" value={stats.scans_last_24h} sub="last 24 hours" color="green" />
                  <StatCard label="Scans (7d)" value={stats.scans_last_7d} sub="last 7 days" color="cyan" />
                  <StatCard label="New Findings (24h)" value={stats.new_findings_24h} color="orange" />
                  <StatCard label="Medium Findings" value={stats.severity_breakdown?.medium ?? 0} color="cyan" />
                </div>

                {/* Severity breakdown bar */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-widest">Severity Breakdown</p>
                  <div className="space-y-3">
                    {(["critical", "high", "medium", "low"] as const).map(sev => {
                      const count = stats.severity_breakdown?.[sev] ?? 0;
                      const total = stats.open_findings || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={sev} className="flex items-center gap-4">
                          <span className="w-16 text-xs uppercase text-white/40">{sev}</span>
                          <div className="flex-1 rounded-full bg-white/[0.06] h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                sev === "critical" ? "bg-red-400" :
                                sev === "high" ? "bg-orange-400" :
                                sev === "medium" ? "bg-yellow-400" : "bg-blue-400"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-xs text-white/50">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-white/40">No stats available.</p>
            )}
          </div>
        )}

        {/* Targets Tab */}
        {activeTab === "targets" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">{targets.length} targets registered</p>
              <button
                onClick={() => setAddingTarget(v => !v)}
                className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400/20 transition-colors"
              >
                + Add Target
              </button>
            </div>

            {addingTarget && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
                <p className="text-sm font-semibold text-white">New CASM Target</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none"
                    placeholder="target.com"
                    value={newTarget.target}
                    onChange={e => setNewTarget(v => ({ ...v, target: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none"
                    placeholder="Customer name (optional)"
                    value={newTarget.customer_name}
                    onChange={e => setNewTarget(v => ({ ...v, customer_name: e.target.value }))}
                  />
                  <select
                    className="rounded-xl border border-white/10 bg-[#0d0e14] px-4 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    value={newTarget.scan_mode}
                    onChange={e => setNewTarget(v => ({ ...v, scan_mode: e.target.value }))}
                  >
                    <option value="full">Full Scan</option>
                    <option value="recon">Recon Only</option>
                    <option value="stealth">Stealth</option>
                  </select>
                  <select
                    className="rounded-xl border border-white/10 bg-[#0d0e14] px-4 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    value={newTarget.schedule}
                    onChange={e => setNewTarget(v => ({ ...v, schedule: e.target.value }))}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addTarget}
                    disabled={saving}
                    className="rounded-xl bg-cyan-400/20 border border-cyan-400/30 px-5 py-2 text-sm text-cyan-400 hover:bg-cyan-400/30 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Add Target"}
                  </button>
                  <button
                    onClick={() => setAddingTarget(false)}
                    className="rounded-xl border border-white/10 px-5 py-2 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Target</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Customer</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Mode</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Schedule</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Findings</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Last Scan</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Next Scan</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 animate-pulse rounded bg-white/[0.06]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : targets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-white/30">
                        No targets yet. Add your first CASM target above.
                      </td>
                    </tr>
                  ) : (
                    targets.map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-mono text-cyan-400">{t.target}</td>
                        <td className="px-4 py-3 text-white/60">{t.customer_name ?? "—"}</td>
                        <td className="px-4 py-3 text-white/60 capitalize">{t.scan_mode}</td>
                        <td className="px-4 py-3 text-white/60 capitalize">{t.schedule}</td>
                        <td className="px-4 py-3">
                          <span className="text-white/80">{t.findings_count}</span>
                          {t.critical_count > 0 && (
                            <span className="ml-2 text-xs text-red-400">{t.critical_count} crit</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/40 text-xs">{fmt(t.last_scan_at)}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">{fmt(t.next_scan_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteTarget(t.id)}
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Findings Tab */}
        {activeTab === "findings" && (
          <div className="space-y-4">
            <p className="text-sm text-white/40">{findings.length} recent findings</p>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Severity</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Title</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Target</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">CVE</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Tool</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Status</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40">Found</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 animate-pulse rounded bg-white/[0.06]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : findings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                        No findings yet. Run a CASM scan to populate this table.
                      </td>
                    </tr>
                  ) : (
                    findings.map(f => (
                      <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3"><SevBadge sev={f.severity} /></td>
                        <td className="px-4 py-3 text-white/80 max-w-xs truncate" title={f.title}>{f.title}</td>
                        <td className="px-4 py-3 font-mono text-xs text-cyan-400/80">{f.target}</td>
                        <td className="px-4 py-3 text-xs text-orange-400">{f.cve ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-white/40">{f.tool ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${f.status === "new" ? "text-yellow-400" : "text-green-400"}`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/30">{fmt(f.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
