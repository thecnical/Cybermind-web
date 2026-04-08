import AuthRegisterPageClient from "@/components/AuthRegisterPageClient";
import type { PlanTier } from "@/lib/mockData";

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

