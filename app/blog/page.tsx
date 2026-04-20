import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — CyberMind CLI",
  description:
    "Security research, AI-powered pentesting guides, bug bounty tips, and the story behind CyberMind CLI.",
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
}

const posts: BlogPost[] = [
  {
    slug: "top-10-bug-bounty-tools-2025",
    title: "Top 10 Bug Bounty Tools in 2025 — What Actually Works",
    excerpt:
      "After running thousands of recon pipelines, we ranked the tools that consistently surface real vulnerabilities — not just noise. Nuclei, httpx, subfinder, and the AI-assisted newcomers that are changing the game.",
    date: "June 12, 2025",
    readTime: "8 min read",
    category: "Bug Bounty",
    categoryColor: "#00ffff",
  },
  {
    slug: "ai-changing-penetration-testing-2025",
    title: "How AI is Changing Penetration Testing in 2025",
    excerpt:
      "LLMs can now generate exploit chains, suggest attack paths from recon data, and write nuclei templates on the fly. We break down what's hype and what's genuinely useful in your pentest workflow.",
    date: "June 5, 2025",
    readTime: "10 min read",
    category: "AI Security",
    categoryColor: "#a78bfa",
  },
  {
    slug: "owasp-top-10-2025",
    title: "OWASP Top 10 2025: What's New and How to Test for It",
    excerpt:
      "The 2025 update brings LLM injection and supply-chain attacks into the top tier. Here's a practical testing checklist for each category, with CyberMind CLI commands you can run right now.",
    date: "May 28, 2025",
    readTime: "12 min read",
    category: "Web Security",
    categoryColor: "#f59e0b",
  },
  {
    slug: "zero-to-bug-bounty-roadmap",
    title: "From Zero to Bug Bounty: Complete Roadmap for Beginners",
    excerpt:
      "No experience? No problem. This step-by-step roadmap covers the tools, platforms, learning resources, and mindset shifts that take you from curious beginner to your first paid report.",
    date: "May 20, 2025",
    readTime: "15 min read",
    category: "Beginner Guide",
    categoryColor: "#34d399",
  },
  {
    slug: "sql-injection-2025",
    title: "SQL Injection in 2025: Still the #1 Web Vulnerability",
    excerpt:
      "Despite decades of awareness, SQLi remains the most exploited vulnerability class. We explore why modern frameworks still miss it, and how to find blind, time-based, and OOB variants with automated tooling.",
    date: "May 14, 2025",
    readTime: "9 min read",
    category: "Web Security",
    categoryColor: "#f59e0b",
  },
  {
    slug: "how-we-built-cybermindcli",
    title: "How We Built an Uncensored Security AI: CyberMind CLI Story",
    excerpt:
      "Most AI tools refuse to discuss offensive security. We built CyberMind CLI to change that — a terminal-first, uncensored AI agent for bug bounty hunters and pentesters. Here's the full story.",
    date: "May 1, 2025",
    readTime: "7 min read",
    category: "Behind the Build",
    categoryColor: "#f472b6",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#080a10] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,255,255,0.25) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#00ffff]/30 bg-[#00ffff]/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#00ffff]">
            Security Research &amp; Guides
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            CyberMind{" "}
            <span className="bg-gradient-to-r from-[#00ffff] to-[#a78bfa] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#8b9ab0]">
            Deep dives into bug bounty, AI-powered pentesting, OWASP vulnerabilities, and the
            engineering behind CyberMind CLI.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(255,255,255,0.03)] p-6 transition-all duration-300 hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)] hover:shadow-[0_0_40px_rgba(0,255,255,0.06)]"
            >
              {/* Category tag */}
              <span
                className="mb-4 inline-block self-start rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: post.categoryColor,
                  background: `${post.categoryColor}18`,
                  border: `1px solid ${post.categoryColor}30`,
                }}
              >
                {post.category}
              </span>

              {/* Title */}
              <h2 className="mb-3 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#00ffff]">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="flex-1 text-sm leading-relaxed text-[#8b9ab0]">{post.excerpt}</p>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span className="font-mono text-xs text-[#4a5568]">{post.date}</span>
                <span className="font-mono text-xs text-[#4a5568]">{post.readTime}</span>
              </div>

              {/* Hover arrow */}
              <span
                aria-hidden
                className="absolute bottom-6 right-6 translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: post.categoryColor }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
