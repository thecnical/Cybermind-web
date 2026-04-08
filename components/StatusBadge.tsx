"use client";

import { cn } from "@/lib/utils";

export default function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "error" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tone === "neutral" &&
          "border-white/10 bg-white/[0.04] text-[var(--text-main)]",
        tone === "accent" &&
          "border-[var(--accent-cyan)]/25 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]",
        tone === "success" &&
          "border-[var(--success)]/25 bg-[rgba(0,255,136,0.08)] text-[var(--success)]",
        tone === "warning" &&
          "border-[var(--warning)]/25 bg-[rgba(255,215,0,0.08)] text-[var(--warning)]",
        tone === "error" &&
          "border-[var(--error)]/25 bg-[rgba(255,68,68,0.08)] text-[var(--error)]",
      )}
    >
      {label}
    </span>
  );
}
