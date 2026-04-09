import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.features;

const page = {
  title: "Features",
  eyebrow: "Capabilities",
  description:
    "CyberMind CLI combines AI chat, recon, hunt, provider fallback, and a Linux-first offensive workflow into one terminal-native product surface.",
  command: "cybermind features list",
  sections: [
    {
      title: "Real CLI capabilities",
      body:
        "The refreshed site now describes the actual upstream project rather than generic platform language. That means the page focuses on the prompt shell, the documented recon and hunt chains, and the Linux-only Abhimanyu mode.",
      bullets: [
        "Interactive AI chat on every supported platform.",
        "20-tool recon and 11-tool hunt workflows on Kali Linux.",
        "Provider routing, fallback behavior, and local history.",
      ],
    },
    {
      title: "Why the redesign changed",
      body:
        "The earlier version looked like a generic operator shell. The current version uses the official repository as its source of truth, so the feature story is finally consistent with the product itself.",
    },
  ],
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
