import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCards from "../FeatureCards";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata = PAGE_META.featureChain;

export default function ChainPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0" }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "100px 20px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(138,43,226,0.12)",
            border: "1px solid rgba(138,43,226,0.3)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 12,
            color: "#8A2BE2",
            marginBottom: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}>
            Pro+ Plan
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #ffffff 0%, #00FFFF 40%, #8A2BE2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeIn 0.8s ease-out",
          }}>
            Vulnerability Chaining Engine
          </h1>
          <p style={{ color: "#8b949e", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Reads Brain_Memory findings and suggests multi-step exploit chains — turning low-severity bugs into critical impact with PoC generation.
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
            cybermind /chain example.com
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
            Get Pro Plan →
          </Link>
        </div>

        {/* Feature Cards */}
        <FeatureCards
          hoverBorderColor="rgba(0,255,255,0.2)"
          cards={[
            { icon: "🧠", title: "Brain Memory Integration", desc: "Reads all previous scan findings from Brain_Memory to understand the full attack surface" },
            { icon: "🔗", title: "Chain Discovery", desc: "AI identifies how individual low-severity bugs can be chained for critical impact" },
            { icon: "💥", title: "PoC Generation", desc: "Generates step-by-step proof-of-concept for each discovered chain with exact commands" },
            { icon: "📈", title: "CVSS Uplift", desc: "Shows how chaining increases CVSS score — e.g., two Medium bugs → Critical chain" },
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
{`$ cybermind /chain example.com

  🔗 CHAIN — Vulnerability Chaining Engine
  ────────────────────────────────────────────────────────────

  [chain] loading Brain_Memory for example.com...
  [chain] found 14 findings: 2 HIGH, 6 MEDIUM, 6 LOW
  [chain] analyzing chain opportunities...

  ╔══════════════════════════════════════════════════════════╗
  ║           🔗 Chain Analysis Results                     ║
  ╚══════════════════════════════════════════════════════════╝

  Chain 1: SSRF + IDOR → PII leak via internal API pivot
    Step 1: SSRF on /api/fetch?url= → reach internal metadata service
    Step 2: IDOR on /api/users/{id} → enumerate all user IDs
    Step 3: Pivot SSRF to internal /admin/users → dump PII
    CVSS Uplift: MEDIUM(5.3) + MEDIUM(4.3) → CRITICAL(9.1)
    PoC: curl -X GET "https://example.com/api/fetch?url=http://169.254.169.254/latest/meta-data/"

  Chain 2: Open Redirect + XSS → Account Takeover
    Step 1: Open redirect on /redirect?to= → bypass CSP
    Step 2: Reflected XSS on /search?q= → steal session cookie
    Step 3: Use stolen cookie → full account takeover
    CVSS Uplift: LOW(3.1) + MEDIUM(6.1) → HIGH(8.8)

  Chain 3: Info Disclosure + SQLi → Database Dump
    Step 1: /debug endpoint leaks DB credentials
    Step 2: Use credentials with SQLi → bypass auth
    CVSS Uplift: LOW(2.7) + HIGH(7.5) → CRITICAL(9.8)

  Report saved: ~/.cybermind/chains/example.com-chains-2026.md`}
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
            Upgrade to Pro →
          </Link>
          <p style={{ color: "#555", fontSize: 13, marginTop: 12 }}>Pro plan · ₹1,149/mo · 3 devices</p>
        </div>

      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
