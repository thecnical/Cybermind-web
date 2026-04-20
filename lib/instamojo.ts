/**
 * Instamojo payment integration — India-friendly, accepts individuals
 *
 * Advantages:
 * - No company registration needed (just PAN + Aadhaar + bank)
 * - Instant approval (usually)
 * - UPI, cards, netbanking, wallets
 * - Lower fees than Razorpay for small sellers
 *
 * Flow:
 * 1. User clicks "Pay with Instamojo"
 * 2. Frontend calls POST /instamojo/create-payment → gets payment URL
 * 3. User redirected to Instamojo (handles UPI/card/netbanking)
 * 4. Webhook fires → backend upgrades plan
 * 5. User redirected to /dashboard?payment=success
 */

export type InstamojoPlan = "starter" | "pro" | "elite";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

export interface InstamojoCheckoutOptions {
  plan: InstamojoPlan;
  billing: "monthly" | "annual";
  apiKey: string;
}

/**
 * Create an Instamojo payment and redirect user to Instamojo's hosted page.
 * Instamojo handles UPI, cards, netbanking, wallets automatically.
 */
export async function startInstamojoCheckout(opts: InstamojoCheckoutOptions): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/instamojo/create-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": opts.apiKey,
    },
    body: JSON.stringify({
      plan: opts.plan,
      billing: opts.billing,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create payment");
  }

  // Redirect to Instamojo hosted checkout
  if (data.payment_url) {
    window.location.href = data.payment_url;
  } else {
    throw new Error("No payment URL returned");
  }
}

/**
 * Poll backend until plan matches expected value.
 * Called after returning from Instamojo success redirect.
 */
export async function waitForInstamojoUpgrade(
  expectedPlan: InstamojoPlan,
  token: string,
  maxWaitMs = 20000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const res = await fetch(`${BACKEND_URL}/auth/profile`, {
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

// Plan display info (INR only — Instamojo is India-only)
export const INSTAMOJO_PLAN_INFO: Record<
  InstamojoPlan,
  {
    name: string;
    monthly: string;
    annual: string;
  }
> = {
  starter: {
    name: "Starter",
    monthly: "₹85/mo",
    annual: "₹850/yr",
  },
  pro: {
    name: "Pro",
    monthly: "₹1,149/mo",
    annual: "₹9,990/yr",
  },
  elite: {
    name: "Elite",
    monthly: "₹2,399/mo",
    annual: "₹23,990/yr",
  },
};
