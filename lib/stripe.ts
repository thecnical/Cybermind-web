/**
 * Stripe checkout integration — replaces Razorpay
 *
 * Supports:
 *  - UPI (Indian users — Stripe shows UPI automatically for INR)
 *  - Cards (international)
 *  - Netbanking, Wallets (India)
 *
 * Flow:
 *  1. User clicks "Upgrade"
 *  2. Frontend calls POST /payment/create-session → gets Stripe checkout URL
 *  3. User redirected to Stripe hosted checkout (handles UPI/card/netbanking)
 *  4. On success, Stripe fires webhook → backend upgrades plan
 *  5. User redirected to /dashboard?payment=success
 *  6. Dashboard polls until plan updates
 */

export type StripePlan = "starter" | "pro" | "elite";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

export interface CheckoutOptions {
  plan: StripePlan;
  billing: "monthly" | "annual";
  currency: "inr" | "usd";
  apiKey: string;
  email: string;
}

/**
 * Create a Stripe checkout session and redirect user to Stripe's hosted page.
 * Stripe handles UPI, cards, netbanking automatically based on currency + location.
 */
export async function startStripeCheckout(opts: CheckoutOptions): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/payment/create-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": opts.apiKey,
    },
    body: JSON.stringify({
      plan:     opts.plan,
      billing:  opts.billing,
      currency: opts.currency,
      email:    opts.email,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create payment session");
  }

  // Redirect to Stripe hosted checkout
  // Stripe handles UPI QR, card form, netbanking — all in one page
  if (data.url) {
    window.location.href = data.url;
  } else {
    throw new Error("No checkout URL returned");
  }
}

/**
 * Poll backend until plan matches expected value.
 * Called after returning from Stripe success redirect.
 */
export async function waitForPlanUpgrade(
  expectedPlan: StripePlan,
  backendUrl: string,
  token: string,
  maxWaitMs = 20000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const res = await fetch(`${backendUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.profile?.plan === expectedPlan) return true;
    } catch {
      // network hiccup — keep polling
    }
  }
  return false;
}

// Plan display info
export const PLAN_INFO: Record<StripePlan, {
  nameINR: string; nameUSD: string;
  monthlyINR: string; annualINR: string;
  monthlyUSD: string; annualUSD: string;
}> = {
  starter: {
    nameINR: "₹85/mo",   nameUSD: "$4/mo",
    monthlyINR: "₹85",   annualINR: "₹850/yr",
    monthlyUSD: "$4",    annualUSD: "$40/yr",
  },
  pro: {
    nameINR: "₹1,149/mo", nameUSD: "$14/mo",
    monthlyINR: "₹1,149", annualINR: "₹9,990/yr",
    monthlyUSD: "$14",    annualUSD: "$120/yr",
  },
  elite: {
    nameINR: "₹2,399/mo", nameUSD: "$29/mo",
    monthlyINR: "₹2,399", annualINR: "₹23,990/yr",
    monthlyUSD: "$29",    annualUSD: "$290/yr",
  },
};
