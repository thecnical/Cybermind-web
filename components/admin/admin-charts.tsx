"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const axisStyle = {
  stroke: "rgba(148, 163, 184, 0.35)",
  fontSize: 12,
};

function ChartTooltip() {
  return (
    <Tooltip
      contentStyle={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(10,10,15,0.92)",
        color: "white",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      }}
      cursor={{ stroke: "rgba(255,255,255,0.14)" }}
    />
  );
}

export function RequestsLineChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={48} />
          <ChartTooltip />
          <Legend />
          <Line type="monotone" dataKey="chat" stroke="#00d4ff" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="scan" stroke="#fb923c" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="hunt" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="exploit" stroke="#fb7185" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="recon" stroke="#22c55e" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutUsageChart({
  data,
}: {
  data: { name: string; value: number; fill: string }[];
}) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={102}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueBarChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={46} />
          <ChartTooltip />
          <Bar dataKey="revenue" radius={[12, 12, 0, 0]} fill="url(#barGradient)" />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueAreaChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={46} />
          <ChartTooltip />
          <Area type="monotone" dataKey="value" stroke="#00d4ff" fill="url(#areaRevenue)" strokeWidth={2.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarChart({
  data,
  dataKey,
  color = "#00d4ff",
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color?: string;
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <ChartTooltip />
          <Bar dataKey={dataKey} fill={color} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ErrorTimelineChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <ChartTooltip />
          <Line type="monotone" dataKey="rate" stroke="#fb7185" strokeWidth={2.8} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WorldMapPlaceholder({
  dots,
}: {
  dots: { country: string; x: number; y: number; sessions: number }[];
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.08),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
      <svg viewBox="0 0 100 60" className="h-[260px] w-full">
        <path
          d="M6 24c4-2 9-3 14-1l3 2 4-2 3 1 2 3 5 2 4-1 4-5 6 0 4 2 7-3 7 1 5-1 6 4 7 0 7 4-1 5-6 2-8 0-5 3-7 0-4-2-5 2-4 5-6 0-2-3-5-1-4-4-4-1-5 3-6-1-5-5-4-1-2-5 3-5z"
          fill="rgba(148,163,184,0.12)"
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="0.4"
        />
        {dots.map((dot) => (
          <g key={dot.country} transform={`translate(${dot.x}, ${dot.y})`}>
            <circle r="3.6" fill="rgba(0,212,255,0.14)" />
            <circle r="1.5" fill="#00d4ff" />
          </g>
        ))}
      </svg>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {dots.map((dot) => (
          <div key={dot.country} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm">
            <span className="text-slate-300">{dot.country}</span>
            <span className="font-mono text-cyan-200">{dot.sessions}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Heatmap({
  days,
}: {
  days: { day: string; values: number[] }[];
}) {
  const max = Math.max(...days.flatMap((entry) => entry.values));

  return (
    <div className="space-y-3">
      {days.map((row) => (
        <div key={row.day} className="grid grid-cols-[48px_1fr] items-center gap-3">
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{row.day}</span>
          <div className="grid grid-cols-12 gap-2">
            {row.values.map((value, index) => {
              const opacity = 0.16 + (value / max) * 0.84;
              return (
                <div
                  key={`${row.day}-${index}`}
                  className="h-9 rounded-xl border border-white/6"
                  style={{
                    background: `rgba(0, 212, 255, ${opacity})`,
                    boxShadow: opacity > 0.7 ? "0 0 18px rgba(0,212,255,0.2)" : "none",
                  }}
                  title={`${row.day} / ${index * 2}:00 = ${value}ms`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TinyTrend({
  values,
  color = "#00d4ff",
  className,
}: {
  values: number[];
  color?: string;
  className?: string;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / Math.max(max - min, 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className={cn("h-10 w-24", className)}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
