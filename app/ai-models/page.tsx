"use client";

import Link from "next/link";
import { Brain, Code2, Cpu, Globe, Shield, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Surface, Reveal } from "@/components/DesignPrimitives";
import CyberMindLogo from "@/components/CyberMindLogo";

// ─── Data ─────────────────────────────────────────────────────────────────────

const nvidiaModels = [
  {
    name: "MiniMax M2.7",
    id: "minimaxai/minimax-m2.7",
    badge: "PRIMARY CODING AGENT",
    badgeColor: "#00FFFF",
    params: "230B",
    context: "65K",
    desc: "Main coding agent. Complex software engineering, agentic tool use, Agent Teams, dynamic tool search. Deeply participates in its own evolution.",
    tags: ["Coding", "Agentic", "Tool Use", "Complex Tasks"],
    icon: "🧠",
  },
  {
    name: "Kimi K2 Thinking",
    id: "moonshotai/kimi-k2-thinking",
    badge: "REASONING",
    badgeColor: "#8A2BE2",
    params: "1T MoE",
    context: "256K",
    desc: "Most capable open-source thinking model. Reasons step-by-step while dynamically invoking tools. 256K context window.",
    tags: ["Reasoning", "Tool Use", "Long Context"],
    icon: "💭",
  },
  {
    name: "Kimi K2 Instruct",
    id: "moonshotai/kimi-k2-instruct",
    badge: "INSTRUCTION",
    badgeColor: "#7B5FFF",
    params: "1T MoE",
    context: "131K",
    desc: "State-of-the-art MoE model with 32B activated parameters. Excellent for coding and instruction following.",
    tags: ["Coding", "Instruction", "MoE"],
    icon: "⚡",
  },
  {
    name: "GLM-4.7",
    id: "z-ai/glm4_7",
    badge: "AGENTIC CODING",
    badgeColor: "#00FF88",
    params: "7B",
    context: "32K",
    desc: "Multilingual agentic coding partner. Stronger reasoning, tool use, UI generation, and terminal-based tasks.",
    tags: ["Multilingual", "UI Gen", "Terminal"],
    icon: "🌐",
  },
  {
    name: "Phi-3.5 Mini",
    id: "microsoft/phi-3_5-mini-instruct",
    badge: "FAST CODE",
    badgeColor: "#FFD700",
    params: "3.8B",
    context: "128K",
    desc: "Microsoft's compact powerhouse. Fast code generation with 128K context. Perfect for quick tasks.",
    tags: ["Fast", "Code", "Compact"],
    icon: "🚀",
  },
  {
    name: "Phi-3 Medium 128K",
    id: "microsoft/phi-3-medium-128k-instruct",
    badge: "LONG CONTEXT",
    badgeColor: "#FF6600",
    params: "14B",
    context: "128K",
    desc: "128K context window for analyzing large codebases, long documents, and complex multi-file tasks.",
    tags: ["128K Context", "Large Files", "Analysis"],
    icon: "📄",
  },
  {
    name: "Mamba Codestral 7B",
    id: "mistralai/mamba-codestral-7b-v0.1",
    badge: "CODE SPECIALIST",
    badgeColor: "#FF4444",
    params: "7B",
    context: "256K",
    desc: "Mistral's code specialist. Optimized purely for code generation with 256K context.",
    tags: ["Code Only", "256K", "Mistral"],
    icon: "💻",
  },
  {
    name: "Gemma 2 27B",
    id: "google/gemma-2-27b-it",
    badge: "SECURITY ANALYSIS",
    badgeColor: "#00CFFF",
    params: "27B",
    context: "8K",
    desc: "Google's best open model. Used for security analysis, OMEGA plan generation, and recon AI.",
    tags: ["Security", "Analysis", "Google"],
    icon: "🔍",
  },
  {
    name: "Falcon 3 7B",
    id: "tiiuae/falcon3-7b-instruct",
    badge: "FAST",
    badgeColor: "#777777",
    params: "7B",
    context: "32K",
    desc: "TII's fast lightweight model. Quick responses for simple tasks and chat.",
    tags: ["Fast", "Lightweight"],
    icon: "🦅",
  },
];

