"use client";

import { useEffect, useState } from "react";

const prompts = [
  "Ask anything about cybersecurity...",
  "Run /recon example.com across all phases",
  "Explain the latest nuclei findings",
  "Prepare a payload for windows x64",
];

const statuses = [
  ["cybermind v2.5.0", "AI", "Live", "PgUp/PgDn scroll", "Ctrl+L clear"],
  ["cybermind v2.5.0", "Recon", "Ready", "Local history", "Windows chat"],
  ["cybermind v2.5.0", "Providers", "9 online", "40+ models", "Auto fallback"],
];

export default function CyberMindTerminal() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const promptTimer = window.setInterval(() => {
      setPromptIndex((value) => (value + 1) % prompts.length);
    }, 2200);

    const statusTimer = window.setInterval(() => {
      setStatusIndex((value) => (value + 1) % statuses.length);
    }, 3200);

    return () => {
      window.clearInterval(promptTimer);
      window.clearInterval(statusTimer);
    };
  }, []);

  return (
    <div className="cm-spotlight-card min-w-0 overflow-hidden rounded-[32px] border border-[rgba(149,111,255,0.34)] bg-[linear-gradient(180deg,#080a0f_0%,#101824_100%)] shadow-[0_32px_120px_rgba(0,0,0,0.42)]">
      <div className="border-b border-white/8 bg-[linear-gradient(90deg,rgba(33,44,68,0.85),rgba(12,16,25,0.85))] px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--accent-cyan)]">
            <span className="text-base tracking-normal">&gt;_</span>
            CyberMind CLI
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Official prompt shell
          </p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6">
        <div className="min-w-0 rounded-[28px] border border-[rgba(108,161,255,0.35)] bg-[linear-gradient(180deg,rgba(11,17,27,0.9),rgba(16,25,38,0.86))] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="overflow-hidden font-mono text-[clamp(2rem,5vw,4.2rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-transparent [text-shadow:3px_3px_0_rgba(130,24,255,0.45),6px_6px_0_rgba(0,0,0,0.28)] [background:linear-gradient(180deg,#38e8ff_0%,#46b2ff_42%,#7a62ff_70%,#d85bff_100%)] [background-clip:text] [-webkit-background-clip:text]">
            cybermind
          </div>
          <div className="mt-4 space-y-2 break-words font-mono text-[13px] leading-6 text-[var(--text-soft)]">
            <p className="text-[var(--accent-cyan)]">
              lightning CyberMind CLI v2.5.0 | Windows chat
            </p>
            <p>created by Chandan Pandey</p>
            <p>Local IP: 169.254.121.32</p>
            <p>Info: Auto Recon/Hunt/Abhimanyu Mode: Linux only</p>
          </div>
        </div>

        <div className="min-w-0 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 font-mono text-[13px] text-[var(--text-soft)]">
          <p className="text-[var(--accent-strong)]">Tips for getting started:</p>
          <ol className="mt-2 space-y-1 text-[var(--text-main)]">
            <li>1. Ask questions, edit files, or run commands.</li>
            <li>2. Use /recon, /hunt, and /abhimanyu on Kali Linux.</li>
            <li>3. Use the chat shell on Windows for guided commands.</li>
            <li>4. Run /doctor after install or update.</li>
          </ol>
        </div>

        <div className="min-w-0 rounded-[22px] border border-[rgba(123,151,255,0.34)] bg-[rgba(15,23,36,0.86)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-2 font-mono text-xs text-[var(--text-muted)]">
            <span className="min-w-0">Using 9 providers | local history enabled</span>
            <span className="min-w-0">40+ models | auto fallback</span>
          </div>
          <div className="px-4 py-4">
            <div className="min-w-0 rounded-[18px] border border-[rgba(132,155,255,0.42)] bg-[rgba(11,16,24,0.92)] px-4 py-3 font-mono text-[15px] text-[var(--text-main)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="mr-3 text-[var(--accent-strong)]">&gt;</span>
              <span className="break-words">{prompts[promptIndex]}</span>
              <span className="ml-1 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-[var(--accent-cyan)]" />
            </div>
            <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
              Enter=send  Ctrl+C=exit  PgUp/PgDn=scroll
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs text-[var(--text-main)]">
          {statuses[statusIndex].map((item) => (
            <span
              key={item}
              className="max-w-full break-words rounded-full border border-[rgba(90,120,255,0.28)] bg-[rgba(20,30,48,0.7)] px-3 py-2"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
