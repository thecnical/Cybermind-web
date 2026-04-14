# CyberMind CLI — Windows Installer v2.5.2
# Downloads pre-built binary directly — NO Go required.
#
# Usage:
#   (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
#   $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex

param([string]$key = "")
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if ($key -eq "" -and $env:CYBERMIND_KEY -ne "") { $key = $env:CYBERMIND_KEY }

$CDN        = "https://cybermindcli1.vercel.app"
$installDir = Join-Path $env:LOCALAPPDATA "Programs\cybermind"
$homeDir    = Join-Path $env:USERPROFILE ".cybermind"
$binaryUrl  = "$CDN/cybermind-windows-amd64.exe"
$binaryPath = Join-Path $installDir "cybermind.exe"
$cbmPath    = Join-Path $installDir "cbm.exe"

Write-Host ""
Write-Host " ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ███╗██╗███╗   ██╗██████╗" -ForegroundColor Cyan
Write-Host "⚡ CyberMind CLI v2.5.2 — Windows Installer" -ForegroundColor Green
Write-Host ""

foreach ($d in @($installDir, $homeDir)) {
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# ── Download binary ───────────────────────────────────────────────────────────
Write-Host "  ⟳ Downloading CyberMind CLI..." -ForegroundColor DarkGray
try {
  (New-Object System.Net.WebClient).DownloadFile($binaryUrl, $binaryPath)
} catch {
  try { Invoke-WebRequest -Uri $binaryUrl -OutFile $binaryPath -UseBasicParsing }
  catch {
    Write-Host "  ✗ Download failed: $_" -ForegroundColor Red
    exit 1
  }
}

$size = (Get-Item $binaryPath).Length
if ($size -lt 1MB) {
  Write-Host "  ✗ Downloaded file too small ($size bytes). Aborting." -ForegroundColor Red
  Remove-Item $binaryPath -Force -ErrorAction SilentlyContinue
  exit 1
}

Copy-Item $binaryPath $cbmPath -Force
Write-Host "  ✓ Installed: $binaryPath" -ForegroundColor Green
Write-Host "  ✓ Alias:     $cbmPath" -ForegroundColor Green

# ── Add to PATH ───────────────────────────────────────────────────────────────
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$installDir*") {
  [Environment]::SetEnvironmentVariable("PATH", "$installDir;$userPath", "User")
  $env:PATH = "$installDir;$env:PATH"
  Write-Host "  ✓ Added to PATH: $installDir" -ForegroundColor Green
}

# ── Save API key ──────────────────────────────────────────────────────────────
if ($key -ne "") {
  $cfg = Join-Path $homeDir "config.json"
  Set-Content -Path $cfg -Value "{`"key`":`"$key`"}"
  Write-Host "  ✓ API key saved to $cfg" -ForegroundColor Green
} else {
  Write-Host "  ℹ  No API key. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ⚡ CyberMind CLI v2.5.2 installed!" -ForegroundColor Green
Write-Host ""
Write-Host "  Verify:   cybermind --version" -ForegroundColor Cyan
Write-Host "  AI Chat:  cybermind" -ForegroundColor Cyan
Write-Host "  Doctor:   cybermind /doctor" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚠  Open a NEW terminal for PATH to take effect." -ForegroundColor Yellow
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
