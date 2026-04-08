import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";

const page = {
  title: "AI models",
  eyebrow: "Routing",
  description:
    "The provider story now mirrors the official CyberMind CLI repo: multi-provider routing, uncensored-first ordering, parallel execution, and fallback behavior.",
  command: "cybermind model route inspect",
  sections: [
    {
      title: "Provider strategy",
      body:
        "The site no longer speaks about model routing abstractly. It now points back to the public README claims about provider count, model breadth, and how CyberMind prefers to route work.",
      bullets: [
        "9 providers and 40+ models in the public repo.",
        "Automatic fallback and parallel execution.",
        "Adaptive skill detection and multilingual replies.",
      ],
    },
    {
      title: "Supporting docs",
      body:
        "The docs tree now includes dedicated provider, privacy, and repository-status pages so the AI story is easier to verify and trust.",
    },
  ],
};

export default function AIModelsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
