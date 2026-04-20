"use client";

/**
 * Admin Calendar — Real events from Supabase
 * Shows: user signups, support tickets, team activity
 */
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChevronLeft, ChevronRight, Users, MessageSquare, Zap } from "lucide-react";

interface CalEvent {
  date: string; // YYYY-MM-DD
  type: "signup" | "ticket" | "elite";
  label: string;
  color: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [current, setCurrent] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const startOfMonth = new Date(current.year, current.month - 1, 1).toISOString();
      const endOfMonth = new Date(current.year, current.month + 2, 1).toISOString();

      const [{ data: signups }, { data: tickets }] = await Promise.all([
        supabase.from("profiles")
          .select("created_at, plan, full_name, email")
          .gte("created_at", startOfMonth)
          .lt("created_at", endOfMonth)
          .order("created_at", { ascending: true }),
        supabase.from("support_tickets")
          .select("created_at, subject, priority")
          .gte("created_at", startOfMonth)
          .lt("created_at", endOfMonth)
          .order("created_at", { ascending: true })
          .limit(50),
      ]);

      const evts: CalEvent[] = [];

      for (const s of signups || []) {
        const d = s.created_at.slice(0, 10);
        const name = s.full_name || s.email?.split("@")[0] || "User";
        if (s.plan === "elite") {
          evts.push({ date: d, type: "elite", label: `⚡ ${name} → Elite`, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" });
        } else if (s.plan === "pro" || s.plan === "starter") {
          evts.push({ date: d, type: "signup", label: `🔑 ${name} → ${s.plan}`, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" });
        } else {
          evts.push({ date: d, type: "signup", label: `👤 ${name} signed up`, color: "bg-gray-500/20 text-gray-300 border-gray-500/30" });
        }
      }

      for (const t of tickets || []) {
        const d = t.created_at.slice(0, 10);
        const color = t.priority === "urgent" || t.priority === "high"
          ? "bg-red-500/20 text-red-300 border-red-500/30"
          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        evts.push({ date: d, type: "ticket", label: `🎫 ${t.subject?.slice(0, 30) || "Support ticket"}`, color });
      }

      setEvents(evts);
      setLoading(false);
    }
    load();
  }, [current]);

  // Build calendar grid
  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function getEventsForDay(day: number) {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  }

  const selectedEvents = selected ? events.filter(e => e.date === selected) : [];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Stats for this month
  const signupCount = events.filter(e => e.type === "signup" || e.type === "elite").length;
  const ticketCount = events.filter(e => e.type === "ticket").length;
  const eliteCount = events.filter(e => e.type === "elite").length;

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">Real-time signups, tickets, and platform events</p>
      </div>

      {/* Month stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <Users size={18} className="text-cyan-400" />
          <div>
            <p className="text-xl font-bold text-white">{signupCount}</p>
            <p className="text-xs text-gray-500">Signups this month</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <MessageSquare size={18} className="text-yellow-400" />
          <div>
            <p className="text-xl font-bold text-white">{ticketCount}</p>
            <p className="text-xs text-gray-500">Support tickets</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <Zap size={18} className="text-purple-400" />
          <div>
            <p className="text-xl font-bold text-white">{eliteCount}</p>
            <p className="text-xs text-gray-500">Elite upgrades</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Calendar */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {MONTHS[current.month]} {current.year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent(c => {
                  const d = new Date(c.year, c.month - 1, 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })}
                className="rounded-xl border border-white/8 p-2 text-gray-400 hover:text-white transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                className="rounded-xl border border-white/8 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition"
              >
                Today
              </button>
              <button
                onClick={() => setCurrent(c => {
                  const d = new Date(c.year, c.month + 1, 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })}
                className="rounded-xl border border-white/8 p-2 text-gray-400 hover:text-white transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map(d => (
              <div key={d} className="py-1 text-center text-xs font-medium text-gray-500">{d}</div>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = getEventsForDay(day);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selected;

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(isSelected ? null : dateStr)}
                    className={`relative min-h-[60px] rounded-xl border p-1.5 text-left transition ${
                      isSelected
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : isToday
                        ? "border-cyan-500/30 bg-cyan-500/5"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday ? "text-cyan-400" : "text-gray-400"}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e, j) => (
                        <div key={j} className={`truncate rounded px-1 py-0.5 text-[9px] border ${e.color}`}>
                          {e.label}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected day events */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-bold text-white">
            {selected ? `Events — ${selected}` : "Select a day"}
          </h3>
          {!selected && (
            <p className="text-xs text-gray-500">Click any day to see events</p>
          )}
          {selected && selectedEvents.length === 0 && (
            <p className="text-xs text-gray-500">No events on this day</p>
          )}
          <div className="space-y-2">
            {selectedEvents.map((e, i) => (
              <div key={i} className={`rounded-xl border px-3 py-2.5 text-xs ${e.color}`}>
                {e.label}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Legend</p>
            {[
              { color: "bg-purple-500", label: "Elite upgrade" },
              { color: "bg-blue-500", label: "Paid signup" },
              { color: "bg-gray-500", label: "Free signup" },
              { color: "bg-red-500", label: "Urgent ticket" },
              { color: "bg-yellow-500", label: "Support ticket" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
