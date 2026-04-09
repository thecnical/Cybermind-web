import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.plans;

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
