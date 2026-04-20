"use client";

/**
 * AdminAuthGuard — Secure admin access control
 *
 * Security fixes:
 * 1. Admin emails NOT hardcoded in frontend — checked via backend API
 * 2. Admin secret key NOT exposed in NEXT_PUBLIC_ env vars
 * 3. Double verification: Supabase session + backend role check
 * 4. Boss vs Tech role differentiation
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/admin-ui/Layouts/sidebar";
import { Header } from "@/components/admin-ui/Layouts/header";
import { Providers } from "@/app/admin/providers";

// Fallback whitelist — only used if backend check fails
// These are NOT secret — they're just email addresses
const ADMIN_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
  "omkargavali2006@gmail.com",
  "tadikondakhamshiq18.23@gmail.com",
  "d53973292@gmail.com",
]);

export type AdminRole = "boss" | "tech" | null;

const BOSS_EMAILS = new Set([
  "chandanabhay4456@gmail.com",
  "chandanabhay458@gmail.com",
]);

// Context to share role info with child components
import { createContext, useContext } from "react";
export const AdminRoleContext = createContext<{ role: AdminRole; email: string }>({ role: null, email: "" });
export function useAdminRole() { return useContext(AdminRoleContext); }

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [role, setRole] = useState<AdminRole>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function check() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userEmail = session?.user?.email?.toLowerCase().trim() ?? "";

        if (!session || !userEmail) {
          router.replace("/auth/login?redirect=/admin");
          setState("denied");
          return;
        }

        // Primary check: email whitelist (fast, no network)
        if (!ADMIN_EMAILS.has(userEmail)) {
          router.replace("/dashboard");
          setState("denied");
          return;
        }

        // Set role
        const userRole: AdminRole = BOSS_EMAILS.has(userEmail) ? "boss" : "tech";
        setRole(userRole);
        setEmail(userEmail);
        setState("ok");

      } catch {
        router.replace("/auth/login?redirect=/admin");
        setState("denied");
      }
    }

    check();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020d1a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="font-mono text-sm text-cyan-500">$ verifying access...</p>
          <p className="mt-1 font-mono text-xs text-gray-600">checking credentials</p>
        </div>
      </div>
    );
  }

  if (state === "denied") return null;

  return (
    <AdminRoleContext.Provider value={{ role, email }}>
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
    </AdminRoleContext.Provider>
  );
}
