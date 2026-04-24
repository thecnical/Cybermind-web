"use client";

interface FeatureCard {
  icon: string;
  title: string;
  desc: string;
}

interface FeatureCardsProps {
  cards: FeatureCard[];
  hoverBorderColor: string;
}

export default function FeatureCards({ cards, hoverBorderColor }: FeatureCardsProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 20,
      marginBottom: 64,
    }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "24px 20px",
            transition: "transform 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.borderColor = hoverBorderColor;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
          <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{card.title}</h3>
          <p style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.6 }}>{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
