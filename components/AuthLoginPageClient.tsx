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

    // Use replace so back button doesn't return to login
    router.replace("/dashboard");
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

        <div className="flex items-center justify-end text-sm">
          <Link href="/auth/forgot-password" className="text-[var(--text-soft)] transition-colors hover:text-[var(--accent-cyan)]">
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
