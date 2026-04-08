"use client";

import { useState } from "react";
import { Check, Mail, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    setError("");
    setSending(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { setError("Not logged in"); setSending(false); return; }

      const res = await fetch(`${BACKEND_URL}/auth/invite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setEmail("");
      } else {
        setError(data.error || "Invite failed");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setSending(false);
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Invite a teammate</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Send a Supabase-powered invite email. They&apos;ll get a signup link directly to the dashboard.
        </p>
      </section>

      <section className="cm-card-soft p-6">
        {sent ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 mb-4">
              <Check size={24} className="text-[#00FF88]" />
            </div>
            <p className="text-lg font-semibold text-white">Invite sent!</p>
            <p className="text-sm text-[var(--text-soft)] mt-2">They&apos;ll receive an email with a signup link.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-sm text-[var(--accent-cyan)] hover:underline">
              Invite another
            </button>
          </div>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="cm-label block mb-2">Email address</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="teammate@company.com"
                    className="cm-input pl-10"
                  />
                </div>
                <button type="submit" disabled={sending || !email}
                  className="cm-button-primary gap-2 text-sm disabled:opacity-50">
                  <UserPlus size={14} />
                  {sending ? "Sending..." : "Send invite"}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3">{error}</p>}
            <p className="text-xs text-[var(--text-muted)]">
              Invitee will receive a Supabase magic link to create their account and access the dashboard.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
