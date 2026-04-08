"use client";

import { useMemo, useState } from "react";
import { Laptop, TerminalSquare, MonitorCog } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { Surface } from "@/components/DesignPrimitives";
import { withApiKey } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export type InstallPlatform = "linux" | "windows" | "mac";

type InstallTabConfig = {
  id: InstallPlatform;
  label: string;
  icon: typeof Laptop;
  eyebrow: string;
  steps: string[];
  command: string;
};

const iconMap = {
  linux: TerminalSquare,
  windows: MonitorCog,
  mac: Laptop,
} satisfies Record<InstallPlatform, typeof Laptop>;

export default function InstallTabs({
  commands,
  initialKey = "sk_live_cm_xxxxxxxxxxxxxxxx",
  editable = false,
}: {
  commands: Record<InstallPlatform, string>;
  initialKey?: string;
  editable?: boolean;
}) {
  const [platform, setPlatform] = useState<InstallPlatform>("linux");
  const [apiKey, setApiKey] = useState(initialKey);

  const tabs = useMemo<InstallTabConfig[]>(() => {
    return [
      {
        id: "linux",
        label: "Linux / Kali",
        icon: iconMap.linux,
        eyebrow: "Full recon, hunt, and Abhimanyu workflow",
        steps: [
          "Open a Kali or Debian-compatible shell with curl available.",
          "Run the install script and pass your CLI key in one shot.",
          "Start CyberMind and run /doctor after installation.",
        ],
        command: withApiKey(commands.linux, apiKey || initialKey),
      },
      {
        id: "windows",
        label: "Windows",
        icon: iconMap.windows,
        eyebrow: "Chat-first setup with provider routing and shell guidance",
        steps: [
          "Launch PowerShell with internet access enabled.",
          "Pull the installer and bind the key after install.",
          "Start CyberMind and use the prompt shell for guided commands.",
        ],
        command: withApiKey(commands.windows, apiKey || initialKey),
      },
      {
        id: "mac",
        label: "macOS",
        icon: iconMap.mac,
        eyebrow: "Fast local setup for prompt-first workflows",
        steps: [
          "Install Homebrew if it is not already available.",
          "Install the CLI package and bind your key locally.",
          "Run cybermind and verify provider routing from the shell.",
        ],
        command: withApiKey(commands.mac, apiKey || initialKey),
      },
    ];
  }, [apiKey, commands, initialKey]);

  const activeTab = tabs.find((item) => item.id === platform) ?? tabs[0];

  return (
    <div className="grid gap-5">
      {editable ? (
        <label className="grid gap-2">
          <span className="cm-label">Personalize install command</span>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Enter your API key to embed it into the install command"
            className="cm-input"
          />
        </label>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === platform;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPlatform(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition-all",
                active
                  ? "border-[var(--accent-cyan)]/35 bg-[rgba(0,255,255,0.1)] text-white"
                  : "border-white/10 bg-white/[0.03] text-[var(--text-soft)] hover:text-white",
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Surface variant="glass" tone="cyan" elevation="medium" motion="medium" className="grid gap-5 rounded-[30px] p-5 md:p-6">
        <div>
          <p className="cm-label">{activeTab.eyebrow}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{activeTab.label}</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {activeTab.steps.map((step, index) => (
            <Surface key={step} variant={index === 1 ? "clay" : "skeuo"} tone="default" elevation="low" motion="fast" className="rounded-2xl p-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-cyan)]">
                Step {index + 1}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{step}</p>
            </Surface>
          ))}
        </div>

        <Surface variant="skeuo" tone="accent" elevation="low" motion="fast" className="rounded-[24px] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="cm-label">Install command</p>
            <CopyButton text={activeTab.command} />
          </div>
          <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-sm text-white">
            {activeTab.command}
          </code>
        </Surface>
      </Surface>
    </div>
  );
}
