import { NextResponse } from "next/server";

const SCRIPT = `# CyberMind CLI — Windows PowerShell Installer
# Usage: iwr https://cybermindcli1.vercel.app/install.ps1 | iex
# Usage: $env:CYBERMIND_KEY="cp_live_xxx"; iwr https://cybermindcli1.vercel.app/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ⚡ CyberMind CLI — Windows Installer" -ForegroundColor Cyan
Write-Host "  https://cybermindcli1.vercel.app" -ForegroundColor DarkGray
Write-Host ""

$ARCH = if ([System.Environment]::Is64BitOperatingSystem) { "amd64" } else { "386" }
$RELEASE_URL = "https://github.com/thecnical/cybermind/releases/latest/download/cybermind-windows-$ARCH.exe"
$INSTALL_DIR = "$env:SystemRoot\\System32"
$BINARY = "cybermind.exe"
$TMP = "$env:TEMP\\cybermind_install.exe"

Write-Host "  Downloading cybermind-windows-$ARCH.exe..." -ForegroundColor DarkGray

try {
  Invoke-WebRequest -Uri $RELEASE_URL -OutFile $TMP -UseBasicParsing
} catch {
  Write-Host "  ✗ Download failed: $_" -ForegroundColor Red
  Write-Host "  Download manually from: https://github.com/thecnical/cybermind/releases" -ForegroundColor Yellow
  exit 1
}

# Try to install to System32 (requires admin), fallback to user dir
$installed = $false
try {
  Copy-Item $TMP "$INSTALL_DIR\\$BINARY" -Force
  Write-Host "  ✓ Installed to $INSTALL_DIR\\$BINARY" -ForegroundColor Green
  $installed = $true
} catch {
  $USER_BIN = "$env:USERPROFILE\\.local\\bin"
  New-Item -ItemType Directory -Force -Path $USER_BIN | Out-Null
  Copy-Item $TMP "$USER_BIN\\$BINARY" -Force
  Write-Host "  ✓ Installed to $USER_BIN\\$BINARY" -ForegroundColor Green
  # Add to user PATH if not already there
  $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
  if ($currentPath -notlike "*$USER_BIN*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$USER_BIN", "User")
    Write-Host "  ✓ Added to PATH (restart terminal to take effect)" -ForegroundColor Green
  }
  $installed = $true
}

Remove-Item $TMP -Force -ErrorAction SilentlyContinue

# Save API key if provided via env
if ($env:CYBERMIND_KEY) {
  $CONFIG_DIR = "$env:USERPROFILE\\.cybermind"
  New-Item -ItemType Directory -Force -Path $CONFIG_DIR | Out-Null
  '{"key":"' + $env:CYBERMIND_KEY + '"}' | Set-Content "$CONFIG_DIR\\config.json" -Encoding UTF8
  Write-Host "  ✓ API key saved to $CONFIG_DIR\\config.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Run: cybermind" -ForegroundColor Cyan
Write-Host "  Docs: https://cybermindcli1.vercel.app/docs" -ForegroundColor DarkGray
Write-Host ""
`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
