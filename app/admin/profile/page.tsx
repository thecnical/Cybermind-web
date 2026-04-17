"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, Save } from "lucide-react";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const TEAM: Record<string, { defaultName: string; role: string; emoji: string }> = {
  "chandanabhay4456@gmail.com": { defaultName: "Chandan Pandey", role: "Boss Admin",  emoji: "👑" },
  "chandanabhay458@gmail.com":  { defaultName: "Chandan",        role: "Boss Admin",  emoji: "👑" },
  "omkargavali2006@gmail.com":  { defaultName: "Omkar Gavali",   role: "Tech Team",   emoji: "🛠️" },
  "tadikondakhamshiq18.23@gmail.com": { defaultName: "Khamshiq", role: "Tech Team",   emoji: "⚡" },
  "d53973292@gmail.com":        { defaultName: "Dev",            role: "Tech Team",   emoji: "🔧" },
};

export default function AdminProfilePage() {
  const supabase = getSupabase();
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [theme, setTheme]     = useState("dark");
  const [notifs, setNotifs]   = useState(true);
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      setEmail(session.user.email || "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();
      setName(data?.full_name || TEAM[session.user.email || ""]?.defaultName || "");
    });
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("profiles")
        .update({ full_name: name, updated_at: new Date().toISOString() })
        .eq("id", session.user.id);
    }
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const member = TEAM[email];

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-10">
      <div>
        <h1 className="text-xl font-bold text-white">My Profile</h1>
        <p className="mt-0.5 text-xs text-gray-500">Manage your admin profile and preferences</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-3xl">
            {member?.emoji || "👤"}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{name || email.split("@")[0]}</p>
            <p className="text-sm text-gray-500">{email}</p>
            <span className="mt-1 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              {member?.role || "Admin"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Display Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Email (read-only)
            </label>
            <input
              value={email}
              disabled
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-40"
          >
            {saved ? <><Check size={14} className="text-green-400" /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Theme</p>
              <p className="text-xs text-gray-500">Admin panel appearance</p>
            </div>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="dark">Dark (default)</option>
              <option value="darker">Darker</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Team chat notifications</p>
              <p className="text-xs text-gray-500">Get notified of new messages</p>
            </div>
            <button
              onClick={() => setNotifs(n => !n)}
              className={`relative h-6 w-11 rounded-full transition-colors ${notifs ? "bg-cyan-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-bold text-white">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/admin", label: "Dashboard", emoji: "📊" },
            { href: "/admin/team-chat", label: "Team Chat", emoji: "💬" },
            { href: "/admin/ai-chat", label: "AI Chat", emoji: "⚡" },
            { href: "/admin/users", label: "Users", emoji: "👥" },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm text-gray-400 transition hover:border-cyan-500/20 hover:text-white"
            >
              <span>{item.emoji}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
