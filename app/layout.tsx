import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CyberMindAssistant from "@/components/CyberMindAssistant";
import CookieConsent from "@/components/CookieConsent";
import CursorAura from "@/components/CursorAura";
import NewFeaturesBanner from "@/components/NewFeaturesBanner";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermindcli1.vercel.app";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-admin-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CyberMind CLI — AI-Powered Offensive Security, Bug Bounty & Coding CLI",
    template: "%s | CyberMind CLI",
  },
  description:
    "CyberMind CLI — AI-powered offensive security CLI for bug bounty hunters. OMEGA plan mode, 20-tool recon, 30-tool hunt, /devsec secret scanning, /vibe-hack autonomous AI hacking, /chain vuln chaining, /red-team campaigns. Works on Windows, macOS, Linux.",
  keywords: [
    // Primary — high search volume
    "cybersecurity CLI", "offensive security tool", "penetration testing CLI",
    "bug bounty automation", "AI hacking tool", "ethical hacking CLI",
    "kali linux security tool", "automated recon tool", "vulnerability scanner",
    // Product-specific
    "cybermind CLI", "cybermind security", "cybermindcli AI model",
    "OMEGA plan mode", "Abhimanyu exploit mode", "recon automation tool",
    // New v4.4.0 modes — long-tail SEO
    "developer security scanner", "devsec CLI", "secret scanning tool",
    "SAST CLI tool", "dependency audit CLI", "trufflehog gitleaks CLI",
    "autonomous AI hacking", "vibe hack tool", "SSE hacking session",
    "vulnerability chaining tool", "exploit chain generator", "red team campaign tool",
    "multi-day red team CLI", "red team automation",
    // AI coding
    "AI coding assistant terminal", "VSCode security extension", "free Claude Code alternative",
    "terminal AI coding", "cybermind vibe coder",
    // Providers
    "DeepSeek R1 CLI", "Qwen3 Coder", "GPT-5 security tool",
    // Platform
    "windows hacking tool", "kali linux automation", "linux security CLI",
  ],
  authors: [{ name: "Chandan Pandey", url: "https://github.com/thecnical" }],
  creator: "Chandan Pandey",
  publisher: "CyberMind CLI",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "CyberMind CLI",
    title: "CyberMind CLI — AI-Powered Offensive Security, Bug Bounty & Coding CLI",
    description:
      "AI-powered offensive security CLI for bug bounty hunters. OMEGA plan mode, /devsec, /vibe-hack, /chain, /red-team, 20-tool recon, 30-tool hunt, VSCode extension. Free tier available.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CyberMind CLI — AI-Powered Offensive Security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberMind CLI — AI-Powered Offensive Security & Bug Bounty CLI",
    description: "OMEGA plan mode, /devsec, /vibe-hack, /chain, /red-team — AI-powered offensive security CLI for bug bounty hunters. Free tier available.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@thecnical",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

// JSON-LD structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CyberMind CLI",
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description: "AI-powered offensive security CLI and VSCode extension for penetration testers and developers.",
  founder: { "@type": "Person", name: "Chandan Pandey", url: "https://github.com/thecnical" },
  sameAs: ["https://github.com/thecnical", "https://twitter.com/thecnical"],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CyberMind CLI",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "SecurityApplication",
  operatingSystem: "Windows, macOS",
  url: BASE_URL,
  downloadUrl: `${BASE_URL}/install`,
  description: "AI-powered offensive security CLI with VSCode extension, recon, hunt, and exploit automation.",
  featureList: [
    "cybermindcli fine-tuned security AI model",
    "DeepSeek R1, Qwen3 Coder, GPT-5, Claude support",
    "11+ AI providers with smart routing",
    "20-tool automated recon chain",
    "30-tool hunt engine",
    "Abhimanyu exploit mode (Elite)",
    "/devsec — Developer Security Scanner (Starter+)",
    "/vibe-hack — Autonomous AI hacking with SSE (Pro+)",
    "/chain — Vulnerability chaining engine (Pro+)",
    "/red-team — Multi-day red team campaign (Elite)",
    "OMEGA plan mode — 10-phase autonomous pipeline",
    "Built-in security scanner",
    "MCP (Model Context Protocol) support",
    "Windows, macOS, Linux support",
  ],
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free Plan" },
    { "@type": "Offer", price: "4", priceCurrency: "USD", name: "Starter Plan" },
    { "@type": "Offer", price: "14", priceCurrency: "USD", name: "Pro Plan" },
    { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Elite Plan" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "127",
    bestRating: "5",
  },
};

// FAQ schema for CyberMind — helps Google show rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CyberMind CLI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CyberMind CLI is an AI-powered offensive security CLI with a VSCode extension, 20-tool recon chain, OMEGA plan mode, Abhimanyu exploit mode, and four new v4.4.0 modes: /devsec, /vibe-hack, /chain, and /red-team.",
      },
    },
    {
      "@type": "Question",
      name: "Is CyberMind CLI free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CyberMind CLI has a free tier with 20 requests/day, AI chat, and basic scanning. Paid plans start at $4/month (Starter) for full recon, hunt, and /devsec mode.",
      },
    },
    {
      "@type": "Question",
      name: "Does CyberMind CLI work on Windows?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CyberMind CLI fully supports Windows via PowerShell. AI chat, /scan, /osint, /breach, /cve, /payload, and /devsec all work on Windows. Recon/hunt/Abhimanyu require Linux/Kali.",
      },
    },
    {
      "@type": "Question",
      name: "What AI models does CyberMind CLI use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CyberMind CLI supports DeepSeek R1, Qwen3 Coder, GPT-5, Claude Opus 4, Llama 3.3 70B, and 11+ other providers. It auto-routes to the best model for your task and plan tier.",
      },
    },
    {
      "@type": "Question",
      name: "What is /devsec mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "/devsec is CyberMind's Developer Security Scanner. It scans GitHub repos and local paths for secrets (trufflehog, gitleaks), SAST issues (semgrep), and vulnerable dependencies (trivy, npm audit, pip-audit). Available on Starter+ plan.",
      },
    },
    {
      "@type": "Question",
      name: "What is /vibe-hack mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "/vibe-hack is an autonomous AI hacking session where the AI decides the next attack step, streams results live via SSE, and saves a full session transcript. Available on Pro+ plan.",
      },
    },
    {
      "@type": "Question",
      name: "What is /red-team mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "/red-team is a structured 7-day red team campaign with mandatory scope validation, AI-guided phases (OSINT, phishing, initial access, lateral movement, persistence, report), and state persistence between sessions. Elite plan only.",
      },
    },
    {
      "@type": "Question",
      name: "How do I connect a custom domain to CyberMind on Vercel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deploy on Vercel, then go to Project Settings > Domains > Add Domain. In your domain registrar (Hostinger, GoDaddy), add a CNAME record pointing to cname.vercel-dns.com, or an A record pointing to 76.76.21.21. Vercel auto-provisions SSL.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        {/* Favicon — official CyberMind brand icon */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* Force cache bust on logo/favicon */}
        <meta name="theme-color" content="#00FFFF" />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body suppressHydrationWarning className={`${plusJakartaSans.className} app-theme antialiased`}>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-[var(--accent-cyan)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <CursorAura />
            {children}
            <NewFeaturesBanner />
            <CyberMindAssistant />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
