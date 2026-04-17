"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/admin-ui/Layouts/sidebar";
import { Header } from "@/components/admin-ui/Layouts/header";
import { Providers } from "@/app/admin/providers";

const ADMIN_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
  "omkargavali2006@gmail.com",
  "tadikondakhamshiq18.23@gmail.com",
  "d53973292@gmail.com",
]);

function isAdmin(email?: string | null) {
  return !!email && ADMIN_EMAILS.has(email.toLowerCase().trim());
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    // Check session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isAdmin(session?.user?.email)) {
        setState("ok");
      } else if (session?.user) {
        // Logged in but not admin
        setState("denied");
        router.replace("/dashboard");
      } else {
        // Not logged in
        setState("denied");
        router.replace("/auth/login?redirect=/admin");
      }
    });

    // Also listen for auth state changes (handles post-login redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isAdmin(session?.user?.email)) {
        setState("ok");
      } else if (session?.user) {
        setState("denied");
        router.replace("/dashboard");
      } else {
        setState("denied");
        router.replace("/auth/login?redirect=/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020d1a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="font-mono text-sm text-cyan-500">$ verifying access...</p>
        </div>
      </div>
    );
  }

  if (state === "denied") return null;

  return (
    <Providers>
      <NextTopLoader color="#00ffff" showSpinner={false} />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
