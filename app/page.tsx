"use client";

import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Bot,
  Gauge,
  KeyRound,
  Network,
  Radar,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Workflow,
} from "lucide-react";
import AnimatedTestimonials, { type TestimonialItem } from "@/components/AnimatedTestimonials";
import AnimatedTooltip from "@/components/AnimatedTooltip";
import CyberMindTerminal from "@/components/CyberMindTerminal";
import Footer from "@/components/Footer";
import GeminiBackground from "@/components/GeminiBackground";
import Navbar from "@/components/Navbar";
import TextFlip from "@/components/TextFlip";
import ThreeDMarquee from "@/components/ThreeDMarquee";
import WorldMapPulse from "@/components/WorldMapPulse";
import { Reveal, Surface } from "@/components/DesignPrimitives";
import { CommandBar, LinkCard } from "@/components/SitePrimitives";
import { contributorTooltipPeople } from "@/lib/projectData";

const featureCards = [
  {
    icon: Bot,
    title: "Interactive AI shell",
    body: "Prompt-first chat with model routing, local history, and fast command iteration.",
  },
  {
    icon: Radar,
    title: "20-tool recon chain",
    body: "Passive intel, host mapping, HTTP fingerprinting, content discovery, and vuln scans.",
  },
  {
    icon: Network,
    title: "11-tool hunt engine",
    body: "Parameter mining, XSS vectors, nuclei coverage, and exploit-surface reduction.",
  },
  {
    icon: ShieldAlert,
    title: "Abhimanyu mode",
    body: "Linux-first exploit and post-exploitation mode for advanced research environments.",
  },
];

const socialProof = [
  { value: "1,00,000+", label: "security researchers" },
  { value: "50+", label: "countries reached" },
  { value: "4.9/5", label: "product rating" },
];

const howItWorks = [
  {
    icon: UserPlus,
    title: "Sign up free",
    body: "Create an account and start on the free tier immediately.",
  },
  {
    icon: KeyRound,
    title: "Get your API key",
    body: "Copy your live key in dashboard and keep it ready for install.",
  },
  {
    icon: Sparkles,
    title: "Install and run",
    body: "Use personalized Linux/Windows/macOS commands and launch straight into CLI.",
  },
];

const routeHighlights = [
  {
    href: "/docs/get-started",
    label: "Quick start",
    description: "Install CyberMind CLI and reach a working shell fast.",
  },
  {
    href: "/docs/modes/recon",
    label: "Recon workflow",
    description: "Understand the six-phase discovery chain before execution.",
  },
  {
    href: "/docs/reference/commands",
    label: "Commands reference",
    description: "See the command surface grouped by job-to-be-done.",
  },
  {
    href: "/docs/resources/troubleshooting",
    label: "Troubleshooting",
    description: "Fix platform, tool, key, and provider issues quickly.",
  },
];

const testimonials: TestimonialItem[] = [
  {
    quote:
      "CyberMind CLI shortened my recon-to-validation loop because install, key management, and shell all feel like one product.",
    name: "R. Mehta",
    role: "Independent security researcher",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=R%20Mehta",
  },
  {
    quote:
      "The dashboard is restrained in the right way. I can rotate keys and return to the terminal without friction.",
    name: "A. Rodrigues",
    role: "Red team operator",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=A%20Rodrigues",
  },
  {
    quote:
      "The platform-aware install flow helped us onboard mixed Kali, Windows, and macOS teams faster.",
    name: "S. Khan",
    role: "Security engineering lead",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=S%20Khan",
  },
];

