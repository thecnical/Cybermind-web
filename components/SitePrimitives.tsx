"use client";

import Link from "next/link";
import { motion as fm } from "framer-motion";
import type { DocPage, MarketingPage, PageLink, PageSection } from "@/lib/siteContent";
import CopyButton from "@/components/CopyButton";
import {
  Reveal,
  Surface,
  type SurfaceElevation,
  type SurfaceMotion,
  type SurfaceTone,
  type SurfaceVariant,
} from "@/components/DesignPrimitives";
import { cn } from "@/lib/utils";

export type PrimitiveVisualProps = {
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
  elevation?: SurfaceElevation;
  motion?: SurfaceMotion;
};

export function CommandBar({
  command,
  className,
  variant = "skeuo",
  tone = "accent",
  elevation = "low",
  motion = "fast",
}: {
  command: string;
  className?: string;
} & PrimitiveVisualProps) {
  return (
    <Surface
      variant={variant}
      tone={tone}
      elevation={elevation}
      motion={motion}
      className={cn("group relative flex items-center gap-3 rounded-2xl px-4 py-3", className)}
    >
      <span className="font-mono text-sm text-[var(--accent-cyan)]">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">
        {command}
      </code>
      <CopyButton text={command} />
    </Surface>
  );
}

export function LinkCard({
  href,
  label,
  description,
  variant = "glass",
  tone = "default",
  elevation = "low",
  motion = "medium",
}: PageLink & PrimitiveVisualProps) {
  return (
    <Link href={href} className="group block">
      <Surface
        variant={variant}
        tone={tone}
        elevation={elevation}
        motion={motion}
        className="cm-spotlight-card rounded-2xl p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-main)] transition-colors group-hover:text-white">
              {label}
            </p>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{description}</p>
            ) : null}
          </div>
          <span className="font-mono text-xs text-[var(--accent-cyan)]">open</span>
        </div>
      </Surface>
    </Link>
  );
}

export function SectionCard({
  section,
  variant = "glass",
  tone = "default",
  elevation = "medium",
  motion = "medium",
}: {
  section: PageSection;
} & PrimitiveVisualProps) {
  return (
    <Surface
      variant={variant}
      tone={tone}
      elevation={elevation}
      motion={motion}
      className="cm-spotlight-card rounded-[28px] p-6"
    >
      <h2 className="text-xl font-semibold tracking-tight text-white">{section.title}</h2>
      <p className="mt-4 text-[15px] leading-7 text-[var(--text-soft)]">{section.body}</p>
      {section.bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-[var(--text-main)]">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.code ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-black/30 p-4">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-[var(--text-main)]">
            {section.code}
          </pre>
        </div>
      ) : null}
      {section.links?.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {section.links.map((link) => (
            <LinkCard key={link.href} {...link} />
          ))}
        </div>
      ) : null}
    </Surface>
  );
}

function PageHero({
  eyebrow,
  title,
  description,
  command,
  variant = "glass",
  tone = "accent",
  elevation = "high",
  motion = "hero",
}: {
  eyebrow: string;
  title: string;
  description: string;
  command?: string;
} & PrimitiveVisualProps) {
  return (
    <Surface
      variant={variant}
      tone={tone}
      elevation={elevation}
      motion={motion}
      className="cm-noise-overlay cm-spotlight-card relative overflow-hidden rounded-[32px] p-8 md:p-10"
    >
      <div className="cm-hero-beams" />
      <fm.div
        className="relative max-w-3xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">{eyebrow}</p>
        <h1 className="cm-heading-shift mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">{description}</p>
        {command ? <CommandBar command={command} className="mt-8 max-w-2xl" /> : null}
      </fm.div>
    </Surface>
  );
}

export function MarketingPageView({ page }: { page: MarketingPage }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
      <Reveal>
        <PageHero
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          command={page.command}
        />
      </Reveal>
      <div className="grid gap-6">
        {page.sections.map((section, index) => (
          <Reveal key={section.title} delay={index * 0.04}>
            <SectionCard section={section} variant={index % 3 === 1 ? "clay" : "glass"} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function DocsPageView({ page }: { page: DocPage }) {
  return (
    <article className="flex flex-col gap-6">
      <Reveal>
        <PageHero
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          command={page.command}
          tone="cyan"
        />
      </Reveal>
      {page.sections.map((section, index) => (
        <Reveal key={section.title} delay={index * 0.04}>
          <SectionCard section={section} variant={index % 2 === 0 ? "glass" : "skeuo"} />
        </Reveal>
      ))}
    </article>
  );
}
