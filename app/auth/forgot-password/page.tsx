"use client";

import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your account email and we will send a reset link."
      footer={
        <p>
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-white underline decoration-white/20 underline-offset-4">
            Back to login
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-[28px] border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)] p-6 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]">
            <Mail size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">Check your email</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
            A reset link was sent to <span className="text-white">{email}</span>.
            Click it to set a new password.
          </p>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl border border-[var(--error)]/30 bg-[rgba(255,68,68,0.08)] px-4 py-3 text-sm text-white">
              {error}
            </div>
          )}
          <label className="grid gap-2">
            <span className="cm-label">Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="cm-input" placeholder="name@company.com" autoComplete="email" />
          </label>
          <button type="submit" className="cm-button-primary w-full gap-2" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
