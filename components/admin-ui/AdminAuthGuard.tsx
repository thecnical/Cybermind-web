"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/admin-ui/Layouts/sidebar";
import { Header } from "@/components/admin-ui/Layouts/header";
import { Providers } from "@/app/admin/providers";

// All 5 team members who can access admin panel
const ADMIN_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
  "omkargavali2006@gmail.com",
  "tadikondakhamshiq18.23@gmail.com",
  "d53973292@gmail.com",
]);

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    // Use getUser() for fresh auth check (not cached getSession)
    supabase.auth.getUser().then(({ data: { user } }) => {
      const email = user?.email?.toLowerCase() ?? "";
      if (ADMIN_EMAILS.has(email)) {
        setState("ok");
      } else {
        setState("denied");
        router.replace("/auth/login?redirect=/admin");
      }
    }).catch(() => {
      setState("denied");
      router.replace("/auth/login?redirect=/admin");
    });
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
