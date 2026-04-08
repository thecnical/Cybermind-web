import Link from "next/link";
import CyberMindLogo from "@/components/CyberMindLogo";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "/install", label: "Install" },
      { href: "/plans", label: "Plans" },
      { href: "/extensions", label: "Extensions" },
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
    title: "Account",
    links: [
      { href: "/auth/login", label: "Login" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/20 px-5 py-16 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <CyberMindLogo size={38} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--accent-cyan)]">
                  CyberMind CLI
                </p>
                <p className="text-base font-semibold text-white">
                  Shell-first account, install, docs, and billing surfaces
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[var(--text-soft)]">
              The website now ties homepage, auth, dashboard, install, docs, and legal guidance into one consistent CyberMind CLI experience.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
                  {column.title}
                </p>
                <div className="mt-4 grid gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[var(--text-soft)] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/8 pt-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
          <p>CyberMind CLI website, aligned to the live product workflow and account experience.</p>
          <p className="font-mono text-xs uppercase tracking-[0.28em]">
            TERMINAL-FIRST. COMMERCIAL-READY. CLEARER DOCS.
          </p>
        </div>
      </div>
    </footer>
  );
}