const workflowSignals = [
  {
    icon: Workflow,
    title: "Pipeline orchestration",
    text: "Map recon -> hunt -> report in one route-aware workflow graph.",
  },
  {
    icon: Gauge,
    title: "Runtime telemetry",
    text: "Track provider fallback, request budget, and execution confidence in real-time.",
  },
  {
    icon: Binary,
    title: "Mode intelligence",
    text: "Switch between chat, recon, hunt, and Abhimanyu with context carry-over.",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <GeminiBackground />
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface
          variant="glass"
          tone="cyan"
          elevation="high"
          motion="hero"
          className="cm-noise-overlay relative overflow-hidden rounded-[42px] px-6 py-8 md:px-8 md:py-10 xl:px-10 xl:py-12"
        >
          <div className="cm-hero-beams" />
          <div className="absolute inset-0 cm-grid-bg opacity-25" />

          <div className="relative grid gap-8 xl:grid-cols-[1fr_480px] xl:items-center 2xl:grid-cols-[1fr_520px]">
            <div className="min-w-0">
              <p className="cm-label text-[var(--accent-cyan)]">Official CyberMind CLI experience</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl xl:text-6xl">
                CyberMind CLI powers{" "}
                <TextFlip
                  words={["AI chat", "recon chains", "hunt execution", "exploit workflows"]}
                  className="text-gradient-command"
                />{" "}
                in one command-first surface.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)] md:text-lg">
                Run offensive security workflows with platform-aware boundaries, fast install, and account control
                that stays aligned to real terminal sessions.
              </p>
              <CommandBar
                command="curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key sk_live_cm_xxxxxxxxxxxxxxxx"
                className="mt-7 max-w-2xl"
                variant="skeuo"
                tone="cyan"
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/auth/register" className="cm-button-primary gap-2">
                  Start free
                  <ArrowRight size={16} />
                </Link>
                <Link href="/install" className="cm-button-secondary">
                  Install CyberMind CLI
                </Link>
              </div>
            </div>

            <div className="min-w-0 xl:pl-4">
              <CyberMindTerminal />
            </div>
          </div>
        </Surface>

        <section className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            {socialProof.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.04}>
                <Surface variant="brutal" tone="default" elevation="low" motion="fast" className="rounded-2xl p-5 text-center md:text-left">
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{item.label}</p>
                </Surface>
              </Reveal>
            ))}
          </div>
          <Surface variant="glass" elevation="low" className="flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="cm-label whitespace-nowrap">Contributors</span>
            <AnimatedTooltip people={contributorTooltipPeople} />
          </Surface>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Surface variant="glass" elevation="high" className="rounded-[32px] p-6 md:p-8">
            <p className="cm-label">Beyond terminal</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              Hybrid operator canvas with cinematic UX
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              Blend command context, mode routing, execution telemetry, and docs guidance in one control surface.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {workflowSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <Surface key={signal.title} variant="skeuo" elevation="low" className="rounded-2xl p-4">
                    <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.05] p-2 text-[var(--accent-cyan)]">
                      <Icon size={16} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{signal.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[var(--text-soft)]">{signal.text}</p>
                  </Surface>
                );
              })}
            </div>
          </Surface>

          <Surface variant="clay" tone="accent" elevation="high" className="rounded-[32px] p-6 md:p-7">
            <p className="cm-label">Capability stream</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Live product pulses</h3>
            <div className="mt-5 grid gap-4">
              {[
                ["Recon phase", "Passive -> service map -> HTTP", "active"],
                ["Hunt phase", "Params -> payload validation", "queued"],
                ["Report phase", "Findings normalization", "standby"],
              ].map((row, index) => (
                <div key={row[0]} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{row[0]}</p>
                    <span className="text-xs uppercase tracking-[0.12em] text-[var(--accent-cyan)]">{row[2]}</span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-[var(--text-soft)]">{row[1]}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-strong))]"
                      style={{ width: `${35 + index * 18}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            const variant = index % 2 === 0 ? "glass" : "clay";
            return (
              <Reveal key={card.title} delay={index * 0.03}>
                <Surface variant={variant} tone="default" elevation="medium" motion="medium" className="cm-spotlight-card rounded-[30px] p-6">
                  <div className="mb-5 inline-flex rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.14)] p-3 text-[var(--accent-cyan)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{card.body}</p>
                </Surface>
              </Reveal>
            );
          })}
        </section>

        <Surface variant="glass" elevation="medium" className="rounded-[28px] p-6 md:p-8">
          <p className="cm-label">3D signal marquee</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Command ecosystem highlights</h2>
          <div className="mt-6">
            <ThreeDMarquee
              items={[
                "recon",
                "hunt",
                "abhimanyu",
                "nuclei",
                "xss",
                "osint",
                "reporting",
                "api keys",
                "session memory",
                "cli ai",
              ]}
            />
          </div>
        </Surface>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Surface variant="glass" tone="accent" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Three steps from account to shell</h2>
          </Surface>
          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Surface key={item.title} variant="skeuo" tone="default" elevation="low" motion="fast" className="rounded-2xl p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-cyan)]">0{index + 1}</p>
                  <div className="mt-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.body}</p>
                </Surface>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">Clear docs</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              The docs are organized by action, not route noise.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              Start with install and command basics, then move into recon, hunt, privacy, troubleshooting, or release notes as needed.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {routeHighlights.map((item) => (
                <LinkCard key={item.href} {...item} variant="skeuo" motion="fast" />
              ))}
            </div>
          </Surface>

          <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">Pricing teaser</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Start free, upgrade when ready</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
              Free gets you into the product quickly. Pro unlocks full recon and hunt. Elite adds persistence, reporting, and full mode coverage.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["Free", "$0/mo", "20 requests/day"],
                ["Pro", "$9/mo", "200 requests/day"],
                ["Elite", "$29/mo", "Unlimited + Abhimanyu"],
              ].map((item) => (
                <Surface key={item[0]} variant="skeuo" elevation="low" className="rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{item[0]}</p>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">{item[2]}</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{item[1]}</p>
                  </div>
                </Surface>
              ))}
            </div>
            <Link href="/plans" className="cm-button-primary mt-6">
              Compare all plans
            </Link>
          </Surface>
        </section>

        <WorldMapPulse />
        <AnimatedTestimonials items={testimonials} />

        <Surface variant="clay" tone="cyan" elevation="high" motion="hero" className="rounded-[36px] p-7 text-center md:p-10">
          <p className="cm-label">Final CTA</p>
          <h2 className="cm-heading-shift mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Start your free account</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
            Create an account, copy your live key, and launch CyberMind CLI with a command that already matches your platform and plan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/register" className="cm-button-primary gap-2">
              Start your free account
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="cm-button-secondary">
              View dashboard preview
            </Link>
          </div>
        </Surface>
      </main>
      <Footer />
    </div>
  );
}
