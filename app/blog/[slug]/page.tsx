import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const title = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} — CyberMind Blog`,
    description: "CyberMind CLI security research and guides.",
  };
}

export default function BlogPostPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-[#080a10] text-white">
      <section className="relative overflow-hidden px-4 pb-24 pt-32">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,255,255,0.2) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-[#8b9ab0] transition-colors hover:text-[#00ffff]"
          >
            ← Back to Blog
          </Link>

          {/* Coming soon card */}
          <div className="mt-8 rounded-2xl border border-[#00ffff]/20 bg-[rgba(0,255,255,0.04)] p-12">
            <div className="mb-4 text-5xl">🔐</div>
            <h1 className="mb-3 text-2xl font-bold text-white">Coming Soon</h1>
            <p className="text-[#8b9ab0]">
              This article is being written. Check back soon — we publish new security research
              every week.
            </p>
            <Link
              href="/blog"
              className="mt-8 inline-block rounded-xl border border-[#00ffff]/30 bg-[#00ffff]/10 px-6 py-3 font-mono text-sm text-[#00ffff] transition-all hover:bg-[#00ffff]/20"
            >
              Browse all posts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
