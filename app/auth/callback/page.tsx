"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

// Handles Supabase auth redirects:
// - Email verification → /dashboard
// - Password reset → /auth/reset-password  ← MUST go here, not dashboard
// - Magic link login → /dashboard
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // ONLY listen to auth state changes — do NOT call getSession() here
    // getSession() would redirect to /dashboard before PASSWORD_RECOVERY fires
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Password reset link clicked — go to reset page
        router.replace("/auth/reset-password");
      } else if (event === "SIGNED_IN" && session) {
        // Email verification or magic link — go to dashboard
        router.replace("/dashboard");
      } else if (event === "USER_UPDATED") {
        router.replace("/dashboard");
      }
    });

    // Fallback: if no event fires in 3s, check session and redirect
    const fallback = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
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
