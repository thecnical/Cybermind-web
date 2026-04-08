"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Surface } from "@/components/DesignPrimitives";
import { cn } from "@/lib/utils";

const rows = [
  ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Bksp"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
];

export default function KeyboardPlayground() {
  const [lastKey, setLastKey] = useState<string>("Space");

  return (
    <Surface
      variant="glass"
      tone="accent"
      elevation="high"
      className="rounded-[28px] p-5 md:p-6"
    >
      <p className="cm-label">Interactive keyboard</p>
      <p className="mt-2 text-sm text-[var(--text-soft)]">
        Tap keys to simulate command macros.
      </p>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-[var(--accent-cyan)]">
        Last input: {lastKey}
      </div>

      <div className="mt-4 grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-2">
            {row.map((key, keyIndex) => (
              <motion.button
                key={`${rowIndex}-${keyIndex}-${key}`}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setLastKey(key)}
                className={cn(
                  "rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 font-mono text-xs text-white transition-colors hover:border-[var(--accent-cyan)]/45 hover:bg-[rgba(0,255,255,0.08)]",
                  key === "Space" ? "min-w-28 flex-1" : "",
                )}
              >
                {key}
              </motion.button>
            ))}
          </div>
        ))}
      </div>
    </Surface>
  );
}
