"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { supabase, UserProfile, fetchProfile } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  emailVerified: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  emailVerified: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Routes that require email verification
const VERIFIED_REQUIRED_PATHS = ["/dashboard"];
// Routes that are always accessible (even unverified)
const PUBLIC_PATHS = ["/auth/", "/", "/plans", "/privacy", "/terms", "/aup", "/contact", "/docs", "/about", "/features"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function loadProfile() {
    const p = await fetchProfile();
    setProfile(p);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // email_confirmed_at is set by Supabase when user verifies
      setEmailVerified(!!session?.user?.email_confirmed_at);
      if (session?.user) loadProfile();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setEmailVerified(!!session?.user?.email_confirmed_at);
        if (session?.user) {
          await loadProfile();
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect unverified users away from protected routes
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (emailVerified) return;

    const needsVerification = VERIFIED_REQUIRED_PATHS.some(p => pathname?.startsWith(p));
    const isPublic = PUBLIC_PATHS.some(p => pathname?.startsWith(p));

    if (needsVerification && !isPublic) {
      router.replace("/auth/verify-email");
    }
  }, [loading, user, emailVerified, pathname, router]);

  async function signOut() {
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch { /* ignore */ }
    // Clear state immediately — don't wait for onAuthStateChange
    setUser(null);
    setSession(null);
    setProfile(null);
    setEmailVerified(false);
    // Clear all Supabase localStorage tokens
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-")) localStorage.removeItem(k);
      });
      // Also clear sessionStorage
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith("sb-")) sessionStorage.removeItem(k);
      });
    }
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading, emailVerified,
      signOut, refreshProfile: loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
