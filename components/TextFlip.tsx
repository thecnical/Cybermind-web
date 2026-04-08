"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TextFlipProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

export default function TextFlip({
  words,
  intervalMs = 2200,
  className,
}: TextFlipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % words.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [words, intervalMs]);

  const activeWord = words[index] ?? "";

  return (
    <span className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={activeWord}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {activeWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
