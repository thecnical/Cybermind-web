"use client";

import { cn } from "@/lib/utils";

export type StrengthLevel = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): StrengthLevel {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 3) return "strong";
  if (score === 2) return "medium";
  return "weak";
}

const toneClasses: Record<StrengthLevel, string> = {
  weak: "bg-[var(--error)]",
  medium: "bg-[var(--warning)]",
  strong: "bg-[var(--success)]",
};

export default function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const level = password ? (strength === "weak" ? 1 : strength === "medium" ? 2 : 3) : 0;

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-2 flex-1 rounded-full bg-white/8 transition-colors",
              segment <= level && toneClasses[strength],
            )}
          />
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
        Password strength: <span className="text-white">{password ? strength : "pending"}</span>
      </p>
    </div>
  );
}
