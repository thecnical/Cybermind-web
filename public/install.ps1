# CyberMind CLI — Windows Global Installer
# After install: `cybermind` and `cybermind vibe` work from ANY terminal, ANY folder.
# Same as Claude Code — globally available, no restart needed.
#
# Usage:
#   $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex

param([string]$key = "")

$ErrorActionPreference = "Stop"

# Read key from env var first
if ($key -eq "" -and $env:CYBERMIND_KEY -ne "") { $key = $env:CYBERMIND_KEY }

Write-Host ""
Write-Host "  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗" -ForegroundColor Cyan
Write-Host " ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝" -ForegroundColor Cyan
Write-Host " ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗  " -ForegroundColor Cyan
Write-Host " ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚡ CyberMind CLI — Global Windows Installer" -ForegroundColor Cyan
Write-Host "  After install: cybermind + cybermind vibe work from ANY folder" -ForegroundColor DarkGray
Write-Host ""

# ── Check Go ──────────────────────────────────────────────────────────────────
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
  Write-Host "  ✗ Go not found. Download from https://go.dev/dl" -ForegroundColor Red
  Write-Host "  Go installer does NOT require admin rights on Windows." -ForegroundColor DarkGray
  exit 1
}

# ── Install directory ─────────────────────────────────────────────────────────
# Use %LOCALAPPDATA%\Programs\cybermind — already in PATH on modern Windows
# Falls back to ~/.cybermind with manual PATH update
$localPrograms = Join-Path $env:LOCALAPPDATA "Programs\cybermind"
$homeDir       = Join-Path $env:USERPROFILE ".cybermind"

# Try LocalAppData\Programs first (no admin, often already in PATH)
$installDir = $localPrograms
try {
  if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir -Force | Out-Null }
} catch {
  $installDir = $homeDir
  if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir -Force | Out-Null }
}

# Config always in ~/.cybermind (shared between install locations)
if (-not (Test-Path $homeDir)) { New-Item -ItemType Directory -Path $homeDir -Force | Out-Null }

# ── Clone and build ───────────────────────────────────────────────────────────
$tmpDir = Join-Path $env:TEMP "cybermind_install_$(Get-Random)"
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }

Write-Host "  ⟳ Cloning CyberMind CLI..." -ForegroundColor DarkGray
git clone --depth=1 https://github.com/thecnical/cybermind.git $tmpDir 2>$null

Write-Host "  ⟳ Building binary..." -ForegroundColor DarkGray
Push-Location "$tmpDir\cli"
go build -o cybermind.exe . 2>$null
Pop-Location

# ── Install binary globally ───────────────────────────────────────────────────
$binaryPath = Join-Path $installDir "cybermind.exe"
Copy-Item "$tmpDir\cli\cybermind.exe" $binaryPath -Force
Write-Host "  ✓ Binary installed to $binaryPath" -ForegroundColor Green

# ── Ensure in PATH — User scope (no admin) ───────────────────────────────────
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User") ?? ""
if ($userPath -notlike "*$installDir*") {
  [Environment]::SetEnvironmentVariable("PATH", "$userPath;$installDir", "User")
  Write-Host "  ✓ Added to User PATH" -ForegroundColor Green
}

# ── CRITICAL: Update CURRENT session PATH immediately ────────────────────────
# This makes `cybermind` work RIGHT NOW without restarting terminal
# Same trick Claude Code uses — update $env:PATH in current process
if ($env:PATH -notlike "*$installDir*") {
  $env:PATH = "$env:PATH;$installDir"
}

# Also try to update parent PowerShell process PATH via registry refresh
try {
  $regPath = "HKCU:\Environment"
  $currentPath = (Get-ItemProperty -Path $regPath -Name PATH -ErrorAction SilentlyContinue).PATH
  if ($currentPath -notlike "*$installDir*") {
    Set-ItemProperty -Path $regPath -Name PATH -Value "$currentPath;$installDir"
  }
  # Broadcast WM_SETTINGCHANGE so Explorer + new terminals pick up PATH immediately
  Add-Type -TypeDefinition @"
    using System;
    using System.Runtime.InteropServices;
    public class WinEnv {
      [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Auto)]
      public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
    }
"@ -ErrorAction SilentlyContinue
  $result = [UIntPtr]::Zero
  [WinEnv]::SendMessageTimeout([IntPtr]0xFFFF, 0x001A, [UIntPtr]::Zero, "Environment", 2, 5000, [ref]$result) | Out-Null
} catch { <# non-critical #> }

# ── Save API key ───────────────────────────────────────────────────────────────
if ($key -ne "") {
  $configPath = Join-Path $homeDir "config.json"
  Set-Content -Path $configPath -Value "{`"key`":`"$key`"}"
  try {
    $acl = Get-Acl $configPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
      [System.Security.Principal.WindowsIdentity]::GetCurrent().Name, "FullControl", "Allow"
    )
    $acl.SetAccessRule($rule)
    Set-Acl $configPath $acl
  } catch { }
  Write-Host "  ✓ API key saved" -ForegroundColor Green
} else {
  Write-Host "  ℹ  No API key. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

# ── Cleanup ───────────────────────────────────────────────────────────────────
Remove-Item $tmpDir -Recurse -Force

Write-Host ""
Write-Host "  ✓ CyberMind CLI installed globally!" -ForegroundColor Green
Write-Host ""
Write-Host "  Run from ANY folder in ANY terminal:" -ForegroundColor Cyan
Write-Host "    cybermind              — AI security chat" -ForegroundColor DarkGray
Write-Host "    cybermind vibe         — CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "    cybermind --version    — check version" -ForegroundColor DarkGray
Write-Host ""

# ── Verify immediately ────────────────────────────────────────────────────────
Write-Host "  Verifying install..." -ForegroundColor DarkGray
try {
  $ver = & "$binaryPath" --version 2>$null
  Write-Host "  ✓ cybermind $ver — ready to use!" -ForegroundColor Green
  Write-Host ""
  Write-Host "  Try it now (in this terminal):" -ForegroundColor Cyan
  Write-Host "    cybermind --version" -ForegroundColor DarkGray
  Write-Host "    cd C:\Users\$env:USERNAME\my-project" -ForegroundColor DarkGray
  Write-Host "    cybermind vibe" -ForegroundColor DarkGray
} catch {
  Write-Host "  ⚠  Open a new terminal window and run: cybermind --version" -ForegroundColor Yellow
}
Write-Host ""
