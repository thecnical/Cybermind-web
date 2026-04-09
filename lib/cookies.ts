/**
 * Cookie consent management — full stack implementation.
 *
 * Stores preferences in localStorage under "cybermind_cookie_prefs".
 * Controls:
 *   - necessary: always true (session, auth)
 *   - functional: UI preferences, theme, language
 *   - analytics: Google Analytics / GTM
 *
 * Usage:
 *   import { getCookiePrefs, setCookiePrefs, hasConsented } from "@/lib/cookies";
 */

export type CookieCategory = "necessary" | "functional" | "analytics";

export interface CookiePrefs {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  consentedAt: string | null; // ISO timestamp of when user made a choice
  version: number;            // bump when categories change to re-prompt
}

const STORAGE_KEY    = "cybermind_cookie_prefs";
const CURRENT_VERSION = 1;

const DEFAULTS: CookiePrefs = {
  necessary:   true,
  functional:  false,
  analytics:   false,
  consentedAt: null,
  version:     CURRENT_VERSION,
};

/** Read preferences from localStorage. Returns null if not yet set. */
export function getCookiePrefs(): CookiePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    // Re-prompt if version changed
    if ((parsed.version ?? 0) < CURRENT_VERSION) return null;
    return {
      necessary:   true,
      functional:  Boolean(parsed.functional),
      analytics:   Boolean(parsed.analytics),
      consentedAt: parsed.consentedAt ?? null,
      version:     CURRENT_VERSION,
    };
  } catch {
    return null;
  }
}

/** Save preferences and apply them immediately. */
export function setCookiePrefs(prefs: Omit<CookiePrefs, "necessary" | "consentedAt" | "version">): CookiePrefs {
  const full: CookiePrefs = {
    necessary:   true,
    functional:  prefs.functional,
    analytics:   prefs.analytics,
    consentedAt: new Date().toISOString(),
    version:     CURRENT_VERSION,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    applyPrefs(full);
  }
  return full;
}

/** Returns true if user has made any consent choice (accept or reject). */
export function hasConsented(): boolean {
  return getCookiePrefs() !== null;
}

/**
 * Apply preferences — enable/disable analytics scripts.
 * Called on page load and whenever preferences change.
 */
export function applyPrefs(prefs: CookiePrefs): void {
  if (typeof window === "undefined") return;

  if (prefs.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

/** Enable Google Analytics by setting the consent flag. */
function enableAnalytics(): void {
  // Google Analytics consent mode v2
  if (typeof window !== "undefined") {
    // @ts-expect-error gtag may not be typed
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage:        "denied", // we never enable ads
    });
    // Also set dataLayer for GTM
    // @ts-expect-error dataLayer may not be typed
    window.dataLayer = window.dataLayer || [];
    // @ts-expect-error dataLayer push
    window.dataLayer.push({ event: "cookie_consent_analytics_granted" });
  }
}

/** Disable Google Analytics. */
function disableAnalytics(): void {
  if (typeof window !== "undefined") {
    // @ts-expect-error gtag may not be typed
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage:        "denied",
    });
    // @ts-expect-error dataLayer may not be typed
    window.dataLayer = window.dataLayer || [];
    // @ts-expect-error dataLayer push
    window.dataLayer.push({ event: "cookie_consent_analytics_denied" });
  }
}

/** Initialize consent on page load — call once in layout. */
export function initCookieConsent(): void {
  if (typeof window === "undefined") return;
  const prefs = getCookiePrefs();
  if (prefs) {
    applyPrefs(prefs);
  } else {
    // Default deny until user consents
    disableAnalytics();
  }
}
