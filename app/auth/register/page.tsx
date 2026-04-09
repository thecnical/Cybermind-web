import AuthRegisterPageClient from "@/components/AuthRegisterPageClient";
import type { PlanTier } from "@/lib/mockData";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.register;

function toPlanTier(value: string | string[] | undefined): PlanTier {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "pro" || raw === "elite" || raw === "free") {
    return raw;
  }
  return "free";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const initialPlan = toPlanTier(params.plan);

  return <AuthRegisterPageClient initialPlan={initialPlan} />;
}

