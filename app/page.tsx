import Link from "next/link";
import {
  ArrowRight,
  Bot,
  KeyRound,
  Network,
  Radar,
  ShieldAlert,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CyberMindTerminal from "@/components/CyberMindTerminal";
import HeroWordmark from "@/components/HeroWordmark";
import { CommandBar, LinkCard } from "@/components/SitePrimitives";

const featureCards = [
  {
    icon: Bot,
    title: "Interactive AI shell",
    body: "Prompt-first chat with model routing, local history, and fast command iteration instead of a dashboard-heavy operating model.",
  },
  {
    icon: Radar,
    title: "20-tool recon chain",
    body: "Move from passive intel through ports, HTTP fingerprinting, content discovery, and vulnerability scanning in one guided flow.",
  },
  {
    icon: Network,
    title: "11-tool hunt engine",
    body: "Push recon output into parameter mining, XSS testing, nuclei coverage, and post-discovery attack surface narrowing.",
  },
  {
    icon: ShieldAlert,
    title: "Abhimanyu mode",
    body: "Elite mode extends into exploitation, post-exploitation, and deeper offensive workflows where the platform supports them.",
  },
];

const socialProof = [
  { value: "1,00,000+", label: "security researchers" },
  { value: "50+", label: "countries reached" },
  { value: "4.9★", label: "product rating" },
];

const howItWorks = [
  {
    icon: UserPlus,
    title: "Sign up free",
    body: "Create an account and start on the free tier without touching billing first.",
  },
  {
    icon: KeyRound,
    title: "Get your API key",
    body: "Open the dashboard, copy the live key, and keep it ready for the install command.",
  },
  {
    icon: Sparkles,
    title: "Install and run",
    body: "Choose Linux, Windows, or macOS and launch a personalized command that boots straight into the CLI workflow.",
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
    description: "Understand the six-phase discovery chain before you run it.",
  },
  {
    href: "/docs/reference/commands",
    label: "Commands reference",
    description: "See the main commands grouped by the job they solve.",
  },
  {
    href: "/docs/resources/troubleshooting",
    label: "Troubleshooting",
    description: "Fix platform, tool, key, and provider issues quickly.",
  },
];

const testimonials = [
  {
    quote:
      "CyberMind CLI shortened my recon-to-validation loop because the install flow, key management, and shell all feel like one product.",
    name: "R. Mehta",
    role: "Independent security researcher",
  },
  {
    quote:
      "The dashboard is restrained in the right way. I can copy keys, rotate them, and get back to the terminal without wrestling a SaaS control panel.",
    name: "A. Rodrigues",
    role: "Red team operator",
  },
  {
    quote:
      "The install page and platform-aware commands make onboarding cleaner for teams that mix Kali, Windows, and macOS machines.",
    name: "S. Khan",
    role: "Security engineering lead",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <section className="surface-shell relative overflow-hidden rounded-[40px] px-6 py-8 md:px-8 md:py-10 xl:px-10 xl:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.12),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(138,43,226,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(0,255,255,0.08),transparent_32%)]" />
          <div className="absolute inset-0 cm-grid-bg opacity-30" />
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[rgba(0,255,255,0.08)] blur-3xl animate-pulse" />
          <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-[rgba(138,43,226,0.14)] blur-3xl animate-pulse" />
          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_30rem] xl:items-center">
            <div className="min-w-0 xl:pr-4">
              <HeroWordmark />
              <p className="mt-8 cm-label text-[var(--accent-cyan)]">Official CyberMind CLI experience</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                CyberMind CLI turns recon, hunt, and AI chat into one command surface.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
                Sign up, generate a key, install on your platform, and move into a terminal-native workflow that stays clear about Linux-only offensive modes and cross-platform AI chat.
              </p>
              <CommandBar
                command="curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key sk_live_cm_xxxxxxxxxxxxxxxx"
                className="mt-8 max-w-3xl"
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth/register" className="cm-button-primary gap-2">
                  Start free
                  <ArrowRight size={16} />
                </Link>
                <Link href="/install" className="cm-button-secondary">
                  Install CyberMind CLI
                </Link>
              </div>
            </div>

            <div className="min-w-0 xl:pl-2">
              <CyberMindTerminal />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {socialProof.map((item) => (
            <div key={item.label} className="cm-card-soft p-5 text-center md:text-left">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="cm-card p-6">
                <div className="mb-5 inline-flex rounded-2xl border border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.14)] p-3 text-[var(--accent-cyan)]">
                  <Icon size={18} />
                </div>
                <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{card.body}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Three steps from account to shell</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="cm-card-soft p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-cyan)]">0{index + 1}</p>
                  <div className="mt-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">Clear docs</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              The docs are now organized around what you actually need to do.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              Start with install and command basics, then move into recon, hunt, privacy, troubleshooting, or release notes only when you need them.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {routeHighlights.map((item) => (
                <LinkCard key={item.href} {...item} />
              ))}
            </div>
          </div>

          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">Pricing teaser</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Start free, upgrade when ready</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
              Free gets you into the product fast. Pro unlocks the full recon and hunt stack. Elite adds persistence, reporting, and full mode coverage.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["Free", "$0/mo", "20 requests/day"],
                ["Pro", "$9/mo", "200 requests/day"],
                ["Elite", "$29/mo", "Unlimited + Abhimanyu"],
              ].map((item) => (
                <div key={item[0]} className="cm-card-soft flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-base font-semibold text-white">{item[0]}</p>
                    <p className="mt-1 text-sm text-[var(--text-soft)]">{item[2]}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">{item[1]}</p>
                </div>
              ))}
            </div>
            <Link href="/plans" className="cm-button-primary mt-6">
              Compare all plans
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="cm-card p-6">
              <p className="text-base leading-8 text-white">“{item.quote}”</p>
              <div className="mt-6 border-t border-white/8 pt-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-[var(--text-soft)]">{item.role}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="linear-shell rounded-[36px] p-7 text-center md:p-10">
          <p className="cm-label">Final CTA</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
            Start your free account
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
            Create an account, copy your live key, and launch CyberMind CLI with a command that already matches your platform and plan.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/auth/register" className="cm-button-primary gap-2">
              Start your free account
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="cm-button-secondary">
              View dashboard preview
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
