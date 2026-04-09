import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.contact;

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
