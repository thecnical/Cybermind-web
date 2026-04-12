import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermind.thecnical.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages — highest priority
    { url: BASE_URL,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/cbm-code`,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/install`,             lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE_URL}/plans`,               lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    // Docs
    { url: `${BASE_URL}/docs`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/docs/cbm-code`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/docs/installation`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/docs/quickstart`,     lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE_URL}/docs/commands`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/docs/providers`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/docs/ai-chat`,        lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/docs/recon`,          lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/docs/hunt`,           lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/docs/faq`,            lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Marketing
    { url: `${BASE_URL}/features`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/ai-models`,           lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/course`,              lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/changelog`,           lastModified: now, changeFrequency: "weekly",  priority: 0.65 },
    { url: `${BASE_URL}/get-tools`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/careers`,             lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Legal
    { url: `${BASE_URL}/privacy`,             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terms`,               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/cookies`,             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/aup`,                 lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  return staticRoutes;
}
