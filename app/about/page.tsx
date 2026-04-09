import Link from "next/link";
import { Globe, Sparkles, Users } from "lucide-react";
import AnimatedTimeline from "@/components/AnimatedTimeline";
import AnimatedTooltip from "@/components/AnimatedTooltip";
import CometProfileCard, { LeaderProfileCard } from "@/components/CometProfileCard";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";
export const metadata: Metadata = PAGE_META.about;
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ThreeDMarquee from "@/components/ThreeDMarquee";
import WaitlistPanel from "@/components/WaitlistPanel";
import { Reveal, Surface } from "@/components/DesignPrimitives";
import {
  contributorTooltipPeople,
  cybermindProjectMeta,
  cybermindProjectMetrics,
  cybermindProjectTopics,
  cybermindTimeline,
  leadershipProfiles,
  techTeamProfiles,
} from "@/lib/projectData";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
        <Surface variant="glass" tone="cyan" elevation="high" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
          <p className="cm-label">About CyberMind CLI</p>
          <h1 className="cm-heading-shift mt-3 max-w-5xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Built from the official {cybermindProjectMeta.repoName} project, shaped for real operator workflows.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            CyberMind CLI is an AI-powered offensive security command surface focused on recon, hunt, and exploitation
            workflows with platform-aware execution boundaries.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="https://cybermind.thecnical.dev/docs" className="cm-button-primary gap-2">
              <Globe size={15} /> Documentation
            </a>
            <a href="https://cybermind.thecnical.dev/plans" className="cm-button-secondary gap-2">
              <Sparkles size={15} /> View plans
            </a>
          </div>
        </Surface>

        {/* Metrics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cybermindProjectMetrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.04}>
              <Surface variant={index === 0 ? "clay" : "glass"} elevation="medium" className="rounded-[24px] p-5">
                <p className="cm-label">{metric.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-[var(--text-soft)]">{metric.detail}</p>
              </Surface>
            </Reveal>
          ))}
        </section>

        {/* Project topics + contributors tooltip */}
        <Surface variant="glass" elevation="medium" className="rounded-[28px] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="cm-label">Project topics</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Core focus areas</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Contributors</p>
              <AnimatedTooltip people={contributorTooltipPeople} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {cybermindProjectTopics.map((topic) => (
              <span key={topic}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-main)]">
                {topic}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <ThreeDMarquee items={[
              "ai security", "recon chain", "hunt engine", "linux-first modes",
              "operator workflow", "bug bounty", "red team", "cybermind cli",
              "offensive security", "exploit engine", "kali linux", "penetration testing",
            ]} />
          </div>
        </Surface>

        {/* ── Leadership — Creator & CEO (large hero cards) ── */}
        <section>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <p className="cm-label">Leadership</p>
              <div className="h-px flex-1 bg-white/8" />
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {leadershipProfiles.map((profile, i) => (
              <Reveal key={profile.name} delay={i * 0.08}>
                <LeaderProfileCard profile={profile} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Tech Team (3 smaller cards) ── */}
        <section>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <Users size={14} className="text-[var(--accent-cyan)]" />
              <p className="cm-label">Tech Team</p>
              <div className="h-px flex-1 bg-white/8" />
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {techTeamProfiles.map((profile, i) => (
              <Reveal key={profile.name} delay={i * 0.06}>
                <CometProfileCard profile={profile} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <Surface variant="glass" tone="accent" elevation="high" className="rounded-[32px] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="cm-label">Animated timeline</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Product evolution</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">
                Key milestones in the development of CyberMind CLI.
              </p>
            </div>
          </div>
          <div className="mt-7">
            <AnimatedTimeline items={cybermindTimeline} />
          </div>
        </Surface>

        <WaitlistPanel
          title="Get roadmap updates from the core team"
          description="Join the product-insider waitlist for release updates, course launches, and new tool bundle announcements."
          audienceLabel="Roadmap insiders"
          baseCount={2410}
        />

        {/* Project status */}
        <Surface variant="skeuo" elevation="medium" className="rounded-[28px] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="cm-label">Project status</p>
              <p className="mt-3 text-xl font-semibold text-white">
                Last updated: {cybermindProjectMeta.updatedAt} | Created: {cybermindProjectMeta.createdAt}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
                Source of truth stays the official GitHub repository. Website content is continuously aligned to that
                upstream project state.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.1)] px-4 py-2 text-sm text-white">
              <Sparkles size={14} className="text-[var(--accent-cyan)]" />
              Repo-aligned experience
            </span>
          </div>
        </Surface>
      </main>
      <Footer />
    </div>
  );
}
