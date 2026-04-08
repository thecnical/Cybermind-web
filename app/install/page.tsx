"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import InstallTabs from "@/components/InstallTabs";
import Navbar from "@/components/Navbar";
import Accordion from "@/components/Accordion";
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
    body: "Confirm that your shell supports the command you selected. Linux/Kali uses bash, Windows expects PowerShell, and macOS assumes Homebrew is installed.",
  },
  {
    title: "My API key is rejected",
    body: "Re-copy the key from the dashboard and make sure no spaces or quotes were added while pasting it into the shell command.",
  },
  {
    title: "Providers do not show up after install",
    body: "Run /doctor from inside the CLI. The doctor flow is the fastest way to catch missing environment variables or routing issues.",
  },
  {
    title: "Recon or hunt commands are unavailable",
    body: "The deepest automated workflows are strongest on Kali/Linux. Windows stays chat-first and may not expose the full offensive toolchain.",
  },
];

export default function InstallPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <section className="linear-shell rounded-[36px] p-7 md:p-10">
          <p className="cm-label">Install</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Install CyberMind CLI on Linux, Windows, or macOS with a personalized command.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
            Pick a platform, drop in your API key, and the command updates instantly so the install flow matches the account you just created.
          </p>
        </section>

        <section className="cm-card p-6 md:p-8">
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
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="cm-card p-6 md:p-8">
            <p className="cm-label">System requirements</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Before you run the installer</h2>
            <div className="mt-6 grid gap-3">
              {requirements.map((item) => (
                <div key={item} className="cm-card-soft p-4 text-sm leading-7 text-[var(--text-soft)]">
                  {item}
                </div>
              ))}
            </div>
          </div>

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
