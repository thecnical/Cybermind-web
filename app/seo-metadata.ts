/**
 * Centralized SEO metadata — CyberMind CLI
 * Site URL: https://cybermindcli1.vercel.app
 */
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://cybermindcli1.vercel.app";

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
      title, description, url,
      siteName: "CyberMind CLI",
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: [`${BASE}/og-image.png`],
      creator: "@thecnical",
      site: "@thecnical",
    },
    ...extra,
  };
}

export const PAGE_META = {
  home: meta(
    "CyberMind CLI — AI Security CLI + CBM Code AI Coding Assistant",
    "Terminal-first AI security CLI with 20-tool recon, 11-tool hunt, Abhimanyu exploit mode, and CBM Code — the free Claude Code alternative with MiniMax M2.5, DeepSeek R1, Qwen3 Coder. Windows & macOS.",
    "/",
    { keywords: ["cybermind CLI","CBM Code","AI coding assistant","claude code alternative","offensive security CLI","penetration testing","bug bounty","MiniMax M2.5","DeepSeek R1","Qwen3 Coder","free AI coding tool","Windows AI coding","cybermind vibe coder","terminal AI coding","ethical hacking CLI"] }
  ),
  cbmCode: meta(
    "CBM Code — Free AI Coding Assistant | Claude Code Alternative | CyberMind",
    "CBM Code is a terminal-based AI coding assistant with 11+ providers (MiniMax M2.5, DeepSeek R1, Qwen3 Coder), free tier, MCP support, built-in security scanner. Works on Windows & macOS. Better than Claude Code.",
    "/cbm-code",
    { keywords: ["CBM Code","AI coding assistant","claude code alternative","MiniMax M2.5","DeepSeek R1 coding","Qwen3 Coder","free AI coding tool","Windows AI coding","cybermind vibe coder","AI code editor terminal","free claude code alternative","AI pair programmer terminal","coding AI CLI","MCP AI coding","terminal coding assistant"] }
  ),
  install: meta(
    "Install CyberMind CLI — Windows & macOS One-Command Setup",
    "Install CyberMind CLI on Windows (PowerShell) or macOS in under 2 minutes. Get your API key, launch CBM Code AI coding assistant, start building immediately.",
    "/install",
    { keywords: ["install cybermind CLI","cybermind windows install","cybermind mac install","CBM Code install","AI coding assistant install","cybermind setup","install CBM Code Windows","install CBM Code macOS"] }
  ),
  plans: meta(
    "CyberMind CLI Pricing — Free, Starter, Pro & Elite Plans",
    "Free tier with CBM Code AI coding + AI chat. Pro with full recon & hunt. Elite with Abhimanyu mode, unlimited requests, and GPT-5/Claude Opus access.",
    "/plans"
  ),
  docs: meta(
    "CyberMind CLI Docs — CBM Code, Recon, Hunt, MCP & More",
    "Complete documentation: CBM Code AI coding assistant, MCP integration, Windows/macOS install, slash commands, edit modes, AI providers, and API reference.",
    "/docs"
  ),
  features: meta(
    "CyberMind CLI Features — CBM Code, Recon, Hunt, Abhimanyu & AI Chat",
    "CBM Code AI coding assistant, 20-tool recon chain, 11-tool hunt engine, Abhimanyu exploit mode, MCP support, 11+ AI providers. Free tier available.",
    "/features"
  ),
  about: meta(
    "About CyberMind CLI — Built by Security Researchers & Developers",
    "CyberMind CLI is built by Chandan Pandey and the thecnical team for offensive security professionals, bug bounty hunters, and developers who want AI-powered tools.",
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
    "CyberMind CLI Course — Learn Offensive Security with AI",
    "Learn offensive security, penetration testing, and bug bounty hunting with the CyberMind CLI course.",
    "/course"
  ),
  changelog: meta(
    "CyberMind CLI Changelog — Updates & Releases",
    "Latest updates, bug fixes, and new features in CyberMind CLI and CBM Code.",
    "/changelog"
  ),
  aiModels: meta(
    "AI Models — MiniMax M2.5, DeepSeek R1, Qwen3 Coder, GPT-5 & More | CyberMind",
    "CyberMind CLI routes across MiniMax M2.5, DeepSeek R1, Qwen3 Coder, GPT-5, Claude Opus, Gemini, Groq, Bytez, Nvidia, and 11+ providers for best-in-class responses.",
    "/ai-models"
  ),
  getTools: meta(
    "Get Security Tools — CyberMind CLI Tool Installer",
    "Install all required security tools for CyberMind CLI with one command.",
    "/get-tools"
  ),
  careers: meta(
    "Careers at CyberMind CLI",
    "Join the CyberMind CLI team. We are looking for security researchers, developers, and designers.",
    "/careers"
  ),
  privacy: meta("Privacy Policy — CyberMind CLI","CyberMind CLI privacy policy.","/privacy",{ robots: { index: false, follow: false } }),
  terms: meta("Terms of Service — CyberMind CLI","CyberMind CLI terms of service.","/terms",{ robots: { index: false, follow: false } }),
  login: meta("Log In — CyberMind CLI","Log in to your CyberMind CLI account.","/auth/login",{ robots: { index: false, follow: false } }),
  register: meta("Create Account — CyberMind CLI","Sign up for CyberMind CLI. Free tier available.","auth/register",{ robots: { index: false, follow: false } }),
};
