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
    "CyberMind CLI — AI Security CLI + VSCode Extension",
    "Terminal-first AI security CLI with 20-tool recon, 11-tool hunt, Abhimanyu exploit mode, VSCode extension, and cybermindcli fine-tuned security AI. Windows & macOS.",
    "/",
    { keywords: ["cybermind CLI","cybermindcli","AI coding assistant","offensive security CLI","penetration testing","bug bounty","MiniMax M2.5","DeepSeek R1","Qwen3 Coder","free AI coding tool","Windows AI coding","cybermind vibe coder","terminal AI coding","ethical hacking CLI","VSCode extension"] }
  ),
  extensions: meta(
    "CyberMind AI for VSCode — Security-Focused VSCode Extension",
    "AI-powered VSCode extension with 8 specialized agents, OWASP security scanning, inline completions, and real file editing. Free tier available.",
    "/extensions",
    { keywords: ["VSCode extension","AI coding","security scanning","OWASP","cybermind VSCode","AI agents","inline completions","code assistant"] }
  ),
  model: meta(
    "cybermindcli — The Uncensored Security AI Model | CyberMind",
    "Fine-tuned security AI model for offensive security research. No safety filters. Trained on pentest data, CVE analysis, and bug bounty workflows.",
    "/model",
    { keywords: ["cybermindcli","security AI model","uncensored AI","pentest AI","bug bounty AI","exploit research","payload generation","HuggingFace model"] }
  ),
  install: meta(
    "Install CyberMind CLI — Windows & macOS One-Command Setup",
    "Install CyberMind CLI on Windows (PowerShell) or macOS in under 2 minutes. Get your API key and start building immediately.",
    "/install",
    { keywords: ["install cybermind CLI","cybermind windows install","cybermind mac install","AI coding assistant install","cybermind setup"] }
  ),
  plans: meta(
    "CyberMind CLI Pricing — Free, Starter, Pro & Elite Plans",
    "Free tier with AI coding + AI chat. Pro with full recon & hunt. Elite with Abhimanyu mode, unlimited requests, and GPT-5/Claude Opus access.",
    "/plans"
  ),
  docs: meta(
    "CyberMind CLI Docs — VSCode Extension, Recon, Hunt, MCP & More",
    "Complete documentation: VSCode extension, MCP integration, Windows/macOS install, slash commands, edit modes, AI providers, and API reference.",
    "/docs"
  ),
  features: meta(
    "CyberMind CLI Features — VSCode Extension, Recon, Hunt, Abhimanyu & AI Chat",
    "VSCode AI extension, 20-tool recon chain, 11-tool hunt engine, Abhimanyu exploit mode, MCP support, 11+ AI providers. Free tier available.",
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
    "Latest updates, bug fixes, and new features in CyberMind CLI.",
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
