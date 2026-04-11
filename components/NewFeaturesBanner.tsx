"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

// Banner shows from LAUNCH_DATE for SHOW_DAYS days
const LAUNCH_DATE = new Date("2026-04-11T00:00:00Z");
const SHOW_DAYS   = 6;
const HIDE_KEY    = "cybermind_new_banner_v252_hidden";

export default function NewFeaturesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if within 6-day window
    const now      = Date.now();
    const expiry   = LAUNCH_DATE.getTime() + SHOW_DAYS * 24 * 60 * 60 * 1000;
    const inWindow = now >= LAUNCH_DATE.getTime() && now < expiry;

    if (!inWindow) return;

    // Check if user dismissed it
    const hidden = localStorage.getItem(HIDE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(HIDE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:bottom-4 md:left-auto md:right-4 md:w-[420px]">
      <div className="relative overflow-hidden rounded-2xl border border-[#00FFFF]/30 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl shadow-[#00FFFF]/10">
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.8),transparent)]" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
              <Zap size={16} className="text-[#00FFFF]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00FFFF] bg-[#00FFFF]/10 px-2 py-0.5 rounded-full">
                  New in v2.5.2
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                OMEGA Planning Mode is live
              </p>
              <p className="mt-1 text-xs text-[var(--text-soft)] leading-relaxed">
                AI builds your full 9-phase attack plan before running a single tool.
                Plus 2 new free AI providers and cold start fix.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/what-is-new"
                  onClick={dismiss}
                  className="text-xs font-semibold text-[#00FFFF] hover:underline">
                  See what&apos;s new →
                </Link>
                <span className="text-[var(--text-muted)] text-xs">·</span>
                <Link
                  href="/docs/modes/planning"
                  onClick={dismiss}
                  className="text-xs text-[var(--text-soft)] hover:text-white">
                  Planning mode docs
                </Link>
              </div>
            </div>
            <button
              onClick={dismiss}
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-white transition-colors p-1"
              aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
