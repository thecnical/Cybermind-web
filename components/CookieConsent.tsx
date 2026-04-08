"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type CookiePrefs = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
};

const storageKey = "cybermind_cookie_preferences";

function readPrefs(): CookiePrefs | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(
    () =>
      readPrefs() ?? {
        necessary: true,
        functional: true,
        analytics: false,
      },
  );

  useEffect(() => {
    const saved = readPrefs();
    if (saved) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const summary = useMemo(() => {
    return prefs.analytics
      ? "Functional and analytics cookies enabled."
      : prefs.functional
        ? "Functional cookies enabled. Analytics disabled."
        : "Only essential cookies enabled.";
  }, [prefs]);

  function save(next: CookiePrefs) {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setPrefs(next);
    setVisible(false);
    setExpanded(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-[80] mx-auto w-full max-w-xl"
        >
          <div className="linear-shell rounded-[30px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.46)]">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]">
                <Cookie size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="cm-label">Cookie preferences</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Control how this site remembers you</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="cm-button-secondary gap-2 px-4 py-2 text-xs"
                  >
                    <Settings2 size={14} />
                    {expanded ? "Hide options" : "Manage"}
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                  CyberMind CLI uses essential cookies for session state and optional cookies for interface preferences. {summary}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Read the <Link href="/cookies" className="text-white underline decoration-white/20 underline-offset-4">cookie policy</Link> and <Link href="/privacy" className="text-white underline decoration-white/20 underline-offset-4">privacy policy</Link>.
                </p>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="grid gap-3">
                        {[
                          {
                            key: "necessary",
                            label: "Essential cookies",
                            detail: "Required for session continuity and security state.",
                            disabled: true,
                          },
                          {
                            key: "functional",
                            label: "Functional cookies",
                            detail: "Stores interface choices like consent state and UI preferences.",
                            disabled: false,
                          },
                          {
                            key: "analytics",
                            label: "Analytics cookies",
                            detail: "Reserved for future traffic measurement and product insights.",
                            disabled: false,
                          },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-white">{item.label}</p>
                              <p className="mt-1 text-sm text-[var(--text-soft)]">{item.detail}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={prefs[item.key as keyof CookiePrefs]}
                              disabled={item.disabled}
                              onChange={(event) =>
                                setPrefs((current) => ({
                                  ...current,
                                  [item.key]: event.target.checked,
                                }))
                              }
                              className={cn(
                                "h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-cyan)]",
                                item.disabled && "opacity-60",
                              )}
                            />
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => save({ necessary: true, functional: true, analytics: true })}
                    className="cm-button-primary"
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => save({ necessary: true, functional: false, analytics: false })}
                    className="cm-button-secondary"
                  >
                    Reject optional
                  </button>
                  {expanded ? (
                    <button type="button" onClick={() => save(prefs)} className="cm-button-secondary">
                      Save preferences
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
