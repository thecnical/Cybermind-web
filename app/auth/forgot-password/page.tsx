"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#06070B]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <CyberMindLogo size={40} />
          </Link>
          <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
          <p className="text-sm text-[var(--text-soft)] mt-2">Enter your email and we&apos;ll send a reset link</p>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8">
          {sent ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 mb-4">
                <Mail size={24} className="text-[var(--accent-cyan)]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Check your inbox</h2>
              <p className="text-sm text-[var(--text-soft)] mb-6">We sent a reset link to <strong className="text-white">{email}</strong></p>
              <Link href="/auth/login" className="text-sm text-[var(--accent-cyan)] hover:underline">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none transition-colors" />
              </div>
              {error && <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-3 text-sm font-medium text-white hover:bg-[rgba(141,117,255,0.28)] transition-colors disabled:opacity-50">
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <p className="text-center text-sm text-[var(--text-soft)]">
                <Link href="/auth/login" className="text-[var(--accent-cyan)] hover:underline">Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
