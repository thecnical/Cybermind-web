"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, Surface } from "@/components/DesignPrimitives";
import type { TimelineItem } from "@/lib/projectData";

export default function AnimatedTimeline({
  items,
}: {
  items: TimelineItem[];
}) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[13px] top-2 hidden w-px bg-gradient-to-b from-[var(--accent-cyan)]/65 via-white/10 to-transparent md:block" />
      <div className="grid gap-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.04}>
            <div className="grid gap-3 md:grid-cols-[30px_minmax(0,1fr)] md:items-start">
              <div className="hidden pt-2 md:flex">
                <motion.span
                  className="h-3.5 w-3.5 rounded-full border border-white/15 bg-[var(--accent-cyan)]/80"
                  animate={{ boxShadow: ["0 0 0 rgba(0,255,255,0)", "0 0 16px rgba(0,255,255,0.55)", "0 0 0 rgba(0,255,255,0)"] }}
                  transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.2 }}
                />
              </div>
              <Surface variant="skeuo" elevation="medium" className="rounded-[22px] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-cyan)]">{item.date}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.description}</p>
                <Link
                  href={item.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm text-[var(--accent-cyan)] transition-colors hover:text-white"
                >
                  View commit
                </Link>
              </Surface>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

