"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown, Copy, ExternalLink, Loader2,
  MessageSquarePlus, Minimize2, SendHorizonal,
  Sparkles, Terminal, X, Zap,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  assistantQuickPrompts,
  findAssistantMatches,
  getContextualPrompts,
} from "@/lib/chatbotKnowledge";
import { cn } from "@/lib/utils";
import CyberMindLogo from "@/components/CyberMindLogo";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageLink = { href: string; label: string };
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  code?: string;
  links?: MessageLink[];
  timestamp?: Date;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trimSentence(value: string, max = 280) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function dedupeLinks(links: MessageLink[]) {
  const seen = new Set<string>();
  return links.filter(l => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

function routeHint(pathname: string) {
  if (pathname.startsWith("/install"))   return "You're on the install page. I can generate exact commands for your OS.";
  if (pathname.startsWith("/plans"))     return "You're on pricing. I can compare plans and recommend the right tier.";
  if (pathname.startsWith("/docs"))      return "You're in docs. Ask me anything — I'll route you to the right section.";
  if (pathname.startsWith("/dashboard")) return "You're in dashboard. I can help with API keys, usage, and billing.";
  if (pathname.startsWith("/cbm-code"))  return "You're on CBM Code page. Ask about AI models, commands, or how to start.";
  if (pathname.startsWith("/features"))  return "You're on features. Ask me to explain any capability in detail.";
  return "Ask about install, plans, commands, or any CyberMind feature.";
}

function buildReply(query: string) {
  const normalized = query.toLowerCase();
  const matches = findAssistantMatches(query, 3);

  if (normalized.match(/^(hi|hello|hey|yo|sup)\b/)) {
    return {
      text: "Hey! CyberMind assistant online. I can help with install commands, plan selection, docs, or any CLI question.",
      links: [
        { href: "/install", label: "Install guide" },
        { href: "/docs/get-started", label: "Get started" },
        { href: "/plans", label: "View plans" },
      ],
    };
  }

  if (normalized.includes("price") || normalized.includes("plan") || normalized.includes("cost") || normalized.includes("free")) {
    return {
      text: "CyberMind has 4 tiers: Free (20 req/day), Starter ($4/mo, 200/day), Pro ($14/mo, unlimited + recon/hunt), Elite ($29/mo, Abhimanyu mode + all features).",
      links: [{ href: "/plans", label: "See all plans" }],
    };
  }

  if (normalized.includes("install") || normalized.includes("download") || normalized.includes("setup")) {
    return {
      text: "One-command install on all platforms. Linux/macOS: curl install script. Windows: PowerShell one-liner. Takes under 2 minutes.",
      code: "curl -sL https://cybermindcli1.vercel.app/install.sh | bash",
      links: [{ href: "/install", label: "Full install guide" }],
    };
  }

  if (normalized.includes("cbm") || normalized.includes("vibe") || normalized.includes("code")) {
    return {
      text: "CBM Code is a terminal AI coding assistant — free Claude Code alternative. Supports MiniMax M2.5, DeepSeek R1, Qwen3 Coder, GPT-5. Works on Windows & macOS.",
      code: "cybermind vibe",
      links: [{ href: "/cbm-code", label: "CBM Code page" }, { href: "/docs/cbm-code", label: "Docs" }],
    };
  }

  if (normalized.includes("recon") || normalized.includes("hunt") || normalized.includes("scan")) {
    return {
      text: "Auto recon runs 20+ tools (subfinder, nmap, httpx, nuclei...) in a chained pipeline. Hunt mode runs 30+ tools for XSS, SSRF, IDOR, params. Linux/Kali only.",
      code: "cybermind /recon target.com",
      links: [{ href: "/features", label: "All features" }, { href: "/docs/recon", label: "Recon docs" }],
    };
  }

  if (normalized.includes("api key") || normalized.includes("apikey") || normalized.includes("key")) {
    return {
      text: "Get your API key from the dashboard after signing up. Then set it with: cybermind --key cp_live_xxxxx",
      code: "cybermind --key cp_live_xxxxx",
      links: [{ href: "/dashboard", label: "Dashboard" }],
    };
  }

  if (normalized.includes("windows") || normalized.includes("powershell")) {
    return {
      text: "CyberMind fully supports Windows via PowerShell. CBM Code, AI chat, /scan, /osint, /payload, /cve all work. Recon/hunt requires Linux/Kali.",
      code: `iwr -useb https://cybermindcli1.vercel.app/install.ps1 | iex`,
      links: [{ href: "/install", label: "Windows install" }],
    };
  }

  if (matches.length === 0) {
    return {
      text: "I didn't find a direct match. Try asking about: install commands, plan pricing, CBM Code, recon/hunt tools, API keys, or Windows vs Linux support.",
      links: [
        { href: "/install", label: "Install" },
        { href: "/plans", label: "Plans" },
        { href: "/docs/get-started", label: "Docs" },
      ],
    };
  }

  const top = matches[0];
  return {
    text: `${top.title}. ${trimSentence(top.content)}`,
    code: top.command,
    links: dedupeLinks(matches.map(item => ({ href: item.href, label: item.title }))),
  };
}

function makeInitialMessage(pathname: string): ChatMessage {
  return {
    id: "assistant-0",
    role: "assistant",
    text: `CyberMind assistant ready. ${routeHint(pathname)}`,
    links: [
      { href: "/install", label: "Install" },
      { href: "/docs/get-started", label: "Docs" },
      { href: "/plans", label: "Plans" },
    ],
    timestamp: new Date(),
  };
}

// ─── Bot Avatar — uses CyberMind brand logo ───────────────────────────────────

function BotAvatar({ size = 36, pulse = true }: { size?: number; pulse?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <motion.div
        className="flex items-center justify-center rounded-xl border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.06)]"
        style={{ width: size, height: size }}
        animate={pulse ? { boxShadow: ["0 0 0px rgba(0,255,255,0)", "0 0 12px rgba(0,255,255,0.35)", "0 0 0px rgba(0,255,255,0)"] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <CyberMindLogo size={size * 0.65} />
      </motion.div>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [text]);
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-auto flex-shrink-0 rounded-lg border border-white/10 p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--accent-cyan)]"
      title="Copy command"
    >
      {copied ? <Zap size={11} className="text-[var(--accent-cyan)]" /> : <Copy size={11} />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CyberMindAssistant() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const idCounter = useRef(1);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [makeInitialMessage(pathname)]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasUserMessages = messages.some(m => m.role === "user");

  const promptBank = useMemo(() => {
    const merged = [...getContextualPrompts(pathname), ...assistantQuickPrompts];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const item of merged) {
      const n = item.toLowerCase();
      if (seen.has(n)) continue;
      seen.add(n);
      unique.push(item);
    }
    return unique.slice(0, 6);
  }, [pathname]);

  function makeId(prefix: string) {
    return `${prefix}-${idCounter.current++}`;
  }

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending, open]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimized]);

  function handleNewChat() {
    setMessages([makeInitialMessage(pathname)]);
    setInput("");
    setPending(false);
    idCounter.current = 1;
  }

  function submitPrompt(rawPrompt: string) {
    const prompt = rawPrompt.trim();
    if (!prompt || pending) return;
    setInput("");
    setMinimized(false);
    setMessages(cur => [...cur, {
      id: makeId("user"),
      role: "user",
      text: prompt,
      timestamp: new Date(),
    }]);
    setPending(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";
    fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, messages: [] }),
      signal: AbortSignal.timeout(15000),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.response) {
          setMessages(cur => [...cur, {
            id: makeId("assistant"),
            role: "assistant",
            text: data.response,
            links: [
              { href: "/docs/get-started", label: "Docs" },
              { href: "/install", label: "Install" },
            ],
            timestamp: new Date(),
          }]);
        } else throw new Error("empty");
      })
      .catch(() => {
        const next = buildReply(prompt);
        setMessages(cur => [...cur, {
          id: makeId("assistant"),
          role: "assistant",
          ...next,
          timestamp: new Date(),
        }]);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitPrompt(input);
  }

  return (
    <div className="fixed bottom-4 right-3 z-[78] sm:bottom-5 sm:right-4 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 flex flex-col overflow-hidden rounded-[22px] border border-white/[0.1] bg-[rgba(7,10,18,0.97)] shadow-[0_40px_120px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,255,255,0.06)] backdrop-blur-2xl"
            style={{
              width: "min(420px, calc(100vw - 1.5rem))",
              maxHeight: minimized ? "64px" : "min(580px, calc(100dvh - 130px))",
              transition: "max-height 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* ── Header ── */}
            <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <BotAvatar size={34} pulse={!reducedMotion} />
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
                    CyberMind AI
                  </p>
                  <p className="text-[13px] font-semibold leading-tight text-white">
                    Assistant
                  </p>
                </div>
                {/* Online indicator */}
                <div className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={reducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <span className="font-mono text-[9px] text-emerald-400">online</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNewChat}
                  title="New chat"
                  className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] transition-colors hover:border-[var(--accent-cyan)]/30 hover:text-white"
                  aria-label="New chat"
                >
                  <MessageSquarePlus size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setMinimized(v => !v)}
                  className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] transition-colors hover:text-white"
                  aria-label={minimized ? "Expand" : "Minimize"}
                >
                  {minimized ? <ChevronDown size={13} /> : <Minimize2 size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] transition-colors hover:border-red-500/30 hover:text-red-400"
                  aria-label="Close"
                >
                  <X size={13} />
                </button>
              </div>
            </header>

            {!minimized && (
              <>
                {/* ── Messages ── */}
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
                  style={{ minHeight: 0 }}
                >
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2.5",
                        message.role === "user" ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      {/* Avatar */}
                      {message.role === "assistant" && (
                        <div className="mt-0.5 flex-shrink-0">
                          <BotAvatar size={26} pulse={false} />
                        </div>
                      )}
                      {message.role === "user" && (
                        <div className="mt-0.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.08)]">
                          <Terminal size={12} className="text-[var(--accent-cyan)]" />
                        </div>
                      )}

                      <div className="flex max-w-[82%] flex-col gap-1.5">
                        {/* Bubble */}
                        <div className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-sm leading-[1.65]",
                          message.role === "user"
                            ? "rounded-tr-sm border border-[var(--accent-cyan)]/25 bg-[rgba(0,255,255,0.09)] text-white"
                            : "rounded-tl-sm border border-white/[0.08] bg-white/[0.04] text-[var(--text-main)]",
                        )}>
                          {message.text}
                        </div>

                        {/* Code block */}
                        {message.code && (
                          <div className="flex items-center gap-2 rounded-xl border border-[var(--accent-cyan)]/20 bg-[#060a14] px-3 py-2">
                            <span className="font-mono text-xs text-[var(--accent-cyan)] flex-1 break-all">
                              {message.code}
                            </span>
                            <CopyBtn text={message.code} />
                          </div>
                        )}

                        {/* Links */}
                        {message.links?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {message.links.map(link => (
                              <Link
                                key={`${message.id}-${link.href}`}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] text-[var(--text-soft)] transition-colors hover:border-[var(--accent-cyan)]/30 hover:text-white"
                              >
                                {link.label}
                                <ExternalLink size={9} />
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {pending && (
                    <div className="flex gap-2.5">
                      <BotAvatar size={26} pulse={false} />
                      <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-[var(--text-soft)]">
                        <Loader2 size={12} className="animate-spin text-[var(--accent-cyan)]" />
                        <span>Thinking...</span>
                        <motion.span
                          className="inline-flex gap-0.5"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        >
                          <span className="h-1 w-1 rounded-full bg-[var(--accent-cyan)]" />
                          <span className="h-1 w-1 rounded-full bg-[var(--accent-cyan)]" />
                          <span className="h-1 w-1 rounded-full bg-[var(--accent-cyan)]" />
                        </motion.span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Footer ── */}
                <div className="flex-shrink-0 border-t border-white/[0.08] px-4 pb-4 pt-3">
                  {/* Quick prompts */}
                  <AnimatePresence>
                    {!hasUserMessages && (
                      <motion.div
                        initial={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="mb-3 flex flex-wrap gap-1.5 overflow-hidden"
                      >
                        {promptBank.map(prompt => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => submitPrompt(prompt)}
                            className="rounded-full border border-[var(--accent-strong)]/25 bg-[rgba(138,43,226,0.08)] px-2.5 py-1 text-[11px] text-[var(--text-soft)] transition-all hover:border-[var(--accent-cyan)]/35 hover:bg-[rgba(0,255,255,0.07)] hover:text-white"
                          >
                            {prompt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={onSubmit} className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Ask anything about CyberMind..."
                      className="cm-input h-10 min-w-0 flex-1 rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      disabled={pending || !input.trim()}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-cyan)] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
                      aria-label="Send"
                    >
                      <SendHorizonal size={14} />
                    </button>
                  </form>

                  <p className="mt-2 text-center font-mono text-[9px] text-[var(--text-muted)]">
                    CyberMind AI · Powered by CyberMind backend
                  </p>
                </div>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Trigger Button ── */}
      <motion.button
        type="button"
        onClick={() => { setOpen(v => !v); setMinimized(false); }}
        initial={false}
        animate={{ scale: open ? 0.97 : 1 }}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2.5 rounded-2xl border border-[var(--accent-cyan)]/25 bg-[rgba(7,10,18,0.95)] px-3 py-2.5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:px-3.5"
        aria-label={open ? "Close assistant" : "Open CyberMind assistant"}
      >
        {/* Glow ring on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
          style={{ boxShadow: "0 0 20px rgba(0,255,255,0.15), inset 0 0 20px rgba(0,255,255,0.04)" }}
        />

        <div className="relative flex-shrink-0">
          <BotAvatar size={32} pulse={!reducedMotion && !open} />
          {/* Online dot */}
          <motion.span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[rgba(7,10,18,0.95)]"
            animate={reducedMotion ? {} : { scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <span className="hidden text-left sm:block">
          <span className="block font-mono text-[9px] uppercase tracking-[0.26em] text-[var(--accent-cyan)]">
            CyberMind AI
          </span>
          <span className="mt-0.5 block text-[13px] font-semibold text-white">
            {open ? "Close chat" : "Ask anything"}
          </span>
        </span>

        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-[var(--accent-cyan)]/25">
          <AnimatePresence mode="wait">
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X size={12} /> : <Sparkles size={12} />}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 right-0 -z-10">
        <motion.div
          className="h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.18),transparent_65%)]"
          animate={reducedMotion ? {} : { opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 3.6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
