"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Key, CreditCard, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import CyberMindLogo from "@/components/CyberMindLogo";
import { cn } from "@/lib/utils";
import { PLAN_LIMITS } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const PLAN_COLORS = { free: "#777777", pro: "#00FFFF", elite: "#8A2BE2" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06070B]">
        <div className="text-[var(--text-muted)] font-mono text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const plan = profile?.plan || "free";
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const limit = PLAN_LIMITS[plan];
  const used = profile?.requests_today || 0;
  const usagePct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);

  return (
    <div className="min-h-screen flex bg-[#06070B]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/8 bg-[#08090E] flex flex-col">
        <div className="p-6 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3">
            <CyberMindLogo size={32} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind</p>
              <p className="text-xs font-semibold text-white">Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                active ? "bg-white/8 text-white" : "text-[var(--text-soft)] hover:text-white hover:bg-white/4"
              )}>
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/8">
          {/* Usage bar */}
          {limit !== Infinity && (
            <div className="mb-4 px-1">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>Today</span>
                <span>{used}/{limit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, backgroundColor: usagePct > 80 ? "#FF4444" : "#00FFFF" }} />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(141,117,255,0.2)] flex items-center justify-center text-xs font-semibold text-white">
              {(profile?.full_name || user.email || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || "User"}</p>
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: planColor }}>{plan}</p>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-[var(--text-soft)] hover:text-white hover:bg-white/4 transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
