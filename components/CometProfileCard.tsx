"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, GitFork, Zap } from "lucide-react";

export type ProfileCardData = {
  name: string;
  role: string;
  badge?: string;
  summary: string;
  avatarUrl: string;
  githubUrl?: string;
  websiteUrl?: string;
  skills?: string[];
  accent?: "cyan" | "purple";
  isAI?: boolean;
};

// ─── Large hero card for Creator / CEO ───────────────────────────────────────
export function LeaderProfileCard({ profile }: { profile: ProfileCardData }) {
  const isCyan = profile.accent !== "purple";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-0 shadow-[0_32px_100px_rgba(0,0,0,0.4)]"
    >
      {/* Animated background orbs */}
      <motion.div
        className={`pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full ${
          isCyan
            ? "bg-[radial-gradient(circle,rgba(0,255,255,0.25),transparent_65%)]"
            : "bg-[radial-gradient(circle,rgba(138,43,226,0.3),transparent_65%)]"
        }`}
        animate={{ x: [0, 12, -8, 0], y: [0, -8, 10, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full ${
          isCyan
            ? "bg-[radial-gradient(circle,rgba(138,43,226,0.35),transparent_65%)]"
            : "bg-[radial-gradient(circle,rgba(0,255,255,0.2),transparent_65%)]"
        }`}
        animate={{ x: [0, -14, 10, 0], y: [0, 10, -6, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glowing top border line */}
      <div className={`absolute inset-x-12 top-0 h-px ${
        isCyan
          ? "bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.9),transparent)]"
          : "bg-[linear-gradient(90deg,transparent,rgba(138,43,226,0.9),transparent)]"
      }`} />

      <div className="relative flex flex-col gap-0 md:flex-row">
        {/* Photo — large, takes left side on desktop */}
        <div className="relative h-72 w-full flex-shrink-0 overflow-hidden rounded-t-[36px] md:h-auto md:w-64 md:rounded-l-[36px] md:rounded-tr-none">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            unoptimized
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 256px"
          />
          {/* Gradient overlay at bottom of photo */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(9,12,20,0.95),transparent)]" />

          {/* Badge on photo */}
          {profile.badge && (
            <div className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
              isCyan
                ? "border-[var(--accent-cyan)]/40 bg-[rgba(0,255,255,0.15)] text-[var(--accent-cyan)]"
                : "border-[var(--accent-strong)]/40 bg-[rgba(138,43,226,0.15)] text-[#c084fc]"
            }`}>
              {profile.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
          <div>
            <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
              isCyan ? "text-[var(--accent-cyan)]" : "text-[#c084fc]"
            }`}>
              {profile.role}
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {profile.name}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{profile.summary}</p>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className={`rounded-full border px-3 py-1 text-xs ${
                    isCyan
                      ? "border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)] text-[var(--text-main)]"
                      : "border-[var(--accent-strong)]/20 bg-[rgba(138,43,226,0.06)] text-[var(--text-main)]"
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.githubUrl && (
              <Link href={profile.githubUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/[0.08]">
                <GitFork size={15} />
                GitHub
              </Link>
            )}
            {profile.websiteUrl && (
              <Link href={profile.websiteUrl} target="_blank" rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm text-white transition-colors ${
                  isCyan
                    ? "border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)] hover:bg-[rgba(0,255,255,0.14)]"
                    : "border-[var(--accent-strong)]/30 bg-[rgba(138,43,226,0.08)] hover:bg-[rgba(138,43,226,0.14)]"
                }`}>
                <ExternalLink size={15} />
                Website
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Smaller card for Tech Team ───────────────────────────────────────────────
export default function CometProfileCard({ profile }: { profile: ProfileCardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition-all hover:border-white/15"
    >
      {/* Subtle hover glow */}
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.15),transparent_65%)] opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            unoptimized
            className="object-cover object-top"
            sizes="64px"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {profile.isAI ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#00d4ff]/40 bg-[rgba(0,212,255,0.12)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00d4ff]">
                🤖 AI Assistant
              </span>
            ) : (
              <>
                <Zap size={12} className="flex-shrink-0 text-[var(--accent-cyan)]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent-cyan)]">
                  {profile.role}
                </p>
              </>
            )}
          </div>
          <h3 className="mt-1 truncate text-base font-semibold text-white">{profile.name}</h3>
          {profile.isAI && (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-0.5">
              {profile.role}
            </p>
          )}
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-6 text-[var(--text-soft)]">{profile.summary}</p>

      {profile.githubUrl && (
        <div className="relative mt-4">
          <Link href={profile.githubUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--text-soft)] transition-colors hover:text-white">
            <GitFork size={13} />
            GitHub
          </Link>
        </div>
      )}
    </motion.div>
  );
}
