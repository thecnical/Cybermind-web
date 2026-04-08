"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, SendHorizonal, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  assistantQuickPrompts,
  findAssistantMatches,
  getContextualPrompts,
} from "@/lib/chatbotKnowledge";
import { cn } from "@/lib/utils";

type MessageLink = {
  href: string;
  label: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  code?: string;
  links?: MessageLink[];
};

function trimSentence(value: string, max = 240) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function dedupeLinks(links: MessageLink[]) {
  const seen = new Set<string>();
  const unique: MessageLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    unique.push(link);
  }
  return unique;
}

function routeHint(pathname: string) {
  if (pathname.startsWith("/install")) {
    return "You are on the install flow. I can generate platform commands and troubleshooting shortcuts.";
  }
  if (pathname.startsWith("/plans")) {
    return "You are on pricing. I can compare Free, Pro, and Elite and suggest the right tier.";
  }
  if (pathname.startsWith("/docs")) {
    return "You are in docs. I can route you to the right section without digging through everything.";
  }
  if (pathname.startsWith("/dashboard")) {
    return "You are in dashboard. I can guide API key, billing, and usage actions.";
  }
  return "Ask about setup, plans, docs, or command workflows.";
}

function buildReply(query: string) {
  const normalized = query.toLowerCase();
  const matches = findAssistantMatches(query, 3);

  if (normalized.includes("hello") || normalized.includes("hi")) {
    return {
      text: "CyberMind assistant online. Ask for install commands, plan guidance, or docs shortcuts.",
      links: [
        { href: "/install", label: "Install guide" },
        { href: "/docs/get-started", label: "Get started docs" },
      ],
    };
  }

  if (matches.length === 0) {
    return {
      text:
        "I could not find a direct match in local project content. Try asking about install, plans, docs commands, API keys, or Linux vs Windows capabilities.",
      links: [
        { href: "/install", label: "Install" },
        { href: "/plans", label: "Plans" },
        { href: "/docs/get-started", label: "Docs" },
      ],
    };
  }

  const top = matches[0];
  const summary = trimSentence(top.content);
  const links = dedupeLinks(
    matches.map((item) => ({
      href: item.href,
      label: item.title,
    })),
  );

  return {
    text: `${top.title}. ${summary}`,
    code: top.command,
    links,
  };
}

