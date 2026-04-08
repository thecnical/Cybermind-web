"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function GeminiBackground() {
  const reduced = useReducedMotion();

  const pulse = reduced
    ? { opacity: 0.55, scale: 1 }
    : { opacity: [0.35, 0.8, 0.35], scale: [0.95, 1.06, 0.95] };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.22),transparent_65%)] blur-xl"
        animate={pulse}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-6rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.25),transparent_70%)] blur-xl"
        animate={pulse}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,190,255,0.16),transparent_72%)] blur-xl"
        animate={pulse}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(0,255,255,0.07)_0%,transparent_36%,rgba(141,117,255,0.08)_68%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,11,0.14)_0%,rgba(6,7,11,0.76)_100%)]" />
    </div>
  );
}
