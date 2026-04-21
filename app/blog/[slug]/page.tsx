import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { blogAuthor, blogPosts, getBlogPost, getRelatedBlogPosts } from "@/lib/blogData";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermindcli1.vercel.app";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog post not found | CyberMind CLI",
    };
  }

  return {
    title: `${post.title} | CyberMind CLI`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${BASE_URL}/blog/${post.slug}`,
      images: [
        {
          url: `${BASE_URL}${post.image}`,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${BASE_URL}${post.image}`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.relatedSlugs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    image: [`${BASE_URL}${post.image}`],
    author: {
      "@type": "Person",
      name: blogAuthor.name,
      url: blogAuthor.profileUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "CyberMind CLI",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    keywords: post.tags.join(", "),
  };

  const faqSchema = post.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 pb-24 pt-28 md:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        {faqSchema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        ) : null}

        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04]">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070b] via-[#06070b]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <Link href="/blog" className="text-sm text-[var(--text-soft)] transition-colors hover:text-white">
                Back to blog
              </Link>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ borderColor: `${post.categoryColor}40`, color: post.categoryColor }}
                >
                  {post.category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{formatDate(post.publishedAt)}</span>
                <span className="text-xs text-[var(--text-muted)]">{post.readTime}</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                {post.description}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <article className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <p className="cm-label text-[var(--accent-cyan)]">Key takeaways</p>
              <div className="mt-4 grid gap-3">
                {post.takeaways.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-[var(--text-soft)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="prose-blog mt-8">
              {post.sections.map((section) => (
                <section key={section.title} className="mb-10 last:mb-0">
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.codeBlocks?.map((block) => (
                    <div key={`${section.title}-${block.caption || block.language}`} className="mb-6">
                      {block.caption ? <p className="mb-3 text-sm text-[var(--text-muted)]">{block.caption}</p> : null}
                      <pre>
                        <code>{block.content}</code>
                      </pre>
                    </div>
                  ))}
                  {section.note ? <div className="prose-note">{section.note}</div> : null}
                </section>
              ))}
            </div>

            {post.faq?.length ? (
              <section className="mt-10 rounded-[28px] border border-white/10 bg-black/20 p-5">
                <p className="cm-label text-[var(--accent-cyan)]">FAQ</p>
                <div className="mt-5 grid gap-4">
                  {post.faq.map((item) => (
                    <div key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <h3 className="text-base font-semibold text-white">{item.question}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
              <p className="cm-label text-[var(--accent-cyan)]">Author</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10">
                  <Image src={blogAuthor.image} alt={blogAuthor.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{blogAuthor.name}</p>
                  <p className="text-sm text-[var(--text-soft)]">{blogAuthor.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{blogAuthor.bio}</p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
              <p className="cm-label text-[var(--accent-cyan)]">Context</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[var(--text-soft)]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                {post.basedOn.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-[var(--text-soft)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
              <p className="cm-label text-[var(--accent-cyan)]">Authorized use only</p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
                These articles are written for authorized security testing, defensive validation, and product research. Any offensive workflow should stay inside explicit scope and permission boundaries.
              </p>
            </div>

            {post.references?.length ? (
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
                <p className="cm-label text-[var(--accent-cyan)]">References</p>
                <div className="mt-4 grid gap-3">
                  {post.references.map((reference) => (
                    <a
                      key={reference.href}
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-[var(--text-soft)] transition-colors hover:text-white"
                    >
                      {reference.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <Link href={post.cta.href} className="rounded-[30px] border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 p-5 text-sm leading-7 text-white">
              <p className="cm-label text-[var(--accent-cyan)]">Next step</p>
              <p className="mt-3 text-base font-semibold">{post.cta.label}</p>
            </Link>
          </aside>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <p className="cm-label text-[var(--accent-cyan)]">Related posts</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group overflow-hidden rounded-[28px] border border-white/10 bg-black/20 transition-all hover:border-white/20">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.imageAlt}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: relatedPost.categoryColor }}>
                    {relatedPost.category}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold text-white">{relatedPost.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{relatedPost.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
