"use client";

import { motion } from "framer-motion";

export default function HeroWordmark() {
  return (
    <div className="relative inline-block">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,18,0.9),rgba(12,16,24,0.82))] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
      >
        <div className="cm-wordmark-shimmer absolute inset-0 opacity-80" />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.36em] text-[var(--accent-cyan)]">
            CyberMind CLI
          </p>
          <h2 className="mt-3 font-mono text-[clamp(2.2rem,8vw,6rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-transparent [text-shadow:3px_3px_0_rgba(138,43,226,0.35),7px_7px_0_rgba(0,0,0,0.25)] [background:linear-gradient(180deg,#6cf6ff_0%,#33c3ff_34%,#8b77ff_64%,#ff64d6_100%)] [background-clip:text] [-webkit-background-clip:text]">
            CYBERMIND
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.32em] text-[var(--text-soft)]">
            Offensive security command surface
          </p>
        </div>
      </motion.div>
    </div>
  );
}
