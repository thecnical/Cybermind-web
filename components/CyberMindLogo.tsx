"use client";

import { motion } from "framer-motion";

export default function CyberMindLogo({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, flexShrink: 0 }}
      whileHover={{ rotate: 6, scale: 1.06 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CyberMind CLI logo"
      >
        {/* Background panel — dark with subtle gradient */}
        <rect width="64" height="64" rx="16" fill="url(#cm-bg)" />
        <rect width="64" height="64" rx="16" fill="url(#cm-glow)" opacity="0.4" />

        {/* Terminal chevron > */}
        <path
          d="M11 21L24 32L11 43"
          stroke="url(#cm-cyan)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cursor underscore _ */}
        <rect x="28" y="39.5" width="23" height="4" rx="2" fill="url(#cm-cyan)" />

        {/* Neural node — top right circuit */}
        <circle cx="47" cy="17" r="3.5" fill="url(#cm-spark)" />
        <circle cx="55" cy="23" r="2" fill="#8A2BE2" opacity="0.85" />
        <line x1="47" y1="17" x2="55" y2="23" stroke="url(#cm-cyan)" strokeWidth="1.5" opacity="0.6" />

        {/* Small accent dot */}
        <circle cx="52" cy="12" r="1.5" fill="white" opacity="0.5" />

        <defs>
          <linearGradient id="cm-bg" x1="0" y1="0" x2="64" y2="64">
            <stop stopColor="#0d1220" />
            <stop offset="1" stopColor="#070a10" />
          </linearGradient>
          <radialGradient id="cm-glow" cx="0.2" cy="0.2" r="0.8">
            <stop stopColor="#00FFFF" stopOpacity="0.15" />
            <stop offset="1" stopColor="#8A2BE2" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="cm-cyan" x1="11" y1="21" x2="51" y2="44">
            <stop stopColor="#00FFFF" />
            <stop offset="0.5" stopColor="#7B5FFF" />
            <stop offset="1" stopColor="#D26BFF" />
          </linearGradient>
          <radialGradient id="cm-spark" cx="0.3" cy="0.3" r="0.8">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#8A2BE2" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
