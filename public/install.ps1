# CyberMind CLI installer for Windows
# Installs: AI chat + CBM Code (vibe coder) + all Windows features
#
# CBM Code works in YOUR project folder — reads/writes files in your workspace.
# No admin rights needed. Binary installs to ~/.cybermind/ (user folder).
# Terminal commands run as the current user — same as any terminal session.
#
# Usage (recommended — key via env var, never in shell history):
#   $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
#
# Usage (key as param):
#   (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
#   cybermind --key cp_live_xxx

param(
  [string]$key = ""
)

$ErrorActionPreference = "Stop"

# Read key from env var first, then fall back to param
if ($key -eq "" -and $env:CYBERMIND_KEY -ne "") {
  $key = $env:CYBERMIND_KEY
}

Write-Host ""
Write-Host "  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗" -ForegroundColor Cyan
Write-Host " ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝" -ForegroundColor Cyan
Write-Host " ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗  " -ForegroundColor Cyan
Write-Host " ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚡ CyberMind CLI — Windows Installer" -ForegroundColor Cyan
Write-Host "  Includes: AI chat + CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "  No admin rights required — installs to your user folder." -ForegroundColor DarkGray
Write-Host ""

# ── Check Go ──────────────────────────────────────────────────────────────────
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
  Write-Host "  ✗ Go not found." -ForegroundColor Red
  Write-Host "  Download from https://go.dev/dl and re-run this script." -ForegroundColor DarkGray
  Write-Host "  (Go installer does NOT require admin rights on Windows)" -ForegroundColor DarkGray
  exit 1
}

# ── Install directory — user home, no admin needed ────────────────────────────
$installDir = Join-Path $env:USERPROFILE ".cybermind"
if (-not (Test-Path $installDir)) {
  New-Item -ItemType Directory -Path $installDir | Out-Null
}

# ── Clone and build ───────────────────────────────────────────────────────────
$tmpDir = Join-Path $env:TEMP "cybermind_install_$(Get-Random)"
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }

Write-Host "  ⟳ Cloning CyberMind CLI..." -ForegroundColor DarkGray
git clone --depth=1 https://github.com/thecnical/cybermind.git $tmpDir 2>$null

Write-Host "  ⟳ Building binary..." -ForegroundColor DarkGray
Push-Location "$tmpDir\cli"
go build -o cybermind.exe . 2>$null
Pop-Location

# ── Install binary to user folder ─────────────────────────────────────────────
$binaryPath = Join-Path $installDir "cybermind.exe"
Copy-Item "$tmpDir\cli\cybermind.exe" $binaryPath -Force
Write-Host "  ✓ Binary installed to $binaryPath" -ForegroundColor Green

# ── Add to user PATH (no admin needed — User scope) ──────────────────────────
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$installDir*") {
  [Environment]::SetEnvironmentVariable("PATH", "$userPath;$installDir", "User")
  $env:PATH = "$env:PATH;$installDir"
  Write-Host "  ✓ Added to PATH (User scope — no admin needed)" -ForegroundColor Green
} else {
  Write-Host "  ✓ Already in PATH" -ForegroundColor Green
}

# ── Save API key ───────────────────────────────────────────────────────────────
if ($key -ne "") {
  $configPath = Join-Path $installDir "config.json"
  Set-Content -Path $configPath -Value "{`"key`":`"$key`"}"
  try {
    $acl = Get-Acl $configPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
      [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
      "FullControl", "Allow"
    )
    $acl.SetAccessRule($rule)
    Set-Acl $configPath $acl
  } catch { }
  Write-Host "  ✓ API key saved to $configPath" -ForegroundColor Green
} else {
  Write-Host "  ℹ  No API key. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

# ── Cleanup ───────────────────────────────────────────────────────────────────
Remove-Item $tmpDir -Recurse -Force

Write-Host ""
Write-Host "  ✓ CyberMind CLI installed!" -ForegroundColor Green
Write-Host ""
Write-Host "  How CBM Code works on Windows:" -ForegroundColor Cyan
Write-Host "  • Reads/writes files in YOUR project folder (e.g. C:\Users\You\my-project\)" -ForegroundColor DarkGray
Write-Host "  • Creates/deletes files as YOU — same permissions as your terminal" -ForegroundColor DarkGray
Write-Host "  • Runs terminal commands as YOU — no elevated privileges" -ForegroundColor DarkGray
Write-Host "  • Never touches system folders (C:\Windows\, C:\Program Files\)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Commands:" -ForegroundColor Cyan
Write-Host "    cybermind          — AI security chat" -ForegroundColor DarkGray
Write-Host "    cybermind vibe     — CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "    cybermind --version" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ⚠  Restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
Write-Host ""
