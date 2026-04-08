"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";
import PasswordStrength from "@/components/PasswordStrength";
import PlanOptionCard from "@/components/PlanOptionCard";
import { avatarFromName, writeMockSession } from "@/lib/mockAuth";
import { planDetails, type PlanTier } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function AuthRegisterPageClient({
  initialPlan = "free",
}: {
  initialPlan?: PlanTier;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(initialPlan);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planCards = useMemo(
    () => [
      {
        tier: "free" as const,
        title: "Free",
        price: "$0 / month",
        description: "Start with AI chat, daily request limits, and community support.",
        bullets: ["20 req/day", "AI chat", "5 recon tools"],
      },
      {
        tier: "pro" as const,
        title: "Pro",
        price: "$9 / month",
        description: "Unlock the complete recon and hunt flow with priority backend routing.",
        bullets: ["200 req/day", "20 recon tools", "11 hunt tools"],
      },
      {
        tier: "elite" as const,
        title: "Elite",
        price: "$29 / month",
        description: "Full product surface with persistence, reports, and priority support.",
        bullets: ["Unlimited", "Abhimanyu", "PDF reports"],
      },
    ],
    [],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      setError("Enter your full name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Accept the terms of service to continue.");
      return;
    }

    setError(null);
    setLoading(true);

    window.setTimeout(() => {
      writeMockSession({
        authenticated: true,
        name,
        email,
        avatar: avatarFromName(name),
        plan: selectedPlan,
      });
      router.push("/dashboard");
    }, 1100);
  }

  return (
    <AuthShell
      title="Create your CyberMind account"
      description="Choose a plan, generate your CLI key, and move from signup to first install without leaving the terminal workflow."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white underline decoration-white/20 underline-offset-4">
            Login
          </Link>
        </p>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-[var(--error)]/30 bg-[rgba(255,68,68,0.08)] px-4 py-3 text-sm text-white">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 md:col-span-2">
            <span className="cm-label">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Chandan Pandey"
              className={cn("cm-input", error && name.trim().length < 3 && "cm-input-error")}
              autoComplete="name"
            />
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="cm-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className={cn("cm-input", error && !email.includes("@") && "cm-input-error")}
              autoComplete="email"
            />
          </label>

          <div className="grid gap-2 md:col-span-2">
            <PasswordField
              id="register-password"
              name="password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={error && password.length < 8 ? "Password must be at least 8 characters." : undefined}
            />
            <PasswordStrength password={password} />
          </div>

          <div className="md:col-span-2">
            <PasswordField
              id="register-confirm-password"
              name="confirmPassword"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              error={error && confirmPassword !== password ? "Passwords must match." : undefined}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <span className="cm-label">Choose your plan</span>
          <div className="grid gap-3">
            {planCards.map((card) => (
              <PlanOptionCard
                key={card.tier}
                tier={card.tier}
                title={card.title}
                price={card.price}
                description={`${card.description} ${planDetails[card.tier].description}`}
                bullets={card.bullets}
                selected={selectedPlan === card.tier}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>
        </div>

        <label className="inline-flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-[var(--text-soft)]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-cyan)]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-white underline decoration-white/20 underline-offset-4">
              terms of service
            </Link>
            .
          </span>
        </label>

        <button type="submit" disabled={loading} className="cm-button-primary w-full gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? "Creating account..." : `Create ${planDetails[selectedPlan].name} account`}
        </button>
      </form>
    </AuthShell>
  );
}
