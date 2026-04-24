"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Zap, ArrowRight, Shield, Brain, Terminal } from "lucide-react";

// Banner shows from LAUNCH_DATE for SHOW_DAYS days
const LAUNCH_DATE = new Date("2026-04-24T00:00:00Z");
const SHOW_DAYS   = 14;
const HIDE_KEY    = "cybermind_new_banner_v440_hidden";

const highlights = [
  { icon: Shield,   color: "#00FFFF", text: "/devsec — Secret scanning, SAST, dep audit [Starter+]" },
  { icon: Zap,      color: "#8A2BE2", text: "/vibe-hack — Autonomous AI hacking with live SSE [Pro+]" },
  { icon: Brain,    color: "#00FF88", text: "/chain — Vuln chaining engine with PoC generation [Pro+]" },
  { icon: Terminal, color: "#FF4444", text: "/red-team — 7-day red team campaign [Elite]" },
];

export default function NewFeaturesBanner() {
  const [visible, setVisible]   = useState(false);
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    const now    = Date.now();
    const expiry = LAUNCH_DATE.getTime() + SHOW_DAYS * 24 * 60 * 60 * 1000;
    if (now < LAUNCH_DATE.getTime() || now >= expiry) return;
    if (!localStorage.getItem(HIDE_KEY)) setVisible(true);
  }, []);

  // Cycle through highlights every 2.5s
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % highlights.length), 2500);
    return () => clearInterval(id);
  }, [visible]);

  function dismiss() {
    localStorage.setItem(HIDE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  const h = highlights[current];
  const Icon = h.icon;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:bottom-5 md:left-5 md:right-auto md:w-[440px]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07080f]/98 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,255,0.08)]">

        {/* Animated top glow */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] transition-all duration-700"
          style={{ background: `linear-gradient(90deg,transparent,${h.color},transparent)` }}
        />

        {/* Version badge strip */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b border-white/5"
          style={{ background: `${h.color}08` }}
        >
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${h.color}20`, color: h.color }}
          >
            v4.4.0 — Just shipped
          </span>
          <span className="text-[10px] text-white/30 ml-auto">May 2026</span>
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-base font-bold text-white leading-tight">
                CyberMind v4.4.0 is live
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                4 new offensive modes — /devsec, /vibe-hack, /chain, /red-team
              </p>
            </div>
            <button
              onClick={dismiss}
              className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors p-1 -mt-0.5"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>

          {/* Animated highlight */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mb-3 transition-all duration-500"
            style={{ background: `${h.color}10`, border: `1px solid ${h.color}25` }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${h.color}20` }}
            >
              <Icon size={15} style={{ color: h.color }} />
            </div>
            <p className="text-sm font-medium text-white/90 leading-snug">{h.text}</p>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 mb-3">
            {highlights.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  background: i === current ? h.color : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          {/* What's new bullets */}
          <div className="space-y-1.5 mb-4">
            {[
              "/devsec [Starter+] — secrets, SAST, dep audit on any GitHub repo",
              "/vibe-hack [Pro+] — autonomous AI hacking with live SSE streaming",
              "/chain [Pro+] — vuln chaining engine: SSRF+IDOR → PII leak",
              "/red-team [Elite] — structured 7-day campaign with AI guidance",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#00FF88] text-xs mt-0.5 flex-shrink-0">✓</span>
                <span className="text-xs text-white/60 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/what-is-new"
              onClick={dismiss}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-black transition-all hover:opacity-90"
              style={{ background: h.color }}
            >
              See what&apos;s new
              <ArrowRight size={12} />
            </Link>
            <Link
              href="/install"
              onClick={dismiss}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              Update CLI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
