import { Surface } from "@/components/DesignPrimitives";
import { CommandBar } from "@/components/SitePrimitives";
import Link from "next/link";

export const metadata = {
  title: "Uninstall CyberMind CLI — Windows, macOS, Linux | CyberMind",
  description: "Complete uninstall guide for CyberMind CLI on Windows, macOS, and Linux. Removes binary, API key, config, and PATH entries.",
};

export default function UninstallPage() {
  return (
    <div className="grid gap-6">

      {/* Header */}
      <Surface variant="clay" tone="accent" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Uninstall CyberMind CLI</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)] max-w-2xl">
          Completely remove CyberMind CLI from your system — binary, API key, config, history, and PATH entries.
          Works on Windows, macOS, and Linux.
        </p>
      </Surface>

      {/* One-command uninstall */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white mb-2">One-command uninstall (recommended)</h2>
        <p className="text-sm text-[var(--text-soft)] mb-4">
          Run this from any terminal — it removes everything automatically:
        </p>
        <CommandBar command="cybermind uninstall" variant="skeuo" tone="cyan" className="max-w-full" />
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Asks for confirmation before deleting. Removes: binary, cbm alias, API key, config, history, PATH entry.
        </p>
      </Surface>

      {/* Windows manual */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">🪟</span>
          <h2 className="text-2xl font-semibold text-white">Windows — Manual Uninstall</h2>
        </div>
        <p className="text-sm text-[var(--text-soft)] mb-5">
          If <code className="font-mono text-[#00d4ff]">cybermind uninstall</code> doesn&apos;t work, run these in PowerShell one by one:
        </p>

        <div className="grid gap-4">
          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 1 — Find where the binary is</p>
            <CommandBar command="where.exe cybermind" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 2 — Delete main install directory</p>
            <CommandBar
              command={`Remove-Item -Recurse -Force "$env:LOCALAPPDATA\\Programs\\cybermind" -ErrorAction SilentlyContinue`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 3 — Delete .local\bin location (older installs)</p>
            <CommandBar
              command={`Remove-Item -Force "$env:USERPROFILE\\.local\\bin\\cybermind.exe" -ErrorAction SilentlyContinue; Remove-Item -Force "$env:USERPROFILE\\.local\\bin\\cbm.exe" -ErrorAction SilentlyContinue`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 4 — Delete API key + config + history</p>
            <CommandBar
              command={`Remove-Item -Recurse -Force "$env:USERPROFILE\\.cybermind" -ErrorAction SilentlyContinue`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 5 — Remove from PATH</p>
            <CommandBar
              command={`$p = [Environment]::GetEnvironmentVariable("PATH","User"); $p = ($p -split ";" | Where-Object { $_ -notmatch "cybermind" -and $_ -notmatch "\\.local\\\\bin" -and $_ -ne "" }) -join ";"; [Environment]::SetEnvironmentVariable("PATH",$p,"User")`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 6 — Remove System32 binaries (if any)</p>
            <CommandBar
              command={`Remove-Item -Force "C:\\Windows\\System32\\cybermind.exe" -ErrorAction SilentlyContinue; Remove-Item -Force "C:\\Windows\\System32\\cbm.exe" -ErrorAction SilentlyContinue`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 7 — Verify everything is gone</p>
            <CommandBar
              command={`where.exe cybermind 2>$null; Test-Path "$env:LOCALAPPDATA\\Programs\\cybermind"; Test-Path "$env:USERPROFILE\\.cybermind"`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
            <p className="mt-2 text-xs text-[#00FF88]">All should return False or show no output.</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#00d4ff]/20 bg-[#00d4ff]/5 p-3">
          <p className="text-xs text-[var(--text-soft)]">
            <strong className="text-white">After uninstall:</strong> Open a new PowerShell window.
            Running <code className="font-mono text-[#00d4ff]">cybermind</code> should give &quot;command not found&quot;.
          </p>
        </div>
      </Surface>

      {/* Linux manual */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">🐧</span>
          <h2 className="text-2xl font-semibold text-white">Linux — Manual Uninstall</h2>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 1 — Remove binaries</p>
            <CommandBar
              command="sudo rm -f /usr/local/bin/cybermind /usr/local/bin/cbm /usr/bin/cybermind /usr/bin/cbm"
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 2 — Delete API key + config + history</p>
            <CommandBar command="rm -rf ~/.cybermind" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 3 — Verify</p>
            <CommandBar command="which cybermind; ls ~/.cybermind 2>/dev/null || echo 'Clean!'" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>
        </div>
      </Surface>

      {/* macOS manual */}
      <Surface variant="clay" tone="default" elevation="high" className="rounded-[30px] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">🍎</span>
          <h2 className="text-2xl font-semibold text-white">macOS — Manual Uninstall</h2>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 1 — Remove binaries</p>
            <CommandBar
              command="sudo rm -f /usr/local/bin/cybermind /usr/local/bin/cbm"
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 2 — Delete API key + config + history</p>
            <CommandBar command="rm -rf ~/.cybermind" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Step 3 — Verify</p>
            <CommandBar command="which cybermind || echo 'Removed!'" variant="skeuo" tone="cyan" className="max-w-full" />
          </div>
        </div>
      </Surface>

      {/* Reinstall */}
      <Surface variant="clay" tone="accent" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white mb-3">Reinstall after uninstall</h2>
        <div className="grid gap-3">
          <div>
            <p className="text-sm text-[var(--text-soft)] mb-2">🪟 Windows:</p>
            <CommandBar
              command={`$env:CYBERMIND_KEY="YOUR_KEY"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex`}
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>
          <div>
            <p className="text-sm text-[var(--text-soft)] mb-2">🐧 Linux:</p>
            <CommandBar
              command="CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install.sh | bash"
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>
          <div>
            <p className="text-sm text-[var(--text-soft)] mb-2">🍎 macOS:</p>
            <CommandBar
              command="CYBERMIND_KEY=YOUR_KEY curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash"
              variant="skeuo" tone="cyan" className="max-w-full"
            />
          </div>
        </div>
        <div className="mt-4">
          <Link href="/dashboard" className="cm-button-primary text-sm gap-2 inline-flex">
            Get a new API key → Dashboard
          </Link>
        </div>
      </Surface>

    </div>
  );
}
