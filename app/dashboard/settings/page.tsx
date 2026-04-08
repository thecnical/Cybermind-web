"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user!.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    await signOut();
    router.push("/");
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white mb-8">Settings</h1>

      {/* Profile */}
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)] mb-4">Profile</p>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-2">Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-2">Email</label>
            <input value={user?.email || ""} disabled
              className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[var(--text-muted)] cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving} className="rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.18)] px-5 py-2.5 text-sm text-white hover:bg-[rgba(141,117,255,0.28)] disabled:opacity-50">
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save changes"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-[28px] border border-[#FF4444]/20 bg-[#FF4444]/5 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#FF4444] mb-4">Danger Zone</p>
        <p className="text-sm text-[var(--text-soft)] mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <div className="space-y-3">
          <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder='Type "DELETE" to confirm'
            className="w-full rounded-2xl border border-[#FF4444]/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:border-[#FF4444]/50 focus:outline-none" />
          <button onClick={handleDeleteAccount} disabled={deleteConfirm !== "DELETE" || deleting}
            className="rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/10 px-5 py-2.5 text-sm text-[#FF4444] hover:bg-[#FF4444]/20 disabled:opacity-30 disabled:cursor-not-allowed">
            {deleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}
