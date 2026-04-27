"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Check, X, Loader2, AlertCircle, Zap, Globe, Shield, Star, ArrowRight, Users, Lock, Cpu } from "lucide-react";
import Accordion from "@/components/Accordion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { startPayUCheckout, type PayUPlan } from "@/lib/payu";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

// ─── Plan upgrade status check ────────────────────────────────────────────────
async function checkCurrentPlan(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile?.plan ?? null;
  } catch {
    return null;
  }
}

function detectCurrency(): "inr" | "usd" {
  if (typeof window === "undefined") return "inr";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz.startsWith("Asia/") ? "inr" : "usd";
}

// ─── Plan Data ────────────────────────────────────────────────────────────────
const plans = [
  {
    id: "free" as const,
    name: "Free",
    monthlyINR: "₹0", annualINR: "₹0",
    monthlyUSD: "$0", annualUSD: "$0",
    description: "AI chat + 2 free attacks/day. All platforms.",
    badge: null as string | null, badgeColor: null as string | null,
    popular: false,
    accentColor: "#8b949e",
    glowColor: "rgba(139,148,158,0.08)",
    borderColor: "rgba(255,255,255,0.06)",
    features: [
      { text: "20 requests/day", included: true },
      { text: "AI security chat (all platforms)", included: true },
      { text: "AI coding — bring your own key", included: true },
      { text: "2 free attacks/day (Linux)", included: true },
      { text: "/scan /cve /payload /osint /locate", included: true },
      { text: "VSCode Extension — 50 credits/mo", included: true },
      { text: "1 device", included: true },
      { text: "OMEGA plan mode", included: false },
      { text: "OSINT Deep / RevEng / Breach", included: false },
    ],
    note: "1 device · No credit card",
    cta: "Get started free",
    ctaHref: "/auth/register",
  },
  {
    id: "starter" as const,
    name: "Starter",
    monthlyINR: "₹85", annualINR: "₹850",
    monthlyUSD: "$4", annualUSD: "$40",
    description: "Full pipeline: OMEGA → Recon → Hunt → Abhimanyu + OSINT Deep + RevEng.",
    badge: "🔥 Best value" as string | null, badgeColor: "#FFD700" as string | null,
    popular: false,
    accentColor: "#FFD700",
    glowColor: "rgba(255,215,0,0.06)",
    borderColor: "rgba(255,215,0,0.15)",
    features: [
      { text: "50 requests/day", included: true },
      { text: "AI security chat + managed keys", included: true },
      { text: "OMEGA plan mode + Phase 0 OSINT", included: true },
      { text: "5 recon/hunt/Abhimanyu targets/mo", included: true },
      { text: "Full 20-tool recon chain (Linux)", included: true },
      { text: "Full 30-tool hunt engine (Linux)", included: true },
      { text: "/osint-deep — 45 tools, 9 phases", included: true },
      { text: "/reveng — 30 tools, 6 phases", included: true },
      { text: "Breach intel (HIBP + BreachDir + LeakCheck)", included: true },
      { text: "/locate — IP/EXIF/WiFi/Social geo", included: true },
      { text: "Bug detection + auto PoC generation", included: true },
      { text: "/devsec — Developer Security Scanner", included: true },
      { text: "VSCode Extension — 500 credits/mo", included: true },
    ],
    note: "Unlimited devices · Secure checkout",
    cta: "Upgrade to Starter",
    ctaHref: null as string | null,
  },
  {
    id: "pro" as const,
    name: "Pro",
    monthlyINR: "₹1,149", annualINR: "₹9,990",
    monthlyUSD: "$14", annualUSD: "$120",
    originalMonthlyINR: "₹1,499", originalMonthlyUSD: "$19",
    description: "Unlimited recon, hunt, AI coding with web search + image gen + PoC reports.",
    badge: "Most popular" as string | null, badgeColor: "#00d4ff" as string | null,
    popular: true,
    accentColor: "#00d4ff",
    glowColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.2)",
    features: [
      { text: "200 requests/day", included: true },
      { text: "AI coding + web search + image gen", included: true },
      { text: "OMEGA plan mode (unlimited)", included: true },
      { text: "Unlimited recon targets (Linux)", included: true },
      { text: "Full recon chain + reconftw -a --deep (6h exhaustive)", included: true },
      { text: "OSINT Deep — unlimited targets", included: true },
      { text: "RevEng — unlimited targets", included: true },
      { text: "/locate Level 1-4", included: true },
      { text: "Breach intel — all APIs", included: true },
      { text: "Bug bounty report auto-generation", included: true },
      { text: "Continuous loop (next target suggest)", included: true },
      { text: "/vibe-hack — Real-time AI Hacking", included: true },
      { text: "/chain — Vuln Chaining Engine", included: true },
      { text: "VSCode Extension — 2,000 credits/mo", included: true },
      { text: "3 devices · Priority routing", included: true },
    ],
    note: "3 devices · Secure checkout via PayU",
    cta: "Upgrade to Pro",
    ctaHref: null as string | null,
  },
  {
    id: "elite" as const,
    name: "Elite",
    monthlyINR: "₹2,399", annualINR: "₹23,990",
    monthlyUSD: "$29", annualUSD: "$290",
    description: "Unlimited everything — GPT-5/Claude, Abhimanyu, full OMEGA, PDF reports.",
    badge: null as string | null, badgeColor: null as string | null,
    popular: false,
    accentColor: "#7c3aed",
    glowColor: "rgba(124,58,237,0.08)",
    borderColor: "rgba(124,58,237,0.2)",
    features: [
      { text: "Unlimited requests", included: true },
      { text: "AI coding with GPT-5 + Claude Opus 4", included: true },
      { text: "OMEGA plan mode (10-phase + Phase 0)", included: true },
      { text: "All modes including Abhimanyu", included: true },
      { text: "reconftw -a --deep + all 10 recon methodologies", included: true },
      { text: "OSINT Deep + dark web + breach (unlimited)", included: true },
      { text: "RevEng — Ghidra + AI decompile", included: true },
      { text: "/locate-advanced — SDR cell tower (Level 5)", included: true },
      { text: "Breach — all APIs + local dump indexing", included: true },
      { text: "Auto PoC + PDF bug bounty reports", included: true },
      { text: "Continuous hunting loop + session persistence", included: true },
      { text: "/red-team — Multi-Day Campaign", included: true },
      { text: "VSCode Extension — Unlimited + Claude 3.7", included: true },
      { text: "Unlimited devices · Priority support", included: true },
    ],
    note: "Unlimited devices · Secure checkout via PayU",
    cta: "Upgrade to Elite",
    ctaHref: null as string | null,
  },
] as const;

