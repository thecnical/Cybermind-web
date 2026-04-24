"use client";

import Link from "next/link";

const newModes = [
  {
    href: "/features/devsec",
    badge: "Starter+",
    badgeColor: "#00FFFF",
    command: "/devsec",
    title: "Developer Security Scanner",
    desc: "Scan GitHub repos for secrets (trufflehog/gitleaks), SAST (semgrep), and vulnerable deps (trivy/npm audit/pip-audit)",
  },
  {
    href: "/features/vibe-hack",
    badge: "Pro+",
    badgeColor: "#8A2BE2",
    command: "/vibe-hack",
    title: "Real-time AI Hacking",
    desc: "Autonomous AI hacking session: AI decides next attack step, streams live via SSE, saves full transcript",
  },
  {
    href: "/features/chain",
    badge: "Pro+",
    badgeColor: "#8A2BE2",
    command: "/chain",
    title: "Vulnerability Chaining Engine",
    desc: "Reads Brain_Memory findings and suggests multi-step exploit chains (e.g., SSRF+IDOR → PII leak) with PoC",
  },
  {
    href: "/features/red-team",
    badge: "Elite",
    badgeColor: "#ff4444",
    command: "/red-team",
    title: "Multi-Day Red Team Campaign",
    desc: "Structured 7-day campaign: OSINT → Phishing → Initial Access → Lateral Movement → Persistence → Report",
  },
];

export default function NewModesGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
      {newModes.map((mode) => (
        <Link key={mode.href} href={mode.href} style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "18px 16px",
              transition: "transform 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLDivElement).style.borderColor = `${mode.badgeColor}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <code style={{ color: mode.badgeColor, fontSize: 13, fontFamily: "monospace", fontWeight: 700 }}>
                {mode.command}
              </code>
              <span style={{
                background: `${mode.badgeColor}18`,
                border: `1px solid ${mode.badgeColor}40`,
                borderRadius: 10,
                padding: "1px 8px",
                fontSize: 10,
                color: mode.badgeColor,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}>
                {mode.badge}
              </span>
            </div>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>{mode.title}</h3>
            <p style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5, margin: 0 }}>{mode.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
