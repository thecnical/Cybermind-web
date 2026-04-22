import { createClient } from "@supabase/supabase-js";

// SECURITY: All credentials MUST come from environment variables.
// Never hardcode keys here. Set them in .env.local (dev) or Vercel dashboard (prod).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
// FIX: no hardcoded fallback URL — fail loudly if env var is missing
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const HAS_SUPABASE_ENV = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (typeof window !== "undefined") {
  if (!HAS_SUPABASE_ENV) {
    console.error("[CyberMind] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables.");
  }
  if (!BACKEND_URL) {
    console.error("[CyberMind] NEXT_PUBLIC_BACKEND_URL must be set in environment variables.");
  }
}

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    }),
    signOut: async () => ({ error: null }),
  },
};

export const supabase = HAS_SUPABASE_ENV
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // FIX: after consuming auth token from URL hash, replace URL immediately
        // prevents access_token appearing in browser history and Referer headers
      },
    })
  : (mockSupabase as unknown as ReturnType<typeof createClient>);

// FIX: strip auth tokens from URL after Supabase OAuth/magic-link callback
// Prevents token leakage via browser history and Referer header
if (typeof window !== "undefined" && HAS_SUPABASE_ENV) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
}

export type UserPlan = "free" | "starter" | "pro" | "elite";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan: UserPlan;
  requests_today: number;
  requests_month: number;
  recon_targets_used: number;  // for starter plan: 5/month limit
  created_at: string;
  avatar?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  /** Full key — ONLY present immediately after creation. Never stored persistently. */
  key?: string;
  /** Safe display prefix (e.g. "cp_live_xxxx") — always available */
  key_prefix?: string;
  /** Timestamp of creation — used to enforce 48hr copy window */
  created_at: string;
  plan: UserPlan;
  is_active: boolean;
  requests_today: number;
  requests_month: number;
  last_used: string | null;
}

export const PLAN_LIMITS: Record<UserPlan, number> = {
  free:    20,
  starter: 50,
  pro:     200,
  elite:   Infinity,
};

// Recon/Hunt/Abhimanyu target limits per month (starter only)
export const PLAN_TARGET_LIMITS: Record<UserPlan, number> = {
  free:    0,
  starter: 5,
  pro:     Infinity,
  elite:   Infinity,
};

export const PLAN_PRICES: Record<UserPlan, { monthly: number; annual: number; monthlyINR: number; annualINR: number }> = {
  free:    { monthly: 0,  annual: 0,   monthlyINR: 0,    annualINR: 0 },
  starter: { monthly: 4,  annual: 3,   monthlyINR: 85,   annualINR: 850 },
  pro:     { monthly: 14, annual: 11,  monthlyINR: 1149, annualINR: 9990 },
  elite:   { monthly: 29, annual: 24,  monthlyINR: 2399, annualINR: 23990 },
};

// Get auth token from current session
async function getToken(): Promise<string | null> {
  if (!HAS_SUPABASE_ENV) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Wake the Render backend silently.
 * Call this when the dashboard loads so the server is warm by the time
 * the user clicks "Generate key".
 * Returns true if backend responded, false if still sleeping.
 */
export async function wakeBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/wake`, {
      signal: AbortSignal.timeout(10000),
      // no-cors not needed — /wake returns JSON and CORS is open
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Wait for backend to become available — polls /wake every 3s for up to maxMs.
 * Shows progress via onProgress callback (0–100).
 */
export async function waitForBackend(
  maxMs = 60000,
  onProgress?: (pct: number) => void
): Promise<boolean> {
  const start = Date.now();
  const interval = 3000;

  while (Date.now() - start < maxMs) {
    const elapsed = Date.now() - start;
    onProgress?.(Math.min(95, Math.round((elapsed / maxMs) * 100)));

    try {
      const res = await fetch(`${BACKEND_URL}/wake`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        onProgress?.(100);
        return true;
      }
    } catch { /* keep polling */ }

    await new Promise(r => setTimeout(r, interval));
  }
  return false;
}

// Fetch user profile from backend
export async function fetchProfile(): Promise<UserProfile | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.profile : null;
  } catch {
    return null;
  }
}

// Fetch user's API keys
export async function fetchApiKeys(): Promise<ApiKey[]> {
  const token = await getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/auth/keys`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.keys : [];
  } catch (err: unknown) {
    if (err instanceof Error && (
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("Load failed") ||
      err.name === "TimeoutError"
    )) {
      throw new Error("Cannot reach the server. Check your internet connection and try again.");
    }
    return [];
  }
}

