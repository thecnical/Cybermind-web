import { BriefcaseBusiness, Clock3, Rocket, ShieldCheck, Users } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WaitlistPanel from "@/components/WaitlistPanel";
import { Surface } from "@/components/DesignPrimitives";

const roles = [
  {
    title: "Security Research Engineer",
    location: "Remote / India",
    type: "Full-time",
    summary: "Design and validate recon/hunt chains, payload patterns, and operator safety boundaries.",
  },
  {
    title: "Frontend Product Engineer",
    location: "Remote / Global",
    type: "Full-time",
    summary: "Build high-velocity command-first UX for account, docs, and dashboard surfaces.",
  },
  {
    title: "DX & Documentation Engineer",
    location: "Remote / Global",
    type: "Contract",
    summary: "Turn complex CLI capabilities into clear docs, examples, and onboarding flows.",
  },
];

const values = [
  { icon: Rocket, text: "Ship practical improvements every week." },
  { icon: ShieldCheck, text: "Security and legal boundaries are non-negotiable." },
  { icon: Users, text: "Build for operators and researchers, not vanity metrics." },
  { icon: Clock3, text: "Optimize for deep work and asynchronous collaboration." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface variant="glass" tone="accent" elevation="high" className="rounded-[36px] p-7 md:p-10">
          <p className="cm-label">Careers</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Help build the CLI layer for next-generation offensive security teams.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            We are hiring engineers who can combine product thinking with real security workflows.
            If you care about command velocity, reliability, and clarity, we should talk.
          </p>
        </Surface>

        <section className="grid gap-5 md:grid-cols-2">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <Surface key={item.text} variant="skeuo" elevation="medium" className="rounded-[24px] p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-xl border border-white/12 bg-white/[0.05] p-2 text-[var(--accent-cyan)]">
                    <Icon size={17} />
                  </span>
                  <p className="text-sm text-[var(--text-main)]">{item.text}</p>
                </div>
              </Surface>
            );
          })}
        </section>

        <section className="grid gap-4">
          <div>
            <p className="cm-label">Open roles</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Current hiring tracks</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role) => (
              <Surface key={role.title} variant="glass" elevation="medium" className="rounded-[26px] p-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[var(--text-soft)]">
                  <BriefcaseBusiness size={14} />
                  {role.type}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{role.title}</h3>
                <p className="mt-2 text-sm text-[var(--accent-cyan)]">{role.location}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{role.summary}</p>
              </Surface>
            ))}
          </div>
        </section>

        <WaitlistPanel
          title="Join the talent waitlist"
          description="No suitable role right now? Join the waitlist and we will reach out when the next hiring batch opens."
          audienceLabel="Talent network"
          baseCount={930}
        />
      </main>
      <Footer />
    </div>
  );
}
