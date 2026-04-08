"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";
import PasswordStrength from "@/components/PasswordStrength";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => {
      router.push("/auth/login?reset=success");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [done, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  }

  return (
    <AuthShell
      title="Set a new password"
      description="Create a strong password and confirm it to finish account recovery."
      footer={
        <p>
          Want to sign in instead?{" "}
          <Link href="/auth/login" className="text-white underline decoration-white/20 underline-offset-4">
            Go to login
          </Link>
        </p>
      }
    >
      {done ? (
        <div className="rounded-[28px] border border-[var(--success)]/25 bg-[rgba(0,255,136,0.08)] p-6 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--success)]/30 bg-[rgba(0,255,136,0.08)] text-[var(--success)]">
            <CheckCircle2 size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">Password updated</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">Redirecting to login...</p>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-2xl border border-[var(--error)]/30 bg-[rgba(255,68,68,0.08)] px-4 py-3 text-sm text-white">
              {error}
            </div>
          ) : null}

          <div className="grid gap-2">
            <PasswordField
              id="reset-password"
              name="password"
              label="New password"
              value={password}
              onChange={setPassword}
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={error && password.length < 8 ? "Password must be at least 8 characters." : undefined}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordField
            id="reset-confirm-password"
            name="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            error={error && password !== confirmPassword ? "Passwords must match." : undefined}
          />

          <button type="submit" className="cm-button-primary w-full gap-2" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