const otherProviders = [
  {
    name: "Groq",
    icon: "⚡",
    color: "#FFD700",
    desc: "Custom silicon — ~500 tok/s",
    models: ["Kimi K2 Instruct", "Qwen3 32B", "Llama 3.3 70B", "Llama 4 Scout"],
    badge: "FASTEST",
  },
  {
    name: "Cerebras",
    icon: "🧬",
    color: "#00FF88",
    desc: "Wafer-scale chip inference",
    models: ["Qwen3 235B", "Llama 3.1 8B"],
    badge: "ULTRA FAST",
  },
  {
    name: "OpenRouter",
    icon: "🔀",
    color: "#8A2BE2",
    desc: "20+ free models in parallel race",
    models: ["MiniMax M2.5", "Qwen3 Coder", "Gemma 4 31B", "Dolphin (Uncensored)", "Hermes 405B", "GPT OSS 120B"],
    badge: "FREE MODELS",
  },
  {
    name: "GitHub Models",
    icon: "🐙",
    color: "#E0E0E0",
    desc: "150 req/day free per token",
    models: ["GPT-4o", "DeepSeek R1", "Phi-4", "Llama 3.1 405B", "Mistral Large"],
    badge: "FREE",
  },
  {
    name: "Mistral",
    icon: "🌪️",
    color: "#FF6600",
    desc: "European AI, strong code",
    models: ["Mistral Large", "Magistral Medium", "Codestral", "Ministral 8B"],
    badge: "RELIABLE",
  },
  {
    name: "AICC (Elite)",
    icon: "👑",
    color: "#FFD700",
    desc: "Premium models for Elite plan",
    models: ["GPT-5.4 Pro", "Claude Opus 4 Thinking", "DeepSeek V3.2", "Gemini 2.5 Flash", "Grok 4.1"],
    badge: "ELITE ONLY",
  },
  {
    name: "Cloudflare",
    icon: "☁️",
    color: "#FF6B35",
    desc: "10K neurons/day free",
    models: ["Llama 3.3 70B", "DeepSeek R1", "Qwen 2.5 72B", "Mistral 7B"],
    badge: "FREE",
  },
  {
    name: "SambaNova",
    icon: "🔥",
    color: "#FF4444",
    desc: "High-throughput inference",
    models: ["Llama 3.3 70B", "Qwen3 32B"],
    badge: "FAST",
  },
];

