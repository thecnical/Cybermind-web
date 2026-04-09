"use client";

import { motion } from "framer-motion";
import { Surface } from "@/components/DesignPrimitives";

const hotspots = [
  { name: "India", x: 67, y: 47 },
  { name: "United States", x: 23, y: 38 },
  { name: "United Kingdom", x: 47, y: 31 },
  { name: "Singapore", x: 73, y: 56 },
  { name: "Germany", x: 50, y: 33 },
  { name: "Brazil", x: 34, y: 62 },
];

export default function WorldMapPulse() {
  return (
    <Surface variant="glass" tone="cyan" elevation="high" className="rounded-[30px] p-6 md:p-8">
      <p className="cm-label">Global reach</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        CyberMind CLI sessions across the world
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
        Researchers and security teams use CyberMind CLI in live workflows across multiple regions
        for recon, hunt, and AI-assisted triage.
      </p>

      <div className="relative mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#070b13_0%,#0b1220_100%)] p-4 md:p-6">
        <div className="overflow-hidden">
        <svg
          viewBox="0 0 1000 460"
          className="h-[240px] w-full md:h-[300px]"
          role="img"
          aria-label="World map showing CyberMind CLI activity"
        >
          <defs>
            <linearGradient id="mapStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(0,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(138,43,226,0.25)" />
            </linearGradient>
          </defs>
          <path
            d="M58 170L120 125l78 10 52 40 98-16 45 22 40-9 38 15 70-12 35 20 46-2 26 18 37 4 52 16 78-10"
            fill="none"
            stroke="url(#mapStroke)"
            strokeWidth="2"
          />
          <path
            d="M92 260l54-23 68 9 41 29 63-8 78 13 53-4 72 11 59-8 70 13 84-9"
            fill="none"
            stroke="url(#mapStroke)"
            strokeWidth="2"
          />
          <path
            d="M430 109l28-18 46-4 41 16 23 35 30 11 51-14 24 7 20 30"
            fill="none"
            stroke="url(#mapStroke)"
            strokeWidth="1.6"
          />
          <path
            d="M334 308l25 27 47 8 38 27 48 3 32-19 40-6 34 9"
            fill="none"
            stroke="url(#mapStroke)"
            strokeWidth="1.6"
          />

          {hotspots.map((spot, index) => (
            <g key={spot.name} transform={`translate(${spot.x * 10}, ${spot.y * 4.6})`}>
              <circle r="4" fill="rgba(0,255,255,0.95)" />
              <motion.circle
                r="4"
                fill="transparent"
                stroke="rgba(0,255,255,0.65)"
                strokeWidth="1.5"
                animate={{ r: [4, 16, 4], opacity: [0.9, 0, 0.9] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: index * 0.25,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
        </svg>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,255,255,0.15),transparent_48%),radial-gradient(circle_at_80%_0%,rgba(138,43,226,0.2),transparent_45%)]" />
      </div>
    </Surface>
  );
}

