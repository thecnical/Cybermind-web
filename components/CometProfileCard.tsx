"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, GitFork } from "lucide-react";
import { Surface } from "@/components/DesignPrimitives";

export type ProfileCardData = {
  name: string;
  role: string;
  summary: string;
  avatarUrl: string;
  githubUrl?: string;
  websiteUrl?: string;
};

export default function CometProfileCard({
  profile,
}: {
  profile: ProfileCardData;
}) {
  return (
    <Surface variant="glass" tone="accent" elevation="high" className="relative overflow-hidden rounded-[30px] p-6">
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.4),transparent_72%)]"
        animate={{ x: [0, 10, -6, 0], y: [0, -6, 8, 0], opacity: [0.65, 0.9, 0.6, 0.65] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.42),transparent_72%)]"
        animate={{ x: [0, -12, 8, 0], y: [0, 8, -4, 0], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-start gap-4">
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={80}
          height={80}
          unoptimized
          className="h-20 w-20 rounded-2xl border border-white/15 object-cover"
          loading="lazy"
        />
        <div>
          <p className="cm-label">{profile.role}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{profile.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{profile.summary}</p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {profile.githubUrl ? (
          <Link href={profile.githubUrl} target="_blank" rel="noreferrer" className="cm-button-secondary gap-2">
            <GitFork size={14} />
            GitHub
          </Link>
        ) : null}
        {profile.websiteUrl ? (
          <Link href={profile.websiteUrl} target="_blank" rel="noreferrer" className="cm-button-secondary gap-2">
            <ExternalLink size={14} />
            Portfolio
          </Link>
        ) : null}
      </div>
    </Surface>
  );
}
