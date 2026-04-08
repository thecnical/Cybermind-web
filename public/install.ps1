# CyberMind CLI installer for Windows (chat mode only)
# Usage: iwr https://cybermind.thecnical.dev/install.ps1 | iex; cybermind --key cp_live_xxxxx
# Or: iwr https://cybermind.thecnical.dev/install.ps1 -OutFile install.ps1; .\install.ps1 --key cp_live_xxxxx

param(
  [string]$key = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ⚡ CyberMind CLI — Windows Installer" -ForegroundColor Cyan
Write-Host "  Note: Windows supports AI chat mode only." -ForegroundColor DarkGray
Write-Host "  Use Kali Linux for full recon/hunt/Abhimanyu pipeline." -ForegroundColor DarkGray
Write-Host ""

# Check Go
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
  Write-Host "  ✗ Go not found. Download from https://go.dev/dl" -ForegroundColor Red
  Write-Host "  After installing Go, re-run this script." -ForegroundColor DarkGray
  exit 1
}

# Clone and build
$tmpDir = Join-Path $env:TEMP "cybermind_install"
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }

Write-Host "  ⟳ Cloning CyberMind CLI..." -ForegroundColor DarkGray
git clone --depth=1 https://github.com/thecnical/cybermind.git $tmpDir 2>$null

Write-Host "  ⟳ Building binary..." -ForegroundColor DarkGray
Set-Location "$tmpDir\cli"
go build -o cybermind.exe . 2>$null

# Install to System32
Write-Host "  ⟳ Installing to C:\Windows\System32..." -ForegroundColor DarkGray
Copy-Item cybermind.exe C:\Windows\System32\cybermind.exe -Force

# Save API key
if ($key -ne "") {
  $configDir = Join-Path $env:USERPROFILE ".cybermind"
  if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir | Out-Null }
  $configPath = Join-Path $configDir "config.json"
  Set-Content -Path $configPath -Value "{`"key`":`"$key`"}"
  Write-Host "  ✓ API key saved to $configPath" -ForegroundColor Green
}

# Cleanup
Set-Location $env:USERPROFILE
Remove-Item $tmpDir -Recurse -Force

Write-Host ""
Write-Host "  ✓ CyberMind CLI installed on Windows!" -ForegroundColor Green
Write-Host ""
Write-Host "  Start chatting:" -ForegroundColor Cyan
Write-Host "  cybermind" -ForegroundColor DarkGray
Write-Host ""