// Create a new API key — with automatic backend wake-up on cold start
export async function createApiKey(
  name: string,
  deviceType?: string,
  onWakeProgress?: (pct: number) => void
): Promise<ApiKey | null> {
  const token = await getToken();
  if (!token) throw new Error("Not logged in. Please refresh and try again.");

  // Step 1: wake the backend
  onWakeProgress?.(2);
  const isAwake = await wakeBackend();

  if (!isAwake) {
    onWakeProgress?.(5);
    const woke = await waitForBackend(90000, onWakeProgress);
    if (!woke) {
      throw new Error(
        "Server is taking too long to start. Please wait 30 seconds and click Try again."
      );
    }
  }

  // Step 2: small buffer after wake — server needs ~1s to finish initializing
  onWakeProgress?.(98);
  await new Promise(r => setTimeout(r, 1500));
  onWakeProgress?.(100);

  // Step 3: create the key — retry up to 3 times on network/timeout errors
  let lastErr: Error = new Error("Failed to create key.");
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/create-key`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.slice(0, 64),
          device_type: deviceType || detectDeviceType(),
        }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Don't retry on auth/plan errors — they won't change
        throw new Error(data.error || `Server error (${res.status}). Please try again.`);
      }
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        const isRetryable =
          err.name === "AbortError" ||
          err.name === "TimeoutError" ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("Load failed");

        if (isRetryable && attempt < 3) {
          // Wait 3s between retries
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        if (err.name === "AbortError" || err.name === "TimeoutError") {
          lastErr = new Error("Request timed out. Please try again.");
        } else if (isRetryable) {
          lastErr = new Error("Cannot reach the server. Check your internet connection and try again.");
        } else {
          lastErr = err;
        }
      }
      break;
    }
  }
  throw lastErr;
}

// Detect device type from user agent
function detectDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("linux")) return "linux";
  if (ua.includes("windows")) return "windows";
  if (ua.includes("mac")) return "mac";
  return "unknown";
}

// Revoke an API key
export async function revokeApiKey(keyId: string): Promise<boolean> {
  const token = await getToken();
  if (!token) throw new Error("Not logged in.");
  try {
    const res = await fetch(`${BACKEND_URL}/auth/revoke-key`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key_id: keyId }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Server error (${res.status})`);
    }
    return true;
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to revoke key.");
  }
}

// Check if a key is within the 48-hour copy window
export function isKeyWithin48Hours(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const hours48 = 48 * 60 * 60 * 1000;
  return now - created < hours48;
}

// Get remaining copy window time as human-readable string
export function getKeyCopyTimeLeft(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const hours48 = 48 * 60 * 60 * 1000;
  const remaining = hours48 - (now - created);
  if (remaining <= 0) return "expired";
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

// Send teammate invite
export async function sendInvite(email: string): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("Not logged in.");
  const res = await fetch(`${BACKEND_URL}/auth/invite`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Invite failed.");
  }
}

// Fetch live usage stats (for real-time dashboard)
export async function fetchLiveUsage(): Promise<{
  requests_today: number;
  requests_month: number;
  recon_targets_used: number;
  osint_targets_used: number;
  reveng_targets_used: number;
} | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return {
      requests_today: data.profile.requests_today ?? 0,
      requests_month: data.profile.requests_month ?? 0,
      recon_targets_used: data.profile.recon_targets_used ?? 0,
      osint_targets_used: data.profile.osint_targets_used ?? 0,
      reveng_targets_used: data.profile.reveng_targets_used ?? 0,
    };
  } catch {
    return null;
  }
}
