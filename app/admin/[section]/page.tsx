import { notFound } from "next/navigation";
import { AdminSectionPage } from "@/components/admin/admin-pages";
import { adminSectionKeys } from "@/lib/mock-data";

export default async function AdminDynamicPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(adminSectionKeys as readonly string[]).includes(section)) {
    notFound();
  }
  return <AdminSectionPage section={section} />;
}
