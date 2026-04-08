"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, Settings, LayoutGrid, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CyberMindLogo from "@/components/CyberMindLogo";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/install", label: "Install" },
  { href: "/plans", label: "Plans" },
  { href: "/docs", label: "Docs" },
  { href: "/resources", label: "Resources" },
  { href: "/changelog", label: "Changelog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { user, profile, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const showAuthMenu = !!user;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function onScroll() {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 12);

      if (open) {
        setHidden(false);
      } else if (currentScrollY < 24) {
        setHidden(false);
      } else {
        setHidden(currentScrollY > lastScrollY);
      }

      lastScrollY = currentScrollY;
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  async function handleLogout() {
    await signOut();
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
  }

  const avatarInitials = (profile?.full_name || user?.email || "U")[0].toUpperCase();
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const displayPlan = profile?.plan || "free";

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      animate={{ y: hidden ? -112 : 0, opacity: hidden ? 0.92 : 1, scale: scrolled ? 0.985 : 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between rounded-[22px] border px-4 py-3 transition-all duration-300",
          scrolled
            ? "border-white/10 bg-[rgba(6,7,11,0.92)] shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl"
            : "border-white/8 bg-[rgba(8,10,15,0.72)] backdrop-blur-lg",
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <CyberMindLogo size={34} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
              CyberMind CLI
            </p>
            <p className="text-sm font-semibold text-white">
              AI Offensive Security CLI
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/8 text-white"
                    : "text-[var(--text-soft)] hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {showAuthMenu ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--accent-strong)]/20 bg-[rgba(141,117,255,0.16)] font-semibold">
                  {avatarInitials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium leading-none">{displayName}</span>
                  <span className="mt-1 block text-xs text-[var(--text-soft)]">{displayPlan.toUpperCase()}</span>
                </span>
                <ChevronDown size={16} className={menuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-56 rounded-[24px] border border-white/10 bg-[rgba(10,12,18,0.96)] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.44)] backdrop-blur-xl"
                  >
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/[0.06]">
                      <LayoutGrid size={16} />
                      Dashboard
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/[0.06]">
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/[0.06]">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="font-mono text-sm text-[var(--text-soft)] transition-colors hover:text-white">
                Login
              </Link>
              <Link href="/auth/register" className="rounded-xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-2 font-mono text-sm text-white transition-all hover:border-[var(--accent-strong)]/50 hover:bg-[rgba(141,117,255,0.25)]">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/8 bg-white/5 p-2 text-[var(--text-main)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-3 max-w-6xl rounded-[24px] border border-white/10 bg-[rgba(10,12,18,0.94)] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/6"
                >
                  {link.label}
                </Link>
              ))}

              {showAuthMenu ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/6">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/6">
                    Settings
                  </Link>
                  <button type="button" onClick={handleLogout} className="rounded-2xl px-4 py-3 text-left text-sm text-[var(--text-main)] transition-colors hover:bg-white/6">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/6">
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)} className="mt-2 rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-3 text-center font-mono text-sm text-white">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
