"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Check, Loader2, AlertCircle, CheckCircle2, Zap, Globe } from "lucide-react";
import Accordion from "@/components/Accordion";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { startStripeCheckout, waitForPlanUpgrade, type StripePlan } from "@/lib/stripe";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

// ── Currency detection ────────────────────────────────────────────────────────
// Default INR for Indian users, USD for international
// Users can toggle manually
function detectCurrency(): "inr" | "usd" {
  if (typeof window === "undefined") return "inr";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz.startsWith("Asia/") ? "inr" : "usd";
}

const plans = [

  {
    id: "free" as const,
    name: "Free",
    monthlyINR: "₹0",
    annualINR: "₹0",
    monthlyUSD: "$0",
    annualUSD: "$0",
    description: "AI chat + 2 free attacks/day. Works on Linux, Windows, macOS.",
    badge: null,
    offer: null,
    features: [
      "20 requests/day",
      "AI security chat (all platforms)",
      "AI coding assistant — bring your own API key",
      "2 free attacks/day (scan + hunt on Linux)",
      "/scan /cve /payload /osint /locate (all OS)",
      "CyberMind fine-tuned AI (no safety filters)",
      "VSCode Extension — 50 AI credits/month",
      "1 device",
      "Community support",
    ],
    note: "1 device · No credit card",
  },

  {
    id: "starter" as const,
    name: "Starter",
    monthlyINR: "₹85",
    annualINR: "₹850",
    monthlyUSD: "$4",
    annualUSD: "$40",
    description: "Full pipeline: Omega plan mode → Recon → Hunt → Abhimanyu + OSINT Deep + RevEng. 5 targets/month.",
    badge: "🔥 Best value",
    offer: null,
    features: [
      "50 requests/day",
      "AI security chat (all platforms)",
      "AI coding assistant — managed keys",
      "OMEGA plan mode (auto attack planning + Phase 0 OSINT)",
      "HackerOne auto-target selection",
      "5 recon/hunt/Abhimanyu targets/month",
      "Full 20-tool recon chain (Linux)",
      "Full 30-tool hunt engine (Linux)",
      "Abhimanyu exploit mode (Linux)",
      "/osint-deep — 45 tools, 9 phases (domain/email/username/phone)",
      "/reveng — 30 tools, static+dynamic+decompile (ELF/PE/APK)",
      "/locate — IP/EXIF/WiFi/Social geolocation",
      "Breach intelligence (HIBP + LeakCheck + BreachDirectory APIs)",
      "Bug detection + auto PoC generation",
      "VSCode Extension — 500 AI credits/month",
      "Email support",
    ],
    note: "Unlimited devices · Secure checkout",
  },

  {
    id: "pro" as const,
    name: "Pro",
    monthlyINR: "₹1,149",
    annualINR: "₹9,990",
    monthlyUSD: "$14",
    annualUSD: "$120",
    originalMonthlyINR: "₹1,499",
    originalMonthlyUSD: "$19",
    description: "Unlimited recon, hunt, AI coding with web search + image gen + PoC reports.",
    badge: "Most popular",
    offer: null,
    features: [
      "200 requests/day",
      "AI coding + web search + image gen",
      "OMEGA plan mode (unlimited)",
      "HackerOne auto-target + --focus flag",
      "Unlimited recon targets (Linux)",
      "Full 20-tool recon chain + reconftw -a",
      "Full 30-tool hunt engine",
      "Auto bug detection + PoC generation",
      "Bug bounty report auto-generation",
      "Continuous loop (next target suggest)",
      "Priority backend routing",
      "VSCode Extension — 2,000 AI credits/month",
      "3 devices",
      "Email support",
    ],
    note: "3 devices · Secure checkout via Stripe",
  },

  {
    id: "elite" as const,
    name: "Elite",
    monthlyINR: "₹2,399",
    annualINR: "₹23,990",
    monthlyUSD: "$29",
    annualUSD: "$290",
    description: "Unlimited everything — AI coding with GPT-5/Claude, Abhimanyu, full OMEGA pipeline, PDF reports.",
    badge: null,
    offer: null,
    features: [
      "Unlimited requests",
      "AI coding with GPT-5 + Claude Opus 4",
      "OMEGA plan mode (unlimited, 10-phase)",
      "HackerOne integration + AI target selection",
      "All modes including Abhimanyu",
      "Phase 1: shodan, h8mail, exiftool, metagoofil, spiderfoot, recon-ng",
      "reconftw -a --deep (6h exhaustive scan)",
      "Auto PoC generation for every bug",
      "Full bug bounty report with PoC",
      "Continuous hunting loop",
      "Session persistence",
      "PDF reports",
      "VSCode Extension — Unlimited credits + Claude 3.7",
      "Unlimited devices",
      "Priority support + early access",
    ],
    note: "Unlimited devices · Secure checkout via Stripe",
  },
] as const;

