"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import PasswordField from "@/components/PasswordField";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(profile?.full_name ?? "Chandan Pandey");
  const [email] = useState(profile?.email ?? "chandan@cybermind.dev");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [notifyUsage, setNotifyUsage] = useState(true);
  const [notifyFeatures, setNotifyFeatures] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [theme, setTheme] = useState("dark");

  function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  async function handleDelete() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Settings</h1>
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <form className="mt-4 grid gap-4" onSubmit={handleProfileSave}>
          <label className="grid gap-2">
            <span className="cm-label">Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="cm-input" />
          </label>
          <label className="grid gap-2">
            <span className="cm-label">Email</span>
            <input value={email} disabled className="cm-input opacity-70" />
          </label>
          <label className="grid gap-2">
            <span className="cm-label">Avatar upload</span>
            <input type="file" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="cm-input" />
            {avatar ? <span className="text-xs text-[var(--text-soft)]">Selected: {avatar.name}</span> : null}
          </label>
          <button type="submit" className="cm-button-primary w-fit">{saved ? "Saved" : "Save profile"}</button>
        </form>
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Change password</h2>
        <form className="mt-4 grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <PasswordField
            id="current-password"
            name="currentPassword"
            label="Current password"
            value={oldPassword}
            onChange={setOldPassword}
            placeholder="Current password"
          />
          <PasswordField
            id="new-password"
            name="newPassword"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="New password"
          />
          <button type="submit" className="cm-button-secondary w-fit">Update password</button>
        </form>
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Notification preferences</h2>
        <div className="mt-4 grid gap-3 text-sm text-[var(--text-soft)]">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notifyUsage} onChange={(e) => setNotifyUsage(e.target.checked)} /> Usage limit alerts</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notifyFeatures} onChange={(e) => setNotifyFeatures(e.target.checked)} /> New feature updates</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notifySecurity} onChange={(e) => setNotifySecurity(e.target.checked)} /> Security alerts</label>
        </div>
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Theme preference</h2>
        <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button type="button" onClick={() => setTheme("dark")} className={`rounded-lg px-4 py-2 text-sm ${theme === "dark" ? "bg-white/10 text-white" : "text-[var(--text-soft)]"}`}>Dark</button>
          <button type="button" onClick={() => setTheme("light")} className={`rounded-lg px-4 py-2 text-sm ${theme === "light" ? "bg-white/10 text-white" : "text-[var(--text-soft)]"}`}>Light (coming soon)</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--error)]/25 bg-[rgba(255,68,68,0.06)] p-6">
        <h2 className="text-xl font-semibold text-white">Danger zone</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Delete your account and end access permanently.</p>
        <button type="button" onClick={() => setDeleteOpen(true)} className="cm-button-danger mt-4">Delete account</button>
      </section>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete account">
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--text-soft)]">This action removes your mock session and signs you out immediately.</p>
          <button type="button" onClick={handleDelete} className="cm-button-danger w-full">Confirm delete</button>
        </div>
      </Modal>
    </div>
  );
}

