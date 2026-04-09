import { createClient } from "@supabase/supabase-js";

// SECURITY: All credentials MUST come from environment variables.
// Never hardcode keys here. Set them in .env.local (dev) or Vercel dashboard (prod).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

if (typeof window !== "undefined" && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.error("[CyberMind] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // FIX: after consuming auth token from URL hash, replace URL immediately
    // prevents access_token appearing in browser history and Referer headers
  },
});

// FIX: strip auth tokens from URL after Supabase OAuth/magic-link callback
// Prevents token leakage via browser history and Referer header
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
}

export type UserPlan = "free" | "pro" | "elite";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan: UserPlan;
  requests_today: number;
  requests_month: number;
  created_at: string;
  avatar?: string; // optional initials or avatar URL
}

export interface ApiKey {
  id: string;
  name: string;
  /** Full key — ONLY present immediately after creation. Never stored persistently. */
  key?: string;
  /** Safe display prefix (e.g. "cp_live_xxxx") — always available */
  key_prefix?: string;
  plan: UserPlan;
  is_active: boolean;
  requests_today: number;
  requests_month: number;
  last_used: string | null;
  created_at: string;
}

export const PLAN_LIMITS: Record<UserPlan, number> = {
  free: 20,
  pro: 200,
  elite: Infinity,
};

export const PLAN_PRICES: Record<UserPlan, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  pro: { monthly: 9, annual: 7 },
  elite: { monthly: 29, annual: 24 },
};

// Get auth token from current session
async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
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
  } catch {
    return [];
  }
}

// Create a new API key with device info
export async function createApiKey(name: string, deviceType?: string): Promise<ApiKey | null> {
  const token = await getToken();
  if (!token) throw new Error("Not logged in. Please refresh and try again.");

  try {
    const controller = new AbortController();
    // 30 second timeout — Render cold start can take up to 30s
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${BACKEND_URL}/auth/create-key`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.slice(0, 64),
        device_type: deviceType || detectDeviceType(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Server error (${res.status}). Please try again.`);
    }
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out. The server may be starting up — please wait 30 seconds and try again.");
      }
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("fetch")) {
        throw new Error("Cannot reach the server. Check your internet connection or wait a moment and try again.");
      }
      throw err;
    }
    throw new Error("Failed to create key. Please try again.");
  }
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
  if (!token) return false;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/revoke-key`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key_id: keyId }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
