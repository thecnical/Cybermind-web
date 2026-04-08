"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CyberMindLogo from "@/components/CyberMindLogo";
import { useAuth } from "@/components/AuthProvider";
import { Surface } from "@/components/DesignPrimitives";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/install", label: "Install" },
  { href: "/plans", label: "Plans" },
  { href: "/docs", label: "Docs" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/course", label: "Course" },
  { href: "/contact", label: "Contact" },
];

function isResourceRoute(pathname: string) {
  return (
    pathname.startsWith("/resources") ||
    pathname.startsWith("/get-tools") ||
    pathname.startsWith("/extensions")
  );
}

function isLinkActive(pathname: string, link: NavItem) {
  if (link.label === "Resources") {
    return isResourceRoute(pathname);
  }
  return link.href === "/"
    ? pathname === "/"
    : pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
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
      const current = window.scrollY;
      setScrolled(current > 12);

      if (open || current < 24) {
        setHidden(false);
      } else {
        setHidden(current > lastScrollY);
      }

      lastScrollY = current;
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) {
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
      animate={
        reduced
          ? { y: 0 }
          : {
              y: hidden ? -110 : 0,
              opacity: hidden ? 0.92 : 1,
              scale: scrolled ? 0.99 : 1,
            }
      }
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      <Surface
        variant="glass"
        tone={scrolled ? "cyan" : "default"}
        elevation={scrolled ? "high" : "medium"}
        motion="medium"
        className="mx-auto cm-noise-overlay flex w-full max-w-6xl items-center justify-between rounded-[24px] px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-3">
          <CyberMindLogo size={34} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
              CyberMind CLI
            </p>
            <p className="text-sm font-semibold text-white">Terminal-first security workflow</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isLinkActive(pathname, link);
            const linkClass = cn(
              "rounded-xl px-4 py-2 text-sm transition-all",
              active
                ? "surface-brutal text-white"
                : "text-[var(--text-soft)] hover:bg-white/10 hover:text-white",
            );

            return (
              <Link key={link.href} href={link.href} className={linkClass}>
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
                className="surface-skeuo inline-flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm text-white"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--accent-strong)]/20 bg-[rgba(141,117,255,0.16)] font-semibold">
                  {avatarInitials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium leading-none">{displayName}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                    {displayPlan}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={menuOpen ? "rotate-180 transition-transform" : "transition-transform"}
                />
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="surface-glass absolute right-0 mt-3 w-56 rounded-[22px] border border-white/10 p-2 shadow-[0_28px_90px_rgba(0,0,0,0.44)]"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/[0.08]"
                    >
                      <LayoutGrid size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/[0.08]"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/[0.08]"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-mono text-sm text-[var(--text-soft)] transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="cm-button-primary rounded-xl px-4 py-2 font-mono text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="surface-skeuo rounded-xl p-2 text-[var(--text-main)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Surface>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-6xl rounded-[24px] border border-white/10 bg-[rgba(10,12,18,0.94)] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}

              {showAuthMenu ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/10"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl px-4 py-3 text-left text-sm text-[var(--text-main)] transition-colors hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] transition-colors hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="cm-button-primary mt-2 justify-center rounded-2xl px-4 py-3 text-center font-mono text-sm"
                  >
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

