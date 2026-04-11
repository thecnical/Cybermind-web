"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  Calendar,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareMore,
  MoonStar,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  Shield,
  Sparkles,
  SunMedium,
  Table,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import CyberMindLogo from "@/components/CyberMindLogo";
import {
  adminPageMeta,
  commandPaletteEntries,
  getNavForRole,
  notifications,
  type AdminRole,
  type AdminSection,
  type IconName,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  AdminButton,
  AdminInput,
  LivePill,
  Panel,
  Pill,
} from "@/components/admin/admin-primitives";
import {
  getDefaultSectionForRole,
  useAdminDemo,
} from "@/components/admin/admin-context";

const iconMap: Record<IconName, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  "line-chart": LineChart,
  "credit-card": CreditCard,
  bot: Bot,
  shield: Shield,
  settings: Settings,
  calendar: Calendar,
  "user-round": UserRound,
  "list-todo": FileText,
  forms: FileText,
  table: Table,
  files: FileText,
  "messages-square": MessageSquareMore,
  inbox: Inbox,
  "receipt-text": CreditCard,
  "bar-chart-3": LineChart,
  sparkles: Sparkles,
  "lock-keyhole": LockKeyhole,
  "layers-3": Users,
  bell: Bell,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { role, setRole, roleDescription, sidebarOpen, setSidebarOpen } = useAdminDemo();
  const [commandOpen, setCommandOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifyOpen, setNotifyOpen] = useState(false);

  const navItems = useMemo(() => getNavForRole(role), [role]);
  const currentSection = (pathname?.split("/").filter(Boolean)[1] as AdminSection | undefined) ?? getDefaultSectionForRole(role);
  const currentMeta = adminPageMeta[currentSection] ?? adminPageMeta.dashboard;

  useEffect(() => {
    const allowed = navItems.some((item) => item.key === currentSection);
    if (!allowed) {
      router.replace(`/admin/${getDefaultSectionForRole(role)}`);
    }
  }, [currentSection, navItems, role, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotifyOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const grouped = ["OPERATIONS", "MAIN MENU", "SUPPORT", "OTHERS"].map((group) => ({
    group,
    items: navItems.filter((item) => item.group === group),
  }));

  const paletteResults = commandPaletteEntries.filter((entry) => {
    const value = `${entry.title} ${entry.subtitle}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  const mobileNav = navItems.slice(0, 4);

  return (
    <div className={cn("admin-surface min-h-screen bg-[#0a0a0f] text-white", resolvedTheme === "light" && "admin-surface-light")}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_26%),linear-gradient(180deg,#0a0a0f_0%,#07070b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]" />
      </div>

      <div className="flex min-h-screen">
        <AnimatePresence>
          {(sidebarOpen || !pathname?.includes("/admin")) && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-white/10 bg-[rgba(10,10,16,0.92)] px-5 pb-6 pt-5 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="group flex items-center gap-3">
              <motion.div whileHover={{ rotate: [-2, 1, -1, 0] }} transition={{ duration: 0.4 }}>
                <CyberMindLogo size={34} />
              </motion.div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-300">
                  CyberMind
                </p>
                <p className="text-sm font-medium text-white">Admin Matrix</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl border border-white/10 p-2 text-slate-400 lg:hidden"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-6 rounded-[26px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(0,212,255,0.1),rgba(124,58,237,0.12))] p-4">
            <div className="flex items-center justify-between">
              <Pill tone="cyan">{role.toUpperCase()}</Pill>
              <LivePill label="ONLINE" />
            </div>
            <p className="mt-3 text-sm text-slate-200">{roleDescription}</p>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            {grouped.map((group) =>
              group.items.length ? (
                <div key={group.group} className="mb-6">
                  <p className="mb-3 pl-2 font-mono text-[11px] uppercase tracking-[0.34em] text-slate-500">
                    {group.group}
                  </p>
                  <LayoutGroup>
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const active = currentSection === item.key;
                        const Icon = iconMap[item.icon];
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "relative flex items-center justify-between overflow-hidden rounded-2xl px-3 py-3 text-sm transition-colors",
                              active ? "text-white" : "text-slate-400 hover:text-slate-200",
                            )}
                          >
                            {active ? (
                              <motion.span
                                layoutId="nav-active"
                                className="absolute inset-0 rounded-2xl border border-cyan-300/25 bg-cyan-300/10"
                                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                              />
                            ) : null}
                            <span className="relative z-10 flex items-center gap-3">
                              <Icon className="size-4" />
                              {item.label}
                            </span>
                            <span className="relative z-10 flex items-center gap-2">
                              {item.badge ? <Pill tone="purple">{item.badge}</Pill> : null}
                              {item.pro ? <Pill tone="orange">PRO</Pill> : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </LayoutGroup>
                </div>
              ) : null,
            )}
          </div>

          <Panel className="mt-3 p-4" glow="purple">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold">
                {role === "boss" ? "CP" : role === "admin" ? "AV" : "MF"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {role === "boss" ? "Chandan Pandey" : role === "admin" ? "Asha Verma" : "Mia Flores"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {role === "support" ? "support@cybermind.ai" : "ops@cybermind.ai"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <AdminButton variant="secondary" className="flex-1">
                <LogOut className="size-4" />
                Logout
              </AdminButton>
            </div>
          </Panel>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(10,10,15,0.78)] backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-200 lg:hidden"
              >
                <Menu className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-200 lg:inline-flex"
              >
                {sidebarOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
              </button>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-slate-500">
                  Admin / {currentMeta.eyebrow}
                </p>
                <h2 className="truncate text-lg font-semibold text-white">{currentMeta.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="group flex min-w-[220px] items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400 transition hover:border-cyan-300/20 hover:text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <Search className="size-4" />
                  Search users, tickets, sessions
                </span>
                <span className="rounded-lg border border-white/10 px-2 py-1 font-mono text-[11px] text-slate-500">
                  Cmd+K
                </span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifyOpen((open) => !open)}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-200"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 flex size-2.5 rounded-full bg-rose-400" />
                </button>
                <AnimatePresence>
                  {notifyOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-[calc(100%+12px)] w-[340px]"
                    >
                      <Panel className="space-y-3 p-4" glow="purple">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                          <Pill tone="red">{notifications.length}</Pill>
                        </div>
                        {notifications.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                            <p className="text-sm font-medium text-white">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-400">{item.body}</p>
                            <p className="mt-2 text-[11px] text-slate-500">{item.time}</p>
                          </div>
                        ))}
                      </Panel>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="min-w-[180px]">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as AdminRole)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                >
                  <option value="boss">Boss</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support Agent</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-200"
              >
                {resolvedTheme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[rgba(10,10,16,0.94)] px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {mobileNav.map((item) => {
            const Icon = iconMap[item.icon];
            const active = currentSection === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px]",
                  active ? "bg-cyan-300/12 text-cyan-200" : "text-slate-500",
                )}
              >
                <Icon className="size-4" />
                {item.shortLabel}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] text-slate-500"
          >
            <Menu className="size-4" />
            More
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {commandOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 px-4 py-10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Panel className="p-4" glow="cyan">
                <div className="mb-4 flex items-center gap-3">
                  <Search className="size-4 text-slate-500" />
                  <AdminInput
                    autoFocus
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search users, tickets, and agent sessions..."
                    className="border-none bg-transparent px-0 py-1 focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  {paletteResults.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setCommandOpen(false);
                        router.push(entry.href);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.05]"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{entry.title}</p>
                        <p className="text-xs text-slate-500">{entry.subtitle}</p>
                      </div>
                      <Pill tone="cyan">Open</Pill>
                    </button>
                  ))}
                </div>
              </Panel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
