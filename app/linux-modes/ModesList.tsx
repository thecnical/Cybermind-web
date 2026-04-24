"use client";

import Link from "next/link";

interface Mode {
  command: string;
  syntax: string;
  title: string;
  desc: string;
  plan: string;
  planColor: string;
  tools: string;
  category: string;
  isNew?: boolean;
}

interface ModesListProps {
  modes: Mode[];
  categories: string[];
}

export default function ModesList({ modes, categories }: ModesListProps) {
  return (
    <>
      {categories.map((category) => {
        const categoryModes = modes.filter((m) => m.category === category);
        if (categoryModes.length === 0) return null;
        return (
          <div key={category} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
                {category}
              </h2>
              {category === "New v4.4.0" && (
                <span style={{
                  background: "rgba(0,255,255,0.1)",
                  border: "1px solid rgba(0,255,255,0.3)",
                  borderRadius: 10,
                  padding: "2px 10px",
                  fontSize: 11,
                  color: "#00FFFF",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}>
                  NEW
                </span>
              )}
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {categoryModes.map((mode) => (
                <div
                  key={mode.command}
                  style={{
                    background: mode.isNew
                      ? "rgba(0,255,255,0.02)"
                      : "rgba(255,255,255,0.02)",
                    border: mode.isNew
                      ? "1px solid rgba(0,255,255,0.1)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "20px 24px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 16,
                    alignItems: "start",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${mode.planColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = mode.isNew
                      ? "rgba(0,255,255,0.1)"
                      : "rgba(255,255,255,0.06)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" as const }}>
                      <code style={{
                        color: "#00FFFF",
                        fontSize: 14,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        background: "rgba(0,255,255,0.06)",
                        padding: "2px 10px",
                        borderRadius: 6,
                      }}>
                        {mode.syntax}
                      </code>
                      <span style={{
                        background: `${mode.planColor}15`,
                        border: `1px solid ${mode.planColor}40`,
                        borderRadius: 10,
                        padding: "1px 8px",
                        fontSize: 10,
                        color: mode.planColor,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                      }}>
                        {mode.plan}
                      </span>
                    </div>
                    <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>
                      {mode.title}
                    </h3>
                    <p style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.6, margin: "0 0 8px" }}>
                      {mode.desc}
                    </p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
                      <span style={{ color: "#444" }}>Tools: </span>{mode.tools}
                    </p>
                  </div>
                  {mode.isNew && (
                    <Link href={`/features/${mode.command.replace("/", "")}`} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: "rgba(0,255,255,0.08)",
                      border: "1px solid rgba(0,255,255,0.2)",
                      color: "#00FFFF",
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap" as const,
                      flexShrink: 0,
                    }}>
                      Learn more →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
