"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function useMockReady(delay = 650) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return ready;
}

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-300/80">
            {eyebrow}
          </p>
        ) : null}
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm text-slate-400 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
  glow = "cyan",
}: {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "red" | "green" | "orange";
}) {
  const glowMap = {
    cyan: "before:from-cyan-400/20 before:to-transparent",
    purple: "before:from-violet-500/20 before:to-transparent",
    red: "before:from-rose-500/24 before:to-transparent",
    green: "before:from-emerald-400/20 before:to-transparent",
    orange: "before:from-orange-400/20 before:to-transparent",
  } as const;

  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,24,0.76)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-100",
        glowMap[glow],
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "cyan" | "purple" | "green" | "orange" | "red";
  className?: string;
}) {
  const tones = {
    default: "border-white/10 bg-white/5 text-slate-200",
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    purple: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    orange: "border-orange-400/25 bg-orange-400/10 text-orange-200",
    red: "border-rose-400/25 bg-rose-500/10 text-rose-200",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LivePill({ label = "LIVE" }: { label?: string }) {
  return (
    <Pill tone="green" className="font-mono tracking-[0.22em]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
      </span>
      {label}
    </Pill>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "border-cyan-300/30 bg-[linear-gradient(135deg,rgba(0,212,255,0.24),rgba(124,58,237,0.22))] text-white shadow-[0_16px_40px_rgba(0,212,255,0.18)] hover:border-cyan-200/50",
    secondary:
      "border-white/12 bg-white/[0.05] text-slate-100 hover:border-white/18 hover:bg-white/[0.08]",
    ghost:
      "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05]",
    danger:
      "border-rose-400/30 bg-rose-500/12 text-rose-100 hover:border-rose-300/50 hover:bg-rose-500/18",
  } as const;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-300/15",
        className,
      )}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          "w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-10 text-sm text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/15",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/15",
        className,
      )}
    />
  );
}

export function StatCard({
  label,
  value,
  change,
  hint,
  prefix,
  suffix,
  sparkline,
  accent,
  live,
}: {
  label: string;
  value: number;
  change: number;
  hint: string;
  prefix?: string;
  suffix?: string;
  sparkline: number[];
  accent: "cyan" | "purple" | "green" | "orange" | "red";
  live?: boolean;
}) {
  const count = useAnimatedNumber(value);
  const tones = {
    cyan: "from-cyan-400/14 via-cyan-300/8 to-transparent",
    purple: "from-violet-500/14 via-fuchsia-400/8 to-transparent",
    green: "from-emerald-400/14 via-emerald-300/8 to-transparent",
    orange: "from-orange-400/14 via-yellow-300/8 to-transparent",
    red: "from-rose-500/16 via-rose-300/8 to-transparent",
  } as const;

  return (
    <Panel className="min-h-[168px] p-5" glow={accent}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100", tones[accent])} />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                {prefix}
                {formatStatValue(count)}
                {suffix}
              </p>
              <Pill tone={change >= 0 ? "green" : "red"} className="px-2.5 py-0.5 text-[11px]">
                {change >= 0 ? "+" : ""}
                {change}
                {suffix === "%" ? "" : "%"}
              </Pill>
            </div>
          </div>
          {live ? <LivePill /> : null}
        </div>
        <div className="space-y-3">
          <MiniSparkline data={sparkline} accent={accent} />
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>
    </Panel>
  );
}

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(target);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      return;
    }

    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, target]);

  return value;
}

