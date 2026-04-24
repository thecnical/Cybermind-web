import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCards from "../FeatureCards";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata = PAGE_META.featureDevsec;

export default function DevSecPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0" }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "100px 20px 80px" }}>
        
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,255,255,0.08)",
            border: "1px solid rgba(0,255,255,0.2)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 12,
            color: "#00FFFF",
            marginBottom: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}>
            Starter+ Plan
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #ffffff 0%, #00FFFF 50%, #8A2BE2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeIn 0.8s ease-out",
          }}>
            Developer Security Scanner
          </h1>
          <p style={{ color: "#8b949e", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Scan GitHub repositories and local paths for secrets, SAST vulnerabilities, and vulnerable dependencies — all in one command.
          </p>
          <code style={{
            display: "block",
            background: "rgba(0,255,255,0.05)",
            border: "1px solid rgba(0,255,255,0.15)",
            borderRadius: 12,
            padding: "12px 20px",
            fontFamily: "monospace",
            fontSize: 16,
            color: "#00FFFF",
            maxWidth: 480,
            margin: "0 auto 32px",
          }}>
            cybermind /devsec https://github.com/owner/repo
          </code>
          <Link href="/plans" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #00FFFF, #8A2BE2)",
            color: "#000",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}>
            Get Starter Plan →
          </Link>
        </div>

        {/* Feature Cards */}
        <FeatureCards
          hoverBorderColor="rgba(0,255,255,0.2)"
          cards={[
            { icon: "🔑", title: "Secret Scanning", desc: "trufflehog + gitleaks scan full git history for API keys, tokens, and credentials" },
            { icon: "🔍", title: "SAST Analysis", desc: "semgrep with p/security-audit ruleset finds injection flaws, XSS, and logic bugs" },
            { icon: "📦", title: "Dependency Audit", desc: "trivy, npm audit, and pip-audit find vulnerable packages with CVE mapping" },
            { icon: "🤖", title: "AI Remediation", desc: "AI classifies severity, maps to MITRE ATT&CK, and provides exact fix commands" },
          ]}
        />

        {/* Terminal Demo */}
        <div style={{
          background: "#0d1117",
          border: "1px solid rgba(0,255,255,0.15)",
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
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.01) 2px, rgba(0,255,255,0.01) 4px)",
            pointerEvents: "none" as const,
          }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <pre style={{ fontFamily: "monospace", fontSize: 13, color: "#e0e0e0", margin: 0, lineHeight: 1.8, overflow: "auto" }}>
{`$ cybermind /devsec https://github.com/example/webapp

  🔐 DEVSEC — Developer Security Scanner
  ────────────────────────────────────────────────────────────

  [devsec] cloning https://github.com/example/webapp...
  [devsec] phase 1: secret scanning...
  [devsec] running trufflehog...
  [devsec] running gitleaks...
  [devsec] phase 2: SAST...
  [devsec] running semgrep...
  [devsec] phase 3: dependency audit...
  [devsec] running trivy...
  [devsec] running npm audit...
  [devsec] sending findings to AI for analysis...

  ╔══════════════════════════════════════════════════════════╗
  ║              🔐 DevSec AI Analysis                      ║
  ╚══════════════════════════════════════════════════════════╝

  CRITICAL: AWS_SECRET_KEY found in .env.backup (line 12)
    → MITRE ATT&CK: T1552.001 — Credentials in Files
    → Fix: Rotate key immediately, add .env* to .gitignore

  HIGH: SQL injection in src/db/query.js (line 47)
    → CVE mapping: CWE-89
    → Fix: Use parameterized queries

  HIGH: lodash 4.17.15 — CVE-2021-23337 (CVSS 7.2)
    → Fix: npm install lodash@4.17.21`}
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
            background: "linear-gradient(135deg, #00FFFF, #8A2BE2)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}>
            Start with Starter Plan →
          </Link>
          <p style={{ color: "#555", fontSize: 13, marginTop: 12 }}>Starter plan · ₹85/mo · Unlimited devices</p>
        </div>

      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
