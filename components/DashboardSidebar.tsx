"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, KeyRound, CreditCard, Settings, LogOut, Menu, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import CyberMindLogo from "@/components/CyberMindLogo";
import {
  clearMockSession,
  defaultMockSession,
  MOCK_AUTH_EVENT,
  readMockSession,
} from "@/lib/mockAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(defaultMockSession);

  useEffect(() => {
    function syncSession() {
      setSession(readMockSession());
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener(MOCK_AUTH_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(MOCK_AUTH_EVENT, syncSession);
    };
  }, []);

  function handleLogout() {
    clearMockSession();
    router.push("/");
  }

  const shell = (
    <aside className="flex h-full flex-col rounded-[30px] border border-white/8 bg-[rgba(10,12,18,0.9)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <CyberMindLogo size={36} />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind CLI</p>
          <p className="text-sm font-semibold text-white">Control center</p>
        </div>
      </Link>

      <div className="mt-8 grid gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all",
                active
                  ? "border border-[var(--accent-cyan)]/25 bg-[rgba(0,255,255,0.1)] text-white"
                  : "border border-transparent text-[var(--text-soft)] hover:border-white/8 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--accent-strong)]/20 bg-[rgba(141,117,255,0.14)] font-semibold text-white">
            {session.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{session.name}</p>
            <p className="text-xs text-[var(--text-soft)]">{session.email}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <StatusBadge label={session.plan.toUpperCase()} tone="accent" />
          <button type="button" onClick={handleLogout} className="cm-button-secondary px-4 py-2 text-xs">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[rgba(8,10,15,0.92)] px-4 py-3 text-sm text-white shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        Menu
      </button>

      <div className="hidden lg:block lg:w-[290px] lg:flex-none">{shell}</div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/60 px-5 py-20 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-sm">{shell}</div>
        </div>
      ) : null}
    </>
  );
}
