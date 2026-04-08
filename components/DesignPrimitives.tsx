"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SurfaceVariant = "glass" | "clay" | "brutal" | "skeuo";
export type SurfaceTone = "default" | "accent" | "cyan" | "success" | "danger";
export type SurfaceElevation = "low" | "medium" | "high";
export type SurfaceMotion = "none" | "fast" | "medium" | "hero";

type PrimitiveProps = {
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
  elevation?: SurfaceElevation;
  motion?: SurfaceMotion;
  className?: string;
  children: React.ReactNode;
};

const variantClass: Record<SurfaceVariant, string> = {
  glass: "surface-glass",
  clay: "surface-clay",
  brutal: "surface-brutal",
  skeuo: "surface-skeuo",
};

const toneClass: Record<SurfaceTone, string> = {
  default: "",
  accent: "surface-tone-accent",
  cyan: "surface-tone-cyan",
  success: "surface-tone-success",
  danger: "surface-tone-danger",
};

const elevationClass: Record<SurfaceElevation, string> = {
  low: "surface-elevation-low",
  medium: "surface-elevation-medium",
  high: "surface-elevation-high",
};

const motionClass: Record<SurfaceMotion, string> = {
  none: "",
  fast: "surface-motion-fast",
  medium: "surface-motion-medium",
  hero: "surface-motion-hero",
};

export function Surface({
  variant = "glass",
  tone = "default",
  elevation = "medium",
  motion = "medium",
  className,
  children,
}: PrimitiveProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-white/10",
        variantClass[variant],
        toneClass[tone],
        elevationClass[elevation],
        motionClass[motion],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Reveal({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

