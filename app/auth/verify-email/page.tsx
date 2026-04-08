"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { writeMockSession } from "@/lib/mockAuth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(6);
  const [resendCount, setResendCount] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setVerified(true);
          writeMockSession({
            authenticated: true,
            name: "Chandan Pandey",
            email: "chandan@cybermind.dev",
            avatar: "CP",
            plan: "free",
          });
          window.setTimeout(() => router.push("/dashboard"), 1200);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [router]);

  return (
    <AuthShell
      title="Check your inbox"
      description="We sent a verification link to your email. Once the address is confirmed, the account will continue into the dashboard automatically."
      footer={
        <p>
          Need a different email?{" "}
          <Link href="/auth/register" className="text-white underline decoration-white/20 underline-offset-4">
            Return to signup
          </Link>
        </p>
      }
    >
      <div className="grid gap-5">
        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[22px] border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]">
            {verified ? <CheckCircle2 size={30} /> : <Mail size={30} />}
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">
            {verified ? "Email verified" : "Verification pending"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
            {verified
              ? "Verification received. Redirecting you into CyberMind CLI..."
              : `Listening for your verification callback. Redirect starts in ${seconds}s.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResendCount((current) => current + 1)}
          className="cm-button-secondary w-full gap-2"
        >
          {resendCount > 0 ? <Loader2 size={16} className="animate-spin" /> : null}
          Resend verification email
        </button>

        {resendCount > 0 ? (
          <p className="text-center text-sm text-[var(--text-soft)]">
            Verification email resent {resendCount} {resendCount === 1 ? "time" : "times"}.
          </p>
        ) : null}
      </div>
    </AuthShell>
  );
}
