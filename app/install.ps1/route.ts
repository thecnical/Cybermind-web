import { NextResponse } from "next/server";

// PowerShell installer for Windows — downloads pre-built binary, no Go needed
// Usage: $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex

const SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

# Read key from env var
$key = if ($env:CYBERMIND_KEY) { $env:CYBERMIND_KEY } else { "" }

Write-Host ""
Write-Host "  CyberMind CLI - Windows Installer" -ForegroundColor Cyan
Write-Host "  No Go required. Works from ANY terminal after install." -ForegroundColor DarkGray
Write-Host "  https://cybermindcli1.vercel.app" -ForegroundColor DarkGray
Write-Host ""

$BINARY_URL = "https://cybermindcli1.vercel.app/cybermind-windows-amd64.exe"
$TMP = "$env:TEMP\cybermind_dl.exe"

Write-Host "  Downloading CyberMind CLI..." -ForegroundColor DarkGray
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($BINARY_URL, $TMP)
} catch {
    Write-Host "  Download failed: $_" -ForegroundColor Red
    exit 1
}

# ── Clean up ALL old install locations before installing fresh ────────────────
$oldLocations = @(
    "$env:USERPROFILE\.local\bin\cybermind.exe",
    "$env:USERPROFILE\.local\bin\cbm.exe",
    "$env:APPDATA\cybermind\cybermind.exe",
    "$env:LOCALAPPDATA\cybermind\cybermind.exe",
    "$env:SystemRoot\System32\cybermind.exe",
    "$env:SystemRoot\System32\cbm.exe"
)
foreach ($old in $oldLocations) {
    if (Test-Path $old) {
        try { Remove-Item $old -Force -ErrorAction SilentlyContinue; Write-Host "  Removed old: $old" -ForegroundColor DarkGray } catch {}
    }
}

# Install to user dir (no admin needed)
$installDir = "$env:LOCALAPPDATA\Programs\cybermind"
$homeDir = "$env:USERPROFILE\.cybermind"
foreach ($d in @($installDir, $homeDir)) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
}

$binaryPath = "$installDir\cybermind.exe"
Copy-Item $TMP $binaryPath -Force
Remove-Item $TMP -Force -ErrorAction SilentlyContinue
Write-Host "  Installed cybermind.exe to $installDir" -ForegroundColor Green

# Create cbm.exe alias (copy of cybermind.exe) — one binary, two names
$cbmPath = "$installDir\cbm.exe"
Copy-Item $binaryPath $cbmPath -Force
Write-Host "  Created cbm.exe alias (cbm vibe = cybermind vibe)" -ForegroundColor Green

# Remove old System32 binaries if they exist
foreach ($old in @("$env:SystemRoot\System32\cybermind.exe", "$env:SystemRoot\System32\cbm.exe")) {
    if (Test-Path $old) {
        try { Remove-Item $old -Force -ErrorAction SilentlyContinue; Write-Host "  Removed old binary from System32" -ForegroundColor Green } catch {}
    }
}

# Add to PATH — PREPEND for priority, update current session too
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if (-not $userPath) { $userPath = "" }
$cleanPath = ($userPath -split ";" | Where-Object { $_ -ne $installDir -and $_ -ne "" }) -join ";"
[Environment]::SetEnvironmentVariable("PATH", "$installDir;$cleanPath", "User")
$env:PATH = "$installDir;" + ($env:PATH -replace [regex]::Escape("$installDir;"), "")
Write-Host "  Added to PATH (front — takes priority)" -ForegroundColor Green

# Broadcast PATH change so new terminals pick it up immediately
try {
    Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices;
public class WinEnv {
    [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Auto)]
    public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
}
"@ -ErrorAction SilentlyContinue
    $r = [UIntPtr]::Zero
    [WinEnv]::SendMessageTimeout([IntPtr]0xFFFF, 0x001A, [UIntPtr]::Zero, "Environment", 2, 5000, [ref]$r) | Out-Null
} catch {}

# Save API key — overwrite any existing key (new key replaces old automatically)
if ($key -ne "") {
    $configPath = "$homeDir\config.json"
    # Remove old key file first to ensure clean replacement
    if (Test-Path $configPath) { Remove-Item $configPath -Force -ErrorAction SilentlyContinue }
    $keyJson = '{"key":"' + $key + '"}'
    Set-Content -Path $configPath -Value $keyJson -Encoding UTF8
    try {
        $acl = Get-Acl $configPath
        $acl.SetAccessRuleProtection($true, $false)
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            [System.Security.Principal.WindowsIdentity]::GetCurrent().Name, "FullControl", "Allow")
        $acl.SetAccessRule($rule); Set-Acl $configPath $acl
    } catch {}
    Write-Host "  API key saved (any previous key replaced)" -ForegroundColor Green
} else {
    Write-Host "  No API key provided. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  CyberMind CLI installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "  Commands (from ANY folder):" -ForegroundColor Cyan
Write-Host "    cybermind              - AI security chat" -ForegroundColor DarkGray
Write-Host "    cybermind vibe         - CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "    cbm vibe               - same as above (short alias)" -ForegroundColor DarkGray
Write-Host "    cybermind --version    - check version" -ForegroundColor DarkGray
Write-Host "    cybermind --key <key>  - update API key" -ForegroundColor DarkGray
Write-Host ""

# Verify in current session
try {
    $ver = & "$binaryPath" --version 2>$null
    Write-Host "  $ver - ready in this terminal!" -ForegroundColor Green
} catch {}

Write-Host ""
Write-Host "  IMPORTANT: Open a NEW PowerShell/CMD window to use 'cybermind' and 'cbm' globally." -ForegroundColor Yellow
Write-Host "  Or run directly now: $binaryPath" -ForegroundColor DarkGray
Write-Host ""
`.trimStart();

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
