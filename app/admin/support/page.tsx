"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://cybermind-backend-8yrt.onrender.com";

interface Ticket {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  subject: string;
  status: string;
  priority: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  sender: "user" | "bot" | "admin";
  content: string;
  created_at: string;
  is_read: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  in_progress: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  resolved: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  closed: "bg-white/10 text-gray-400 border-white/10",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-400",
  normal: "text-gray-300",
  high: "text-yellow-400",
  urgent: "text-red-400",
};

export default function AdminSupportPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setAuthed(true);
    loadTickets(adminKey.trim());
  }

  async function loadTickets(key?: string) {
    const k = key || adminKey;
    setLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? `${BACKEND}/support/tickets`
          : `${BACKEND}/support/tickets?status=${statusFilter}`;
      const res = await fetch(url, { headers: { "x-admin-key": k } });
      const data = await res.json();
      if (data.success) setTickets(data.tickets || []);
      else setAuthError(data.error || "Failed to load");
    } catch {
      setAuthError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    setMsgLoading(true);
    try {
      const res = await fetch(
        `${BACKEND}/support/ticket-detail/${ticket.id}`,
        { headers: { "x-admin-key": adminKey } },
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticket.id ? { ...t, unread_count: 0 } : t,
          ),
        );
      }
    } catch {
      // ignore
    } finally {
      setMsgLoading(false);
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const res = await fetch(`${BACKEND}/support/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          message: reply.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `admin-${Date.now()}`,
            sender: "admin",
            content: reply.trim(),
            created_at: new Date().toISOString(),
            is_read: false,
          },
        ]);
        setReply("");
      }
    } catch {
      // ignore
    } finally {
      setReplying(false);
    }
  }

  async function updateStatus(ticketId: string, status: string) {
    try {
      await fetch(`${BACKEND}/support/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ ticket_id: ticketId, status }),
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status } : t)),
      );
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      // ignore
    }
  }

  // ── Auth screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0f1a2e] p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <Shield size={20} className="text-blue-400" />
            <h1 className="text-lg font-semibold text-white">
              Support Admin
            </h1>
          </div>
          {authError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {authError}
            </div>
          )}
          <form onSubmit={handleAuth} className="grid gap-3">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin secret key"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              autoFocus
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              <Shield size={14} /> Access tickets
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main admin UI ────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 overflow-hidden">
      {/* Ticket list */}
      <div className="flex w-80 flex-shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-base font-semibold text-white">
            <MessageSquare size={16} className="text-blue-400" />
            Support Tickets
          </h1>
          <button
            type="button"
            onClick={() => loadTickets()}
            className="rounded-xl border border-white/10 p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                statusFilter === s
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                  : "border-white/10 text-gray-400 hover:text-white",
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-blue-400" />
            </div>
          )}
          {!loading && tickets.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              No tickets
            </p>
          )}
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket)}
              className={cn(
                "w-full rounded-2xl border p-3 text-left transition-colors",
                selectedTicket?.id === ticket.id
                  ? "border-blue-500/30 bg-blue-500/[0.06]"
                  : "border-white/[0.06] bg-[#0f1a2e] hover:border-white/[0.12]",
              )}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <p className="flex-1 truncate text-xs font-medium text-white">
                  {ticket.subject}
                </p>
                {ticket.unread_count > 0 && (
                  <span className="flex-shrink-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {ticket.unread_count}
                  </span>
                )}
              </div>
              <p className="mb-2 truncate text-[11px] text-gray-400">
                {ticket.email}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase",
                    STATUS_COLORS[ticket.status] || STATUS_COLORS.closed,
                  )}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-semibold uppercase",
                    PRIORITY_COLORS[ticket.priority],
                  )}
                >
                  {ticket.priority}
                </span>
                <span className="ml-auto text-[9px] text-gray-400">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket detail */}
      {selectedTicket ? (
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0f1a2e] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                {selectedTicket.subject}
              </p>
              <p className="text-xs text-gray-400">
                {selectedTicket.email} · Plan:{" "}
                <span className="text-blue-400">{selectedTicket.plan}</span>
                {selectedTicket.name && ` · ${selectedTicket.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedTicket.status}
                onChange={(e) =>
                  updateStatus(selectedTicket.id, e.target.value)
                }
                className="rounded-xl border border-white/10 bg-[#0f1a2e] px-2 py-1.5 text-xs text-white"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl border border-white/10 p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a1220] p-4"
          >
            {msgLoading && (
              <div className="flex justify-center py-8">
                <Loader2 size={18} className="animate-spin text-blue-400" />
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.sender === "admin" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold",
                    msg.sender === "user"
                      ? "border-white/10 bg-white/[0.05] text-gray-400"
                      : msg.sender === "bot"
                        ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                        : "border-blue-500/30 bg-blue-500/10 text-blue-400",
                  )}
                >
                  {msg.sender === "user"
                    ? "U"
                    : msg.sender === "bot"
                      ? "B"
                      : "A"}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                    msg.sender === "user"
                      ? "rounded-tl-sm border border-white/[0.08] bg-white/[0.04] text-gray-200"
                      : msg.sender === "bot"
                        ? "rounded-tl-sm border border-purple-500/20 bg-purple-500/[0.06] text-gray-200"
                        : "rounded-tr-sm border border-blue-500/20 bg-blue-500/[0.06] text-white",
                  )}
                >
                  <p>{msg.content}</p>
                  <p className="mt-1 text-[9px] text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.sender === "admin" && !msg.is_read && " · unread"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply */}
          <form onSubmit={sendReply} className="flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply to user..."
              className="h-10 flex-1 rounded-xl border border-white/10 bg-[#0f1a2e] px-4 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50"
              disabled={replying}
            />
            <button
              type="submit"
              disabled={replying || !reply.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {replying ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0a1220]">
          <div className="text-center">
            <MessageSquare
              size={32}
              className="mx-auto mb-3 text-gray-500"
            />
            <p className="text-sm text-gray-400">
              Select a ticket to view conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
