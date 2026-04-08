"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type TooltipPerson = {
  name: string;
  role: string;
  avatar: string;
};

export default function AnimatedTooltip({
  people,
}: {
  people: TooltipPerson[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {people.map((person, index) => (
        <div
          key={person.name}
          className="relative"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex(index)}
          onBlur={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="group relative h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] p-0.5 transition-all hover:border-[var(--accent-cyan)]/45"
            aria-label={`${person.name} - ${person.role}`}
          >
            <Image
              src={person.avatar}
              alt={person.name}
              width={44}
              height={44}
              unoptimized
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          </button>

          <AnimatePresence>
            {activeIndex === index ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="pointer-events-none absolute left-1/2 top-0 z-20 w-max -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-[rgba(10,12,18,0.94)] px-3 py-2 text-left shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
              >
                <p className="text-xs font-semibold text-white">{person.name}</p>
                <p className="mt-0.5 text-[11px] text-[var(--text-soft)]">{person.role}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
