"use client";

import { useState } from "react";
import { Mail, RefreshCw, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

/**
 * Shows a persistent banner when the user's email is not verified.
 * Includes a resend button that calls Supabase directly.
 * Rendered inside dashboard layout for logged-in unverified users.
 */
export default function EmailVerificationBanner() {
  const { user, emailVerified } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (emailVerified || dismissed || !user) return null;

  async function handleResend() {
    if (!user?.email) return;
    setResending(true);
    try {
      await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/dashboard`,
        },
      });
      setResent(true);
    } catch { /* ignore */ }
    setResending(false);
  }

  return (
    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/5 px-5 py-4">
      <div className="flex items-start gap-3">
        <Mail size={18} className="mt-0.5 flex-shrink-0 text-[#FFD700]" />
        <div>
          <p className="text-sm font-semibold text-white">Verify your email to unlock all features</p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">
            A verification link was sent to <span className="text-white">{user.email}</span>.
            You cannot create API keys or use the CLI until your email is verified.
          </p>
          {resent ? (
            <p className="mt-2 text-xs text-[#00FF88]">✓ Verification email resent. Check your inbox.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#FFD700] hover:underline disabled:opacity-60"
            >
              <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-[var(--text-muted)] hover:text-white"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