const comparisonRows = [
  ["Requests/day",              "20",             "50",              "200",              "Unlimited"],
  ["AI chat",                   "✓",              "✓",               "✓",                "✓"],
  ["Free attacks/day (Linux)",  "2",              "—",               "—",                "—"],
  ["AI coding",                 "Own keys",       "Managed keys",    "+ web/img",        "GPT-5/Claude"],
  ["OMEGA plan mode",           "—",              "✓",               "✓",                "✓ (10-phase)"],
  ["HackerOne auto-target",     "—",              "✓",               "✓ + --focus",      "✓ + AI suggest"],
  ["Recon targets/mo",          "2/day",          "5",               "Unlimited",        "Unlimited"],
  ["reconftw mode",             "—",              "-r --deep",       "-a --deep",        "-a --deep 6h"],
  ["Hunt workflow",             "2/day",          "5 targets",       "Full 30 tools",    "Full 30 tools"],
  ["Abhimanyu mode",            "—",              "5 targets",       "—",                "✓"],
  ["Bug detection",             "—",              "✓",               "✓",                "✓"],
  ["Auto PoC generation",       "—",              "✓",               "✓",                "✓"],
  ["Bug bounty report",         "—",              "Markdown",        "Markdown + PoC",   "PDF + PoC"],
  ["Continuous loop",           "—",              "—",               "✓",                "✓"],
  ["PDF reports",               "—",              "—",               "—",                "✓"],
  ["Devices",                   "1",              "Unlimited",       "3",                "Unlimited"],
  ["Support",                   "Community",      "Email",           "Email",            "Priority"],
  ["OSINT Deep (/osint-deep)",  "—",              "5 targets",       "Unlimited",        "Unlimited"],
  ["RevEng (/reveng)",          "—",              "5 targets",       "Unlimited",        "Unlimited"],
  ["Locate (/locate)",          "Level 1-2",      "Level 1-4",       "Level 1-4",        "Level 1-5 (SDR)"],
  ["Breach intelligence",       "—",              "HIBP+LeakCheck",  "All APIs",         "All APIs + local"],
  ["Phase 0 OSINT in /plan",    "—",              "✓",               "✓",                "✓ (deep)"],
];

const faqs = [

  {
    title: "What is OMEGA plan mode?",
    body: "OMEGA is CyberMind's autonomous 10-phase attack pipeline: OSINT → Subdomain enum (reconftw -a --deep) → Port scan → HTTP fingerprint → Directory discovery → Vuln scan (all nuclei templates) → Hunt (XSS/SSRF/IDOR) → Secret hunting → JWT/GraphQL attacks → Exploitation. It runs for hours if needed — no shortcuts.",
  },

  {
    title: "What is HackerOne auto-target?",
    body: "Run 'cybermind /plan --auto-target' and CyberMind fetches the best bug bounty programs with wide scope and good payouts. You can also use '--focus xss,idor' to hunt specific vulnerability types.",
  },

  {
    title: "What is auto PoC generation?",
    body: "When nuclei, dalfox, or sqlmap confirms a vulnerability, CyberMind automatically generates a complete Proof-of-Concept — including curl commands, reproduction steps, CVSS score, and a ready-to-submit HackerOne report template.",
  },

  {
    title: "What counts as a 'target' in the Starter plan?",
    body: "Each unique domain/IP you run recon, hunt, or Abhimanyu on counts as 1 target. You get 5 per month. Targets reset on the 1st of each month.",
  },

  {
    title: "Can I start free and upgrade later?",
    body: "Yes. Sign up free, generate your API key, and upgrade from the plans page or dashboard billing at any time.",
  },

  {
    title: "What currency is used for payment?",
    body: "Payments are processed via Stripe. INR users get UPI, cards, and netbanking. International users get cards and other local methods.",
  },

  {
    title: "Does every plan work on every OS?",
    body: "Core chat and AI coding work everywhere (Windows, macOS, Linux). OMEGA plan mode, recon, hunt, and Abhimanyu require Linux/Kali — these use 50+ security tools that are Linux-native.",
  },

  {
    title: "What is the continuous loop feature?",
    body: "After scanning a target, if no medium/high bugs are found, CyberMind automatically suggests the next best bug bounty target to try — so you keep hunting without manual research.",
  },
];

