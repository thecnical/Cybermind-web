"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function AuthLoginPageClient({
  resetSuccess = false,
}: {
  resetSuccess?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const success = resetSuccess ? "Password updated. Sign in with your new credentials." : null;

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.replace("/dashboard");
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      if (authError.message.includes("Email not confirmed")) {
        setError("Please verify your email first. Check your inbox for the confirmation link.");
      } else if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push("/dashboard");
  }

  async function handleGithub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  return (
    <AuthShell
      title="Log in to CyberMind CLI"
      description="Access your install commands, API keys, usage, and billing controls."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-white underline decoration-white/20 underline-offset-4">
            Sign up free
          </Link>
        </p>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        {success && (
          <div className="rounded-2xl border border-[var(--success)]/25 bg-[rgba(0,255,136,0.08)] px-4 py-3 text-sm text-white">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-[var(--error)]/30 bg-[rgba(255,68,68,0.08)] px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        {/* OAuth buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={handleGithub}
            className="cm-button-secondary gap-2 text-sm justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
          <button type="button" onClick={handleGoogle}
            className="cm-button-secondary gap-2 text-sm justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-[var(--text-muted)]">or email</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <label className="grid gap-2">
          <span className="cm-label">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            className={cn("cm-input", error && !email.includes("@") && "cm-input-error")}
            autoComplete="email" />
        </label>

        <PasswordField id="login-password" name="password" label="Password"
          value={password} onChange={setPassword}
          placeholder="Enter your password" autoComplete="current-password" />

        <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-soft)]">
          <span />
          <Link href="/auth/forgot-password" className="text-white transition-colors hover:text-[var(--accent-cyan)]">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="cm-button-primary w-full gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
