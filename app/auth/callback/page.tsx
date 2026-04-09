"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

// This page handles Supabase auth redirects:
// - Email verification
// - Password reset
// - Magic link login
// Supabase redirects to /auth/callback with tokens in URL hash
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically handles the hash tokens
    // Just wait for session to be established then redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
      } else if (event === "PASSWORD_RECOVERY") {
        router.replace("/auth/reset-password");
      } else if (event === "USER_UPDATED") {
        router.replace("/dashboard");
      }
    });

    // Also check immediately in case session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06070B]">
      <div className="text-center">
        <div className="inline-flex justify-center mb-6">
          <CyberMindLogo size={48} />
        </div>
        <div className="flex items-center gap-3 text-[var(--text-soft)]">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--accent-cyan)] border-t-transparent animate-spin" />
          <span className="font-mono text-sm">Verifying your account...</span>
        </div>
      </div>
    </div>
  );
}
