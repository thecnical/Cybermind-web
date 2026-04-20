"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserPlus,
  X,
  Crosshair,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import CyberMindLogo from "@/components/CyberMindLogo";
import { cn } from "@/lib/utils";

const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 200,
  elite: Number.POSITIVE_INFINITY,
};

const navItems = [
  { href: "/dashboard",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/attacks",  label: "Attack Targets", icon: Crosshair },
  { href: "/dashboard/api-keys", label: "API Keys",  icon: KeyRound },
  { href: "/dashboard/billing",  label: "Billing",   icon: CreditCard },
  { href: "/dashboard/invite",   label: "Invite",    icon: UserPlus },
  { href: "/dashboard/settings", label: "Settings",  icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, profileLoading, loading, signOut } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect to login if not authenticated (only after auth check completes)
  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Preserve the current path so we can redirect back after login
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      router.replace(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    // Only redirect unverified users if email_confirmed_at is explicitly false
    // (not null/undefined — some providers don't set this field)
    if (user.email_confirmed_at === null && user.app_metadata?.provider === "email") {
      router.replace("/auth/verify-email");
    }
  }, [loading, user, router]);

  // Show full-screen spinner ONLY while Supabase auth is being checked
  // (typically < 300ms — just the initial session check)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06070B]">
        <div className="flex flex-col items-center gap-4">
          <CyberMindLogo size={40} />
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent-cyan)] border-t-transparent" />
            <span className="font-mono text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in — don't render anything (redirect is in progress)
  if (!user) return null;

  // Profile data — use skeleton values while loading from backend
  // This prevents the blank screen — dashboard renders immediately with placeholders
  const displayName  = profile?.full_name || user.email?.split("@")[0] || "User";
  const displayPlan  = profile?.plan || "free";
  const avatarLetter = displayName[0]?.toUpperCase() || "U";
  const requestsToday = profile?.requests_today ?? 0;
  const limit = PLAN_LIMITS[displayPlan] ?? PLAN_LIMITS.free;
  const usage = limit === Number.POSITIVE_INFINITY ? 0 : Math.min(100, (requestsToday / limit) * 100);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try { await signOut(); } catch { /* ignore */ }
    setTimeout(() => { window.location.href = "/"; }, 100);
  }

  return (
    <div className="min-h-screen bg-[#06070B] md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(v => !v)}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(10,12,18,0.9)] px-3 py-2 text-sm text-white backdrop-blur md:hidden"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        Menu
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-white/8 bg-[#08090E] p-5 transition-transform duration-300 md:static md:w-auto md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <Link href="/" className="mb-7 flex items-center gap-3">
          <CyberMindLogo size={34} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind CLI</p>
            <p className="text-xs font-semibold text-white">Dashboard</p>
          </div>
        </Link>

        <nav className="grid gap-1">
          {navItems.map(item => {
            const active = item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                  active ? "bg-white/10 text-white" : "text-[var(--text-soft)] hover:bg-white/5 hover:text-white",
                )}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent-strong)]/20 bg-[rgba(138,43,226,0.2)] text-sm font-semibold text-white">
              {avatarLetter}
            </span>
            <div className="min-w-0">
              {/* Show skeleton while profile loads */}
              {profileLoading && !profile ? (
                <>
                  <div className="h-3.5 w-24 animate-pulse rounded bg-white/10" />
                  <div className="mt-1.5 h-2.5 w-12 animate-pulse rounded bg-white/10" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-white">{displayName}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-cyan)]">{displayPlan}</p>
                </>
              )}
            </div>
          </div>

          {limit !== Number.POSITIVE_INFINITY && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Daily usage</span>
                <span>{requestsToday}/{limit}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--accent-cyan)] transition-all" style={{ width: `${usage}%` }} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[var(--text-main)] transition-colors hover:bg-white/[0.08] disabled:opacity-60"
          >
            <LogOut size={15} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content — renders immediately, no waiting for profile */}
      <main className="min-w-0 px-4 pb-12 pt-20 md:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
