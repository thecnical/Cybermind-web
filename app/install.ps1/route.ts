import { NextResponse } from "next/server";

// PowerShell installer for Windows
// Usage: (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex
// Usage: $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex

const SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  CyberMind CLI - Windows Installer" -ForegroundColor Cyan
Write-Host "  https://cybermindcli1.vercel.app" -ForegroundColor DarkGray
Write-Host ""

$BINARY_URL = "https://cybermindcli1.vercel.app/cybermind-windows-amd64.exe"
$TMP = "$env:TEMP\cybermind.exe"

Write-Host "  Downloading CyberMind CLI..." -ForegroundColor DarkGray

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($BINARY_URL, $TMP)
} catch {
    Write-Host "  Download failed: $_" -ForegroundColor Red
    Write-Host "  Try manually: https://cybermindcli1.vercel.app/cybermind-windows-amd64.exe" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $TMP)) {
    Write-Host "  Download failed - file not found" -ForegroundColor Red
    exit 1
}

# Try System32 first (requires admin), fallback to user dir
$INSTALLED_PATH = $null

try {
    $SYS32 = "$env:SystemRoot\System32\cybermind.exe"
    Copy-Item $TMP $SYS32 -Force
    $INSTALLED_PATH = $SYS32
    Write-Host "  Installed to $SYS32" -ForegroundColor Green
} catch {
    # Fallback: install to user local bin
    $USER_BIN = "$env:USERPROFILE\.local\bin"
    if (-not (Test-Path $USER_BIN)) {
        New-Item -ItemType Directory -Force -Path $USER_BIN | Out-Null
    }
    $USER_PATH = "$USER_BIN\cybermind.exe"
    Copy-Item $TMP $USER_PATH -Force
    $INSTALLED_PATH = $USER_PATH
    Write-Host "  Installed to $USER_PATH" -ForegroundColor Green

    # Add to user PATH if not already there
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$USER_BIN*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$USER_BIN", "User")
        Write-Host "  Added $USER_BIN to PATH" -ForegroundColor Green
        Write-Host "  NOTE: Restart your terminal for PATH to take effect" -ForegroundColor Yellow
    }
}

Remove-Item $TMP -Force -ErrorAction SilentlyContinue

# Save API key if provided
if ($env:CYBERMIND_KEY) {
    $CONFIG_DIR = "$env:USERPROFILE\.cybermind"
    if (-not (Test-Path $CONFIG_DIR)) {
        New-Item -ItemType Directory -Force -Path $CONFIG_DIR | Out-Null
    }
    '{"key":"' + $env:CYBERMIND_KEY + '"}' | Set-Content "$CONFIG_DIR\config.json" -Encoding UTF8
    Write-Host "  API key saved to $CONFIG_DIR\config.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "  CyberMind CLI installed successfully!" -ForegroundColor Green
Write-Host ""

if ($INSTALLED_PATH -like "*System32*") {
    Write-Host "  Run: cybermind" -ForegroundColor Cyan
} else {
    Write-Host "  Run: cybermind  (after restarting terminal)" -ForegroundColor Cyan
    Write-Host "  Or run directly: $INSTALLED_PATH" -ForegroundColor DarkGray
}

Write-Host "  Docs: https://cybermindcli1.vercel.app/docs" -ForegroundColor DarkGray
Write-Host ""
`.trimStart();

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
    },
  });
}
