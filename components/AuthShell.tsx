"use client";

import Link from "next/link";
import CyberMindLogo from "@/components/CyberMindLogo";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function AuthShell({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-5 pb-20 pt-28 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(138,43,226,0.18),transparent_30%)]" />
        <div className="absolute inset-0 cm-grid-bg opacity-40" />
        <div className="relative w-full max-w-md">
          <div className={cn("linear-shell rounded-[32px] p-7 md:p-8", className)}>
            <Link href="/" className="inline-flex items-center gap-3">
              <CyberMindLogo size={42} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--accent-cyan)]">
                  CyberMind CLI
                </p>
                <p className="text-sm font-semibold text-white">Account portal</p>
              </div>
            </Link>

            <div className="mt-8">
              <p className="cm-label">Secure access</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                {description}
              </p>
            </div>

            <div className="mt-8">{children}</div>

            {footer ? (
              <div className="mt-6 border-t border-white/8 pt-5 text-sm text-[var(--text-soft)]">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
