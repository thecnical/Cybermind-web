import Link from "next/link";
import CyberMindLogo from "@/components/CyberMindLogo";
import { Surface } from "@/components/DesignPrimitives";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "/install", label: "Install" },
      { href: "/plans", label: "Plans" },
      { href: "/get-tools", label: "Get tools" },
    ],
  },
  {
    title: "Docs",
    links: [
      { href: "/docs/get-started", label: "Get started" },
      { href: "/docs/reference/commands", label: "Commands" },
      { href: "/docs/resources/troubleshooting", label: "Troubleshooting" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/course", label: "Course" },
      { href: "/careers", label: "Careers" },
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
    <footer className="px-5 py-14 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Surface variant="glass" tone="default" elevation="high" className="cm-noise-overlay rounded-[30px] border border-white/10 p-7 md:p-9">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <div className="flex items-center gap-3">
                <CyberMindLogo size={40} />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--accent-cyan)]">CyberMind CLI</p>
                  <p className="text-base font-semibold text-white">Agency-grade terminal UX for offensive security workflows</p>
                </div>
              </div>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--text-soft)]">
                Unified account, install, docs, dashboard, and legal surfaces under one cinematic command-first design system.
              </p>
              <div className="mt-6 cm-divider" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Glass base. Clay CTAs. Brutal accents. Skeuo controls.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-4">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{column.title}</p>
                  <div className="mt-4 grid gap-3">
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

          <div className="mt-8 flex flex-col gap-2 border-t border-white/8 pt-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
            <p>CyberMind CLI website aligned to the official product workflow and command surface.</p>
            <p className="font-mono text-xs uppercase tracking-[0.28em]">CINEMATIC. TERMINAL-FIRST. PRODUCTION-READY.</p>
          </div>
        </Surface>
      </div>
    </footer>
  );
}
