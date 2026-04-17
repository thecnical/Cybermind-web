"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Admin emails — only these can access admin panel ─────────────────────────
const ADMIN_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
]);

// ── Funny rejection messages ──────────────────────────────────────────────────
const FUNNY_MESSAGES = [
  "🚫 Mat ker lala... ye tera kaam nahi hai 😂",
  "🤡 Bhai, admin nahi hai tu. Ghar ja.",
  "💀 Teri aukat nahi hai yahan aane ki, bhai.",
  "🛑 Aye haramkhor! Yahan kya kar raha hai?",
  "😂 Haha nice try. Ab bhag yahan se.",
  "🔒 Access denied. Aur ek baar try kiya toh IP ban ho jayega.",
  "👀 Bhai, galat jagah aa gaya. Seedha jaa.",
  "🤦 Seriously? Admin panel? Tu? LOL.",
  "🚨 ALERT: Unauthorized clown detected. Removing...",
  "💩 Nahi milega access. Jaa bhai, jaa.",
];

function getRandomFunnyMessage() {
  return FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [funnyMsg, setFunnyMsg] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [glitch, setGlitch]     = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", session.user.id).single();
      if (profile?.role === "admin") {
        router.replace("/admin");
      }
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFunnyMsg("");

    // Client-side email check — show funny message immediately
    const cleanEmail = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.has(cleanEmail)) {
      setAttempts(a => a + 1);
      setFunnyMsg(getRandomFunnyMessage());
      setGlitch(true);
      setTimeout(() => setGlitch(false), 600);
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authErr) {
        setError("Wrong password. Try again.");
        setAttempts(a => a + 1);
        setLoading(false);
        return;
      }

      // Verify admin role in DB
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", data.user.id).single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setFunnyMsg(getRandomFunnyMessage());
        setAttempts(a => a + 1);
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020d1a]">
      {/* Animated grid background */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className={`relative w-full max-w-md px-4 transition-all ${glitch ? "animate-pulse" : ""}`}>
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold text-white">CyberMind Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Restricted access — authorized personnel only</p>
        </div>

        {/* Funny rejection message */}
        {funnyMsg && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
            <p className="text-sm font-semibold text-red-400">{funnyMsg}</p>
            {attempts >= 3 && (
              <p className="mt-1 text-xs text-red-500/70">
                {attempts} failed attempts. Keep trying and get IP banned 🙂
              </p>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-center">
            <p className="text-sm text-orange-400">{error}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin}
          className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@cybermind.dev"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                "Login as Admin →"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            🔒 All access attempts are logged and monitored
          </p>
        </form>

        {/* Terminal-style footer */}
        <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3 font-mono text-xs text-gray-600">
          <span className="text-green-500">$</span> cybermind admin --verify-identity<br />
          <span className="text-gray-500">Checking credentials... {attempts > 0 ? `[${attempts} failed attempts]` : "[ready]"}</span>
        </div>
      </div>
    </div>
  );
}
