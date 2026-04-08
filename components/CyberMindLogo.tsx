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
      style={{ width: size, height: size }}
      whileHover={{ rotate: 8, scale: 1.04 }}
      transition={{ duration: 0.25 }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="18"
          fill="url(#logo-panel)"
          stroke="rgba(255,255,255,0.12)"
        />
        <path d="M15 24L24 32L15 40" stroke="url(#logo-line)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="28" y="38" width="18" height="4.5" rx="2.2" fill="url(#logo-line)" />
        <rect x="28" y="22" width="21" height="14" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <path d="M31 26H36V30H31V26Z" fill="url(#logo-pixel)" />
        <path d="M38 26H43V30H38V26Z" fill="url(#logo-pixel)" />
        <circle cx="50" cy="16" r="3.5" fill="url(#logo-spark)" />
        <defs>
          <linearGradient id="logo-panel" x1="10" y1="8" x2="56" y2="58">
            <stop stopColor="#181d29" />
            <stop offset="1" stopColor="#0b0e15" />
          </linearGradient>
          <linearGradient id="logo-line" x1="18" y1="18" x2="48" y2="46">
            <stop stopColor="#00FFFF" />
            <stop offset="0.62" stopColor="#8A2BE2" />
            <stop offset="1" stopColor="#D26BFF" />
          </linearGradient>
          <linearGradient id="logo-pixel" x1="31" y1="26" x2="43" y2="30">
            <stop stopColor="#89F5FF" />
            <stop offset="1" stopColor="#D26BFF" />
          </linearGradient>
          <radialGradient id="logo-spark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 16) rotate(90) scale(4)">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#8A2BE2" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
