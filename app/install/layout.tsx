import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.install;

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
