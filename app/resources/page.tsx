import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";

const page = {
  title: "Tools",
  eyebrow: "Resources",
  description:
    "Tool-focused resource surface for CyberMind CLI bundles, extension tracks, command references, and install diagnostics.",
  command: "cybermind /tools list",
  sections: [
    {
      title: "Tool launch paths",
      body:
        "Use these pages to access tools quickly without navigating the full documentation tree.",
      links: [
        { href: "/get-tools", label: "Tools hub" },
        { href: "/extensions", label: "Extensions" },
        { href: "/install", label: "Install" },
        { href: "/docs/reference/commands", label: "Command reference" },
        { href: "/docs/resources/troubleshooting", label: "Tool troubleshooting" },
      ],
    },
    {
      title: "Operator intent",
      body:
        "Resources now stay tools-only so operators can jump directly to command, extension, and setup assets.",
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