const routingFlow = [
  { step: "1", label: "Fast Race", desc: "Groq + Cerebras + NVIDIA NIM race simultaneously", color: "#00FFFF", icon: "⚡" },
  { step: "2", label: "OpenRouter Race", desc: "20+ free models race in parallel — first wins", color: "#8A2BE2", icon: "🔀" },
  { step: "3", label: "Sequential Fallback", desc: "GitHub → Mistral → SambaNova → Cloudflare", color: "#FFD700", icon: "🔄" },
  { step: "4", label: "Cache Hit", desc: "Repeated prompts served in <10ms from cache", color: "#00FF88", icon: "💾" },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ModelCard({ model, index }: { model: typeof nvidiaModels[0]; index: number }) {
  const isPrimary = model.badge === "PRIMARY CODING AGENT";
  return (
    <Reveal delay={index * 0.04}>
      <div className={`relative overflow-hidden rounded-[24px] border p-5 h-full flex flex-col transition-all hover:scale-[1.01] ${
        isPrimary
          ? "border-[var(--accent-cyan)]/40 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.1),transparent_50%),rgba(7,10,18,0.9)]"
          : "border-white/[0.08] bg-[rgba(7,10,18,0.6)] hover:border-white/[0.15]"
      }`}>
        {isPrimary && (
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.8),transparent)]" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{model.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">{model.name}</h3>
              <p className="font-mono text-[9px] text-[var(--text-muted)] mt-0.5">{model.id}</p>
            </div>
          </div>
          <span
            className="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider"
            style={{ background: `${model.badgeColor}18`, color: model.badgeColor, border: `1px solid ${model.badgeColor}30` }}
          >
            {model.badge}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-center">
            <p className="font-mono text-[9px] text-[var(--text-muted)]">Params</p>
            <p className="font-mono text-xs font-semibold text-white">{model.params}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-center">
            <p className="font-mono text-[9px] text-[var(--text-muted)]">Context</p>
            <p className="font-mono text-xs font-semibold text-white">{model.context}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-5 text-[var(--text-soft)] flex-1 mb-3">{model.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {model.tags.map(tag => (
            <span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ProviderCard({ provider, index }: { provider: typeof otherProviders[0]; index: number }) {
  const isElite = provider.badge === "ELITE ONLY";
  return (
    <Reveal delay={index * 0.03}>
      <div className={`rounded-[20px] border p-4 h-full ${
        isElite
          ? "border-[#FFD700]/20 bg-[rgba(255,215,0,0.04)]"
          : "border-white/[0.07] bg-[rgba(7,10,18,0.5)]"
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{provider.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">{provider.name}</h3>
              <p className="text-[10px] text-[var(--text-muted)]">{provider.desc}</p>
            </div>
          </div>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[8px] font-bold uppercase"
            style={{ background: `${provider.color}15`, color: provider.color, border: `1px solid ${provider.color}25` }}
          >
            {provider.badge}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {provider.models.map(m => (
            <span key={m} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-[var(--text-soft)]">
              {m}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIModelsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-20 pt-28 md:px-8">

        {/* Hero */}
        <Reveal>
          <Surface variant="glass" tone="cyan" elevation="high" className="cm-noise-overlay rounded-[36px] p-7 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="cm-label">AI Models</p>
                <h1 className="cm-heading-shift mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                  11 providers. 55+ models. Zero downtime.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
                  CyberMind races multiple AI providers simultaneously. Groq + Cerebras + NVIDIA NIM run in parallel — fastest response wins. MiniMax M2.7 is the primary coding agent.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)] px-5 py-4 text-center">
                  <p className="font-mono text-3xl font-bold text-[var(--accent-cyan)]">55+</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Models</p>
                </div>
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] px-5 py-4 text-center">
                  <p className="font-mono text-3xl font-bold text-purple-400">11</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Providers</p>
                </div>
              </div>
            </div>
          </Surface>
        </Reveal>

        {/* Routing Flow */}
        <Reveal>
          <div>
            <p className="cm-label mb-4">How routing works</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {routingFlow.map((step) => (
                <div key={step.step} className="rounded-[20px] border border-white/[0.07] bg-[rgba(7,10,18,0.6)] p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold"
                      style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                    >
                      {step.step}
                    </div>
                    <span className="text-lg">{step.icon}</span>
                    <p className="text-sm font-semibold text-white">{step.label}</p>
                  </div>
                  <p className="text-xs leading-5 text-[var(--text-soft)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* NVIDIA NIM Models */}
        <div>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)]">
                <Cpu size={15} className="text-[var(--accent-cyan)]" />
              </div>
              <div>
                <p className="cm-label">NVIDIA NIM — build.nvidia.com</p>
                <p className="text-xs text-[var(--text-muted)]">Free API · OpenAI-compatible · Fast inference</p>
              </div>
              <div className="ml-auto rounded-full border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)] px-3 py-1 font-mono text-[10px] text-[var(--accent-cyan)]">
                {nvidiaModels.length} models
              </div>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nvidiaModels.map((model, i) => (
              <ModelCard key={model.id} model={model} index={i} />
            ))}
          </div>
        </div>

        {/* Other Providers */}
        <div>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/[0.08]">
                <Globe size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="cm-label">Other Providers</p>
                <p className="text-xs text-[var(--text-muted)]">Fallback chain — zero downtime</p>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherProviders.map((provider, i) => (
              <ProviderCard key={provider.name} provider={provider} index={i} />
            ))}
          </div>
        </div>

        {/* Plan Access */}
        <Reveal>
          <Surface variant="glass" elevation="medium" className="rounded-[28px] p-6 md:p-8">
            <p className="cm-label mb-5">Plan-based model access</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  plan: "Free",
                  color: "#777777",
                  models: ["All NVIDIA NIM free models", "OpenRouter 20+ free models", "Groq + Cerebras", "GitHub Models (150/day)"],
                },
                {
                  plan: "Starter",
                  color: "#FFD700",
                  models: ["Everything in Free", "Managed API keys", "MiniMax M2.7 (primary)", "Kimi K2 Thinking"],
                },
                {
                  plan: "Pro",
                  color: "#00CFFF",
                  models: ["Everything in Starter", "Web search + Image gen", "Stable Diffusion 3", "Codestral (code)"],
                },
                {
                  plan: "Elite",
                  color: "#8A2BE2",
                  models: ["Everything in Pro", "GPT-5.4 Pro", "Claude Opus 4 Thinking", "Gemini 2.5 Flash", "Grok 4.1"],
                },
              ].map((tier) => (
                <div key={tier.plan} className="rounded-[20px] border border-white/[0.07] bg-white/[0.03] p-4">
                  <p
                    className="mb-3 font-mono text-xs font-bold uppercase tracking-wider"
                    style={{ color: tier.color }}
                  >
                    {tier.plan}
                  </p>
                  <ul className="space-y-1.5">
                    {tier.models.map(m => (
                      <li key={m} className="flex items-start gap-1.5 text-xs text-[var(--text-soft)]">
                        <span style={{ color: tier.color }} className="mt-0.5 flex-shrink-0">✓</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Surface>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/[0.07] bg-[rgba(7,10,18,0.6)] p-8 text-center">
            <CyberMindLogo size={48} />
            <h2 className="text-2xl font-semibold text-white">Start using all these models today</h2>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-soft)]">
              Free tier includes NVIDIA NIM, OpenRouter free models, Groq, Cerebras, and GitHub Models. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/auth/register" className="cm-button-primary gap-2">
                <Sparkles size={14} /> Get started free
              </Link>
              <Link href="/plans" className="cm-button-secondary gap-2">
                View plans
              </Link>
            </div>
          </div>
        </Reveal>

      </main>
      <Footer />
    </div>
  );
}
