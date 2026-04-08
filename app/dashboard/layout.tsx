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
  X,
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06070B]">
        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const limit = PLAN_LIMITS[profile.plan] ?? PLAN_LIMITS.free;
  const usage = limit === Number.POSITIVE_INFINITY ? 0 : Math.min(100, (profile.requests_today / limit) * 100);

  return (
    <div className="min-h-screen bg-[#06070B] md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(10,12,18,0.9)] px-3 py-2 text-sm text-white backdrop-blur md:hidden"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        Menu
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/8 bg-[#08090E] p-5 transition-transform duration-300 md:static md:w-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/" className="mb-7 flex items-center gap-3">
          <CyberMindLogo size={34} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind CLI</p>
            <p className="text-xs font-semibold text-white">Dashboard</p>
          </div>
        </Link>

        <nav className="grid gap-1">
          {navItems.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                  active ? "bg-white/10 text-white" : "text-[var(--text-soft)] hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--accent-strong)]/20 bg-[rgba(138,43,226,0.2)] text-sm font-semibold text-white">
              {profile.avatar || profile.full_name[0]}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{profile.full_name}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-cyan)]">{profile.plan}</p>
            </div>
          </div>

          {limit !== Number.POSITIVE_INFINITY ? (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Daily usage</span>
                <span>{profile.requests_today}/{limit}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--accent-cyan)]" style={{ width: `${usage}%` }} />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[var(--text-main)] transition-colors hover:bg-white/[0.08]"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 px-4 pb-12 pt-20 md:px-8 md:pt-8">{children}</main>
    </div>
  );
}

