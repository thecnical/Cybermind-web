"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCheck, ChevronRight, Loader2, MessageSquare,
  RefreshCw, Send, Shield, Sparkles, Terminal, X,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberMindLogo from "@/components/CyberMindLogo";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Sender = "user" | "bot" | "admin";

interface Message {
  id: string;
  sender: Sender;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  plan: string;
  created_at: string;
}

type Step = "form" | "chat";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

// ─── Quick prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "How do I install CyberMind CLI?",
  "My API key is not working",
  "How do I upgrade my plan?",
  "VSCode extension not responding",
  "Recon mode not running on Linux",
  "Billing / payment issue",
];

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";
  const isAdmin = msg.sender === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {!isUser && (
        <div className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border",
          isAdmin
            ? "border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)]"
            : "border-purple-500/30 bg-[rgba(138,43,226,0.08)]"
        )}>
          {isAdmin ? (
            <Shield size={13} className="text-[var(--accent-cyan)]" />
          ) : (
            <CyberMindLogo size={16} />
          )}
        </div>
      )}
      {isUser && (
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)]">
          <Terminal size={12} className="text-[var(--accent-cyan)]" />
        </div>
      )}

      <div className="flex max-w-[80%] flex-col gap-1">
        {/* Sender label */}
        <span className={cn(
          "font-mono text-[9px] uppercase tracking-[0.2em]",
          isUser ? "text-right text-[var(--accent-cyan)]" : "text-[var(--text-muted)]"
        )}>
          {isUser ? "You" : isAdmin ? "CyberMind Team" : "CyberMind Bot"}
        </span>

        {/* Bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-[1.65]",
          isUser
            ? "rounded-tr-sm border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.08)] text-white"
            : isAdmin
            ? "rounded-tl-sm border border-[var(--accent-cyan)]/25 bg-[rgba(0,255,255,0.05)] text-white"
            : "rounded-tl-sm border border-white/[0.08] bg-white/[0.04] text-[var(--text-main)]"
        )}>
          {msg.content}
        </div>

        {/* Timestamp + read status */}
        <div className={cn(
          "flex items-center gap-1 font-mono text-[9px] text-[var(--text-muted)]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isUser && msg.is_read && <CheckCheck size={10} className="text-[var(--accent-cyan)]" />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-[rgba(138,43,226,0.08)]">
        <CyberMindLogo size={16} />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-4 py-3">
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const { user, profile } = useAuth();

  // Form state
  const [name, setName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Chat state
  const [step, setStep] = useState<Step>("form");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [needsHuman, setNeedsHuman] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from auth
  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    if (profile?.full_name && !name) setName(profile.full_name);
  }, [user, profile]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (step === "chat") {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [step]);

  // ── Create ticket ──────────────────────────────────────────────────────────
  async function handleCreateTicket(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!email.includes("@")) { setFormError("Enter a valid email"); return; }
    if (subject.trim().length < 4) { setFormError("Subject too short"); return; }
    if (firstMessage.trim().length < 5) { setFormError("Message too short"); return; }

    setFormLoading(true);
    try {
      const res = await fetch(`${BACKEND}/support/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          subject: subject.trim(),
          message: firstMessage.trim(),
          user_id: user?.id || undefined,
          plan: profile?.plan || "free",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to create ticket");
        return;
      }

      // Build initial messages
      const now = new Date().toISOString();
      const initMessages: Message[] = [
        {
          id: "user-0",
          sender: "user",
          content: firstMessage.trim(),
          created_at: now,
          is_read: true,
        },
        {
          id: "bot-0",
          sender: "bot",
          content: data.bot_reply,
          created_at: now,
          is_read: true,
        },
      ];

      setTicket({
        id: data.ticket_id,
        subject: subject.trim(),
        status: "open",
        plan: profile?.plan || "free",
        created_at: now,
      });
      setMessages(initMessages);
      setNeedsHuman(data.needs_human || false);
      setSuggestedLinks(data.suggested_links || []);
      setStep("chat");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Send follow-up message ─────────────────────────────────────────────────
  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const msg = input.trim();
    if (!msg || sending || !ticket) return;

    setInput("");
    setSending(true);
    setTyping(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: msg,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch(`${BACKEND}/support/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticket.id,
          email: email.trim(),
          message: msg,
        }),
      });
      const data = await res.json();
      setTyping(false);

      if (data.success) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: data.bot_reply,
          created_at: new Date().toISOString(),
          is_read: true,
        };
        setMessages(prev => [...prev, botMsg]);
        if (data.needs_human) setNeedsHuman(true);
        if (data.suggested_links?.length) setSuggestedLinks(data.suggested_links);
      }
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: "bot",
        content: "Connection error. Please try again.",
        created_at: new Date().toISOString(),
        is_read: true,
      }]);
    } finally {
      setSending(false);
    }
  }

  // ── Quick prompt ───────────────────────────────────────────────────────────
  function useQuickPrompt(prompt: string) {
    if (step === "form") {
      setFirstMessage(prompt);
      if (!subject) setSubject(prompt.slice(0, 60));
    } else {
      setInput(prompt);
    }
  }

  // ─── Render: Form step ─────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 pb-20 pt-28 md:px-8">

          {/* Hero */}
          <div className="rounded-[32px] border border-white/[0.08] bg-[rgba(7,10,18,0.8)] p-7 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)]">
                <MessageSquare size={18} className="text-[var(--accent-cyan)]" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent-cyan)]">Support</p>
                <h1 className="text-xl font-semibold text-white">CyberMind Support</h1>
              </div>
            </div>
            <p className="text-[var(--text-soft)] text-sm leading-6 max-w-2xl">
              Get help with installation, API keys, plans, VSCode extension, recon/hunt tools, or anything else.
              Our AI bot responds instantly — complex issues are escalated to the team.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(7,10,18,0.6)] p-6 md:p-8">
              <h2 className="text-lg font-semibold text-white mb-5">Start a conversation</h2>

              {formError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Name (optional)</span>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="cm-input"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Email *</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="cm-input"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                </div>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Subject *</span>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="cm-input"
                    placeholder="What do you need help with?"
                    required
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Message *</span>
                  <textarea
                    value={firstMessage}
                    onChange={e => setFirstMessage(e.target.value)}
                    className="cm-input min-h-32 resize-y"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="cm-button-primary gap-2 w-full sm:w-fit"
                >
                  {formLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Starting chat...</>
                  ) : (
                    <><Send size={14} /> Start chat</>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Quick prompts */}
              <div className="rounded-[24px] border border-white/[0.08] bg-[rgba(7,10,18,0.6)] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">Common issues</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => useQuickPrompt(p)}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left text-xs text-[var(--text-soft)] transition-colors hover:border-[var(--accent-cyan)]/25 hover:text-white"
                    >
                      <ChevronRight size={11} className="flex-shrink-0 text-[var(--accent-cyan)]" />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="rounded-[24px] border border-white/[0.08] bg-[rgba(7,10,18,0.6)] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">Response time</p>
                <div className="flex flex-col gap-2 text-xs text-[var(--text-soft)]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={11} className="text-[var(--accent-cyan)]" />
                    <span>AI bot: instant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={11} className="text-[var(--accent-cyan)]" />
                    <span>Human team: within 24h</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-[var(--text-muted)]">
                    Or email us directly:{" "}
                    <a href="mailto:support@cybermind.thecnical.dev" className="text-[var(--accent-cyan)] hover:underline">
                      support@cybermind.thecnical.dev
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Render: Chat step ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-8 pt-28 md:px-8" style={{ height: "100dvh" }}>

        {/* Chat header */}
        <div className="mb-4 flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-[rgba(7,10,18,0.8)] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)]">
              <MessageSquare size={14} className="text-[var(--accent-cyan)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[200px]">{ticket?.subject}</p>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="font-mono text-[9px] text-emerald-400">
                  {needsHuman ? "Team notified" : "Bot online"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
              ticket?.status === "open" ? "bg-emerald-500/15 text-emerald-400" :
              ticket?.status === "in_progress" ? "bg-yellow-500/15 text-yellow-400" :
              "bg-white/10 text-[var(--text-muted)]"
            )}>
              {ticket?.status?.replace("_", " ")}
            </span>
            <button
              type="button"
              onClick={() => { setStep("form"); setTicket(null); setMessages([]); }}
              className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] hover:text-white"
              title="New ticket"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto overscroll-contain rounded-[20px] border border-white/[0.08] bg-[rgba(7,10,18,0.6)] p-4"
          style={{ minHeight: 0 }}
        >
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>

          {typing && <TypingIndicator />}

          {/* Needs human notice */}
          {needsHuman && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-300"
            >
              <Shield size={12} className="inline mr-1.5" />
              Your issue has been escalated to our team. We'll respond within 24 hours.
            </motion.div>
          )}

          {/* Suggested links */}
          {suggestedLinks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {suggestedLinks.map(link => (
                <Link
                  key={link}
                  href={link}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-[var(--text-soft)] hover:text-white"
                >
                  {link.replace(/^\//, "")}
                  <ChevronRight size={9} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick prompts (only before first user reply) */}
        {messages.filter(m => m.sender === "user").length <= 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.slice(0, 4).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => useQuickPrompt(p)}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-[var(--text-soft)] hover:border-[var(--accent-cyan)]/25 hover:text-white"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="cm-input h-11 flex-1 rounded-xl text-sm"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="cm-button-primary h-11 w-11 flex-shrink-0 rounded-xl p-0 disabled:opacity-50"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>

        <p className="mt-2 text-center font-mono text-[9px] text-[var(--text-muted)]">
          Ticket #{ticket?.id?.slice(0, 8)} · {email}
        </p>
      </main>
    </div>
  );
}
