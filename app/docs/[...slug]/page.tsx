import { notFound } from "next/navigation";
import { DocsPageView } from "@/components/SitePrimitives";
import { cybermindDocRoutes, getDocPage } from "@/lib/siteContent";

export function generateStaticParams() {
  return cybermindDocRoutes.map((route) => ({
    slug: route.split("/"),
  }));
}

export default async function DynamicDocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = slug.join("/");

  if (!cybermindDocRoutes.includes(route as (typeof cybermindDocRoutes)[number])) {
    notFound();
  }

  return <DocsPageView page={getDocPage(route)} />;
}
