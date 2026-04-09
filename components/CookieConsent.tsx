"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCookiePrefs, setCookiePrefs, initCookieConsent, type CookiePrefs } from "@/lib/cookies";

export default function CookieConsent() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Omit<CookiePrefs, "necessary" | "consentedAt" | "version">>({
    functional: false,
    analytics:  false,
  });

  useEffect(() => {
    // Initialize consent on mount (applies saved prefs or defaults to deny)
    initCookieConsent();

    const saved = getCookiePrefs();
    if (saved) {
      // User already chose — don't show banner
      setPrefs({ functional: saved.functional, analytics: saved.analytics });
      return;
    }

    // Show banner after short delay so it doesn't flash on first paint
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  function save(next: Omit<CookiePrefs, "necessary" | "consentedAt" | "version">) {
    setCookiePrefs(next);
    setPrefs(next);
    setVisible(false);
    setExpanded(false);
  }

  const acceptAll    = () => save({ functional: true,  analytics: true  });
  const rejectAll    = () => save({ functional: false, analytics: false });
  const saveCustom   = () => save(prefs);

  const summaryText = prefs.analytics
    ? "Analytics enabled."
    : prefs.functional
    ? "Functional only. Analytics off."
    : "Essential cookies only.";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto w-full max-w-lg sm:inset-x-4 sm:bottom-4"
          role="dialog"
          aria-label="Cookie preferences"
          aria-modal="false"
        >
          <div className="linear-shell rounded-[28px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]">
                <Cookie size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent-cyan)]">Cookie preferences</p>
                    <h2 className="mt-1 text-base font-semibold text-white">We use cookies</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpanded(v => !v)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-1.5 text-xs text-[var(--text-soft)] transition-colors hover:text-white"
                    >
                      <Settings2 size={12} />
                      {expanded ? "Less" : "Manage"}
                    </button>
                    <button
                      type="button"
                      onClick={rejectAll}
                      className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] transition-colors hover:text-white"
                      aria-label="Reject all and close"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  Essential cookies keep your session working. Optional cookies improve your experience.{" "}
                  <span className="text-[var(--text-muted)]">{summaryText}</span>
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  <Link href="/cookies" className="underline underline-offset-2 hover:text-white">Cookie policy</Link>
                  {" · "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-white">Privacy policy</Link>
                </p>
              </div>
            </div>

            {/* Expandable preferences */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid gap-2">
                    {[
                      {
                        key:      "necessary" as const,
                        label:    "Essential",
                        detail:   "Session state, authentication, security. Always active.",
                        locked:   true,
                        checked:  true,
                      },
                      {
                        key:      "functional" as const,
                        label:    "Functional",
                        detail:   "Remembers your UI preferences and consent choices.",
                        locked:   false,
                        checked:  prefs.functional,
                      },
                      {
                        key:      "analytics" as const,
                        label:    "Analytics",
                        detail:   "Aggregate traffic data to improve the product. No personal profiling.",
                        locked:   false,
                        checked:  prefs.analytics,
                      },
                    ].map(item => (
                      <label
                        key={item.key}
                        className={cn(
                          "flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3",
                          item.locked ? "opacity-70" : "cursor-pointer hover:bg-white/[0.05]",
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{item.label}</p>
                          <p className="mt-0.5 text-xs text-[var(--text-soft)]">{item.detail}</p>
                        </div>
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            disabled={item.locked}
                            onChange={e => {
                              if (item.locked) return;
                              setPrefs(p => ({ ...p, [item.key]: e.target.checked }));
                            }}
                            className="sr-only"
                          />
                          {/* Custom toggle */}
                          <div className={cn(
                            "h-5 w-9 rounded-full border transition-colors",
                            item.checked
                              ? "border-[var(--accent-cyan)]/50 bg-[rgba(0,255,255,0.2)]"
                              : "border-white/20 bg-white/[0.06]",
                          )}>
                            <div className={cn(
                              "mt-0.5 h-4 w-4 rounded-full transition-all",
                              item.checked
                                ? "ml-4 bg-[var(--accent-cyan)]"
                                : "ml-0.5 bg-white/40",
                            )} />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="cm-button-primary flex-1 justify-center text-sm"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="cm-button-secondary flex-1 justify-center text-sm"
              >
                Essential only
              </button>
              {expanded && (
                <button
                  type="button"
                  onClick={saveCustom}
                  className="cm-button-secondary w-full justify-center text-sm"
                >
                  Save my choices
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