type CheckoutState =
  | { status: "idle" }
  | { status: "loading"; plan: StripePlan }
  | { status: "polling"; plan: StripePlan }
  | { status: "success"; plan: StripePlan }
  | { status: "error"; message: string };

export default function PlansPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });
  const [loginModal, setLoginModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<StripePlan | null>(null);

  const currentPlan = profile?.plan || "free";

  const handleUpgrade = useCallback(async (planId: StripePlan) => {
    if (!user || !profile) {
      setPendingPlan(planId);
      setLoginModal(true);
      return;
    }
    if (currentPlan === planId) return;

    setCheckout({ status: "loading", plan: planId });

    try {
      // Get API key for auth
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setCheckout({ status: "error", message: "Session expired. Please log in again." });
        return;
      }

      // Fetch user's API key for payment auth
      const keysRes = await fetch(`${BACKEND_URL}/auth/keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const keysData = await keysRes.json();
      const apiKey = keysData.keys?.[0]?.key_prefix
        ? null // prefix only — use JWT auth instead
        : keysData.keys?.[0]?.key;

      // Start Stripe checkout — redirects to Stripe hosted page
      // Stripe handles UPI, cards, netbanking automatically
      await startStripeCheckout({
        plan:     planId,
        billing:  annual ? "annual" : "monthly",
        currency: currency,
        apiKey:   apiKey || token, // fallback to JWT
        email:    user.email ?? "",
      });

      // Note: user will be redirected to Stripe, so code below won't run
      // unless there's an error before redirect
    } catch (err) {
      setCheckout({
        status: "error",
        message: err instanceof Error ? err.message : "Checkout failed. Please try again.",
      });
    }
  }, [user, profile, currentPlan, annual, currency, refreshProfile]);

  const isLoading = (planId: string) =>
    (checkout.status === "loading" || checkout.status === "polling") && checkout.plan === planId;

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
                From free chat to unlimited recon pipelines — pick the tier that matches your workflow.
              </p>
            </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          
  {/* Currency toggle */}
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button type="button" onClick={() => setCurrency("inr")}
                className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", currency === "inr" ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}>
                🇮🇳 INR
              </button>
              <button type="button" onClick={() => setCurrency("usd")}
                className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", currency === "usd" ? "bg-white/10 text-white" : "text-[var(--text-soft)]")}>
                🌍 USD
              </button>
            </div>
          
  {/* Billing toggle */}
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
          </div>
        </section>

      
  {/* Status banners */}
      
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
            <button onClick={() => setCheckout({ status: "idle" })} className="text-xs text-[var(--text-muted)] hover:text-white">dismiss</button>
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

      
  {/* Plan cards — 4 columns */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        
  {plans.map((plan) => {
            const highlighted = plan.id === "pro";
            const isStarter = plan.id === "starter";
            const isCurrent = currentPlan === plan.id;
            const loading = isLoading(plan.id);
            const price = currency === "inr"
              ? (annual ? plan.annualINR : plan.monthlyINR)
              : (annual ? plan.annualUSD : plan.monthlyUSD);
            const period = annual ? "/ year" : "/ month";
            const originalPrice = currency === "inr" && !annual
              ? ("originalMonthlyINR" in plan ? plan.originalMonthlyINR : null)
              : currency === "usd" && !annual
              ? ("originalMonthlyUSD" in plan ? plan.originalMonthlyUSD : null)
              : null;

            return (
              <div key={plan.id}
                className={cn(
                  "cm-spotlight-card relative overflow-hidden rounded-[28px] border p-5 flex flex-col",
                  highlighted
                    ? "border-[var(--accent-cyan)]/30 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                    : isStarter
                    ? "border-[#FFD700]/20 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]"
                    : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
                  isCurrent && "ring-1 ring-[var(--accent-cyan)]/20"
                )}>
              
  {highlighted && <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.85),transparent)]" />}
              
  {isStarter && <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.6),transparent)]" />}

              
  {/* Badge */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <p className="cm-label">{plan.name}</p>
                  <div className="flex flex-col items-end gap-1">
                  
  {plan.badge && (
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        isStarter ? "bg-[#FFD700]/15 text-[#FFD700]" : "bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]"
                      )}>
                      
  {plan.badge}
                      </span>
                    )}
                  
  {isCurrent && <StatusBadge label="Current" tone="success" />}
                  </div>
                </div>

              
  {/* Price */}
                <div className="mb-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-semibold text-white">{price}</h2>
                  
  {originalPrice && !annual && (
                      <span className="text-sm text-[var(--text-muted)] line-through">{originalPrice}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-soft)]">{period}</p>
                </div>

              
  {/* Offer tag */}
              
  {plan.offer && !annual && (
                  <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1.5">
                    <Zap size={11} className="text-[#FFD700]" />
                    <p className="text-[10px] text-[#FFD700] font-medium">{plan.offer}</p>
                  </div>
                )}

                <p className="text-xs leading-5 text-[var(--text-soft)] mb-4">{plan.description}</p>

                <ul className="space-y-2 text-xs text-[var(--text-main)] flex-1">
                
  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check size={12} className="mt-0.5 flex-shrink-0 text-[#00FF88]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 grid gap-2">
                
  {plan.id === "free" ? (
                    <Link href="/auth/register"
                      className="cm-button-secondary w-full text-center text-sm">
                      Get started free
                    </Link>
                  ) : isCurrent ? (
                    <div className="rounded-2xl border border-white/10 px-4 py-2.5 text-center text-xs text-[var(--text-muted)]">
                      Current plan
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpgrade(plan.id as StripePlan)}
                        disabled={loading || checkout.status === "polling"}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60",
                          highlighted
                            ? "border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-white hover:bg-[var(--accent-cyan)]/20"
                            : isStarter
                            ? "border border-[#FFD700]/30 bg-[#FFD700]/10 text-white hover:bg-[#FFD700]/20"
                            : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        )}>
                      
  {loading ? (
                          <><Loader2 size={13} className="animate-spin" /> Redirecting...</>
                        ) : currency === "inr" ? (
                          <>Pay with UPI / Card <span className="text-[10px] opacity-50">→ Stripe</span></>
                        ) : (
                          <>Pay with Card <span className="text-[10px] opacity-50">→ Stripe</span></>
                        )}
                      </button>
                    
  {currency === "inr" && (
                        <p className="text-center text-[10px] text-[var(--text-muted)]">
                          UPI · Cards · Netbanking · Wallets
                        </p>
                      )}
                    </>
                  )}
                  <p className="text-center text-[10px] text-[var(--text-muted)]">{plan.note}</p>
                </div>
              </div>
            );
          })}
        </section>

      
  {/* Comparison table */}
        <section className="cm-card p-6 md:p-8">
          <p className="cm-label">Compare tiers</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Feature comparison</h2>
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[860px] overflow-hidden rounded-[24px] border border-white/8">
              <div className="grid grid-cols-5 bg-white/[0.04] px-5 py-4 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                <span>Feature</span><span>Free</span><span>Starter</span><span>Pro</span><span>Elite</span>
              </div>
            
  {comparisonRows.map((row) => (
                <div key={row[0]} className="grid grid-cols-5 border-t border-white/8 px-5 py-3.5 text-sm text-[var(--text-soft)]">
                
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

      
  {/* FAQ */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Start free, upgrade when ready.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
              Sign up now to generate your first API key and move into the dashboard immediately.
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

        <section className="rounded-[24px] border border-white/8 bg-white/[0.02] px-6 py-5">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-soft)]">
            <span className="text-[#00FF88]">🔒 Secure payments</span>
            <span>Powered by Stripe · UPI + Cards + Netbanking · No card data stored by CyberMind</span>
            <span className="flex items-center gap-1"><Globe size={12} /> Available worldwide</span>
            <Link href="/privacy" className="text-[var(--accent-cyan)] hover:underline ml-auto">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--accent-cyan)] hover:underline">Terms</Link>
          </div>
        </section>
      </main>
      <Footer />

      <Modal open={loginModal} onClose={() => setLoginModal(false)} title="Sign in to upgrade">
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--text-soft)]">
            Sign in to upgrade to the <span className="capitalize text-white">{pendingPlan}</span> plan.
          </p>
          <div className="grid gap-3">
            <Link href={`/auth/login?redirect=/plans`} className="cm-button-primary w-full text-center" onClick={() => setLoginModal(false)}>
              Sign in
            </Link>
            <Link href={`/auth/register?plan=${pendingPlan}`} className="cm-button-secondary w-full text-center" onClick={() => setLoginModal(false)}>
              Create account
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