function HackerBotAvatar({
  compact = false,
  animate = true,
}: {
  compact?: boolean;
  animate?: boolean;
}) {
  const size = compact ? 44 : 66;
  const eyeMotion = animate ? { opacity: [0.35, 1, 0.35] } : { opacity: 1 };

  return (
    <motion.svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      initial={false}
      animate={animate ? { y: [0, -1.2, 0] } : { y: 0 }}
      transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      aria-hidden="true"
    >
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        fill="rgba(0,255,255,0.08)"
        stroke="rgba(0,255,255,0.35)"
        strokeWidth="1.5"
        animate={animate ? { opacity: [0.5, 0.9, 0.5] } : { opacity: 0.75 }}
        transition={{ duration: 2.3, repeat: Infinity }}
      />
      <rect
        x="22"
        y="24"
        width="52"
        height="42"
        rx="10"
        fill="rgba(9,14,26,0.95)"
        stroke="rgba(138,43,226,0.58)"
        strokeWidth="2"
      />
      <path d="M30 20h36" stroke="rgba(0,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 12v8" stroke="rgba(0,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
      <rect x="29" y="34" width="38" height="10" rx="5" fill="rgba(0,255,255,0.14)" />
      <motion.circle
        cx="38"
        cy="39"
        r="3.2"
        fill="#00FFFF"
        animate={eyeMotion}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.circle
        cx="58"
        cy="39"
        r="3.2"
        fill="#8A2BE2"
        animate={eyeMotion}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
      />
      <path d="M34 54c4 4 24 4 28 0" stroke="rgba(138,43,226,0.92)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 76h56" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M29 76v6m10-6v6m10-6v6m10-6v6" stroke="rgba(0,255,255,0.58)" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function CyberMindAssistant() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const idCounter = useRef(1);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "assistant-0",
      role: "assistant",
      text: `CyberMind assistant ready. ${routeHint(pathname)}`,
      links: [
        { href: "/install", label: "Install" },
        { href: "/docs/get-started", label: "Docs" },
      ],
    },
  ]);

  const promptBank = useMemo(() => {
    const merged = [...getContextualPrompts(pathname), ...assistantQuickPrompts];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const item of merged) {
      const normalized = item.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      unique.push(item);
    }
    return unique.slice(0, 6);
  }, [pathname]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  function makeId(prefix: string) {
    const id = `${prefix}-${idCounter.current}`;
    idCounter.current += 1;
    return id;
  }

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending, open]);

  function submitPrompt(rawPrompt: string) {
    const prompt = rawPrompt.trim();
    if (!prompt || pending) return;

    setInput("");
    setMessages((current) => [...current, { id: makeId("user"), role: "user", text: prompt }]);
    setPending(true);

    // Try real backend first, fall back to local knowledge base
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

    fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, messages: [] }),
      signal: AbortSignal.timeout(15000),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.response) {
          setMessages((current) => [
            ...current,
            {
              id: makeId("assistant"),
              role: "assistant",
              text: data.response,
              links: [
                { href: "/docs/get-started", label: "Docs" },
                { href: "/install", label: "Install" },
              ],
            },
          ]);
        } else {
          throw new Error("empty");
        }
      })
      .catch(() => {
        // Fallback to local knowledge base
        const next = buildReply(prompt);
        setMessages((current) => [
          ...current,
          { id: makeId("assistant"), role: "assistant", ...next },
        ]);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(input);
  }

  return (
    <div className="fixed bottom-5 right-4 z-[78] md:bottom-6 md:right-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="surface-glass mb-3 w-[min(440px,calc(100vw-1.5rem))] rounded-[28px] border border-white/12 bg-[rgba(9,12,20,0.9)] shadow-[0_36px_110px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
              <div className="flex items-center gap-3">
                <HackerBotAvatar compact animate={!reducedMotion} />
                <div>
                  <p className="cm-label">CyberMind assistant</p>
                  <p className="text-sm font-semibold text-white">Terminal support bot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="surface-skeuo rounded-xl border border-white/10 p-2 text-white"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </header>

            <div ref={scrollRef} className="max-h-[48vh] space-y-3 overflow-y-auto px-4 py-4 md:px-5">
              {messages.map((message) => (
                <div key={message.id} className={cn("grid gap-2", message.role === "user" ? "justify-items-end" : "justify-items-start")}>
                  <div
                    className={cn(
                      "max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-6",
                      message.role === "user"
                        ? "border-[var(--accent-cyan)]/35 bg-[rgba(0,255,255,0.1)] text-white"
                        : "border-white/12 bg-white/[0.04] text-[var(--text-main)]",
                    )}
                  >
                    {message.text}
                  </div>

                  {message.code ? (
                    <code className="max-w-[92%] rounded-xl border border-white/10 bg-[#090d18] px-3 py-2 font-mono text-xs text-[var(--accent-cyan)]">
                      {message.code}
                    </code>
                  ) : null}

                  {message.links?.length ? (
                    <div className="flex max-w-[92%] flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={`${message.id}-${link.href}`}
                          href={link.href}
                          className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--text-soft)] transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {pending ? (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[var(--text-soft)]">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-4 py-4 md:px-5">
              <div className="mb-3 flex flex-wrap gap-2">
                {promptBank.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitPrompt(prompt)}
                    className="rounded-full border border-[var(--accent-strong)]/30 bg-[rgba(138,43,226,0.12)] px-3 py-1.5 text-xs text-white transition-colors hover:border-[var(--accent-cyan)]/40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about install, plans, docs, or commands"
                  className="cm-input h-11 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="cm-button-primary h-11 w-11 rounded-xl p-0 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Send message"
                >
                  <SendHorizonal size={16} />
                </button>
              </form>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        initial={false}
        animate={{ scale: open ? 0.98 : 1 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="surface-skeuo group inline-flex items-center gap-3 rounded-2xl border border-[var(--accent-cyan)]/30 bg-[rgba(9,13,24,0.9)] px-3 py-2.5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
        aria-label={open ? "Hide assistant" : "Open assistant"}
      >
        <div className="relative">
          <HackerBotAvatar compact animate={!reducedMotion} />
          <motion.span
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--success)]"
            animate={reducedMotion ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>
        <span className="hidden text-left sm:block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent-cyan)]">
            CyberMind Bot
          </span>
          <span className="mt-1 block text-sm font-medium text-white">
            Ask for quick help
          </span>
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          {open ? <X size={14} /> : <Sparkles size={14} />}
        </span>
      </motion.button>

      <div className="pointer-events-none absolute -top-28 right-0 -z-10 opacity-70">
        <motion.div
          className="h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.24),transparent_64%)]"
          animate={reducedMotion ? { opacity: 0.55 } : { opacity: [0.45, 0.8, 0.45], scale: [0.96, 1.06, 0.96] }}
          transition={{ duration: 3.4, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
