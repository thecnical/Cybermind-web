"use client";

import { useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    setResending(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setError("No email found. Please register again.");
      setResending(false);
      return;
    }
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setResending(false);
    if (resendError) { setError(resendError.message); return; }
    setResent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#06070B]">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex justify-center mb-8">
          <CyberMindLogo size={48} />
        </Link>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 mb-6">
          <Mail size={28} className="text-[var(--accent-cyan)]" />
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3">Verify your email</h1>
        <p className="text-[var(--text-soft)] text-sm mb-6">
          Your account needs email verification before you can access the dashboard.
          Check your inbox for the confirmation link.
        </p>

        {error && (
          <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3 mb-4">{error}</p>
        )}

        {resent ? (
          <p className="text-sm text-[#00FF88] bg-[#00FF88]/10 rounded-xl px-4 py-3 mb-4">
            ✓ Verification email resent. Check your inbox.
          </p>
        ) : (
          <button onClick={handleResend} disabled={resending}
            className="cm-button-secondary gap-2 text-sm mb-4">
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        )}

        <div className="flex justify-center gap-4 text-sm">
          <Link href="/auth/login" className="text-[var(--accent-cyan)] hover:underline">
            Back to login
          </Link>
          <span className="text-[var(--text-muted)]">·</span>
          <Link href="/contact" className="text-[var(--text-soft)] hover:text-white">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}
