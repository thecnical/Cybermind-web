"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * CyberMind Logo — uses the official favicon.ico brand asset
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
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src="/favicon.ico"
        alt="CyberMind CLI"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        priority
      />
    </motion.div>
  );
}
