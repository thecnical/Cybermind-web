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
    default: "CyberMind CLI — AI-Powered Offensive Security CLI",
    template: "%s | CyberMind CLI",
  },
  description:
    "CyberMind CLI is an AI-powered offensive security CLI with interactive AI chat, 20-tool recon chain, 11-tool hunt engine, Abhimanyu exploit mode, and terminal-first workflows.",
  keywords: [
    "cybersecurity CLI", "offensive security", "penetration testing", "bug bounty",
    "AI hacking tool", "recon automation", "ethical hacking", "kali linux",
    "cybermind", "security automation", "nuclei", "subfinder", "nmap",
    "CBM Code", "AI coding assistant", "claude code alternative",
    "terminal AI coding", "MiniMax M2.5", "DeepSeek R1", "Qwen3 Coder",
    "free AI coding tool", "Windows AI coding assistant",
  ],
  authors: [{ name: "Chandan Pandey", url: "https://github.com/thecnical" }],
  creator: "Chandan Pandey",
  publisher: "CyberMind CLI",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.svg?v=2", sizes: "any" },
    ],
    apple: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
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
    title: "CyberMind CLI — AI-Powered Offensive Security CLI",
    description:
      "AI-powered offensive security CLI with recon, hunt, Abhimanyu exploit mode, and terminal-first workflows.",
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
    title: "CyberMind CLI — AI-Powered Offensive Security CLI",
    description: "AI-powered offensive security CLI with recon, hunt, and Abhimanyu exploit mode.",
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
  description: "AI-powered offensive security CLI and CBM Code AI coding assistant for penetration testers and developers.",
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
  description: "AI-powered offensive security CLI with CBM Code AI coding assistant, recon, hunt, and exploit automation.",
  featureList: [
    "CBM Code AI coding assistant (Claude Code alternative)",
    "MiniMax M2.5, DeepSeek R1, Qwen3 Coder support",
    "11+ AI providers with smart routing",
    "20-tool automated recon chain",
    "11-tool hunt engine",
    "Abhimanyu exploit mode",
    "Built-in security scanner",
    "MCP (Model Context Protocol) support",
    "Windows and macOS support",
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

// FAQ schema for CBM Code — helps Google show rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CBM Code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CBM Code is a terminal-based AI coding assistant built into CyberMind CLI. It supports 11+ AI providers including MiniMax M2.5, DeepSeek R1, and Qwen3 Coder. It works on Windows and macOS and is a free alternative to Claude Code.",
      },
    },
    {
      "@type": "Question",
      name: "Is CBM Code free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CBM Code has a free tier where you can bring your own API keys from OpenRouter, Groq, or any provider. No subscription required to start.",
      },
    },
    {
      "@type": "Question",
      name: "Does CBM Code work on Windows?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CBM Code fully supports Windows via PowerShell. Install with one command and launch with 'cybermind vibe' or 'cybermind cbm-code'.",
      },
    },
    {
      "@type": "Question",
      name: "What AI models does CBM Code use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CBM Code supports MiniMax M2.5, DeepSeek R1, Qwen3 Coder, Gemma 4, Llama 3.3 70B, GPT-5, Claude, and 11+ other providers. It auto-routes to the best model for your task.",
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
        {/* Favicon v2 — Neural Shield logo */}
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
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
