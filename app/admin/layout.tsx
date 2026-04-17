/**
 * CyberMind Admin Layout — NextAdmin template
 * Auth: Supabase session + profiles.role = 'admin' required
 * NOTE: /admin/login is excluded from AdminAuthGuard (handled in the guard itself)
 */
import "@/admin-css/css/satoshi.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AdminAuthGuard } from "@/components/admin-ui/AdminAuthGuard";

export const metadata: Metadata = {
  title: {
    template: "%s | CyberMind Admin",
    default: "CyberMind Admin",
  },
  description: "CyberMind platform administration.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
