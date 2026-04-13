"use client";

import { useState, useCallback } from "react";
import { Check, Loader2, AlertCircle, CheckCircle2, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { PLAN_PRICES, UserPlan } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { startStripeCheckout, waitForPlanUpgrade, type StripePlan } from "@/lib/stripe";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

const plans: { id: UserPlan; name: string; features: string[]; devices: string }[] = [
  {
    id: "free",
    name: "Free",
    features: ["20 req/day", "AI chat on all devices", "Basic scan & exploit guides"],
    devices: "1 device",
  },
  {
    id: "pro",
    name: "Pro",
    features: ["200 requests/day", "Full 20-tool recon", "Full 11-tool hunt", "Priority backend", "Email support"],
    devices: "3 devices",
  },
  {
    id: "elite",
    name: "Elite",
    features: ["Unlimited requests", "All modes + Abhimanyu", "Session persistence", "PDF reports", "Priority support"],
    devices: "Unlimited devices",
  },
];

type CheckoutState =
  | { status: "idle" }
  | { status: "loading"; plan: StripePlan }
  | { status: "success"; plan: StripePlan }
  | { status: "error"; message: string };

export default function BillingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });
  const currentPlan = (profile?.plan || "free") as UserPlan;

  const handleUpgrade = useCallback(async (planId: StripePlan) => {
    if (!user || !profile) return;
    if (currentPlan === planId) return;

    setCheckout({ status: "loading", plan: planId });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setCheckout({ status: "error", message: "Session expired. Please log in again." });
        return;
      }

      // Redirect to Stripe checkout — handles UPI, cards, netbanking
      await startStripeCheckout({
        plan:     planId,
        billing:  annual ? "annual" : "monthly",
        currency: currency,
        apiKey:   token,
        email:    user.email ?? "",
      });
      // User is redirected to Stripe — code below won't run
    } catch (err) {
      setCheckout({
        status: "error",
        message: err instanceof Error ? err.message : "Checkout failed. Please try again.",
      });
    }
  }, [user, profile, currentPlan, annual, currency, refreshProfile]);

  const isLoading = (planId: string) =>
    checkout.status === "loading" && checkout.plan === planId;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Billing</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Manage your plan and subscription</p>
      </section>

      {/* Status banners */}
      {checkout.status === "success" && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#00FF88]/30 bg-[#00FF88]/5 px-5 py-4">
          <CheckCircle2 size={18} className="text-[#00FF88]" />
          <p className="text-sm text-white">
            Plan upgraded to <span className="font-semibold capitalize">{checkout.plan}</span>!
          </p>
        </div>
      )}
      {checkout.status === "error" && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-[#FF4444]" />
            <p className="text-sm text-white">{checkout.message}</p>
          </div>
          <button onClick={() => setCheckout({ status: "idle" })} className="text-xs text-[var(--text-muted)] hover:text-white">dismiss</button>
        </div>
      )}

      {/* Current plan */}
      <section className="cm-card-soft p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="cm-label">Current plan</p>
            <p className="mt-2 text-2xl font-semibold text-white capitalize">{currentPlan}</p>
          </div>
          <Link href="/plans" className="cm-button-secondary text-sm gap-2">
            View all plans <ExternalLink size={14} />
          </Link>
        </div>
      </section>

      {/* Currency + Billing toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-2xl border border-white/10 overflow-hidden">
          <button onClick={() => setCurrency("inr")}
            className={`px-3 py-2 text-xs transition-colors ${currency === "inr" ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            🇮🇳 INR
          </button>
          <button onClick={() => setCurrency("usd")}
            className={`px-3 py-2 text-xs transition-colors ${currency === "usd" ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            🌍 USD
          </button>
        </div>
        <div className="flex rounded-2xl border border-white/10 overflow-hidden">
          <button onClick={() => setAnnual(false)}
            className={`px-4 py-2 text-sm transition-colors ${!annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            Monthly
          </button>
          <button onClick={() => setAnnual(true)}
            className={`px-4 py-2 text-sm transition-colors ${annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            Annual <span className="text-[#00FF88] text-xs ml-1">save 17%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {plans.map(plan => {
          const priceINR = annual
            ? (plan.id === "free" ? "₹0" : plan.id === "pro" ? "₹9,990/yr" : "₹23,990/yr")
            : (plan.id === "free" ? "₹0" : plan.id === "pro" ? "₹1,149/mo" : "₹2,399/mo");
          const priceUSD = annual
            ? (plan.id === "free" ? "$0" : plan.id === "pro" ? "$120/yr" : "$290/yr")
            : (plan.id === "free" ? "$0" : plan.id === "pro" ? "$14/mo" : "$29/mo");
          const price = currency === "inr" ? priceINR : priceUSD;
          const isCurrent = plan.id === currentPlan;
          const isPro = plan.id === "pro";
          const loading = isLoading(plan.id);

          return (
            <div key={plan.id}
              className={`rounded-[28px] border p-6 flex flex-col ${isPro ? "border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5" : "border-white/8 bg-white/[0.03]"}`}>
              <p className="cm-label">{plan.name}</p>
              <p className="text-2xl font-semibold text-white mt-2">{price}</p>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                    <Check size={14} className="text-[#00FF88] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <div className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-[var(--text-muted)]">
                    Current plan
                  </div>
                ) : plan.id === "free" ? (
                  <div className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-[var(--text-muted)]">
                    Downgrade via support
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpgrade(plan.id as StripePlan)}
                      disabled={loading}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-60 ${isPro ? "border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-white hover:bg-[var(--accent-cyan)]/20" : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}>
                      {loading
                        ? <><Loader2 size={14} className="animate-spin" /> Redirecting...</>
                        : currency === "inr"
                        ? <>Pay with UPI / Card <span className="text-[10px] opacity-50">→ Stripe</span></>
                        : <>Pay with Card <span className="text-[10px] opacity-50">→ Stripe</span></>
                      }
                    </button>
                    {currency === "inr" && (
                      <p className="text-center text-[10px] text-[var(--text-muted)] mt-1">
                        UPI · Cards · Netbanking · Wallets
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Security note */}
      <section className="cm-card-soft p-4">
        <p className="text-xs text-[var(--text-muted)] flex flex-wrap items-center gap-2">
          <span>🔒 Payments via Stripe — UPI, Cards, Netbanking supported.</span>
          <Globe size={11} className="inline" />
          <span>Available worldwide.</span>
          <span>CyberMind never stores card details.</span>
          <a href="mailto:support@cybermind.thecnical.dev" className="text-[var(--accent-cyan)] hover:underline">support@cybermind.thecnical.dev</a>
        </p>
      </section>
    </div>
  );
}
