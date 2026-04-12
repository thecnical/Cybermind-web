# CyberMind CLI installer for Windows
# Installs: AI chat + CBM Code (vibe coder) + all Windows features
#
# Usage (recommended — key via env var, never in shell history):
#   $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
#
# Usage (key as param — appears in history, less secure):
#   (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
#   cybermind --key cp_live_xxx

param(
  [string]$key = ""
)

$ErrorActionPreference = "Stop"

# FIX: read key from env var first, then fall back to param
# This way one command installs everything — key never in shell history
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
Write-Host "  Note: Full recon/hunt/Abhimanyu pipeline requires Linux/Kali." -ForegroundColor DarkGray
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

# Install to a directory in PATH
$installDir = "$env:USERPROFILE\.cybermind"
if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir | Out-Null }
Copy-Item cybermind.exe "$installDir\cybermind.exe" -Force

# Add to PATH if not already there
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$installDir*") {
  [Environment]::SetEnvironmentVariable("PATH", "$userPath;$installDir", "User")
  $env:PATH = "$env:PATH;$installDir"
  Write-Host "  ✓ Added $installDir to PATH" -ForegroundColor Green
}

# Save API key with restricted permissions
if ($key -ne "") {
  $configPath = Join-Path $installDir "config.json"
  Set-Content -Path $configPath -Value "{`"key`":`"$key`"}"
  # Restrict to current user only
  try {
    $acl = Get-Acl $configPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
      $env:USERNAME, "FullControl", "Allow"
    )
    $acl.SetAccessRule($rule)
    Set-Acl $configPath $acl
  } catch { <# non-critical #> }
  Write-Host "  ✓ API key saved (restricted to current user)" -ForegroundColor Green
} else {
  Write-Host "  ℹ  No API key provided. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

# Cleanup
Set-Location $env:USERPROFILE
Remove-Item $tmpDir -Recurse -Force

Write-Host ""
Write-Host "  ✓ CyberMind CLI installed!" -ForegroundColor Green
Write-Host ""
Write-Host "  Commands:" -ForegroundColor Cyan
Write-Host "    cybermind          — AI security chat" -ForegroundColor DarkGray
Write-Host "    cybermind vibe     — CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "    cybermind --version" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
Write-Host ""