export function MiniSparkline({
  data,
  accent = "cyan",
}: {
  data: number[];
  accent?: "cyan" | "purple" | "green" | "orange" | "red";
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = ((max - value) / Math.max(max - min, 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const colors = {
    cyan: "#00d4ff",
    purple: "#8b5cf6",
    green: "#22c55e",
    orange: "#fb923c",
    red: "#fb7185",
  } as const;

  return (
    <div className="relative h-10 w-full overflow-hidden rounded-2xl bg-white/[0.03]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polyline
          fill="none"
          stroke={colors[accent]}
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}

function formatStatValue(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value > 10000 ? 0 : 1)}k`;
  if (value % 1 !== 0) return value.toFixed(1);
  return Math.round(value).toString();
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.08),rgba(255,255,255,0.04))] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((__, cell) => (
            <SkeletonBlock key={cell} className="h-10 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  pageSize = 5,
  loading,
  enableSelection = true,
  bulkActions,
  onRowClick,
}: {
  rows: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  pageSize?: number;
  loading?: boolean;
  enableSelection?: boolean;
  bulkActions?: (selectedIds: string[]) => ReactNode;
  onRowClick?: (row: T) => void;
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const column = columns.find((item) => item.key === sortKey);
    if (!column) return rows;
    const getter = column.sortValue ?? ((row: T) => String(column.render(row)));
    return [...rows].sort((left, right) => {
      const leftValue = getter(left);
      const rightValue = getter(right);
      if (leftValue === rightValue) return 0;
      const comparison = leftValue > rightValue ? 1 : -1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [columns, rows, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const currentPageRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function toggleSort(column: TableColumn<T>) {
    if (!column.sortable) return;
    if (sortKey === column.key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(column.key);
    setSortDirection("asc");
  }

  function toggleSelection(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAllCurrentPage() {
    const pageIds = currentPageRows.map(rowKey);
    const allSelected = pageIds.every((id) => selected.includes(id));
    setSelected((current) =>
      allSelected
        ? current.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...current, ...pageIds])),
    );
  }

  return (
    <Panel className="p-0" glow="cyan">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="text-sm text-slate-400">
          {selected.length > 0 ? `${selected.length} selected` : `${rows.length} records`}
        </div>
        {selected.length > 0 && bulkActions ? <div>{bulkActions(selected)}</div> : null}
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-5">
            <SkeletonTable rows={Math.max(pageSize, 5)} />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {enableSelection ? (
                  <th className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={currentPageRows.length > 0 && currentPageRows.every((row) => selected.includes(rowKey(row)))}
                      onChange={toggleAllCurrentPage}
                      className="rounded border-white/15 bg-white/5"
                    />
                  </th>
                ) : null}
                {columns.map((column) => (
                  <th key={column.key} className={cn("px-5 py-4", column.className)}>
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className={cn(
                        "inline-flex items-center gap-2 transition-colors",
                        column.sortable ? "hover:text-slate-300" : "cursor-default",
                      )}
                    >
                      {column.label}
                      {column.sortable ? <ChevronsUpDown className="size-3.5" /> : null}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {currentPageRows.map((row, index) => {
                  const id = rowKey(row);
                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        "group cursor-default bg-transparent transition-colors hover:bg-cyan-400/[0.03]",
                        onRowClick ? "cursor-pointer" : undefined,
                      )}
                    >
                      {enableSelection ? (
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.includes(id)}
                            onChange={() => toggleSelection(id)}
                            className="rounded border-white/15 bg-white/5"
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td key={column.key} className={cn("px-5 py-4 text-slate-200", column.className)}>
                          {column.render(row)}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-slate-400">
        <div>
          Page {safePage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <AdminButton variant="ghost" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1}>
            <ChevronLeft className="size-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages}>
            <ChevronRight className="size-4" />
          </AdminButton>
        </div>
      </div>
    </Panel>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      <AdminInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-11"
      />
    </div>
  );
}

export function MetricList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={String(item.label)}
          className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
        >
          <span className="text-sm text-slate-400">{item.label}</span>
          <span className="text-sm font-medium text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Panel className="flex min-h-[240px] flex-col items-center justify-center text-center" glow="purple">
      <div className="max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{body}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Panel>
  );
}

export function SurfaceTabs({
  items,
  active,
  onChange,
}: {
  items: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <LayoutGroup>
      <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {items.map((item) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm transition-colors",
                selected ? "text-white" : "text-slate-400 hover:text-slate-200",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="surface-tab"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
