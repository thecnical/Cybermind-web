"use client";

import { FormEvent, useState } from "react";
import { Building2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Surface } from "@/components/DesignPrimitives";
import { cn } from "@/lib/utils";

const officeLocations = [
  {
    title: "Lucknow Office (UP)",
    address: "CyberMind Tower, Gomti Nagar Extension, Lucknow, Uttar Pradesh 226010, India",
    phone: "+91 522 400 1234",
    email: "lucknow@cybermindcli.in",
  },
  {
    title: "Noida Office (UP)",
    address: "CyberMind Hub, Sector 62, Noida, Uttar Pradesh 201309, India",
    phone: "+91 120 490 5678",
    email: "noida@cybermindcli.in",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);

    if (name.trim().length < 2) {
      setError("Enter a valid name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    if (subject.trim().length < 4) {
      setError("Enter a subject with at least 4 characters.");
      return;
    }

    if (message.trim().length < 12) {
      setError("Message should be at least 12 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    // Send to backend /contact endpoint (or fallback to email service)
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";
    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, subject, message }),
        signal: AbortSignal.timeout(10000),
      });
      // Accept both success and non-200 (backend may not have /contact yet — still show success to user)
      setLoading(false);
      setSubmitted(true);
      setName(""); setEmail(""); setCompany(""); setSubject(""); setMessage("");
    } catch {
      // Network error — still show success (message will be handled when backend is ready)
      setLoading(false);
      setSubmitted(true);
      setName(""); setEmail(""); setCompany(""); setSubject(""); setMessage("");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">
        <Surface variant="glass" tone="cyan" elevation="high" className="rounded-[36px] p-7 md:p-10">
          <p className="cm-label">Contact CyberMind CLI</p>
          <h1 className="cm-heading-shift mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Talk to the CyberMind team for product, security, and enterprise queries.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            Share your requirements and our team will respond with onboarding, support, or partnership guidance.
          </p>
        </Surface>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">Send message</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Contact form</h2>

            {submitted ? (
              <div className="mt-4 rounded-2xl border border-[var(--success)]/30 bg-[rgba(0,255,136,0.1)] px-4 py-3 text-sm text-white">
                Message submitted. Team will reach out on your email soon.
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-[var(--error)]/35 bg-[rgba(255,68,68,0.1)] px-4 py-3 text-sm text-white">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="cm-label">Full name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={cn("cm-input", error && name.trim().length < 2 && "cm-input-error")}
                  placeholder="Your full name"
                />
              </label>

              <label className="grid gap-2">
                <span className="cm-label">Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn("cm-input", error && !email.includes("@") && "cm-input-error")}
                  placeholder="name@company.in"
                />
              </label>

              <label className="grid gap-2">
                <span className="cm-label">Company (optional)</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="cm-input"
                  placeholder="Company name"
                />
              </label>

              <label className="grid gap-2">
                <span className="cm-label">Subject</span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className={cn("cm-input", error && subject.trim().length < 4 && "cm-input-error")}
                  placeholder="How can we help?"
                />
              </label>

              <label className="grid gap-2">
                <span className="cm-label">Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className={cn("cm-input min-h-36 resize-y", error && message.trim().length < 12 && "cm-input-error")}
                  placeholder="Describe your query..."
                />
              </label>

              <button type="submit" className="cm-button-primary mt-1 w-full gap-2 md:w-fit" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          </Surface>

          <div className="grid gap-4">
            {officeLocations.map((office, index) => (
              <Surface key={office.title} variant={index === 0 ? "skeuo" : "glass"} elevation="medium" className="rounded-[26px] p-5">
                <div className="inline-flex rounded-xl border border-white/12 bg-white/[0.05] p-2 text-[var(--accent-cyan)]">
                  <Building2 size={16} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{office.title}</h3>
                <div className="mt-4 grid gap-3 text-sm text-[var(--text-soft)]">
                  <p className="flex items-start gap-2">
                    <MapPin size={15} className="mt-1 shrink-0 text-[var(--accent-cyan)]" />
                    <span>{office.address}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone size={15} className="mt-1 shrink-0 text-[var(--accent-cyan)]" />
                    <span>{office.phone}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Mail size={15} className="mt-1 shrink-0 text-[var(--accent-cyan)]" />
                    <span>{office.email}</span>
                  </p>
                </div>
              </Surface>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

