"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/admin-ui/Layouts/sidebar";
import { Header } from "@/components/admin-ui/Layouts/header";
import { Providers } from "@/app/admin/providers";

// ── Admin email whitelist — no SQL dependency ─────────────────────────────────
// Boss admins + tech team all get admin panel access
const ADMIN_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
  "omkargavali2006@gmail.com",
  "tadikondakhamshiq18.23@gmail.com",
  "d53973292@gmail.com",
]);

type AuthState = "loading" | "authorized" | "unauthorized";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>("loading");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Login page — skip auth check entirely
    if (isLoginPage) {
      setAuthState("authorized");
      return;
    }

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.email) {
          router.replace("/admin/login");
          setAuthState("unauthorized");
          return;
        }

        // Check email whitelist — no DB query needed
        if (!ADMIN_EMAILS.has(session.user.email.toLowerCase())) {
          router.replace("/admin/login");
          setAuthState("unauthorized");
          return;
        }

        setAuthState("authorized");
      } catch {
        router.replace("/admin/login");
        setAuthState("unauthorized");
      }
    }

    checkAuth();
  }, [router, isLoginPage]);

  // Login page — render immediately, no loading state
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020d1a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="font-mono text-sm text-cyan-500">$ verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthorized") return null;

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
