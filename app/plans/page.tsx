"use client";

import Link from "next/link";
import { useState } from "react";
import Accordion from "@/components/Accordion";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    monthly: "$0",
    annual: "$0",
    description: "Prompt-first access for trying CyberMind CLI before you commit to the full operator workflow.",
    features: [
      "20 requests/day",
      "AI chat only",
      "5 recon tools",
      "No hunt or Abhimanyu",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: "$9",
    annual: "$90",
    description: "The main working tier for serious research with full recon, full hunt, and faster backend routing.",
    features: [
      "200 requests/day",
      "Full 20-tool recon",
      "Full 11-tool hunt",
      "Priority backend",
      "Email support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    monthly: "$29",
    annual: "$290",
    description: "Unlimited CLI usage with persistence, reports, early access, and the complete CyberMind mode stack.",
    features: [
      "Unlimited requests",
      "All modes including Abhimanyu",
      "Session persistence",
      "PDF reports",
      "Priority support + early access",
    ],
  },
] as const;

const comparisonRows = [
  ["Requests", "20/day", "200/day", "Unlimited"],
  ["AI chat", "Included", "Included", "Included"],
  ["Recon tools", "5", "20", "20"],
  ["Hunt workflow", "Not included", "Full", "Full"],
  ["Abhimanyu", "Not included", "Not included", "Included"],
  ["Reports", "Basic logs", "CLI export", "PDF reports"],
  ["Support", "Community", "Email", "Priority"],
];

const faqs = [
  {
    title: "Can I start free and upgrade later?",
    body: "Yes. The signup flow keeps the free tier as the default and lets you move to Pro or Elite later from billing or the plans page.",
  },
  {
    title: "What changes when I switch to annual billing?",
    body: "Annual billing prices the paid plans at ten months of service, which effectively gives you two months free compared with month-to-month pricing.",
  },
  {
    title: "Does every plan work on every operating system?",
    body: "Core chat and account features work everywhere. The deepest automated recon, hunt, and Abhimanyu paths remain strongest on Kali/Linux, matching the underlying product workflow.",
  },
  {
    title: "Is checkout live?",
    body: "Not yet. The UI is prepared for Stripe, but the current checkout buttons intentionally stop at a placeholder state.",
  },
];

export default function PlansPage() {
  const [annual, setAnnual] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <section className="linear-shell rounded-[36px] p-7 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cm-label">Commercial plans</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                Start free, then scale into the full CyberMind CLI workflow.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
                Choose the account tier that matches your request volume, recon depth, hunt coverage, and reporting needs.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn("rounded-full px-4 py-2 text-sm transition-colors", !annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn("rounded-full px-4 py-2 text-sm transition-colors", annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}
              >
                Annual
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan) => {
            const highlighted = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={cn(
                  "cm-spotlight-card relative overflow-hidden rounded-[32px] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)]",
                  highlighted
                    ? "border-[var(--accent-cyan)]/30 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                    : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
                )}
              >
                {highlighted ? <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.85),transparent)]" /> : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="cm-label">{plan.name}</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">{annual ? plan.annual : plan.monthly}</h2>
                    <p className="mt-1 text-sm text-[var(--text-soft)]">{annual ? "/ year" : "/ month"}</p>
                  </div>
                  {highlighted ? <StatusBadge label="Most popular" tone="accent" /> : null}
                </div>
                <p className="mt-5 text-sm leading-7 text-[var(--text-soft)]">{plan.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--text-main)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid gap-3">
                  <Link
                    href={plan.id === "free"
                      ? "/auth/register"
                      : plan.id === "elite"
                      ? "/auth/register?plan=elite"
                      : `/auth/register?plan=${plan.id}`}
                    className={highlighted ? "cm-button-primary w-full text-center" : "cm-button-secondary w-full text-center"}
                  >
                    {plan.id === "free" ? "Get started free" :
                     plan.id === "elite" ? "Get Elite — instant key" :
                     `Choose ${plan.name}`}
                  </Link>
                  {plan.id !== "free" ? (
                    <button type="button" onClick={() => setCheckoutPlan(plan.name)} className="cm-button-secondary w-full">
                      Upgrade existing account
                    </button>
                  ) : null}
                  <p className="text-center text-xs text-[var(--text-muted)]">
                    {plan.id === "free" ? "1 device · No credit card" :
                     plan.id === "pro" ? "3 devices · Select device on signup" :
                     "Unlimited devices · Key auto-generated"}
                  </p>
                </div>              </div>
            );
          })}
        </section>

        <section className="cm-card p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="cm-label">Compare tiers</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Feature comparison</h2>
            </div>
            {annual ? <StatusBadge label="2 months free" tone="success" /> : null}
          </div>
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[760px] overflow-hidden rounded-[24px] border border-white/8">
              <div className="grid grid-cols-4 bg-white/[0.04] px-5 py-4 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                <span>Feature</span>
                <span>Free</span>
                <span>Pro</span>
                <span>Elite</span>
              </div>
              {comparisonRows.map((row) => (
                <div key={row[0]} className="grid grid-cols-4 border-t border-white/8 px-5 py-4 text-sm text-[var(--text-soft)]">
                  {row.map((cell, index) => (
                    <span key={`${row[0]}-${index}`} className={index === 0 ? "font-medium text-white" : undefined}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Start free, upgrade when ready.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
              Sign up now to generate your first API key, personalize the install command, and move into the dashboard immediately.
            </p>
            <Link href="/auth/register" className="cm-button-primary mt-6">
              Start your free account
            </Link>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="cm-label">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Common plan questions</h2>
            </div>
            <Accordion items={faqs} />
          </div>
        </section>
      </main>
      <Footer />

      <Modal open={Boolean(checkoutPlan)} onClose={() => setCheckoutPlan(null)} title="Stripe checkout placeholder">
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--text-soft)]">
            Checkout for the <span className="text-white">{checkoutPlan}</span> plan is reserved for Stripe integration. The UI is ready; the payment flow is intentionally stubbed.
          </p>
          <button type="button" onClick={() => setCheckoutPlan(null)} className="cm-button-primary w-full">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
