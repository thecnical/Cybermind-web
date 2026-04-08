import { BookOpenCheck, Brain, FlaskConical, ShieldAlert, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WaitlistPanel from "@/components/WaitlistPanel";
import { Reveal, Surface } from "@/components/DesignPrimitives";

const modules = [
  {
    icon: BookOpenCheck,
    title: "CLI Foundations",
    body: "Install, key routing, command syntax, and operator-safe workflow setup.",
  },
  {
    icon: FlaskConical,
    title: "Recon Deep Dive",
    body: "Six-phase recon chain with practical target profiling and evidence capture.",
  },
  {
    icon: ShieldAlert,
    title: "Hunt & Exploit Boundaries",
    body: "Payload validation, exploitation boundaries, and report-ready findings hygiene.",
  },
  {
    icon: Brain,
    title: "AI Prompt Engineering",
    body: "Prompt patterns for speed, precision, and reproducible terminal sessions.",
  },
];

export default function CoursePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface variant="glass" tone="accent" elevation="high" className="rounded-[36px] p-7 md:p-10">
          <p className="cm-label">CyberMind Course</p>
          <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Beyond scripts. Learn offensive workflow thinking with CyberMind CLI.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            This course is designed for serious researchers and security teams who want structured, real-world
            command workflows, not random tool usage.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)] px-4 py-2 text-sm text-white">
            <Sparkles size={14} className="text-[var(--accent-cyan)]" />
            Waitlist open for first cohort
          </div>
        </Surface>

        <section className="grid gap-4 md:grid-cols-2">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Reveal key={module.title} delay={index * 0.04}>
                <Surface variant={index % 2 === 0 ? "skeuo" : "glass"} elevation="medium" className="rounded-[26px] p-6">
                  <div className="inline-flex rounded-xl border border-white/12 bg-white/[0.05] p-2 text-[var(--accent-cyan)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{module.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{module.body}</p>
                </Surface>
              </Reveal>
            );
          })}
        </section>

        <WaitlistPanel
          title="Join the CyberMind course waitlist"
          description="Share your current skill level and goals. We will send cohort invites with module roadmap and schedule."
          audienceLabel="Course cohort"
          baseCount={3180}
        />
      </main>
      <Footer />
    </div>
  );
}

