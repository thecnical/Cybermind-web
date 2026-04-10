"use client";

import { useState } from "react";
import { Check, Copy, Mail, UserPlus, Users } from "lucide-react";
import { sendInvite } from "@/lib/supabase";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentList, setSentList] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/auth/register`
    : "https://cybermindcli1.vercel.app/auth/register";

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    setError("");
    setSending(true);
    try {
      await sendInvite(email);
      setSentList(prev => [email, ...prev]);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invite failed. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Invite a teammate</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Send a signup invite to your team. They&apos;ll get a magic link to create their account and access the dashboard.
        </p>
      </section>

      {/* Email invite */}
      <section className="cm-card-soft p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-[var(--accent-cyan)]" />
          <p className="text-sm font-semibold text-white">Send email invite</p>
        </div>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="teammate@company.com"
              className="cm-input flex-1"
              disabled={sending}
            />
            <button type="submit" disabled={sending || !email}
              className="cm-button-primary gap-2 text-sm disabled:opacity-50 flex-shrink-0">
              <UserPlus size={14} />
              {sending ? "Sending..." : "Invite"}
            </button>
          </div>
          {error && (
            <p className="text-sm text-[#FF4444] bg-[#FF4444]/10 rounded-xl px-4 py-3">{error}</p>
          )}
          <p className="text-xs text-[var(--text-muted)]">
            They&apos;ll receive a Supabase magic link to create their free account.
          </p>
        </form>
      </section>

      {/* Share link */}
      <section className="cm-card-soft p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[var(--accent-cyan)]" />
          <p className="text-sm font-semibold text-white">Share signup link</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <code className="flex-1 font-mono text-xs text-[var(--text-soft)] truncate">{inviteLink}</code>
          <button onClick={handleCopyLink}
            className="flex-shrink-0 text-[var(--text-muted)] hover:text-white transition-colors">
            {copied ? <Check size={15} className="text-[#00FF88]" /> : <Copy size={15} />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Anyone with this link can create a free account.
        </p>
      </section>

      {/* Sent list */}
      {sentList.length > 0 && (
        <section className="cm-card-soft p-5">
          <p className="cm-label mb-3">Sent invites ({sentList.length})</p>
          <div className="grid gap-2">
            {sentList.map((e) => (
              <div key={e} className="flex items-center gap-3 rounded-xl border border-white/8 px-4 py-2.5">
                <Check size={14} className="text-[#00FF88] flex-shrink-0" />
                <p className="text-sm text-white">{e}</p>
                <span className="ml-auto text-xs text-[var(--text-muted)]">Invite sent</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
