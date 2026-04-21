import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { blogPosts } from "@/lib/blogData";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermindcli1.vercel.app";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export const metadata: Metadata = {
  title: "Blog | CyberMind CLI",
  description:
    "Latest 2026 CyberMind blogs on AI security, OMEGA planning, Aegis integration, bug bounty workflows, API security, and operator-grade offensive security strategy.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "CyberMind Blog",
    description:
      "Operator-grade research, release breakdowns, and product strategy for CyberMind CLI, the VSCode extension, OMEGA, and Aegis-powered workflows.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const spotlight = rest.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-24 pt-28 md:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_45%),linear-gradient(135deg,#0b1220,#06070b_65%)] px-6 py-10 md:px-10 md:py-14">
          <div className="absolute inset-0 cm-grid-bg opacity-20" />
          <div className="relative grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <p className="cm-label text-[var(--accent-cyan)]">Research + operator briefs</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                2026 blog library for CyberMind, OMEGA, Aegis, and real-world offensive workflows
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                Every article is written as an operator brief: what is real, what is hype, what ships today, and
                what should be built next if CyberMind wants to become a category-defining company.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["AI Security", "Bug Bounty", "Release Notes", "Aegis", "VSCode", "API Security"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[var(--text-soft)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">{blogPosts.length}+</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">Detailed 2026 articles</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">E-E-A-T</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">Author, context, references, and proof-first structure</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">Weekly</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">Release, product, and workflow updates</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {spotlight.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-[112px_1fr] gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-[var(--accent-cyan)]/40 hover:bg-white/[0.06]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em]" style={{ color: post.categoryColor }}>
                      {post.category}
                    </p>
                    <h2 className="mt-2 text-base font-semibold text-white">{post.title}</h2>
                    <p className="mt-2 text-xs leading-6 text-[var(--text-soft)]">{post.excerpt}</p>
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      {formatDate(post.publishedAt)} · {post.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Link
            href={`/blog/${featured.slug}`}
            className="group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] transition-all hover:border-[var(--accent-cyan)]/40"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 720px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070b] via-[#06070b]/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span
                  className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ borderColor: `${featured.categoryColor}40`, color: featured.categoryColor }}
                >
                  Featured · {featured.category}
                </span>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                  {featured.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>{featured.readTime}</span>
                  <span>{featured.tags.slice(0, 2).join(" · ")}</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6">
            <p className="cm-label text-[var(--accent-cyan)]">Editorial promise</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Why these blog pages rank better and read better</h2>
            <div className="mt-6 grid gap-4">
              {[
                "Every article is tied to real product context, release notes, docs, or repository analysis.",
                "Author context, timestamps, related posts, and references are exposed directly on-page.",
                "Posts are written for search intent and operator clarity, not filler keyword density.",
                "The blog is connected to the homepage and sitemap so discovery improves across the whole site.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-[var(--text-soft)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ borderColor: `${post.categoryColor}40`, color: post.categoryColor }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{post.readTime}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-xs text-[var(--text-muted)]">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
