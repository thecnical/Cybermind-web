import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCards from "../FeatureCards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "/red-team — Multi-Day Red Team Campaign | CyberMind CLI",
  description: "Structured 7-day red team campaign: OSINT → Phishing → Initial Access → Lateral Movement → Persistence → Report. Elite plan only.",
};

export default function RedTeamPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0" }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "100px 20px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,68,68,0.1)",
            border: "1px solid rgba(255,68,68,0.3)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 12,
            color: "#ff4444",
            marginBottom: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}>
            Elite Only
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #ffffff 0%, #ff4444 40%, #8A2BE2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeIn 0.8s ease-out",
          }}>
            Multi-Day Red Team Campaign
          </h1>
          <p style={{ color: "#8b949e", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Structured 7-day red team campaign with AI-guided phases: OSINT, phishing simulation, initial access, lateral movement, persistence, and final report.
          </p>
          <code style={{
            display: "block",
            background: "rgba(255,68,68,0.05)",
            border: "1px solid rgba(255,68,68,0.15)",
            borderRadius: 12,
            padding: "12px 20px",
            fontFamily: "monospace",
            fontSize: 16,
            color: "#ff6b6b",
            maxWidth: 520,
            margin: "0 auto 32px",
          }}>
            cybermind /red-team acme-corp --duration 7d
          </code>
          <Link href="/plans" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff4444, #8A2BE2)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}>
            Get Elite Plan →
          </Link>
        </div>

        {/* Feature Cards */}
        <FeatureCards
          hoverBorderColor="rgba(255,68,68,0.3)"
          cards={[
            { icon: "🎯", title: "Scope Validation", desc: "AI validates target scope, generates rules of engagement, and confirms authorization before starting" },
            { icon: "📅", title: "7-Day Campaign", desc: "Structured multi-day timeline: each phase builds on the previous with AI-guided decision making" },
            { icon: "🔄", title: "Phase Persistence", desc: "Campaign state saved between sessions — resume from any phase, never lose progress" },
            { icon: "📋", title: "Final Report", desc: "Professional red team report with executive summary, technical findings, and remediation roadmap" },
          ]}
        />

        {/* Terminal Demo */}
        <div style={{
          background: "#0d1117",
          border: "1px solid rgba(255,68,68,0.2)",
          borderRadius: 16,
          padding: "24px",
          marginBottom: 48,
          position: "relative" as const,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute" as const,
            top: 0, left: 0, right: 0,
            height: "100%",
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,68,68,0.01) 2px, rgba(255,68,68,0.01) 4px)",
            pointerEvents: "none" as const,
          }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <pre style={{ fontFamily: "monospace", fontSize: 13, color: "#e0e0e0", margin: 0, lineHeight: 1.8, overflow: "auto" }}>
{`$ cybermind /red-team acme-corp --duration 7d

  🔴 RED-TEAM — Multi-Day Campaign
  ────────────────────────────────────────────────────────────

  [red-team] validating scope for acme-corp...
  [red-team] authorization confirmed — starting 7-day campaign

  ── DAY 1: OSINT & Reconnaissance ──────────────────────────
  [phase 1] Running OSINT Deep on acme-corp.com...
  [phase 1] Found: 47 employees on LinkedIn, 12 subdomains
  [phase 1] Identified: tech stack (AWS, React, Node.js)
  [phase 1] Brain_Memory updated with 89 findings

  ── DAY 2: Phishing Simulation ──────────────────────────────
  [phase 2] Generating phishing templates for acme-corp...
  [phase 2] Target: IT helpdesk persona (john.smith@acme-corp.com)
  [phase 2] Payload: credential harvester + macro dropper

  ── DAY 3-4: Initial Access ─────────────────────────────────
  [phase 3] Testing external attack surface...
  [phase 3] Found: VPN portal on vpn.acme-corp.com
  [phase 3] CVE-2024-21887 applicable → exploiting...
  [phase 3] ✓ Initial access obtained

  ── DAY 5: Lateral Movement ─────────────────────────────────
  [phase 4] Enumerating internal network...
  [phase 4] Found: domain controller at 10.0.1.5
  [phase 4] Kerberoasting → 3 service account hashes

  ── DAY 6: Persistence ──────────────────────────────────────
  [phase 5] Establishing persistence mechanisms...
  [phase 5] Scheduled task + registry run key

  ── DAY 7: Report Generation ────────────────────────────────
  [phase 6] Generating executive + technical report...
  [phase 6] Report saved: ~/.cybermind/redteam/acme-corp-2026.pdf`}
          </pre>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/plans" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff4444, #8A2BE2)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}>
            Upgrade to Elite →
          </Link>
          <p style={{ color: "#555", fontSize: 13, marginTop: 12 }}>Elite plan · ₹2,399/mo · Unlimited devices</p>
        </div>

      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
