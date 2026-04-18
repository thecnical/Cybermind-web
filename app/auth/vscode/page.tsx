"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

type Step = "loading" | "login" | "authorizing" | "success" | "error";

function VscodeAuthInner() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state") ?? "";

  const [step, setStep] = useState<Step>("loading");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [plan, setPlan] = useState("free");
  const [userEmail, setUserEmail] = useState("");
  // Store the full vscode:// URI so the button can open it
  const vscodeUriRef = useRef("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        handleAuthorize(session.access_token, session.user?.email ?? "");
      } else {
        setStep("login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAuthorize(token: string, emailAddr: string) {
    setStep("authorizing");
    try {
      let userPlan = "free";
      try {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile?.plan) userPlan = data.profile.plan;
        }
      } catch { /* use free */ }

      const params = new URLSearchParams({ token, plan: userPlan, email: emailAddr, state });
      vscodeUriRef.current = `vscode://cybermind/auth?${params.toString()}`;

      setPlan(userPlan);
      setUserEmail(emailAddr);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authorization failed");
      setStep("error");
    }
  }

  function handleOpenVSCode() {
    if (vscodeUriRef.current) {
      window.location.href = vscodeUriRef.current;
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !data.session) {
        setError(authError?.message ?? "Invalid email or password.");
        setSubmitting(false);
        return;
      }
      await handleAuthorize(data.session.access_token, data.user?.email ?? email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : "https://cybermindcli1.vercel.app"}/auth/vscode-callback?state=${state}`,
      },
    });
    if (authError) {
      setError(authError.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06070B] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <CyberMindLogo size={48} />
          <h1 className="mt-4 text-xl font-semibold text-white">CyberMind for VSCode</h1>
          <p className="mt-1 text-sm text-[#666]">Sign in to connect your account</p>
        </div>

        {/* Loading */}
        {step === "loading" && (
          <div className="flex items-center justify-center gap-3 text-[#666]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
            <span className="text-sm">Checking session...</span>
          </div>
        )}

        {/* Login form */}
        {step === "login" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08] disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0b10] px-3 text-xs text-[#555]">or email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#00ffff]/50"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#00ffff]/50"
              />
              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full rounded-xl bg-[#00ffff] py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cccc] disabled:opacity-50"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-[#555]">
              No account?{" "}
              <Link href="/auth/register" className="text-[#00ffff] hover:underline">Sign up free</Link>
            </p>
          </div>
        )}

        {/* Authorizing */}
        {step === "authorizing" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
            <p className="text-sm text-[#888]">Authorizing...</p>
          </div>
        )}

        {/* Success — user must click to open VSCode */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Check mark */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div>
              <p className="text-lg font-semibold text-white">Signed in successfully!</p>
              <p className="mt-1 text-sm text-[#888]">{userEmail}</p>
              <span className="mt-2 inline-block rounded-full border border-[#00ffff]/30 bg-[#00ffff]/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#00ffff]">
                {plan}
              </span>
            </div>

            {/* THE MAIN BUTTON — user must click this */}
            <button
              onClick={handleOpenVSCode}
              className="w-full rounded-xl bg-[#00ffff] py-4 text-base font-bold text-black transition-all hover:bg-[#00cccc] active:scale-95"
            >
              ⚡ Open VSCode
            </button>

            <p className="text-xs text-[#555] leading-5">
              Click the button above to return to VSCode.<br />
              If a browser dialog appears, click <strong className="text-white">Open</strong>.
            </p>

            <p className="text-xs text-[#444]">
              VSCode not installed?{" "}
              <a href="https://code.visualstudio.com" target="_blank" rel="noreferrer" className="text-[#00ffff] hover:underline">
                Download it here
              </a>
            </p>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setStep("login")} className="text-sm text-[#00ffff] hover:underline">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VscodeAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
      </div>
    }>
      <VscodeAuthInner />
    </Suspense>
  );
}
