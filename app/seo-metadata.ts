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
    "CyberMind CLI — AI-Powered Bug Bounty & Offensive Security CLI",
    "AI-powered offensive security CLI for bug bounty hunters. OMEGA plan mode, /devsec, /vibe-hack, /chain, /red-team, 20-tool recon, 30-tool hunt, VSCode extension. Free tier. Works on Windows, macOS, Linux.",
    "/",
    { keywords: ["cybermind CLI","bug bounty automation","AI hacking tool","offensive security CLI","penetration testing CLI","kali linux tool","recon automation","cybermindcli","OMEGA plan mode","devsec scanner","vibe hack","red team tool","free security CLI","Windows hacking tool"] }
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
    "CyberMind CLI Features — /devsec, /vibe-hack, /chain, /red-team & More",
    "VSCode AI extension, 20-tool recon, 30-tool hunt, /devsec secret scanning, /vibe-hack autonomous AI hacking, /chain vuln chaining, /red-team campaigns. Free tier available.",
    "/features"
  ),
  linuxModes: meta(
    "Linux Modes — All CyberMind CLI Commands | Kali Linux Security Tool",
    "Complete list of all CyberMind CLI modes on Linux: OMEGA, /recon, /hunt, /abhimanyu, /devsec, /vibe-hack, /chain, /red-team, /osint-deep, /reveng, /breach, /locate. Free to Elite.",
    "/linux-modes",
    { keywords: ["kali linux security tool","linux hacking CLI","offensive security linux","bug bounty linux","recon automation kali","cybermind linux modes","penetration testing linux"] }
  ),
  featureDevsec: meta(
    "/devsec — Developer Security Scanner | CyberMind CLI",
    "Scan GitHub repos and local paths for secrets (trufflehog, gitleaks), SAST issues (semgrep), and vulnerable dependencies (trivy, npm audit, pip-audit). Starter+ plan.",
    "/features/devsec",
    { keywords: ["developer security scanner","secret scanning CLI","SAST tool","dependency audit CLI","trufflehog CLI","gitleaks CLI","semgrep CLI","trivy CLI","devsec tool"] }
  ),
  featureVibeHack: meta(
    "/vibe-hack — Autonomous AI Hacking Session | CyberMind CLI",
    "Autonomous AI hacking session with live SSE streaming. AI decides the next attack step in real-time, explains reasoning, and saves full session transcript. Pro+ plan.",
    "/features/vibe-hack",
    { keywords: ["autonomous AI hacking","AI penetration testing","SSE hacking tool","automated hacking session","AI red team tool","vibe hack","autonomous security testing"] }
  ),
  featureChain: meta(
    "/chain — Vulnerability Chaining Engine | CyberMind CLI",
    "Reads Brain_Memory findings and suggests multi-step exploit chains (SSRF+IDOR→PII leak) with PoC generation and CVSS uplift analysis. Pro+ plan.",
    "/features/chain",
    { keywords: ["vulnerability chaining","exploit chain generator","SSRF IDOR chain","bug chain tool","CVSS uplift","PoC generator","vulnerability escalation"] }
  ),
  featureRedTeam: meta(
    "/red-team — Multi-Day Red Team Campaign | CyberMind CLI",
    "Structured 7-day red team campaign: OSINT, phishing simulation, initial access, lateral movement, persistence, and final report. Mandatory scope validation. Elite plan only.",
    "/features/red-team",
    { keywords: ["red team automation","multi-day red team","red team campaign tool","AI red team","phishing simulation tool","lateral movement automation","red team report generator"] }
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
