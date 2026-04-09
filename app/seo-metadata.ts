/**
 * Centralized SEO metadata for all pages.
 * Import and re-export from each page file.
 */
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermind.thecnical.dev";

function meta(
  title: string,
  description: string,
  path: string,
  extra?: Partial<Metadata>
): Metadata {
  const url = `${BASE}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "CyberMind CLI",
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}/og-image.png`],
    },
    ...extra,
  };
}

export const PAGE_META = {
  home: meta(
    "CyberMind CLI — AI-Powered Offensive Security CLI",
    "Terminal-first AI security CLI with 20-tool recon, 11-tool hunt engine, Abhimanyu exploit mode, and interactive AI chat. Built for pentesters and bug bounty hunters.",
    "/"
  ),
  install: meta(
    "Install CyberMind CLI — One-Command Setup",
    "Install CyberMind CLI on Linux, Kali, Windows, or macOS with a single command. Get your API key and start hacking in minutes.",
    "/install"
  ),
  plans: meta(
    "CyberMind CLI Pricing — Free, Pro & Elite Plans",
    "Choose your CyberMind CLI plan. Free tier with AI chat, Pro with full recon & hunt, Elite with Abhimanyu mode and unlimited requests.",
    "/plans"
  ),
  docs: meta(
    "CyberMind CLI Documentation",
    "Complete documentation for CyberMind CLI — commands, modes, API reference, and integration guides.",
    "/docs"
  ),
  features: meta(
    "CyberMind CLI Features — Recon, Hunt, Abhimanyu & AI Chat",
    "Explore CyberMind CLI features: 20-tool recon chain, 11-tool hunt engine, Abhimanyu exploit mode, and AI-powered cybersecurity chat.",
    "/features"
  ),
  about: meta(
    "About CyberMind CLI — Built by Security Researchers",
    "CyberMind CLI is built by Chandan Pandey and the thecnical team for offensive security professionals and bug bounty hunters.",
    "/about"
  ),
  contact: meta(
    "Contact CyberMind CLI — Support & Enterprise",
    "Get in touch with the CyberMind CLI team for product support, enterprise queries, and partnership opportunities.",
    "/contact"
  ),
  resources: meta(
    "CyberMind CLI Resources — Tools, Guides & Extensions",
    "Security tools, guides, extensions, and resources curated for CyberMind CLI users.",
    "/resources"
  ),
  course: meta(
    "CyberMind CLI Course — Learn Offensive Security",
    "Learn offensive security, penetration testing, and bug bounty hunting with the CyberMind CLI course.",
    "/course"
  ),
  changelog: meta(
    "CyberMind CLI Changelog — Updates & Releases",
    "Latest updates, bug fixes, and new features in CyberMind CLI.",
    "/changelog"
  ),
  aiModels: meta(
    "CyberMind CLI AI Models — Multi-Provider AI Routing",
    "CyberMind CLI uses multi-provider AI routing across GPT-4, Claude, Gemini, and open-source models for best-in-class security responses.",
    "/ai-models"
  ),
  getTools: meta(
    "Get Security Tools — CyberMind CLI Tool Installer",
    "Install all required security tools for CyberMind CLI with one command. Recon, hunt, and exploit tools for Kali Linux.",
    "/get-tools"
  ),
  careers: meta(
    "Careers at CyberMind CLI",
    "Join the CyberMind CLI team. We're looking for security researchers, developers, and designers.",
    "/careers"
  ),
  privacy: meta(
    "Privacy Policy — CyberMind CLI",
    "CyberMind CLI privacy policy — how we collect, use, and protect your data.",
    "/privacy",
    { robots: { index: false, follow: false } }
  ),
  terms: meta(
    "Terms of Service — CyberMind CLI",
    "CyberMind CLI terms of service and acceptable use policy.",
    "/terms",
    { robots: { index: false, follow: false } }
  ),
  login: meta(
    "Log In — CyberMind CLI",
    "Log in to your CyberMind CLI account to access your API keys, usage stats, and billing.",
    "/auth/login",
    { robots: { index: false, follow: false } }
  ),
  register: meta(
    "Create Account — CyberMind CLI",
    "Sign up for CyberMind CLI. Choose your plan and get your API key in minutes.",
    "/auth/register",
    { robots: { index: false, follow: false } }
  ),
};
