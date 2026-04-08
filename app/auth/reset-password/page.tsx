"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Supabase handles the token from URL hash automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is in password recovery mode — form is ready
      }
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/auth/login?reset=success");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#06070B]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><CyberMindLogo size={40} /></Link>
          <h1 className="text-2xl font-semibold text-white mt-4">Set new password</h1>
        </div>
        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">New Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 focus:outline-none" />
            </div>
            {error && <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-4 py-3 text-sm font-medium text-white hover:bg-[rgba(141,117,255,0.28)] disabled:opacity-50">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
