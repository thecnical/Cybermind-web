"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { PLAN_PRICES, UserPlan } from "@/lib/supabase";

const plans: { id: UserPlan; name: string; features: string[]; devices: string }[] = [
  {
    id: "free",
    name: "Free",
    features: ["20 requests/day", "AI chat only", "5 recon tools", "Community support"],
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

export default function BillingPage() {
  const { profile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const currentPlan = (profile?.plan || "free") as UserPlan;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Billing</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Manage your plan and subscription</p>
      </section>

      {/* Current plan */}
      <section className="cm-card-soft p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="cm-label">Current plan</p>
            <p className="mt-2 text-2xl font-semibold text-white capitalize">{currentPlan}</p>
            <p className="text-sm text-[var(--text-soft)] mt-1">
              {currentPlan === "free" ? "Free forever" :
               currentPlan === "pro" ? "$9/month" : "$29/month"}
            </p>
          </div>
          {currentPlan === "free" && (
            <Link href="/plans" className="cm-button-primary text-sm gap-2">
              Upgrade plan <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </section>

      {/* Billing toggle */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-[var(--text-soft)]">Billing cycle:</p>
        <div className="flex rounded-2xl border border-white/10 overflow-hidden">
          <button onClick={() => setAnnual(false)}
            className={`px-4 py-2 text-sm transition-colors ${!annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            Monthly
          </button>
          <button onClick={() => setAnnual(true)}
            className={`px-4 py-2 text-sm transition-colors ${annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            Annual <span className="text-[#00FF88] text-xs ml-1">-20%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {plans.map(plan => {
          const price = annual ? PLAN_PRICES[plan.id].annual : PLAN_PRICES[plan.id].monthly;
          const isCurrent = plan.id === currentPlan;
          const isPro = plan.id === "pro";
          return (
            <div key={plan.id}
              className={`rounded-[28px] border p-6 ${isPro ? "border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5" : "border-white/8 bg-white/[0.03]"}`}>
              <p className="cm-label">{plan.name}</p>
              <p className="text-3xl font-semibold text-white mt-2">
                {price === 0 ? "Free" : `$${price}`}
                {price > 0 && <span className="text-sm font-normal text-[var(--text-soft)]">/mo</span>}
              </p>
              <p className="text-xs text-[var(--accent-cyan)] mt-1">{plan.devices}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                    <Check size={14} className="text-[#00FF88] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="mt-6 rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-[var(--text-muted)]">
                  Current plan
                </div>
              ) : (
                <Link href="/plans"
                  className={`mt-6 block rounded-2xl px-4 py-3 text-center text-sm font-medium transition-colors ${isPro ? "border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-white hover:bg-[var(--accent-cyan)]/20" : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}>
                  {plan.id === "free" ? "Downgrade" : "Upgrade"}
                </Link>
              )}
            </div>
          );
        })}
      </section>

      {/* Stripe coming soon */}
      <section className="cm-card-soft p-5">
        <p className="cm-label mb-2">Payment method</p>
        <div className="rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/5 px-4 py-3">
          <p className="text-sm text-[#FFD700]">⚡ Stripe payment integration coming soon.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            To upgrade manually, contact: <a href="mailto:support@cybermind.thecnical.dev" className="text-[var(--accent-cyan)] hover:underline">support@cybermind.thecnical.dev</a>
          </p>
        </div>
      </section>
    </div>
  );
}