// ─── Comparison Table Data ────────────────────────────────────────────────────
const comparisonRows = [
  { category: "Core", icon: <Zap size={14} />, feature: "Daily requests", free: "20", starter: "50", pro: "200", elite: "Unlimited" },
  { category: "Core", icon: <Zap size={14} />, feature: "AI security chat", free: true, starter: true, pro: true, elite: true },
  { category: "Core", icon: <Zap size={14} />, feature: "Devices", free: "1", starter: "Unlimited", pro: "3", elite: "Unlimited" },
  { category: "Recon", icon: <Globe size={14} />, feature: "OMEGA plan mode", free: false, starter: true, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "Auto recon (Linux)", free: false, starter: "5/mo", pro: "Unlimited", elite: "Unlimited" },
  { category: "Recon", icon: <Globe size={14} />, feature: "OSINT Deep (45 tools)", free: false, starter: true, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "RevEng (30 tools)", free: false, starter: true, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "Active DNS recon (puredns/alterx)", free: false, starter: true, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "ASN/IP range discovery", free: false, starter: true, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "Cloud bucket enumeration", free: false, starter: false, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "GitHub/code recon", free: false, starter: false, pro: true, elite: true },
  { category: "Recon", icon: <Globe size={14} />, feature: "JS/API endpoint recon", free: false, starter: true, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "Breach intel", free: false, starter: true, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "Threat intel (/threat)", free: true, starter: true, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "Abhimanyu exploit mode", free: false, starter: false, pro: false, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "SDR cell tower locate", free: false, starter: false, pro: false, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "/devsec — DevSec Scanner", free: false, starter: true, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "/vibe-hack — AI Hacking", free: false, starter: false, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "/chain — Vuln Chaining", free: false, starter: false, pro: true, elite: true },
  { category: "Security", icon: <Shield size={14} />, feature: "/red-team — Red Team", free: false, starter: false, pro: false, elite: true },
  { category: "AI", icon: <Cpu size={14} />, feature: "AI coding", free: "BYOK", starter: "Managed", pro: "Web search + img", elite: "GPT-5 + Claude" },
  { category: "AI", icon: <Cpu size={14} />, feature: "Bug bounty reports", free: false, starter: false, pro: true, elite: "PDF auto-gen" },
  { category: "VSCode", icon: <Star size={14} />, feature: "Extension credits/mo", free: "50", starter: "500", pro: "2,000", elite: "Unlimited" },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    question: "What payment methods are supported?",
    answer: "PayU handles all payments — UPI (GPay, PhonePe, Paytm, BHIM), Cards (Visa/MC/Rupay/Amex), Net Banking, EMI, and Wallets. India + International.",
  },
  {
    question: "Can I switch plans anytime?",
    answer: "Yes. Upgrade or downgrade anytime. Upgrades take effect immediately. Downgrades apply at the next billing cycle.",
  },
  {
    question: "Do I need Linux for all features?",
    answer: "No. AI chat, /scan, /osint, /breach, /threat, /cve, /payload, /locate work on Windows, macOS, and Linux. Recon/hunt/abhimanyu/reveng require Linux/Kali.",
  },
  {
    question: "What is OMEGA mode?",
    answer: "OMEGA is CyberMind's autonomous 10-phase attack planner. It auto-runs recon → hunt → exploit → post-exploit in sequence, passing context between phases.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "The Free plan gives you full access to AI chat and cross-platform tools. Paid plans unlock the full offensive pipeline.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PlansPage() {
  const { user, session } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [currency] = useState<"inr" | "usd">(() => detectCurrency());
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  // Load current plan on mount
  useState(() => {
    if (session?.access_token) {
      checkCurrentPlan(session.access_token).then(plan => {
        if (plan) setCurrentPlan(plan);
      });
    }
  });

  const getPrice = useCallback((plan: typeof plans[number]) => {
    if (billing === "annual") {
      return currency === "inr" ? plan.annualINR : plan.annualUSD;
    }
    return currency === "inr" ? plan.monthlyINR : plan.monthlyUSD;
  }, [billing, currency]);

  const getOriginalPrice = useCallback((plan: typeof plans[number]) => {
    if (billing === "monthly" && "originalMonthlyINR" in plan) {
      return currency === "inr"
        ? (plan as { originalMonthlyINR?: string; originalMonthlyUSD?: string }).originalMonthlyINR
        : (plan as { originalMonthlyINR?: string; originalMonthlyUSD?: string }).originalMonthlyUSD;
    }
    return null;
  }, [billing, currency]);

  const handleUpgrade = useCallback(async (planId: PayUPlan) => {
    if (!user || !session) {
      window.location.href = "/auth/login?redirect=/plans";
      return;
    }
    setLoading(planId);
    setError(null);
    try {
      // Use Supabase JWT access token directly — works for ALL users including new signups
      // No need to fetch api_key from profiles (new users don't have one yet)
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      if (!token) {
        window.location.href = "/auth/login?redirect=/plans";
        return;
      }

      await startPayUCheckout({
        plan: planId,
        billing,
        currency,
        apiKey: token,  // JWT token — backend paymentAuth accepts this
        email: user.email || "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setLoading(null);
    }
  }, [user, session, billing, currency]);

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0" }}>
      <Navbar />

      {/* ── Social Proof Bar ── */}
      <div style={{
        background: "rgba(0,212,255,0.04)",
        borderBottom: "1px solid rgba(0,212,255,0.08)",
        padding: "10px 0",
        textAlign: "center",
        fontSize: "13px",
        color: "#8b949e",
      }}>
        <span style={{ marginRight: 24 }}>
          <Users size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Trusted by <strong style={{ color: "#00d4ff" }}>12,000+</strong> security researchers
        </span>
        <span style={{ marginRight: 24 }}>
          <Shield size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          <strong style={{ color: "#00d4ff" }}>50+</strong> recon tools · <strong style={{ color: "#00d4ff" }}>45</strong> OSINT tools · <strong style={{ color: "#00d4ff" }}>30</strong> RE tools
        </span>
        <span>
          <Lock size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Payments secured by <strong style={{ color: '#00d4ff' }}>PayU</strong>
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px 40px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 12,
            color: "#00d4ff",
            marginBottom: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Pricing
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Choose your arsenal
          </h1>
          <p style={{ color: "#8b949e", fontSize: 17, maxWidth: 520, margin: "0 auto 32px" }}>
            From free AI chat to full autonomous offensive security. No lock-in, cancel anytime.
          </p>

          {/* ── Billing Toggle ── */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 40,
            padding: "6px 8px",
          }}>
            <button
              onClick={() => setBilling("monthly")}
              style={{
                padding: "8px 20px",
                borderRadius: 32,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
                background: billing === "monthly" ? "rgba(255,255,255,0.1)" : "transparent",
                color: billing === "monthly" ? "#fff" : "#8b949e",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              style={{
                padding: "8px 20px",
                borderRadius: 32,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
                background: billing === "annual" ? "rgba(255,255,255,0.1)" : "transparent",
                color: billing === "annual" ? "#fff" : "#8b949e",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Annual
              <span style={{
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 10,
                letterSpacing: "0.04em",
              }}>
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* ── Error / Success ── */}
        {error && (
          <div style={{
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.2)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#ff6b6b",
            fontSize: 14,
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* ── Plan Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          marginBottom: 80,
        }}>
          {plans.map((plan) => {
            const price = getPrice(plan);
            const originalPrice = getOriginalPrice(plan);
            const isLoading = loading === plan.id;

            return (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  background: plan.popular
                    ? `linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.06) 100%)`
                    : `rgba(255,255,255,0.02)`,
                  border: plan.popular
                    ? "1px solid rgba(0,212,255,0.3)"
                    : `1px solid ${plan.borderColor}`,
                  borderRadius: 16,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: plan.popular
                    ? "0 0 40px rgba(0,212,255,0.08), 0 0 80px rgba(124,58,237,0.04)"
                    : `0 0 30px ${plan.glowColor}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Popular ring */}
                {plan.popular && (
                  <div style={{
                    position: "absolute",
                    inset: -1,
                    borderRadius: 17,
                    background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                    zIndex: -1,
                    opacity: 0.4,
                  }} />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: plan.popular
                      ? "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))"
                      : `rgba(255,215,0,0.1)`,
                    border: `1px solid ${plan.popular ? "rgba(0,212,255,0.3)" : "rgba(255,215,0,0.3)"}`,
                    borderRadius: 20,
                    padding: "3px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: plan.popular ? "#00d4ff" : "#FFD700",
                    marginBottom: 16,
                    width: "fit-content",
                  }}>
                    {plan.popular && <Star size={11} fill="currentColor" />}
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: plan.accentColor,
                  margin: "0 0 6px",
                }}>
                  {plan.name}
                  {currentPlan === plan.id && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      background: "rgba(0,255,136,0.15)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      color: "#00FF88",
                      borderRadius: 10,
                      padding: "2px 8px",
                      verticalAlign: "middle",
                    }}>
                      Current
                    </span>
                  )}
                </h2>

                {/* Price */}
                <div style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 6 }}>
                  {originalPrice && (
                    <span style={{ fontSize: 16, color: "#555", textDecoration: "line-through" }}>
                      {originalPrice}
                    </span>
                  )}
                  <span style={{ fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {price}
                  </span>
                  {plan.id !== "free" && (
                    <span style={{ fontSize: 14, color: "#8b949e" }}>
                      /{billing === "annual" ? "yr" : "mo"}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 13, color: "#8b949e", margin: "0 0 20px", lineHeight: 1.5 }}>
                  {plan.description}
                </p>

                {/* CTA Button */}
                {plan.ctaHref ? (
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 20px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      marginBottom: 20,
                      transition: "background 0.2s",
                    }}
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>
                ) : currentPlan === plan.id ? (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "rgba(0,255,136,0.08)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    color: "#00FF88",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}>
                    <Check size={14} />
                    Current plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id as PayUPlan)}
                    disabled={isLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 20px",
                      borderRadius: 10,
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 20,
                      transition: "opacity 0.2s, transform 0.1s",
                      opacity: isLoading ? 0.7 : 1,
                      background: plan.popular
                        ? "linear-gradient(135deg, #00d4ff, #7c3aed)"
                        : plan.id === "elite"
                          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                          : plan.id === "starter"
                            ? "rgba(255,215,0,0.12)"
                            : "rgba(255,255,255,0.06)",
                      color: "#fff",
                      boxShadow: plan.popular ? "0 4px 20px rgba(0,212,255,0.25)" : "none",
                    }}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {plan.cta}
                    {!isLoading && <ArrowRight size={14} />}
                  </button>
                )}

                <p style={{ fontSize: 11, color: "#555", textAlign: "center", margin: "0 0 20px" }}>
                  {plan.note}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                      fontSize: 13,
                      color: f.included ? "#c9d1d9" : "#444",
                    }}>
                      {f.included ? (
                        <Check size={14} style={{ color: plan.accentColor, flexShrink: 0, marginTop: 1 }} />
                      ) : (
                        <X size={14} style={{ color: "#333", flexShrink: 0, marginTop: 1 }} />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Comparison Table ── */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
            color: "#fff",
          }}>
            Full comparison
          </h2>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#8b949e", fontWeight: 500, width: "35%" }}>Feature</th>
                  {["Free", "Starter", "Pro", "Elite"].map((name, i) => (
                    <th key={name} style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      color: i === 2 ? "#00d4ff" : "#c9d1d9",
                      fontWeight: i === 2 ? 700 : 500,
                    }}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}>
                    <td style={{ padding: "12px 20px", color: "#8b949e", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#555" }}>{row.icon}</span>
                      {row.feature}
                    </td>
                    {[row.free, row.starter, row.pro, row.elite].map((val, j) => (
                      <td key={j} style={{ padding: "12px 16px", textAlign: "center" }}>
                        {typeof val === "boolean" ? (
                          val
                            ? <Check size={15} style={{ color: j === 2 ? "#00d4ff" : "#00ff88", margin: "0 auto" }} />
                            : <X size={15} style={{ color: "#333", margin: "0 auto" }} />
                        ) : (
                          <span style={{ color: j === 2 ? "#00d4ff" : "#c9d1d9", fontWeight: j === 2 ? 600 : 400 }}>
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ maxWidth: 720, margin: "0 auto 80px" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
            color: "#fff",
          }}>
            FAQ
          </h2>
          <Accordion items={faqs.map(f => ({ title: f.question, body: f.answer }))} />
        </div>

      </div>

      <Footer />
    </div>
  );
}

