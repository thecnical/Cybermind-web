"use client";

/**
 * AdminAuthGuard — wraps the entire admin panel with auth + role check.
 *
 * Flow:
 *  1. Check Supabase session
 *  2. If no session → redirect to /auth/login?redirect=/admin
 *  3. If session but role != 'admin' → redirect to /dashboard
 *  4. If admin → render NextAdmin shell with children
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/admin-ui/Layouts/sidebar";
import { Header } from "@/components/admin-ui/Layouts/header";
import { Providers } from "@/app/admin/providers";

type AuthState = "loading" | "authorized" | "unauthorized" | "not-admin";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/auth/login?redirect=/admin");
          setAuthState("unauthorized");
          return;
        }

        // Check role in profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role !== "admin") {
          router.replace("/dashboard");
          setAuthState("not-admin");
          return;
        }

        setAuthState("authorized");
      } catch {
        router.replace("/auth/login?redirect=/admin");
        setAuthState("unauthorized");
      }
    }

    checkAuth();
  }, [router]);

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020d1a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#5750F1] border-t-transparent" />
          <p className="text-sm text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (authState !== "authorized") {
    return null; // redirecting
  }

  return (
    <Providers>
      <NextTopLoader color="#5750F1" showSpinner={false} />
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
