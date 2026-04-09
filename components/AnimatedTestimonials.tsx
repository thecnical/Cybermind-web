"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Surface } from "@/components/DesignPrimitives";

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export default function AnimatedTestimonials({
  items,
}: {
  items: TestimonialItem[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[index];

  return (
    <Surface variant="glass" elevation="high" className="rounded-[30px] p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="cm-label">Operator stories</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Teams using CyberMind CLI in production
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => setIndex((value) => (value - 1 + items.length) % items.length)}
            className="cm-button-secondary h-10 w-10 rounded-xl p-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % items.length)}
            className="cm-button-secondary h-10 w-10 rounded-xl p-0"
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-7 min-h-[auto] sm:min-h-[190px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active.name}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
          >
            <Image
              src={active.avatar}
              alt={active.name}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-2xl border border-white/12 object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-lg leading-8 text-white">{`"${active.quote}"`}</p>
              <p className="mt-4 text-sm font-semibold text-white">{active.name}</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">{active.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {items.map((item, dotIndex) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-label={`Go to testimonial ${dotIndex + 1}`}
            className={`h-2 rounded-full transition-all ${
              dotIndex === index
                ? "w-10 bg-[var(--accent-cyan)]"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </Surface>
  );
}
