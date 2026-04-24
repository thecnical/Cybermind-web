import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCards from "../FeatureCards";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata = PAGE_META.featureVibeHack;

export default function VibeHackPage() {
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
            background: "linear-gradient(135deg, #ffffff 0%, #8A2BE2 50%, #00FFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeIn 0.8s ease-out",
          }}>
            Real-time AI Hacking
          </h1>
          <p style={{ color: "#8b949e", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Autonomous AI hacking session where the AI decides the next attack step, streams live via SSE, and saves a full session transcript.
          </p>
          <code style={{
            display: "block",
            background: "rgba(138,43,226,0.06)",
            border: "1px solid rgba(138,43,226,0.2)",
            borderRadius: 12,
            padding: "12px 20px",
            fontFamily: "monospace",
            fontSize: 16,
            color: "#a855f7",
            maxWidth: 480,
            margin: "0 auto 32px",
          }}>
            cybermind /vibe-hack example.com
          </code>
          <Link href="/plans" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #8A2BE2, #00FFFF)",
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
          hoverBorderColor="rgba(138,43,226,0.3)"
          cards={[
            { icon: "🤖", title: "Autonomous AI Loop", desc: "AI decides the next attack step based on live findings — no manual input required" },
            { icon: "📡", title: "Live SSE Streaming", desc: "Every step streams in real-time via Server-Sent Events — watch the AI think and act" },
            { icon: "🧠", title: "Real-time Reasoning", desc: "AI explains its reasoning at each step: why this tool, what it expects to find" },
            { icon: "📝", title: "Session Transcript", desc: "Full session saved to disk — every command, output, and AI decision logged" },
          ]}
        />

        {/* Terminal Demo */}
        <div style={{
          background: "#0d1117",
          border: "1px solid rgba(138,43,226,0.2)",
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
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(138,43,226,0.01) 2px, rgba(138,43,226,0.01) 4px)",
            pointerEvents: "none" as const,
          }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <pre style={{ fontFamily: "monospace", fontSize: 13, color: "#e0e0e0", margin: 0, lineHeight: 1.8, overflow: "auto" }}>
{`$ cybermind /vibe-hack example.com

  🎯 VIBE-HACK — Autonomous AI Hacking Session
  ────────────────────────────────────────────────────────────

  [AI] Starting autonomous hacking session on example.com
  [AI] Reasoning: Let me start with recon to understand the attack surface

  [step 1] Running: subfinder -d example.com
  [AI] Found 12 subdomains → api.example.com looks interesting

  [step 2] Running: httpx -u api.example.com -tech-detect
  [AI] Found PHP + MySQL → trying SQLi next

  [step 3] Running: sqlmap -u "https://api.example.com/users?id=1" --batch
  [AI] SQLi confirmed on id parameter → extracting schema

  [step 4] Running: sqlmap --dump -T users --batch
  [AI] Extracted 847 user records — CRITICAL finding

  [AI] Reasoning: Found SQLi, pivoting to check for SSRF on admin panel
  [step 5] Running: ssrfmap -u "https://api.example.com/fetch?url=FUZZ"
  [AI] SSRF confirmed → internal network accessible

  ╔══════════════════════════════════════════════════════════╗
  ║           🎯 Vibe-Hack Session Complete                 ║
  ╚══════════════════════════════════════════════════════════╝

  Findings: SQLi (CRITICAL) + SSRF (HIGH) + 847 user records
  Transcript saved: ~/.cybermind/sessions/vibe-hack-example.com-2026.md`}
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
            background: "linear-gradient(135deg, #8A2BE2, #00FFFF)",
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
