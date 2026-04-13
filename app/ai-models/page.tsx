import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";
import type { Metadata } from "next";
import { PAGE_META } from "@/app/seo-metadata";

export const metadata: Metadata = PAGE_META.aiModels;

const page = {
  title: "AI Models",
  eyebrow: "11+ Providers · 50+ Models",
  description:
    "CyberMind routes across 11 AI providers with 50+ models. Groq + Cerebras + NVIDIA NIM race simultaneously — fastest response wins. Uncensored models prioritized for security research.",
  command: "cybermind --providers",
  sections: [
    {
      title: "Provider Strategy — Speed + Reliability",
      body:
        "CyberMind races multiple providers simultaneously. Groq, Cerebras, and NVIDIA NIM run in parallel — first valid response wins. If all fast providers fail, OpenRouter free models race next, then sequential fallback.",
      bullets: [
        "Step 1: Race Groq + Cerebras + NVIDIA NIM simultaneously (~500 tok/s)",
        "Step 2: Race 20+ OpenRouter free models in parallel",
        "Step 3: Sequential fallback — GitHub, Mistral, SambaNova, Cloudflare",
        "Zero downtime — if one provider fails, next takes over instantly",
        "Response cache — repeated prompts served in <10ms",
      ],
    },
    {
      title: "NVIDIA NIM Models (Free — build.nvidia.com)",
      body:
        "NVIDIA NIM provides free API access to powerful models. CyberMind uses these for specific tasks where they excel.",
      bullets: [
        "google/gemma-2-27b-it — Best for security analysis, recon planning, general chat",
        "microsoft/phi-3.5-mini — Fast code generation, CBM Code tasks",
        "mistralai/mamba-codestral-7b-v0.1 — Code specialist, CBM Code",
        "microsoft/phi-3-medium-128k-instruct — 128K context, large file analysis",
        "tiiuae/falcon3-7b-instruct — Fast lightweight responses",
        "google/gemma-7b — Fast general purpose",
        "zhipuai/chatglm3-6b — Multilingual support",
        "minimax/minimax-m2.7 — Multimodal tasks",
        "stable-diffusion-3-medium — Image generation (diagrams, screenshots)",
      ],
    },
    {
      title: "OpenRouter Free Models (20+ models)",
      body:
        "OpenRouter provides access to 20+ free models. Uncensored models are prioritized for security research — no safety filters blocking offensive security content.",
      bullets: [
        "minimax/minimax-m2.5:free — MiniMax M2.5, excellent for code",
        "qwen/qwen3-coder:free — Qwen3 Coder, specialized for code",
        "google/gemma-4-31b-it:free — Gemma 4 31B, strong general + code",
        "cognitivecomputations/dolphin-mistral-24b:free — Uncensored, no safety filters",
        "nousresearch/hermes-3-llama-3.1-405b:free — Uncensored 405B",
        "nvidia/nemotron-3-super-120b:free — NVIDIA Nemotron 120B",
        "meta-llama/llama-3.3-70b-instruct:free — Llama 3.3 70B",
        "openai/gpt-oss-120b:free — GPT OSS 120B",
        "20+ more models in rotation",
      ],
    },
    {
      title: "Fast Providers — Groq + Cerebras",
      body:
        "Groq and Cerebras use custom silicon for ultra-fast inference. Used for real-time chat and quick responses.",
      bullets: [
        "Groq: llama-3.3-70b-versatile, kimi-k2, qwen3-32b, llama-4-scout (~500 tok/s)",
        "Cerebras: qwen-3-235b, llama3.1-8b (custom wafer-scale chip)",
        "Both race simultaneously — first response wins",
        "Typical response time: 1-3 seconds",
      ],
    },
    {
      title: "Other Providers",
      body:
        "Additional providers for redundancy and specialized tasks.",
      bullets: [
        "GitHub Models: gpt-4o, gpt-4o-mini, deepseek-r1, phi-4, llama-3.1-405b (free 150 req/day)",
        "Mistral: mistral-large, magistral-medium, ministral-8b",
        "SambaNova: llama3.3-70b, qwen3-32b",
        "Cloudflare Workers AI: llama-3.3-70b, deepseek-r1, qwen2.5-72b (free 10k neurons/day)",
        "AICC: gpt-5.4-pro, claude-opus-4, deepseek-v3.2, gemini-2.5-flash, grok-4.1",
        "HuggingFace: open source models",
      ],
    },
    {
      title: "Plan-Based Model Access",
      body:
        "Different plans get access to different model tiers.",
      bullets: [
        "Free: All free models (Groq, Cerebras, OpenRouter free, NVIDIA NIM free)",
        "Starter: Same as free + managed API keys",
        "Pro: + web search, image generation (Stable Diffusion 3)",
        "Elite: + GPT-5, Claude Opus 4, all premium models via AICC",
      ],
    },
  ],
};

export default function AIModelsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={page} />
      <Footer />
    </div>
  );
}
