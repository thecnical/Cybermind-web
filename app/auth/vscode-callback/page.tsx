"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberMindLogo from "@/components/CyberMindLogo";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://cybermind-backend-8yrt.onrender.com";

function VscodeCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const state = searchParams.get("state") ?? "";

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

      let plan = "free";
      try {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile?.plan) plan = data.profile.plan;
        }
      } catch { /* use free */ }

      const params = new URLSearchParams({ token, plan, email, state });
      window.location.href = `vscode://cybermind/auth?${params.toString()}`;
    }

    handleCallback();
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#06070B] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <CyberMindLogo size={48} />
        <div className="flex items-center gap-3 text-[#666]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" />
          <span className="text-sm">Completing sign-in...</span>
        </div>
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
