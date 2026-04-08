"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Surface } from "@/components/DesignPrimitives";
import { getSidebarGroups } from "@/lib/siteContent";
import { cn } from "@/lib/utils";

export default function DocsSidebar() {
  const pathname = usePathname();
  const groups = getSidebarGroups();

  return (
    <Surface variant="glass" elevation="high" motion="medium" className="cm-noise-overlay rounded-[28px] p-4">
      <Surface variant="skeuo" tone="cyan" elevation="low" motion="fast" className="rounded-2xl px-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">Docs guide</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
          Follow the shortest path for your current task: setup, workflows, commands, or recovery.
        </p>
      </Surface>

      <div className="mt-5 grid gap-5">
        {groups.map((group, groupIndex) => (
          <Surface
            key={group.group}
            variant={groupIndex % 2 === 0 ? "glass" : "clay"}
            tone={groupIndex % 2 === 0 ? "default" : "accent"}
            elevation="low"
            motion="fast"
            className="rounded-[22px] p-3"
          >
            <p className="px-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">{group.group}</p>
            <p className="px-2 pt-2 text-sm leading-6 text-[var(--text-soft)]">{group.description}</p>
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
                        ? "surface-brutal text-white"
                        : "text-[var(--text-soft)] hover:bg-white/[0.05] hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </Surface>
        ))}
      </div>
    </Surface>
  );
}
