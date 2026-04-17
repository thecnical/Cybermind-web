"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, Bot, Trash2 } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// ── Team members ──────────────────────────────────────────────────────────────
const TEAM: Record<string, { name: string; role: string; color: string; emoji: string }> = {
  "chandanabhay4456@gmail.com": { name: "Chandan",  role: "Boss",       color: "#00ffff", emoji: "👑" },
  "chandanabhay458@gmail.com":  { name: "Chandan2", role: "Boss",       color: "#00ffff", emoji: "👑" },
  "omkargavali2006@gmail.com":  { name: "Omkar",    role: "Tech",       color: "#8a2be2", emoji: "🛠️" },
  "tadikondakhamshiq18.23@gmail.com": { name: "Khamshiq", role: "Tech", color: "#00ff88", emoji: "⚡" },
  "d53973292@gmail.com":        { name: "Dev",      role: "Tech",       color: "#ffd700", emoji: "🔧" },
};

interface ChatMsg {
  id: string;
  sender_email: string;
  sender_name: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

interface OnlineUser {
  email: string;
  last_seen: string;
}

export default function TeamChatPage() {
  const supabase = getSupabase();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [myEmail, setMyEmail]   = useState("");
  const [online, setOnline]     = useState<string[]>([]);
  const [aiMode, setAiMode]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setMyEmail(session.user.email);
    });
  }, []);

  // Load messages
  useEffect(() => {
    loadMessages();
    // Real-time subscription
    const channel = supabase
      .channel("team_chat")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "admin_messages",
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMsg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Scroll to bottom on load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const { data } = await supabase
      .from("admin_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);
    setMessages(data || []);
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !myEmail) return;

    const member = TEAM[myEmail];
    const content = input.trim();
    setInput("");

    // If AI mode — send to AI first
    if (aiMode && content.startsWith("/ai ")) {
      const prompt = content.slice(4);
      setLoading(true);

      // Insert user message
      await supabase.from("admin_messages").insert({
        sender_email: myEmail,
        sender_name: member?.name || myEmail.split("@")[0],
        content: `🤖 ${prompt}`,
        is_ai: false,
      });

      // Get AI response
      try {
        const res = await fetch(`${BACKEND}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-Plan": "elite" },
          body: JSON.stringify({ prompt, messages: [] }),
        });
        const data = await res.json();
        if (data.success) {
          await supabase.from("admin_messages").insert({
            sender_email: "ai@cybermind.dev",
            sender_name: `CyberMind AI (${data.model || "elite"})`,
            content: data.response,
            is_ai: true,
          });
        }
      } catch {}
      setLoading(false);
      return;
    }

    // Regular message
    await supabase.from("admin_messages").insert({
      sender_email: myEmail,
      sender_name: member?.name || myEmail.split("@")[0],
      content,
      is_ai: false,
    });
  }

  const myMember = TEAM[myEmail];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-white/8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-3">
        <div>
          <h1 className="text-base font-bold text-white">Team Chat</h1>
          <p className="text-xs text-gray-500">
            {Object.keys(TEAM).length} members · Real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Online indicators */}
          <div className="flex -space-x-1">
            {Object.entries(TEAM).map(([email, m]) => (
              <div
                key={email}
                title={`${m.name} (${m.role})`}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#020d1a] text-xs"
                style={{ backgroundColor: m.color + "20", borderColor: m.color + "40" }}
              >
                {m.emoji}
              </div>
            ))}
          </div>
          {/* AI mode toggle */}
          <button
            onClick={() => setAiMode(a => !a)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition ${
              aiMode
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-white/8 bg-white/[0.03] text-gray-500"
            }`}
          >
            <Bot size={12} /> AI {aiMode ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-600">No messages yet. Say hi! 👋</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_email === myEmail;
          const member = TEAM[msg.sender_email];
          const isAI = msg.is_ai;

          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm"
                style={{
                  backgroundColor: (isAI ? "#8a2be2" : member?.color || "#666") + "20",
                  borderColor: (isAI ? "#8a2be2" : member?.color || "#666") + "40",
                }}
              >
                {isAI ? "⚡" : member?.emoji || "👤"}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isMe && (
                  <p className="text-[10px] font-medium" style={{ color: member?.color || "#888" }}>
                    {msg.sender_name} · {member?.role || ""}
                  </p>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? "rounded-tr-sm text-white"
                      : isAI
                      ? "rounded-tl-sm border border-purple-500/20 bg-purple-500/10 text-gray-200"
                      : "rounded-tl-sm border border-white/8 bg-white/[0.04] text-gray-200"
                  }`}
                  style={isMe ? {
                    background: `linear-gradient(135deg, ${member?.color || "#00ffff"}20, ${member?.color || "#00ffff"}10)`,
                    borderColor: (member?.color || "#00ffff") + "30",
                    border: "1px solid",
                  } : {}}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className="text-[10px] text-gray-600">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2.5">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-sm">⚡</div>
            <div className="rounded-2xl rounded-tl-sm border border-purple-500/20 bg-purple-500/10 px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* AI mode hint */}
      {aiMode && (
        <div className="border-t border-white/5 bg-cyan-500/5 px-4 py-2 text-xs text-cyan-500">
          💡 AI mode ON — type <code className="font-mono">/ai your question</code> to ask CyberMind AI
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-white/8 bg-white/[0.02] p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={aiMode ? "Type /ai <question> for AI, or just chat..." : "Type a message..."}
            className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/30"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
