"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Trash2, Copy, Check, Terminal, Zap } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  time?: string;
  ts: number;
}

const QUICK_PROMPTS = [
  "Show me all users with elite plan",
  "How to find XSS vulnerabilities?",
  "Explain Log4Shell CVE-2021-44228",
  "Write a nuclei template for SSRF",
  "Best bug bounty programs right now",
  "How to bypass Cloudflare WAF?",
  "Generate a SQL injection payload",
  "Explain OMEGA plan mode",
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  function handleCopy() {
    copyToClipboard(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm ${
        isUser
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
          : "border-purple-500/30 bg-purple-500/10 text-purple-400"
      }`}>
        {isUser ? "👤" : "⚡"}
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-cyan-500/10 border border-cyan-500/20 text-white"
            : "rounded-tl-sm bg-white/[0.04] border border-white/8 text-gray-200"
        }`}>
          {/* Code blocks */}
          {msg.content.split("```").map((part, i) => {
            if (i % 2 === 1) {
              const lines = part.split("\n");
              const lang = lines[0];
              const code = lines.slice(1).join("\n");
              return (
                <div key={i} className="my-2 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  {lang && (
                    <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-3 py-1.5">
                      <span className="font-mono text-xs text-gray-500">{lang}</span>
                      <button onClick={() => copyToClipboard(code)} className="text-xs text-gray-500 hover:text-gray-300">copy</button>
                    </div>
                  )}
                  <pre className="overflow-x-auto p-3 font-mono text-xs text-green-400">{code}</pre>
                </div>
              );
            }
            return <span key={i} className="whitespace-pre-wrap">{part}</span>;
          })}
        </div>

        {/* Meta */}
        <div className={`flex items-center gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {msg.model && (
            <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-gray-600">
              {msg.model}
            </span>
          )}
          {msg.time && (
            <span className="text-[10px] text-gray-600">{msg.time}</span>
          )}
          <button
            onClick={handleCopy}
            className="opacity-0 transition group-hover:opacity-100 text-gray-600 hover:text-gray-400"
          >
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "⚡ CyberMind Admin AI — Elite access active.\n\nI'm your hacker-grade AI assistant. Ask me anything — security research, bug bounty, platform management, or anything else. No filters, no restrictions.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(prompt: string) {
    if (!prompt.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt.trim(),
      ts: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Plan": "elite",  // Admin always gets elite routing
        },
        body: JSON.stringify({ prompt: prompt.trim(), messages: history }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.success ? data.response : `Error: ${data.error || "Unknown error"}`,
        model: data.model,
        time: data.time,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Connection error. Backend may be sleeping — try again in 30s.",
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearChat() {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared. What do you want to hack today? 😈",
      ts: Date.now(),
    }]);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            <Terminal size={20} className="text-cyan-400" />
            Admin AI Chat
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">Elite routing — Claude 3.7 / Bedrock / cybermindcli</p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-gray-400 transition hover:border-red-500/30 hover:text-red-400"
        >
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
              ⚡
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-40"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}
