"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";
import { avatarFromName, writeMockSession } from "@/lib/mockAuth";
import { cn } from "@/lib/utils";

export default function AuthLoginPageClient({
  resetSuccess = false,
}: {
  resetSuccess?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const success = resetSuccess
    ? "Password updated. Sign in with your new credentials."
    : null;

  function validate() {
    if (!email.includes("@")) {
      return "Enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!email.includes("cyber") && password !== "cybermind") {
      return "Invalid credentials. Use a project email or the demo password: cybermind.";
    }

    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validate();
    setError(nextError);

    if (nextError) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      writeMockSession({
        authenticated: true,
        name: "Chandan Pandey",
        email,
        avatar: avatarFromName("Chandan Pandey"),
        plan: "free",
      });
      if (!remember) {
        window.sessionStorage.setItem("cybermind_last_login", email);
      }
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <AuthShell
      title="Log in to CyberMind CLI"
      description="Access your install commands, API keys, usage, and billing controls from a single secure console."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-white underline decoration-white/20 underline-offset-4">
            Sign up
          </Link>
        </p>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        {success ? (
          <div className="rounded-2xl border border-[var(--success)]/25 bg-[rgba(0,255,136,0.08)] px-4 py-3 text-sm text-white">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-[var(--error)]/30 bg-[rgba(255,68,68,0.08)] px-4 py-3 text-sm text-white">
            {error}
          </div>
        ) : null}

        <label className="grid gap-2">
          <span className="cm-label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className={cn("cm-input", error && !email.includes("@") && "cm-input-error")}
            autoComplete="email"
          />
        </label>

        <PasswordField
          id="login-password"
          name="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={error && password.length < 6 ? "Password must be at least 6 characters." : undefined}
        />

        <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-soft)]">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-cyan)]"
            />
            Remember me
          </label>
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
