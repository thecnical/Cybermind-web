# CyberMind CLI — Windows Installer
# Downloads pre-built binary directly — NO Go required.
# After install: `cybermind` and `cybermind vibe` work from ANY terminal.
#
# Usage:
#   $env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex

param([string]$key = "")
$ErrorActionPreference = "Stop"

if ($key -eq "" -and $env:CYBERMIND_KEY -ne "") { $key = $env:CYBERMIND_KEY }

Write-Host ""
Write-Host "  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗" -ForegroundColor Cyan
Write-Host " ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝" -ForegroundColor Cyan
Write-Host " ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗  " -ForegroundColor Cyan
Write-Host " ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚡ CyberMind CLI — Windows Installer" -ForegroundColor Cyan
Write-Host "  No Go required — downloads pre-built binary directly." -ForegroundColor DarkGray
Write-Host ""

# ── Install directory ─────────────────────────────────────────────────────────
$installDir = Join-Path $env:LOCALAPPDATA "Programs\cybermind"
$homeDir    = Join-Path $env:USERPROFILE ".cybermind"

foreach ($d in @($installDir, $homeDir)) {
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# ── Download pre-built binary ─────────────────────────────────────────────────
$binaryUrl  = "https://cybermindcli1.vercel.app/cybermind-windows-amd64.exe"
$binaryPath = Join-Path $installDir "cybermind.exe"

Write-Host "  ⟳ Downloading CyberMind CLI binary..." -ForegroundColor DarkGray
try {
  $wc = New-Object System.Net.WebClient
  $wc.DownloadFile($binaryUrl, $binaryPath)
  Write-Host "  ✓ Downloaded to $binaryPath" -ForegroundColor Green
} catch {
  Write-Host "  ✗ Download failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "  Trying fallback (iwr)..." -ForegroundColor DarkGray
  try {
    Invoke-WebRequest -Uri $binaryUrl -OutFile $binaryPath -UseBasicParsing
    Write-Host "  ✓ Downloaded (fallback)" -ForegroundColor Green
  } catch {
    Write-Host "  ✗ Both download methods failed." -ForegroundColor Red
    Write-Host "  Please download manually from: https://cybermindcli1.vercel.app/install" -ForegroundColor Yellow
    exit 1
  }
}

# ── Remove old binary from System32 if it exists ──────────────────────────────
$oldPaths = @("C:\Windows\System32\cybermind.exe", "C:\Windows\cybermind.exe")
foreach ($oldPath in $oldPaths) {
  if (Test-Path $oldPath) {
    try { Remove-Item $oldPath -Force -ErrorAction SilentlyContinue; Write-Host "  ✓ Removed old binary from $oldPath" -ForegroundColor Green }
    catch { <# needs admin — skip #> }
  }
}

# ── Add to PATH (prepend for priority) ───────────────────────────────────────
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User") ?? ""
$cleanPath = ($userPath -split ";" | Where-Object { $_ -ne $installDir -and $_ -ne "" }) -join ";"
[Environment]::SetEnvironmentVariable("PATH", "$installDir;$cleanPath", "User")
$env:PATH = "$installDir;" + ($env:PATH -replace [regex]::Escape("$installDir;"), "")
Write-Host "  ✓ Added to PATH (front — takes priority)" -ForegroundColor Green

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
  Write-Host "  ✓ API key saved to $configPath" -ForegroundColor Green
} else {
  Write-Host "  ℹ  No API key. Run: cybermind --key cp_live_xxx" -ForegroundColor Yellow
}

# ── Broadcast PATH change ─────────────────────────────────────────────────────
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
} catch { }

Write-Host ""
Write-Host "  ✓ CyberMind CLI installed!" -ForegroundColor Green
Write-Host ""
Write-Host "  Commands (work from ANY folder):" -ForegroundColor Cyan
Write-Host "    cybermind              — AI security chat" -ForegroundColor DarkGray
Write-Host "    cybermind vibe         — CBM Code (AI coding assistant)" -ForegroundColor DarkGray
Write-Host "    cybermind --version    — check version" -ForegroundColor DarkGray
Write-Host ""

# ── Verify ────────────────────────────────────────────────────────────────────
try {
  $ver = & "$binaryPath" --version 2>$null
  Write-Host "  ✓ $ver — ready!" -ForegroundColor Green
  Write-Host ""
  Write-Host "  ⚠  Open a NEW terminal window, then run: cybermind --version" -ForegroundColor Yellow
} catch {
  Write-Host "  ⚠  Open a NEW terminal window, then run: cybermind --version" -ForegroundColor Yellow
}
Write-Host ""
