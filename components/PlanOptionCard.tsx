"use client";

import { Check } from "lucide-react";
import type { PlanTier } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function PlanOptionCard({
  tier,
  title,
  price,
  description,
  bullets,
  selected,
  onSelect,
}: {
  tier: PlanTier;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  selected: boolean;
  onSelect: (tier: PlanTier) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tier)}
      className={cn(
        "text-left rounded-[24px] border p-4 transition-all duration-200",
        selected
          ? "border-[var(--accent-cyan)]/40 bg-[rgba(0,255,255,0.07)] shadow-[0_0_0_1px_rgba(0,255,255,0.08)]"
          : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">{price}</p>
        </div>
        <div
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full border",
            selected
              ? "border-[var(--accent-cyan)]/45 bg-[rgba(0,255,255,0.12)] text-[var(--accent-cyan)]"
              : "border-white/12 text-transparent",
          )}
        >
          <Check size={14} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {bullets.map((bullet) => (
          <span key={bullet} className="cm-pill">
            {bullet}
          </span>
        ))}
      </div>
    </button>
  );
}
