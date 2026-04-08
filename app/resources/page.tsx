import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";

const page = {
  title: "Resources",
  eyebrow: "Support",
  description:
    "A simpler resource hub for install help, privacy, troubleshooting, legal pages, and account guidance around CyberMind CLI.",
  command: "cybermind /doctor",
  sections: [
    {
      title: "Start with the clearest paths",
      body:
        "If you are blocked, start with install, troubleshooting, privacy, and legal boundaries instead of walking the entire docs tree.",
      links: [
        { href: "/install", label: "Install" },
        { href: "/docs/resources/troubleshooting", label: "Troubleshooting" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
    {
      title: "What this section is for",
      body:
        "Use resources when you need help deciding what CyberMind stores, what runs on which platform, how to recover a broken setup, and what legal boundary the product expects.",
    },
  ],
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
