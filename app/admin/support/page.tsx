"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle, ChevronDown, Clock, Loader2,
  MessageSquare, RefreshCw, Send, Shield, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cybermind-backend-8yrt.onrender.com";

// ─── Types ────────────────────────────────────────────────────────────────────
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
  open:        "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  in_progress: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  resolved:    "bg-blue-500/15 text-blue-400 border-blue-500/25",
  closed:      "bg-white/10 text-[var(--text-muted)] border-white/10",
};

const PRIORITY_COLORS: Record<string, string> = {
  low:    "text-[var(--text-muted)]",
  normal: "text-[var(--text-soft)]",
  high:   "text-yellow-400",
  urgent: "text-red-400",
};

// ─── Main component ───────────────────────────────────────────────────────────
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

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setAuthed(true);
    loadTickets(adminKey.trim());
  }

  // ── Load tickets ──────────────────────────────────────────────────────────
  async function loadTickets(key?: string) {
    const k = key || adminKey;
    setLoading(true);
    try {
      const url = statusFilter === "all"
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
  }, [statusFilter]);

  // ── Load ticket detail ────────────────────────────────────────────────────
  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    setMsgLoading(true);
    try {
      const res = await fetch(`${BACKEND}/support/ticket-detail/${ticket.id}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        // Update unread count in list
        setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unread_count: 0 } : t));
      }
    } catch {}
    finally { setMsgLoading(false); }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Send reply ────────────────────────────────────────────────────────────
  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const res = await fetch(`${BACKEND}/support/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ ticket_id: selectedTicket.id, message: reply.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          id: `admin-${Date.now()}`,
          sender: "admin",
          content: reply.trim(),
          created_at: new Date().toISOString(),
          is_read: false,
        }]);
        setReply("");
      }
    } catch {}
    finally { setReplying(false); }
  }

  // ── Update status ─────────────────────────────────────────────────────────
  async function updateStatus(ticketId: string, status: string) {
    try {
      await fetch(`${BACKEND}/support/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ ticket_id: ticketId, status }),
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null);
      }
    } catch {}
  }

  // ─── Auth screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-[24px] border border-white/[0.08] bg-[rgba(7,10,18,0.8)] p-8">
          <div className="mb-6 flex items-center gap-3">
            <Shield size={20} className="text-[var(--accent-cyan)]" />
            <h1 className="text-lg font-semibold text-white">Support Admin</h1>
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
              onChange={e => setAdminKey(e.target.value)}
              placeholder="Admin secret key"
              className="cm-input"
              autoFocus
            />
            <button type="submit" className="cm-button-primary gap-2">
              <Shield size={14} /> Access tickets
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Main admin UI ────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 overflow-hidden">

      {/* ── Ticket list ── */}
      <div className="flex w-80 flex-shrink-0 flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-white flex items-center gap-2">
            <MessageSquare size={16} className="text-[var(--accent-cyan)]" />
            Support Tickets
          </h1>
          <button
            type="button"
            onClick={() => loadTickets()}
            className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] hover:text-white"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {["all", "open", "in_progress", "resolved", "closed"].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors",
                statusFilter === s
                  ? "border-[var(--accent-cyan)]/40 bg-[rgba(0,255,255,0.1)] text-[var(--accent-cyan)]"
                  : "border-white/10 text-[var(--text-muted)] hover:text-white"
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[var(--accent-cyan)]" />
            </div>
          )}
          {!loading && tickets.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">No tickets</p>
          )}
          {tickets.map(ticket => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket)}
              className={cn(
                "w-full rounded-[16px] border p-3 text-left transition-colors",
                selectedTicket?.id === ticket.id
                  ? "border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.06)]"
                  : "border-white/[0.06] bg-[rgba(7,10,18,0.6)] hover:border-white/[0.12]"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-medium text-white truncate flex-1">{ticket.subject}</p>
                {ticket.unread_count > 0 && (
                  <span className="flex-shrink-0 rounded-full bg-[var(--accent-cyan)] px-1.5 py-0.5 font-mono text-[9px] text-black">
                    {ticket.unread_count}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate mb-2">{ticket.email}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase", STATUS_COLORS[ticket.status] || STATUS_COLORS.closed)}>
                  {ticket.status.replace("_", " ")}
                </span>
                <span className={cn("font-mono text-[9px] uppercase", PRIORITY_COLORS[ticket.priority])}>
                  {ticket.priority}
                </span>
                <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Ticket detail ── */}
      {selectedTicket ? (
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {/* Ticket header */}
          <div className="flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-[rgba(7,10,18,0.8)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{selectedTicket.subject}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {selectedTicket.email} · Plan: <span className="text-[var(--accent-cyan)]">{selectedTicket.plan}</span>
                {selectedTicket.name && ` · ${selectedTicket.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Status dropdown */}
              <select
                value={selectedTicket.status}
                onChange={e => updateStatus(selectedTicket.id, e.target.value)}
                className="rounded-xl border border-white/10 bg-[rgba(7,10,18,0.8)] px-2 py-1.5 text-xs text-white"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl border border-white/10 p-1.5 text-[var(--text-muted)] hover:text-white"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto rounded-[20px] border border-white/[0.08] bg-[rgba(7,10,18,0.6)] p-4"
          >
            {msgLoading && (
              <div className="flex justify-center py-8">
                <Loader2 size={18} className="animate-spin text-[var(--accent-cyan)]" />
              </div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.sender === "admin" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold",
                  msg.sender === "user" ? "border-white/10 bg-white/[0.05] text-[var(--text-muted)]" :
                  msg.sender === "bot" ? "border-purple-500/30 bg-purple-500/10 text-purple-400" :
                  "border-[var(--accent-cyan)]/30 bg-[rgba(0,255,255,0.08)] text-[var(--accent-cyan)]"
                )}>
                  {msg.sender === "user" ? "U" : msg.sender === "bot" ? "B" : "A"}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-[1.6]",
                  msg.sender === "user" ? "rounded-tl-sm border border-white/[0.08] bg-white/[0.04] text-[var(--text-main)]" :
                  msg.sender === "bot" ? "rounded-tl-sm border border-purple-500/20 bg-purple-500/[0.06] text-[var(--text-main)]" :
                  "rounded-tr-sm border border-[var(--accent-cyan)]/20 bg-[rgba(0,255,255,0.06)] text-white"
                )}>
                  <p>{msg.content}</p>
                  <p className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {msg.sender === "admin" && !msg.is_read && " · unread"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply input */}
          <form onSubmit={sendReply} className="flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Reply to user..."
              className="cm-input h-10 flex-1 rounded-xl text-sm"
              disabled={replying}
            />
            <button
              type="submit"
              disabled={replying || !reply.trim()}
              className="cm-button-primary h-10 w-10 flex-shrink-0 rounded-xl p-0 disabled:opacity-50"
            >
              {replying ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[20px] border border-white/[0.06] bg-[rgba(7,10,18,0.4)]">
          <div className="text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Select a ticket to view conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
