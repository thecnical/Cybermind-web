import Link from "next/link";
import CyberMindLogo from "@/components/CyberMindLogo";
import { Surface } from "@/components/DesignPrimitives";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/install", label: "Install" },
      { href: "/plans", label: "Plans" },
      { href: "/cbm-code", label: "CBM Code" },
      { href: "/ai-models", label: "AI Models" },
      { href: "/features", label: "Features" },
      { href: "/get-tools", label: "Get Tools" },
    ],
  },
  {
    title: "Docs & Learn",
    links: [
      { href: "/docs/get-started", label: "Get Started" },
      { href: "/docs/reference/commands", label: "Commands" },
      { href: "/docs/resources/troubleshooting", label: "Troubleshooting" },
      { href: "/course", label: "Course" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/support", label: "Support" },
      { href: "/contact", label: "Contact" },
      { href: "/auth/login", label: "Login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/aup", label: "Acceptable Use" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <Surface variant="glass" tone="default" elevation="high" className="cm-noise-overlay rounded-[24px] border border-white/10 p-5 md:rounded-[30px] md:p-9">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <div className="flex items-center gap-3">
                <CyberMindLogo size={36} />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">CyberMind CLI</p>
                  <p className="text-sm font-semibold text-white md:text-base">Agency-grade terminal UX for offensive security</p>
                </div>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-soft)]">
                Unified account, install, docs, dashboard, and legal surfaces under one cinematic command-first design system.
              </p>
              <div className="mt-5 cm-divider" />
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Glass base. Clay CTAs. Brutal accents. Skeuo controls.
              </p>
            </div>

            {/* FIX: 2-col grid on mobile, 4-col on sm+ */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{column.title}</p>
                  <div className="mt-3 grid gap-2.5">
                    {column.links.map((link) => (
                      <Link key={link.href} href={link.href} className="text-sm text-[var(--text-soft)] transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/8 pt-5 text-xs text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
            <p>CyberMind CLI website aligned to the official product workflow and command surface.</p>
            <p className="font-mono uppercase tracking-[0.22em]">CINEMATIC. TERMINAL-FIRST.</p>
          </div>
        </Surface>
      </div>
    </footer>
  );
}
