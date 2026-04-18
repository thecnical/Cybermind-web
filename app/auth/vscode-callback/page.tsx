"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

function VscodeCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const state = searchParams.get("state") ?? "";
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const vscodeUriRef = useRef("");

  useEffect(() => {
    async function handleCallback() {
      let session = (await supabase.auth.getSession()).data.session;

      if (!session?.access_token) {
        await new Promise(r => setTimeout(r, 1500));
        session = (await supabase.auth.getSession()).data.session;
      }

      if (!session?.access_token) {
        router.replace(`/auth/vscode?state=${state}`);
        return;
      }

      const token = session.access_token;
      const email = session.user?.email ?? "";

      let userPlan = "free";
      try {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile?.plan) userPlan = data.profile.plan;
        }
      } catch { /* use free */ }

      const params = new URLSearchParams({ token, plan: userPlan, email, state });
      vscodeUriRef.current = `vscode://cybermind.cybermind-vscode/auth?${params.toString()}`;
      setUserEmail(email);
      setPlan(userPlan);
      setReady(true);
    }

    handleCallback();
  }, [state, router]);

  function handleOpenVSCode() {
    if (vscodeUriRef.current) {
      window.location.href = vscodeUriRef.current;
    }
  }

  return (
    <div className="min-h-screen bg-[#06070B] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <CyberMindLogo size={48} />

        {!ready ? (
          <>
            <div className="flex items-center gap-3 text-[#666]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
              <span className="text-sm">Completing sign-in...</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div>
              <p className="text-lg font-semibold text-white">Signed in!</p>
              <p className="mt-1 text-sm text-[#888]">{userEmail}</p>
              <span className="mt-2 inline-block rounded-full border border-[#00ffff]/30 bg-[#00ffff]/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#00ffff]">
                {plan}
              </span>
            </div>

            <button
              onClick={handleOpenVSCode}
              className="w-full rounded-xl bg-[#00ffff] py-4 text-base font-bold text-black transition-all hover:bg-[#00cccc] active:scale-95"
            >
              ⚡ Open VSCode
            </button>

            <p className="text-xs text-[#555] leading-5">
              Click above to return to VSCode.<br />
              If a browser dialog appears, click <strong className="text-white">Open</strong>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VscodeCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
      </div>
    }>
      <VscodeCallbackInner />
    </Suspense>
  );
}
