"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ThreeDMarquee({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items];

  return (
    // FIX: removed [perspective:1100px] — causes black sections on mobile Safari
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.02)] px-3 py-4">
      <motion.div
        className="flex w-max gap-3"
        animate={reduced ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={reduced ? { duration: 0 } : { duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((item, index) => (
          <motion.div
            key={`${item}-${index}`}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] whitespace-nowrap"
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

