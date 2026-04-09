/**
 * Razorpay checkout integration.
 *
 * Flow:
 *  1. User clicks "Upgrade" on plans page
 *  2. We load the Razorpay script dynamically (avoids SSR issues)
 *  3. Open checkout with user's email + plan metadata in notes
 *  4. On payment.captured, Razorpay fires our backend webhook
 *  5. Webhook verifies HMAC, calls upgrade_plan() SECURITY DEFINER function
 *  6. Frontend polls /auth/profile until plan changes, then refreshes UI
 *
 * The notes.user_id and notes.plan fields are read by the webhook handler
 * to identify which user to upgrade. They are NOT trusted for security —
 * the webhook validates the HMAC signature first.
 */

export type RazorpayPlan = "pro" | "elite";

export interface RazorpayCheckoutOptions {
  userId: string;
  email: string;
  plan: RazorpayPlan;
  annual: boolean;
  onSuccess: () => void;
  onFailure: (reason: string) => void;
}

// Prices in paise (INR) — 1 INR = 100 paise
// Monthly: Pro = ₹749, Elite = ₹2399
// Annual:  Pro = ₹7490, Elite = ₹23990
const PRICES: Record<RazorpayPlan, { monthly: number; annual: number; label: string }> = {
  pro:   { monthly: 74900,  annual: 749000,  label: "Pro Plan"   },
  elite: { monthly: 239900, annual: 2399000, label: "Elite Plan" },
};

// Load Razorpay script once
let scriptLoaded = false;
function loadRazorpayScript(): Promise<void> {
  if (scriptLoaded || typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { scriptLoaded = true; resolve(); };
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.head.appendChild(script);
  });
}

/**
 * Poll /auth/profile until plan matches expected value or timeout.
 * Called after payment success to confirm the webhook processed.
 */
async function waitForPlanUpgrade(
  expectedPlan: RazorpayPlan,
  backendUrl: string,
  token: string,
  maxWaitMs = 15000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 1500));
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

/**
 * Open Razorpay checkout modal.
 * Requires NEXT_PUBLIC_RAZORPAY_KEY_ID to be set.
 */
export async function openRazorpayCheckout(opts: RazorpayCheckoutOptions): Promise<void> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    opts.onFailure("Razorpay key not configured. Contact support.");
    return;
  }

  try {
    await loadRazorpayScript();
  } catch {
    opts.onFailure("Payment system unavailable. Please try again.");
    return;
  }

  const priceInfo = PRICES[opts.plan];
  const amount = opts.annual ? priceInfo.annual : priceInfo.monthly;

  const rzpOptions = {
    key: keyId,
    amount,
    currency: "INR",
    name: "CyberMind CLI",
    description: `${priceInfo.label} — ${opts.annual ? "Annual" : "Monthly"}`,
    image: "https://cybermind.thecnical.dev/og-image.png",
    prefill: {
      email: opts.email,
    },
    notes: {
      // Read by backend webhook to identify user + plan
      user_id: opts.userId,
      plan: opts.plan,
      billing: opts.annual ? "annual" : "monthly",
    },
    theme: {
      color: "#00FFFF",
      backdrop_color: "rgba(0,0,0,0.85)",
    },
    modal: {
      backdropclose: false,
      escape: true,
      animation: true,
    },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) => {
      // Payment captured on Razorpay's side.
      // Our webhook will fire asynchronously — poll until plan updates.
      console.log("[razorpay] payment captured:", response.razorpay_payment_id);
      opts.onSuccess();
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rzp = new (window as any).Razorpay(rzpOptions);

  rzp.on("payment.failed", (response: { error: { description: string; reason: string } }) => {
    console.warn("[razorpay] payment failed:", response.error);
    opts.onFailure(response.error.description || "Payment failed. Please try again.");
  });

  rzp.open();
}

export { waitForPlanUpgrade, PRICES };
