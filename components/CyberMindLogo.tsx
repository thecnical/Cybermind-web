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
          fill="url(#logo-surface)"
          stroke="rgba(255,255,255,0.12)"
        />
        <path
          d="M18 18L28 18L20 26L28 34L18 34L10 26L18 18Z"
          fill="url(#logo-line)"
        />
        <path
          d="M37 18H49V22H41V42H49V46H37L31 40V24L37 18Z"
          stroke="url(#logo-line)"
          strokeWidth="2.2"
          fill="rgba(255,255,255,0.04)"
        />
        <path
          d="M36 26H46V30H40V34H46V38H40V42H47V46H36L34 44V28L36 26Z"
          fill="white"
        />
        <circle cx="48" cy="16" r="4" fill="url(#logo-spark)" />
        <defs>
          <linearGradient id="logo-surface" x1="10" y1="8" x2="56" y2="58">
            <stop stopColor="#181d29" />
            <stop offset="1" stopColor="#0b0e15" />
          </linearGradient>
          <linearGradient id="logo-line" x1="18" y1="18" x2="48" y2="46">
            <stop stopColor="#8bdcff" />
            <stop offset="0.55" stopColor="#8d75ff" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="logo-spark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 16) rotate(90) scale(4)">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#8d75ff" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
