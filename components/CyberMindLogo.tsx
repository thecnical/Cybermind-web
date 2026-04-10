"use client";

import { motion } from "framer-motion";

/**
 * CyberMind Logo — Neural Shield
 *
 * Concept: AI brain (neural network nodes) inside a cyber shield.
 * Represents intelligence + security + connectivity.
 * 100% original SVG — no third-party assets, no copyright issues.
 */
export default function CyberMindLogo({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const id = `cm-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, flexShrink: 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CyberMind CLI"
      >
        {/* Dark background */}
        <rect width="64" height="64" rx="14" fill="#080c14" />

        {/* Cyber shield — protection layer */}
        <path
          d="M32 6L10 16V34C10 46 20 55 32 58C44 55 54 46 54 34V16L32 6Z"
          fill={`url(#${id}-sf)`}
          stroke={`url(#${id}-ss)`}
          strokeWidth="1.2"
        />

        {/* Neural network — 6 nodes forming brain-like cluster */}
        {/* Center node — brightest */}
        <circle cx="32" cy="24" r="3.5" fill={`url(#${id}-nc)`} />
        {/* Left node */}
        <circle cx="22" cy="30" r="2.5" fill={`url(#${id}-nl)`} />
        {/* Right node */}
        <circle cx="42" cy="30" r="2.5" fill={`url(#${id}-nr)`} />
        {/* Bottom-left */}
        <circle cx="26" cy="40" r="2" fill={`url(#${id}-nbl)`} />
        {/* Bottom-right */}
        <circle cx="38" cy="40" r="2" fill={`url(#${id}-nbr)`} />
        {/* Bottom center */}
        <circle cx="32" cy="46" r="2" fill={`url(#${id}-nb)`} />

        {/* Neural connections */}
        <line x1="32" y1="24" x2="22" y2="30" stroke={`url(#${id}-cn)`} strokeWidth="1.2" opacity="0.85" />
        <line x1="32" y1="24" x2="42" y2="30" stroke={`url(#${id}-cn)`} strokeWidth="1.2" opacity="0.85" />
        <line x1="22" y1="30" x2="26" y2="40" stroke={`url(#${id}-cn)`} strokeWidth="1" opacity="0.65" />
        <line x1="42" y1="30" x2="38" y2="40" stroke={`url(#${id}-cn)`} strokeWidth="1" opacity="0.65" />
        <line x1="26" y1="40" x2="32" y2="46" stroke={`url(#${id}-cn)`} strokeWidth="1" opacity="0.5" />
        <line x1="38" y1="40" x2="32" y2="46" stroke={`url(#${id}-cn)`} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="30" x2="42" y2="30" stroke={`url(#${id}-cn)`} strokeWidth="0.8" opacity="0.35" />
        <line x1="26" y1="40" x2="38" y2="40" stroke={`url(#${id}-cn)`} strokeWidth="0.8" opacity="0.35" />

        {/* Center glow */}
        <circle cx="32" cy="24" r="7" fill={`url(#${id}-cg)`} opacity="0.25" />

        <defs>
          <linearGradient id={`${id}-sf`} x1="10" y1="6" x2="54" y2="58">
            <stop stopColor="#0a1628" stopOpacity="0.9" />
            <stop offset="1" stopColor="#060a12" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`${id}-ss`} x1="10" y1="6" x2="54" y2="58">
            <stop stopColor="#00FFFF" stopOpacity="0.65" />
            <stop offset="0.5" stopColor="#7B5FFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#D26BFF" stopOpacity="0.45" />
          </linearGradient>
          <radialGradient id={`${id}-nc`} cx="0.4" cy="0.3" r="0.8">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#7B5FFF" />
          </radialGradient>
          <radialGradient id={`${id}-nl`} cx="0.5" cy="0.5" r="0.8">
            <stop stopColor="#00E5FF" />
            <stop offset="1" stopColor="#5B4FFF" />
          </radialGradient>
          <radialGradient id={`${id}-nr`} cx="0.5" cy="0.5" r="0.8">
            <stop stopColor="#A78BFF" />
            <stop offset="1" stopColor="#D26BFF" />
          </radialGradient>
          <radialGradient id={`${id}-nbl`} cx="0.5" cy="0.5" r="0.8">
            <stop stopColor="#00CFFF" />
            <stop offset="1" stopColor="#6B5FFF" />
          </radialGradient>
          <radialGradient id={`${id}-nbr`} cx="0.5" cy="0.5" r="0.8">
            <stop stopColor="#C084FF" />
            <stop offset="1" stopColor="#8A2BE2" />
          </radialGradient>
          <radialGradient id={`${id}-nb`} cx="0.5" cy="0.5" r="0.8">
            <stop stopColor="#7B5FFF" />
            <stop offset="1" stopColor="#D26BFF" />
          </radialGradient>
          <linearGradient id={`${id}-cn`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#8A2BE2" />
          </linearGradient>
          <radialGradient id={`${id}-cg`} cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#00FFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
