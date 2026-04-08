"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

function passwordStrength(p: string): { label: string; color: string; width: string } {
  if (p.length === 0) return { label: "", color: "", width: "0%" };
  if (p.length < 6) return { label: "Weak", color: "#FF4444", width: "25%" };
  if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Medium", color: "#FFD700", width: "60%" };
  return { label: "Strong", color: "#00FF88", width: "100%" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(password);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!agreed) { setError("Please accept the terms of service"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#06070B]">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 mb-6">
            <Check size={28} className="text-[#00FF88]" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Check your email</h1>
          <p className="text-[var(--text-soft)] mb-6">We sent a verification link to <strong className="text-white">{email}</strong>. Click it to activate your account.</p>
          <Link href="/auth/login" className="text-[var(--accent-cyan)] hover:underline text-sm">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#06070B]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <CyberMindLogo size={40} />
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind CLI</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="text-sm text-[var(--text-soft)] mt-2">Free forever. No credit card required.</p>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Chandan Pandey"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: strength.width, backgroundColor: strength.color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none transition-colors" />
            </div>

            {error && <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3">{error}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded" />
              <span className="text-sm text-[var(--text-soft)]">
                I agree to the{" "}
                <Link href="/terms" className="text-[var(--accent-cyan)] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[var(--accent-cyan)] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-3 text-sm font-medium text-white hover:bg-[rgba(141,117,255,0.28)] transition-colors disabled:opacity-50">
              {loading ? "Creating account..." : "Create free account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-soft)] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--accent-cyan)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
