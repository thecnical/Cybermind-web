"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import InstallTabs from "@/components/InstallTabs";
import Navbar from "@/components/Navbar";
import Accordion from "@/components/Accordion";
import { Surface } from "@/components/DesignPrimitives";
import { installCommands } from "@/lib/mockData";

const requirements = [
  "Internet access for installer fetch and provider setup",
  "Shell access: Bash for Linux/Kali, PowerShell for Windows, Homebrew for macOS",
  "A valid CyberMind CLI API key for personalized commands",
  "Provider credentials configured after install if you plan to use external models",
];

const troubleshooting = [
  {
    title: "The installer command fails immediately",
    body: "Confirm that your shell supports the selected command. Linux/Kali uses bash, Windows expects PowerShell, and macOS assumes Homebrew.",
  },
  {
    title: "My API key is rejected",
    body: "Re-copy the key from dashboard and verify no extra spaces or quotes were added while pasting.",
  },
  {
    title: "Providers do not show up after install",
    body: "Run /doctor from inside the CLI. It catches missing environment variables and routing misconfigurations quickly.",
  },
  {
    title: "Recon or hunt commands are unavailable",
    body: "Deep automated workflows are Linux-first. Windows and macOS remain chat-first for most setups.",
  },
];

export default function InstallPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface variant="glass" tone="cyan" elevation="high" motion="hero" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
          <div className="cm-hero-beams" />
          <div className="relative">
            <p className="cm-label">Install</p>
            <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Install CyberMind CLI on Linux, Windows, or macOS with a personalized command.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
              Pick a platform, provide your API key, and keep the install path aligned with your account and workflow mode.
            </p>
          </div>
        </Surface>

        <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="cm-label">Platform install</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Step-by-step setup</h2>
            </div>
            <Link href="/docs/get-started" className="cm-button-secondary">
              Open full docs
            </Link>
          </div>
          <div className="mt-6">
            <InstallTabs commands={installCommands} editable />
          </div>
        </Surface>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Surface variant="clay" tone="accent" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">System requirements</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Before you run the installer</h2>
            <div className="mt-6 grid gap-3">
              {requirements.map((item) => (
                <Surface key={item} variant="skeuo" elevation="low" className="rounded-2xl p-4 text-sm leading-7 text-[var(--text-soft)]">
                  {item}
                </Surface>
              ))}
            </div>
          </Surface>

          <div className="grid gap-4">
            <div>
              <p className="cm-label">Troubleshooting</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Common install issues</h2>
            </div>
            <Accordion items={troubleshooting} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
