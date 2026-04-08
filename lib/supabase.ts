import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xaxbbonibqoxcxtqkhth.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheGJib25pYnFveGN4dHFraHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjI5MDIsImV4cCI6MjA5MTIzODkwMn0.DnXolvQdN7qw5CMQIVqnFBoCppLoVtYtqpw6Fypg1Mk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type UserPlan = "free" | "pro" | "elite";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan: UserPlan;
  requests_today: number;
  requests_month: number;
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string; // only returned on creation
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

// Get auth token from current session
async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Fetch user profile from backend
export async function fetchProfile(): Promise<UserProfile | null> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${BACKEND_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.profile : null;
}

// Fetch user's API keys
export async function fetchApiKeys(): Promise<ApiKey[]> {
  const token = await getToken();
  if (!token) return [];
  const res = await fetch(`${BACKEND_URL}/auth/keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.success ? data.keys : [];
}

// Create a new API key
export async function createApiKey(name: string): Promise<ApiKey | null> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${BACKEND_URL}/auth/create-key`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data : null;
}

// Revoke an API key
export async function revokeApiKey(keyId: string): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;
  const res = await fetch(`${BACKEND_URL}/auth/revoke-key`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key_id: keyId }),
  });
  const data = await res.json();
  return data.success === true;
}
