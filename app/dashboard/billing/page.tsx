"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useAuth } from "@/components/AuthProvider";
import { planDetails, mockInvoices } from "@/lib/mockData";

const planOrder = ["free", "pro", "elite"] as const;

export default function BillingPage() {
  const { profile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const currentPlan = profile?.plan ?? "free";
  const priceLabel = useMemo(
    () =>
      planOrder.reduce<Record<string, string>>((acc, tier) => {
        const details = planDetails[tier];
        acc[tier] = annual ? details.priceAnnual : details.priceMonthly;
        return acc;
      }, {}),
    [annual],
  );

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <section className="cm-card p-6 md:p-8">
        <p className="cm-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Billing</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Current plan: <span className="uppercase text-[var(--accent-cyan)]">{currentPlan}</span></p>
      </section>

      <section className="cm-card-soft flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-[var(--text-soft)]">Billing cycle</p>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button type="button" onClick={() => setAnnual(false)} className={`rounded-lg px-4 py-2 text-sm ${!annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]"}`}>
            Monthly
          </button>
          <button type="button" onClick={() => setAnnual(true)} className={`rounded-lg px-4 py-2 text-sm ${annual ? "bg-white/10 text-white" : "text-[var(--text-soft)]"}`}>
            Annual (2 months free)
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {planOrder.map((tier) => {
          const details = planDetails[tier];
          const featured = tier === "pro";
          return (
            <div key={tier} className={`cm-spotlight-card rounded-[30px] border p-5 ${featured ? "border-[var(--accent-cyan)]/35 bg-[rgba(0,255,255,0.08)]" : "border-white/8 bg-white/[0.03]"}`}>
              <p className="cm-label">{details.name}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{priceLabel[tier]}</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">{tier === "free" ? "" : annual ? "/ year" : "/ month"}</p>
              <ul className="mt-4 grid gap-2">
                {details.features.map((feature) => (
                  <li key={feature} className="text-sm text-[var(--text-soft)]">• {feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={featured ? "cm-button-primary mt-5 w-full" : "cm-button-secondary mt-5 w-full"}
                onClick={() => (tier === currentPlan ? undefined : setCheckoutPlan(details.name))}
                disabled={tier === currentPlan}
              >
                {tier === currentPlan ? "Current plan" : `Upgrade to ${details.name}`}
              </button>
            </div>
          );
        })}
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Payment method</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Visa ending in •••• 4242</p>
      </section>

      <section className="cm-card p-6">
        <h2 className="text-xl font-semibold text-white">Invoice history</h2>
        <div className="mt-4 grid gap-3">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm">
              <span className="text-white">{invoice.date}</span>
              <span className="text-[var(--text-soft)]">{invoice.amount}</span>
              <span className="cm-pill">{invoice.status}</span>
              <Link href="#" className="text-[var(--accent-cyan)]">Download PDF</Link>
            </div>
          ))}
        </div>
        <button type="button" className="mt-5 text-sm text-[var(--error)]">Cancel subscription</button>
      </section>

      <Modal open={Boolean(checkoutPlan)} onClose={() => setCheckoutPlan(null)} title="Checkout placeholder">
        <p className="text-sm leading-7 text-[var(--text-soft)]">
          {checkoutPlan} checkout is a Stripe placeholder right now. Flow is intentionally UI-only.
        </p>
      </Modal>
    </div>
  );
}

