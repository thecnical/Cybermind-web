"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarGroups } from "@/lib/siteContent";
import { cn } from "@/lib/utils";

export default function DocsSidebar() {
  const pathname = usePathname();
  const groups = getSidebarGroups();

  return (
    <nav aria-label="Documentation navigation" className="surface-shell rounded-[28px] p-4">
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
          Docs guide
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
          Start with the path that matches what you need to do right now, not the whole route tree.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        {groups.map((group) => (
          <div key={group.group} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-3">
            <p className="px-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
              {group.group}
            </p>
            <p className="px-2 pt-2 text-sm leading-6 text-[var(--text-soft)]">
              {group.description}
            </p>
            <div className="mt-3 grid gap-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm transition-all duration-200",
                      active
                        ? "bg-[rgba(141,117,255,0.16)] text-white"
                        : "text-[var(--text-soft)] hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
