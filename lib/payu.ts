/**
 * PayU payment integration — India + International
 *
 * Supports:
 *  - UPI (India — all apps: GPay, PhonePe, Paytm, BHIM)
 *  - Credit/Debit Cards (Visa, Mastercard, Rupay, Amex)
 *  - Net Banking (all major Indian banks)
 *  - EMI (credit card EMI)
 *  - Wallets (Paytm, Mobikwik, Freecharge, Airtel)
 *  - International cards
 *
 * Flow:
 *  1. User clicks "Upgrade"
 *  2. Frontend calls POST /payu/create-payment → gets PayU form params
 *  3. Frontend auto-submits form to PayU hosted checkout
 *  4. On success, PayU fires webhook → backend upgrades plan
 *  5. User redirected to /dashboard?payment=success
 *  6. Frontend polls until plan updates
 *
 * Docs: https://devguide.payu.in/
 */

export type PayUPlan = "starter" | "pro" | "elite";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

export interface PayUCheckoutOptions {
  plan: PayUPlan;
  billing: "monthly" | "annual";
  currency: "inr" | "usd";
  apiKey: string;
  email: string;
  phone?: string;
  name?: string;
}

export interface PayUFormParams {
  action: string; // PayU checkout URL
  fields: Record<string, string>; // form fields to POST
}

/**
 * Create a PayU payment and redirect user to PayU's hosted checkout.
 * Backend generates the hash and returns form params.
 * We auto-submit a hidden form — PayU requires a POST redirect.
 */
export async function startPayUCheckout(opts: PayUCheckoutOptions): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/payu/create-payment`, {
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
      phone:    opts.phone || "",
      name:     opts.name || "",
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create PayU payment");
  }

  // PayU requires a POST form submission — auto-submit hidden form
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.action; // https://secure.payu.in/_payment or test URL

  for (const [key, value] of Object.entries(data.fields as Record<string, string>)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

/**
 * Poll backend until plan matches expected value.
 * Called after returning from PayU success redirect.
 */
export async function waitForPayUUpgrade(
  expectedPlan: PayUPlan,
  token: string,
  maxWaitMs = 25000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 2500));
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

// Plan display info
export const PAYU_PLAN_INFO: Record<PayUPlan, {
  name: string;
  monthlyINR: string; annualINR: string;
  monthlyUSD: string; annualUSD: string;
}> = {
  starter: {
    name: "Starter",
    monthlyINR: "₹85",   annualINR: "₹850/yr",
    monthlyUSD: "$4",    annualUSD: "$40/yr",
  },
  pro: {
    name: "Pro",
    monthlyINR: "₹1,149", annualINR: "₹9,990/yr",
    monthlyUSD: "$14",    annualUSD: "$120/yr",
  },
  elite: {
    name: "Elite",
    monthlyINR: "₹2,399", annualINR: "₹23,990/yr",
    monthlyUSD: "$29",    annualUSD: "$290/yr",
  },
};
