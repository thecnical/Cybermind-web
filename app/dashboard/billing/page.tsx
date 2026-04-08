"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { PLAN_PRICES, UserPlan } from "@/lib/supabase";

const plans: { id: UserPlan; name: string; features: string[] }[] = [
  {
    id: "free",
    name: "Free",
    features: ["20 requests/day", "AI chat only", "5 recon tools", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    features: ["200 requests/day", "Full 20-tool recon", "Full 11-tool hunt", "Priority backend", "Email support"],
  },
  {
    id: "elite",
    name: "Elite",
    features: ["Unlimited requests", "All modes + Abhimanyu", "Session persistence", "PDF reports", "Priority support", "Early access"],
  },
];

export default function BillingPage() {
  const { profile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const currentPlan = profile?.plan || "free";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Billing</h1>
        <p className="text-[var(--text-soft)] mt-1">Manage your plan and subscription</p>
      </div>

      {/* Current plan */}
      <div className="rounded-[24px] border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 p-5 mb-8">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-[var(--accent-cyan)]" />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Current Plan</p>
            <p className="text-lg font-semibold text-white capitalize">{currentPlan}</p>
          </div>
          {currentPlan === "free" && (
            <a href="#upgrade" className="ml-auto text-sm text-[var(--accent-cyan)] hover:underline">Upgrade →</a>
          )}
        </div>
      </div>

      {/* Billing toggle */}
      <div id="upgrade" className="flex items-center gap-4 mb-6">
        <p className="text-sm text-[var(--text-soft)]">Billing cycle:</p>
        <div className="flex rounded-2xl border border-white/10 overflow-hidden">
          <button onClick={() => setAnnual(false)} className={`px-4 py-2 text-sm transition-colors ${!annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-2 text-sm transition-colors ${annual ? "bg-white/8 text-white" : "text-[var(--text-soft)]"}`}>
            Annual <span className="text-[#00FF88] text-xs ml-1">-20%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {plans.map(plan => {
          const price = annual ? PLAN_PRICES[plan.id].annual : PLAN_PRICES[plan.id].monthly;
          const isCurrent = plan.id === currentPlan;
          const isPro = plan.id === "pro";
          return (
            <div key={plan.id} className={`rounded-[28px] border p-6 ${isPro ? "border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5" : "border-white/8 bg-white/[0.03]"}`}>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{plan.name}</p>
              <p className="text-3xl font-semibold text-white mt-2">
                {price === 0 ? "Free" : `$${price}`}
                {price > 0 && <span className="text-sm font-normal text-[var(--text-soft)]">/mo</span>}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                    <Check size={14} className="text-[#00FF88] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled={isCurrent} className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${isCurrent ? "border border-white/10 text-[var(--text-muted)] cursor-default" : isPro ? "border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-white hover:bg-[var(--accent-cyan)]/20" : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}>
                {isCurrent ? "Current plan" : plan.id === "free" ? "Downgrade" : "Upgrade — Coming soon"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center">Stripe payment integration coming soon. Contact support to upgrade manually.</p>
    </div>
  );
}
