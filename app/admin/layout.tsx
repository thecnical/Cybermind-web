/**
 * CyberMind Admin Layout — powered by NextAdmin template
 *
 * Auth protection: only users with role='admin' in Supabase profiles can access.
 * Redirects to /auth/login if not authenticated.
 * Redirects to /dashboard if authenticated but not admin.
 */
import "@/admin-css/satoshi.css";
import "@/admin-css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AdminAuthGuard } from "@/components/admin-ui/AdminAuthGuard";

export const metadata: Metadata = {
  title: {
    template: "%s | CyberMind Admin",
    default: "CyberMind Admin Dashboard",
  },
  description: "CyberMind platform administration — users, analytics, payments, security.",
  robots: { index: false, follow: false }, // never index admin pages
};

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
