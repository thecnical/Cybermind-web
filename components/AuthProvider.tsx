"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { supabase, UserProfile, fetchProfile } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;        // true while Supabase session is being checked
  profileLoading: boolean; // true while backend profile is being fetched
  emailVerified: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  profileLoading: false,
  emailVerified: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

const VERIFIED_REQUIRED_PATHS = ["/dashboard"];
const PUBLIC_PATHS = ["/auth/", "/", "/plans", "/privacy", "/terms", "/aup", "/contact", "/docs", "/about", "/features"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                   = useState<User | null>(null);
  const [session, setSession]             = useState<Session | null>(null);
  const [profile, setProfile]             = useState<UserProfile | null>(null);
  const [loading, setLoading]             = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  // Prevent duplicate profile fetches
  const profileFetchRef = useRef(false);

  async function loadProfile() {
    if (profileFetchRef.current) return;
    profileFetchRef.current = true;
    setProfileLoading(true);
    try {
      const p = await fetchProfile();
      setProfile(p);
    } finally {
      setProfileLoading(false);
      profileFetchRef.current = false;
    }
  }

  useEffect(() => {
    // 1. Check existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setEmailVerified(!!session?.user?.email_confirmed_at);
      if (session?.user) {
        loadProfile();
      }
      // Mark auth loading done — profile may still be loading
      setLoading(false);
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setEmailVerified(!!session?.user?.email_confirmed_at);

        if (session?.user) {
          // Don't block — load profile in background
          loadProfile();
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setUser(null);
    setSession(null);
    setProfile(null);
    setEmailVerified(false);
    setProfileLoading(false);
    profileFetchRef.current = false;
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-")) localStorage.removeItem(k);
      });
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith("sb-")) sessionStorage.removeItem(k);
      });
    }
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading, profileLoading, emailVerified,
      signOut, refreshProfile: loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
