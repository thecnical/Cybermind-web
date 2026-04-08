import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";

const page = {
  title: "Changelog",
  eyebrow: "Release notes",
  description:
    "A release surface tied to the public CyberMind repository, not generic redesign notes.",
  command: "cybermind changelog latest",
  sections: [
    {
      title: "Current direction",
      body:
        "The public changelog shows the two biggest shifts clearly: the Kali command mode expansion in 2.0.0 and the recon engine rewrite in 2.3.0.",
      bullets: [
        "2.3.0: recon engine rewrite, structured payloads, adaptive runtime decisions, install-tools flow.",
        "2.0.0: Kali command mode, more providers, broader model routing.",
        "Repository currently reports 2.5.0 in README and cli/main.go, while VERSION still says 2.4.0.",
      ],
    },
    {
      title: "Where to go next",
      body:
        "Use the docs changelog pages for the release narrative, then cross-check the repository-status page when the public source files disagree.",
      links: [
        { href: "/docs/changelogs", label: "Docs changelogs" },
        { href: "/docs/changelogs/latest", label: "Latest channel notes" },
        { href: "/docs/reference/repo-status", label: "Repository status" },
      ],
    },
  ],
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
