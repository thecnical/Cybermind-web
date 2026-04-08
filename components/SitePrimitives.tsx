"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { DocPage, MarketingPage, PageLink, PageSection } from "@/lib/siteContent";
import CopyButton from "@/components/CopyButton";
import { cn } from "@/lib/utils";

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CommandBar({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(141,117,255,0.1)] px-4 py-3 backdrop-blur-xl",
        className,
      )}
    >
      <span className="font-mono text-sm text-[var(--accent-strong)]">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[var(--text-main)]">
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}

export function LinkCard({ href, label, description }: PageLink) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-strong)]/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] transition-colors group-hover:text-white">
            {label}
          </p>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              {description}
            </p>
          ) : null}
        </div>
        <span className="font-mono text-xs text-[var(--accent-strong)]">open</span>
      </div>
    </Link>
  );
}

export function SectionCard({ section }: { section: PageSection }) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        {section.title}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-[var(--text-soft)]">
        {section.body}
      </p>
      {section.bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-sm leading-6 text-[var(--text-main)]"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-strong)]" />
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
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  description,
  command,
}: {
  eyebrow: string;
  title: string;
  description: string;
  command?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(141,117,255,0.18),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 md:p-10">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(141,117,255,0.12),transparent_60%)]" />
      <div className="relative max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-strong)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
          {description}
        </p>
        {command ? <CommandBar command={command} className="mt-8 max-w-2xl" /> : null}
      </div>
    </div>
  );
}

export function MarketingPageView({ page }: { page: MarketingPage }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
      <FadeIn>
        <PageHero
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          command={page.command}
        />
      </FadeIn>
      <div className="grid gap-6">
        {page.sections.map((section, index) => (
          <FadeIn key={section.title} delay={index * 0.05}>
            <SectionCard section={section} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

export function DocsPageView({ page }: { page: DocPage }) {
  return (
    <article className="flex flex-col gap-6">
      <FadeIn>
        <PageHero
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          command={page.command}
        />
      </FadeIn>
      {page.sections.map((section, index) => (
        <FadeIn key={section.title} delay={index * 0.05}>
          <SectionCard section={section} />
        </FadeIn>
      ))}
    </article>
  );
}
