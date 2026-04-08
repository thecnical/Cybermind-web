import AuthLoginPageClient from "@/components/AuthLoginPageClient";

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

