import { ArrowRight, Binary, Cpu, Radar, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WaitlistPanel from "@/components/WaitlistPanel";
import { Surface } from "@/components/DesignPrimitives";

const toolTracks = [
  {
    icon: Radar,
    name: "Recon bundle",
    description: "Domain mapping, service discovery, HTTP fingerprinting, and asset expansion templates.",
    status: "Early access",
  },
  {
    icon: Shield,
    name: "Hunt bundle",
    description: "Parameter discovery, exploit simulation, payload testing, and triage scoring helpers.",
    status: "Waitlist",
  },
  {
    icon: Binary,
    name: "Automation SDK",
    description: "Script templates and orchestration hooks to plug CyberMind into team pipelines.",
    status: "Preview",
  },
  {
    icon: Cpu,
    name: "Model packs",
    description: "Preset provider/model routing profiles for research, CTF, and incident drill sessions.",
    status: "Roadmap",
  },
];

export default function GetToolsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface variant="glass" tone="cyan" elevation="high" className="rounded-[36px] p-7 md:p-10">
          <p className="cm-label">Get tools</p>
          <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Extend CyberMind CLI with focused tool bundles for real operator workloads.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            These packs are built for teams that want curated workflows beyond base install.
            Join waitlists for early access tracks while we expand release coverage.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/install" className="cm-button-primary gap-2">
              Install core CLI
              <ArrowRight size={16} />
            </Link>
            <Link href="/plans" className="cm-button-secondary">
              View plan coverage
            </Link>
          </div>
        </Surface>

        <section className="grid gap-4 md:grid-cols-2">
          {toolTracks.map((track) => {
            const Icon = track.icon;
            return (
              <Surface key={track.name} variant="skeuo" elevation="medium" className="rounded-[26px] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex rounded-xl border border-white/12 bg-white/[0.05] p-2 text-[var(--accent-cyan)]">
                    <Icon size={18} />
                  </div>
                  <span className="cm-pill border-[var(--accent-strong)]/30 bg-[rgba(141,117,255,0.12)] text-white">
                    {track.status}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{track.name}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{track.description}</p>
              </Surface>
            );
          })}
        </section>

        <WaitlistPanel
          title="Join the tools waitlist"
          description="Tell us which tool bundle you need most and we will prioritize rollout invites for your use case."
          audienceLabel="Tooling access"
          baseCount={1540}
        />

        <Surface variant="glass" elevation="medium" className="rounded-[28px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="cm-label">Need immediate command coverage?</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">
                Use base CLI modes today while tool packs are rolling out.
              </p>
            </div>
            <Link href="/docs/reference/commands" className="cm-button-secondary gap-2">
              <Wrench size={15} />
              Open command docs
            </Link>
          </div>
        </Surface>
      </main>
      <Footer />
    </div>
  );
}
