"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Surface } from "@/components/DesignPrimitives";
import { cn } from "@/lib/utils";

type WaitlistPanelProps = {
  title: string;
  description: string;
  audienceLabel: string;
  baseCount?: number;
  className?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function WaitlistPanel({
  title,
  description,
  audienceLabel,
  baseCount = 1874,
  className,
}: WaitlistPanelProps) {
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("General");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const joinedTotal = useMemo(() => baseCount + joined, [baseCount, joined]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("Enter a valid work email.");
      return;
    }

    if (notes.length > 500) {
      setError("Keep notes under 500 characters.");
      return;
    }

    setError(null);
    setPending(true);

    window.setTimeout(() => {
      setPending(false);
      setSubmitted(true);
      setJoined((current) => current + 1);
      setEmail("");
      setNotes("");
    }, 700);
  }

  return (
    <Surface
      variant="clay"
      tone="accent"
      elevation="high"
      className={cn("rounded-[30px] p-6 md:p-8", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="cm-label">{audienceLabel}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
        </div>
        <span className="cm-pill border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.1)] text-white">
          {joinedTotal.toLocaleString()} on waitlist
        </span>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
        {description}
      </p>

      {submitted ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[var(--success)]/30 bg-[rgba(0,255,136,0.08)] px-4 py-3 text-sm text-white">
          <CheckCircle2 size={18} className="mt-0.5 text-[var(--success)]" />
          <span>
            You are on the waitlist. We will notify you when your track opens.
          </span>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-[var(--error)]/35 bg-[rgba(255,68,68,0.12)] px-4 py-3 text-sm text-white">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="cm-label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn("cm-input", error ? "cm-input-error" : "")}
            placeholder="name@company.com"
            autoComplete="email"
            maxLength={180}
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="cm-label">Track</span>
            <select
              value={track}
              onChange={(event) => setTrack(event.target.value)}
              className="cm-input"
            >
              <option>General</option>
              <option>Security teams</option>
              <option>Independent researchers</option>
              <option>Students</option>
              <option>Enterprise</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="cm-label">Use case notes</span>
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value.slice(0, 500))}
              className="cm-input"
              placeholder="What do you want to use this for?"
            />
          </label>
        </div>

        <button
          type="submit"
          className="cm-button-primary mt-1 w-full gap-2 md:w-fit"
          disabled={pending}
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
          {pending ? "Joining waitlist..." : "Join waitlist"}
        </button>
      </form>
    </Surface>
  );
}
