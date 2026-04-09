"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Accordion from "@/components/Accordion";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { openRazorpayCheckout, waitForPlanUpgrade, type RazorpayPlan } from "@/lib/razorpay";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

const plans = [
  {
    id: "free" as const,
    name: "Free",
    monthlyINR: "₹0",
    annualINR: "₹0",
    monthlyUSD: "$0",
    annualUSD: "$0",
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
    id: "pro" as const,
    name: "Pro",
    monthlyINR: "₹749",
    annualINR: "₹7,490",
    monthlyUSD: "$9",
    annualUSD: "$90",
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
    id: "elite" as const,
    name: "Elite",
    monthlyINR: "₹2,399",
    annualINR: "₹23,990",
    monthlyUSD: "$29",
    annualUSD: "$290",
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
  ["AI chat", "✓", "✓", "✓"],
  ["Recon tools", "5", "20", "20"],
  ["Hunt workflow", "—", "Full", "Full"],
  ["Abhimanyu", "—", "—", "✓"],
  ["Reports", "Basic logs", "CLI export", "PDF reports"],
  ["Devices", "1", "3", "Unlimited"],
  ["Support", "Community", "Email", "Priority"],
];

const faqs = [
  {
    title: "Can I start free and upgrade later?",
    body: "Yes. Sign up free, generate your API key, and upgrade from the plans page or dashboard billing at any time.",
  },
  {
    title: "What currency is used for payment?",
    body: "Payments are processed in INR (Indian Rupees) via Razorpay. USD prices shown are approximate equivalents.",
  },
  {
    title: "What happens after payment?",
    body: "Your plan upgrades automatically within seconds. The Razorpay webhook notifies our backend, which upgrades your account. Your CLI will reflect the new plan on the next request.",
  },
  {
    title: "Is my payment secure?",
    body: "Yes. Payments are processed entirely by Razorpay — we never see your card details. Our backend verifies every webhook with HMAC-SHA256 signature validation.",
  },
  {
    title: "What if my payment fails?",
    body: "Your plan will not change. You can retry at any time. If you were charged but the plan did not upgrade, contact support@cybermind.thecnical.dev with your payment ID.",
  },
  {
    title: "Does every plan work on every OS?",
    body: "Core chat and account features work everywhere. The deepest automated recon, hunt, and Abhimanyu paths are Linux/Kali only.",
  },
];

type CheckoutState =
  | { status: "idle" }
  | { status: "loading"; plan: RazorpayPlan }
  | { status: "polling"; plan: RazorpayPlan }
  | { status: "success"; plan: RazorpayPlan }
  | { status: "error"; message: string };

export default function PlansPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });
  const [loginModal, setLoginModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<RazorpayPlan | null>(null);

  const currentPlan = profile?.plan || "free";

  const handleUpgrade = useCallback(async (planId: RazorpayPlan) => {
    // Not logged in — prompt login first
    if (!user || !profile) {
      setPendingPlan(planId);
      setLoginModal(true);
      return;
    }

    // Already on this plan
    if (currentPlan === planId) return;

    setCheckout({ status: "loading", plan: planId });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setCheckout({ status: "error", message: "Session expired. Please log in again." });
        return;
      }

      await openRazorpayCheckout({
        userId: user.id,
        email: user.email ?? "",
        plan: planId,
        annual,
        onSuccess: async () => {
          setCheckout({ status: "polling", plan: planId });
          // Poll until webhook processes and plan updates
          const token2 = (await supabase.auth.getSession()).data.session?.access_token ?? "";
          const upgraded = await waitForPlanUpgrade(planId, BACKEND_URL, token2);
          if (upgraded) {
            await refreshProfile();
            setCheckout({ status: "success", plan: planId });
          } else {
            // Webhook may still be processing — refresh profile anyway
            await refreshProfile();
            setCheckout({
              status: "error",
              message: "Payment received! Plan upgrade may take a moment. Refresh the page if your plan hasn't updated.",
            });
          }
        },
        onFailure: (reason) => {
          setCheckout({ status: "error", message: reason });
        },
      });

      // If user closed the modal without paying, reset
      if (checkout.status === "loading") {
        setCheckout({ status: "idle" });
      }
    } catch (err) {
      setCheckout({
        status: "error",
        message: err instanceof Error ? err.message : "Checkout failed. Please try again.",
      });
    }
  }, [user, profile, currentPlan, annual, refreshProfile, checkout.status]);

  const isLoading = (planId: string) =>
    (checkout.status === "loading" || checkout.status === "polling") &&
    checkout.plan === planId;

  const resetCheckout = () => setCheckout({ status: "idle" });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
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
              <button type="button" onClick={() => setAnnual(false)}
                className={cn("rounded-full px-4 py-2 text-sm transition-colors", !annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}>
                Monthly
              </button>
              <button type="button" onClick={() => setAnnual(true)}
                className={cn("rounded-full px-4 py-2 text-sm transition-colors", annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}>
                Annual <span className="text-[#00FF88] text-xs ml-1">save 17%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Global checkout status banner */}
        {checkout.status === "polling" && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 px-5 py-4">
            <Loader2 size={18} className="animate-spin text-[var(--accent-cyan)]" />
            <p className="text-sm text-white">Payment received — confirming your plan upgrade...</p>
          </div>
        )}
        {checkout.status === "success" && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#00FF88]/30 bg-[#00FF88]/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#00FF88]" />
              <p className="text-sm text-white">
                Plan upgraded to <span className="font-semibold capitalize">{checkout.plan}</span>. Your CLI will use the new limits on the next request.
              </p>
            </div>
            <button onClick={resetCheckout} className="text-xs text-[var(--text-muted)] hover:text-white">dismiss</button>
          </div>
        )}
        {checkout.status === "error" && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-[#FF4444]" />
              <p className="text-sm text-white">{checkout.message}</p>
            </div>
            <button onClick={resetCheckout} className="text-xs text-[var(--text-muted)] hover:text-white">dismiss</button>
          </div>
        )}

        {/* Plan cards */}
        <section className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan) => {
            const highlighted = plan.id === "pro";
            const isCurrent = currentPlan === plan.id;
            const loading = isLoading(plan.id);
            const price = annual ? plan.annualINR : plan.monthlyINR;
            const period = annual ? "/ year" : "/ month";

            return (
              <div key={plan.id}
                className={cn(
                  "cm-spotlight-card relative overflow-hidden rounded-[32px] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)]",
                  highlighted
                    ? "border-[var(--accent-cyan)]/30 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                    : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
                  isCurrent && "ring-1 ring-[var(--accent-cyan)]/20"
                )}>
                {highlighted && <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.85),transparent)]" />}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="cm-label">{plan.name}</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">{price}</h2>
                    <p className="mt-1 text-sm text-[var(--text-soft)]">{period}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {highlighted && <StatusBadge label="Most popular" tone="accent" />}
                    {isCurrent && <StatusBadge label="Current plan" tone="success" />}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-[var(--text-soft)]">{plan.description}</p>

                <ul className="mt-6 space-y-3 text-sm text-[var(--text-main)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-[#00FF88]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-3">
                  {plan.id === "free" ? (
                    <Link href="/auth/register"
                      className={highlighted ? "cm-button-primary w-full text-center" : "cm-button-secondary w-full text-center"}>
                      Get started free
                    </Link>
                  ) : isCurrent ? (
                    <div className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-[var(--text-muted)]">
                      Current plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading || checkout.status === "polling"}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-60",
                        highlighted
                          ? "border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-white hover:bg-[var(--accent-cyan)]/20"
                          : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                      )}>
                      {loading ? (
                        <><Loader2 size={14} className="animate-spin" /> Processing...</>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  )}
                  <p className="text-center text-xs text-[var(--text-muted)]">
                    {plan.id === "free" ? "1 device · No credit card" :
                     plan.id === "pro" ? "3 devices · Secure checkout via Razorpay" :
                     "Unlimited devices · Secure checkout via Razorpay"}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Comparison table */}
        <section className="cm-card p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="cm-label">Compare tiers</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Feature comparison</h2>
            </div>
            {annual && <StatusBadge label="Annual: save 17%" tone="success" />}
          </div>
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[760px] overflow-hidden rounded-[24px] border border-white/8">
              <div className="grid grid-cols-4 bg-white/[0.04] px-5 py-4 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                <span>Feature</span><span>Free</span><span>Pro</span><span>Elite</span>
              </div>
              {comparisonRows.map((row) => (
                <div key={row[0]} className="grid grid-cols-4 border-t border-white/8 px-5 py-4 text-sm text-[var(--text-soft)]">
                  {row.map((cell, i) => (
                    <span key={`${row[0]}-${i}`} className={i === 0 ? "font-medium text-white" : undefined}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA + FAQ */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Start free, upgrade when ready.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
              Sign up now to generate your first API key, personalize the install command, and move into the dashboard immediately.
            </p>
            <Link href="/auth/register" className="cm-button-primary mt-6 inline-block">
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

        {/* Security note */}
        <section className="rounded-[24px] border border-white/8 bg-white/[0.02] px-6 py-5">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-soft)]">
            <span className="text-[#00FF88]">🔒 Secure payments</span>
            <span>Powered by Razorpay · HMAC-verified webhooks · No card data stored by CyberMind</span>
            <Link href="/privacy" className="text-[var(--accent-cyan)] hover:underline ml-auto">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--accent-cyan)] hover:underline">Terms of Service</Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* Login required modal */}
      <Modal open={loginModal} onClose={() => setLoginModal(false)} title="Sign in to upgrade">
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--text-soft)]">
            You need to be signed in to upgrade to the{" "}
            <span className="capitalize text-white">{pendingPlan}</span> plan.
          </p>
          <div className="grid gap-3">
            <Link href={`/auth/login?redirect=/plans`}
              className="cm-button-primary w-full text-center"
              onClick={() => setLoginModal(false)}>
              Sign in
            </Link>
            <Link href={`/auth/register?plan=${pendingPlan}`}
              className="cm-button-secondary w-full text-center"
              onClick={() => setLoginModal(false)}>
              Create account
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
