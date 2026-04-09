import AuthLoginPageClient from "@/components/AuthLoginPageClient";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.login;

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const reset = params.reset;
  const resetSuccess = Array.isArray(reset) ? reset.includes("success") : reset === "success";

  return <AuthLoginPageClient resetSuccess={resetSuccess} />;
}

