"use client";

import { motion } from "framer-motion";

/**
 * CyberMind CLI — Official Brand Logo
 *
 * Design: Stylized "CM" lettermark inside a cyber-hexagon frame.
 * Colors: Cyan (#00FFFF) + Electric Purple (#8A2BE2) gradient — CyberMind brand palette.
 * Background: Transparent — works on any dark surface.
 * Scalable SVG — crisp at any size.
 */
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
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-label="CyberMind CLI"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Hexagon outer frame */}
        <path
          d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
          fill="url(#cm-hex-fill)"
          stroke="url(#cm-hex-stroke)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Inner hex glow ring */}
        <path
          d="M32 10L52 21.5V43L32 54.5L12 43V21.5L32 10Z"
          fill="none"
          stroke="url(#cm-inner-ring)"
          strokeWidth="0.75"
          opacity="0.5"
        />

        {/* "C" letterform — left arc */}
        <path
          d="M30 20C22 20 17 25.5 17 32C17 38.5 22 44 30 44C33 44 35.5 43 37.5 41.5"
          stroke="url(#cm-c-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* "M" letterform — right side */}
        <path
          d="M36 20V44M36 20L43 30L50 20M50 20V44"
          stroke="url(#cm-m-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Corner accent dots */}
        <circle cx="32" cy="4"  r="2" fill="#00FFFF" opacity="0.9" />
        <circle cx="56" cy="18" r="2" fill="#8A2BE2" opacity="0.7" />
        <circle cx="56" cy="46" r="2" fill="#8A2BE2" opacity="0.7" />
        <circle cx="32" cy="60" r="2" fill="#00FFFF" opacity="0.9" />
        <circle cx="8"  cy="46" r="2" fill="#00FFFF" opacity="0.6" />
        <circle cx="8"  cy="18" r="2" fill="#00FFFF" opacity="0.6" />

        <defs>
          <linearGradient id="cm-hex-fill" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFFF" stopOpacity="0.07" />
            <stop offset="1" stopColor="#8A2BE2" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="cm-hex-stroke" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFFF" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#7B5FFF" stopOpacity="0.8" />
            <stop offset="1" stopColor="#8A2BE2" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cm-inner-ring" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#8A2BE2" />
          </linearGradient>
          <linearGradient id="cm-c-grad" x1="17" y1="20" x2="37" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFFF" />
            <stop offset="1" stopColor="#33CFFF" />
          </linearGradient>
          <linearGradient id="cm-m-grad" x1="36" y1="20" x2="50" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFF" />
            <stop offset="1" stopColor="#8A2BE2" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
