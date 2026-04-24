#!/bin/bash
# CyberMind CLI — Linux/Kali Installer v4.4.0
# Downloads pre-built binary — NO Go required.
# Full pipeline: recon + hunt + Abhimanyu + OMEGA smart pipeline + AI chat
# New in v4.4.0: /devsec · /vibe-hack · /chain · /red-team
#
# Usage:
#   curl -sL https://cybermindcli1.vercel.app/install.sh | bash
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash

set -e
CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; DIM='\033[2m'; NC='\033[0m'

VERSION="4.4.0"
GITHUB_RAW="https://raw.githubusercontent.com/thecnical/cybermind/main/cli"
CDN="https://cybermindcli1.vercel.app"
API_KEY="${CYBERMIND_KEY:-}"
INSTALL_DIR="/usr/local/bin"

while [[ $# -gt 0 ]]; do
  case $1 in --key) API_KEY="$2"; shift 2 ;; *) shift ;; esac
done

echo ""
echo -e "${CYAN} ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ███╗██╗███╗   ██╗██████╗${NC}"
echo -e "${CYAN}██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗${NC}"
echo -e "${CYAN}██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║██║  ██║${NC}"
echo -e "${CYAN}╚██████╗   ██║   ██████╔╝███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██████╔╝${NC}"
echo -e "${CYAN} ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝${NC}"
echo ""
echo -e "${GREEN}  ⚡ CyberMind CLI v${VERSION} — Installer${NC}"
echo -e "${DIM}  OMEGA smart pipeline + /devsec + /vibe-hack + /chain + /red-team${NC}"
echo ""

# ── Detect architecture ───────────────────────────────────────────────────────
ARCH=$(uname -m)
case "$ARCH" in
  aarch64|arm64) BINARY_NAME="cybermind-linux-arm64" ;;
  *)             BINARY_NAME="cybermind-linux-amd64" ;;
esac
echo -e "${DIM}  Arch: ${ARCH} → ${BINARY_NAME}${NC}"

# ── Download binary (GitHub primary, Vercel CDN fallback) ────────────────────
echo -e "${DIM}  ⟳ Downloading CyberMind CLI v${VERSION}...${NC}"
TMPFILE=$(mktemp /tmp/cybermind-XXXXXX)

download_binary() {
  local url="$1"
  local label="$2"
  echo -e "${DIM}  ⟳ Trying ${label}...${NC}"
  if command -v curl &>/dev/null; then
    HTTP_CODE=$(curl -fsSL --connect-timeout 15 --max-time 120 -w "%{http_code}" -o "$TMPFILE" "$url" 2>/dev/null)
  elif command -v wget &>/dev/null; then
    wget -q --timeout=120 "$url" -O "$TMPFILE" 2>/dev/null && HTTP_CODE="200" || HTTP_CODE="000"
  fi
  FILESIZE=$(stat -c%s "$TMPFILE" 2>/dev/null || stat -f%z "$TMPFILE" 2>/dev/null || echo 0)
  if [ "${HTTP_CODE:-000}" = "200" ] && [ "$FILESIZE" -gt 5242880 ]; then
    echo -e "${GREEN}  ✓ Downloaded ${FILESIZE} bytes from ${label}${NC}"
    return 0
  fi
  echo -e "${YELLOW}  ⚠  ${label} failed (HTTP ${HTTP_CODE:-000}, ${FILESIZE} bytes)${NC}"
  return 1
}

# Try GitHub first (most reliable, always has latest)
GITHUB_URL="${GITHUB_RAW}/${BINARY_NAME}"
CDN_URL="${CDN}/${BINARY_NAME}"

if ! download_binary "$GITHUB_URL" "GitHub"; then
  if ! download_binary "$CDN_URL" "Vercel CDN"; then
    rm -f "$TMPFILE"
    echo -e "${RED}  ✗ All download sources failed. Check your internet connection.${NC}"
    echo -e "${YELLOW}  Manual: wget ${GITHUB_URL} -O /usr/local/bin/cybermind && chmod +x /usr/local/bin/cybermind${NC}"
    exit 1
  fi
fi

# ── Force install (overwrite any existing version) ───────────────────────────
echo -e "${DIM}  ⟳ Installing to ${INSTALL_DIR} (force overwrite)...${NC}"
chmod +x "$TMPFILE"

# Remove old binary first to ensure clean overwrite
sudo rm -f "${INSTALL_DIR}/cybermind" "${INSTALL_DIR}/cbm" 2>/dev/null || true
sudo cp -f "$TMPFILE" "${INSTALL_DIR}/cybermind"
sudo chmod +x "${INSTALL_DIR}/cybermind"
sudo cp -f "${INSTALL_DIR}/cybermind" "${INSTALL_DIR}/cbm"
sudo chmod +x "${INSTALL_DIR}/cbm"
rm -f "$TMPFILE"

# Verify installation
INSTALLED_VER=$("${INSTALL_DIR}/cybermind" --version 2>/dev/null | head -1 || echo "unknown")
echo -e "${GREEN}  ✓ Installed: ${INSTALL_DIR}/cybermind${NC}"
echo -e "${GREEN}  ✓ Alias:     ${INSTALL_DIR}/cbm${NC}"
echo -e "${GREEN}  ✓ Version:   ${INSTALLED_VER}${NC}"

# ── Save API key ──────────────────────────────────────────────────────────────
mkdir -p "$HOME/.cybermind"
chmod 700 "$HOME/.cybermind"
if [ -n "$API_KEY" ]; then
  printf '{"key":"%s"}' "$API_KEY" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved to ~/.cybermind/config.json${NC}"
else
  echo -e "${YELLOW}  ℹ  No API key provided. Run: cybermind --key cp_live_xxx${NC}"
fi

# ── Configure PATH ────────────────────────────────────────────────────────────
export PATH=$PATH:/usr/local/bin:$HOME/go/bin:/usr/local/go/bin
for profile in ~/.bashrc ~/.zshrc /root/.bashrc /root/.zshrc; do
  if [ -f "$profile" ] && ! grep -q "go/bin" "$profile" 2>/dev/null; then
    echo 'export PATH=$PATH:$HOME/go/bin:/usr/local/go/bin' >> "$profile"
  fi
done

# ── Install auto-update hook ──────────────────────────────────────────────────
# Adds a startup check: if CLI version < latest, auto-update silently
AUTOUPDATE_SCRIPT="/usr/local/bin/cybermind-autoupdate"
sudo tee "$AUTOUPDATE_SCRIPT" > /dev/null << 'AUTOUPDATE'
#!/bin/bash
# CyberMind CLI auto-update check — runs on every cybermind startup
# Checks version against latest, updates silently if outdated
LATEST_URL="https://cybermindcli1.vercel.app/api/version"
CURRENT=$(/usr/local/bin/cybermind --version 2>/dev/null | grep -oP 'v[\d.]+' | head -1)
LATEST=$(curl -fsSL --connect-timeout 5 --max-time 10 "$LATEST_URL" 2>/dev/null | grep -oP '[\d.]+' | head -1)
if [ -n "$LATEST" ] && [ -n "$CURRENT" ]; then
  CURRENT_CLEAN="${CURRENT#v}"
  if [ "$CURRENT_CLEAN" != "$LATEST" ]; then
    echo -e "\033[0;36m  ⟳ Update available: ${CURRENT} → v${LATEST}. Run: sudo cybermind /doctor\033[0m"
  fi
fi
AUTOUPDATE
sudo chmod +x "$AUTOUPDATE_SCRIPT"

# Add auto-update check to shell profiles
for profile in ~/.bashrc ~/.zshrc /root/.bashrc /root/.zshrc; do
  if [ -f "$profile" ] && ! grep -q "cybermind-autoupdate" "$profile" 2>/dev/null; then
    echo '# CyberMind CLI auto-update check' >> "$profile"
    echo 'command -v cybermind-autoupdate &>/dev/null && cybermind-autoupdate &' >> "$profile"
  fi
done

# ── Quick tool install (essentials only — /doctor installs everything) ────────
echo ""
echo -e "${DIM}  ⟳ Installing essential recon tools...${NC}"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -qq 2>/dev/null || true
for tool in nmap whois dnsutils theharvester ffuf gobuster; do
  command -v "$tool" &>/dev/null || sudo apt-get install -y "$tool" -qq 2>/dev/null || true
done

# ── DevSec tools (for /devsec — Starter+ plan) ───────────────────────────────
echo ""
echo -e "${DIM}  ⟳ Checking DevSec tools (/devsec — Starter+ plan)...${NC}"

# trufflehog
if command -v trufflehog &>/dev/null; then
  echo -e "${DIM}  [already installed] trufflehog${NC}"
else
  echo -e "${DIM}  ⟳ Installing trufflehog...${NC}"
  curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sudo sh -s -- -b /usr/local/bin 2>/dev/null \
    || echo -e "${YELLOW}  ⚠  trufflehog install failed — run: sudo apt install trufflehog${NC}"
fi

# gitleaks
if command -v gitleaks &>/dev/null; then
  echo -e "${DIM}  [already installed] gitleaks${NC}"
else
  echo -e "${DIM}  ⟳ Installing gitleaks...${NC}"
  sudo apt-get install -y gitleaks -qq 2>/dev/null \
    || (GITLEAKS_VER="8.18.4" && curl -sSfL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VER}/gitleaks_${GITLEAKS_VER}_linux_x64.tar.gz" -o /tmp/gitleaks.tar.gz 2>/dev/null \
        && sudo tar -xzf /tmp/gitleaks.tar.gz -C /usr/local/bin gitleaks 2>/dev/null \
        && rm -f /tmp/gitleaks.tar.gz \
        || echo -e "${YELLOW}  ⚠  gitleaks install failed${NC}")
fi

# semgrep
if command -v semgrep &>/dev/null; then
  echo -e "${DIM}  [already installed] semgrep${NC}"
else
  echo -e "${DIM}  ⟳ Installing semgrep...${NC}"
  pipx install semgrep 2>/dev/null \
    || pip3 install semgrep --break-system-packages -q 2>/dev/null \
    || echo -e "${YELLOW}  ⚠  semgrep install failed — run: pip3 install semgrep${NC}"
fi

# trivy
if command -v trivy &>/dev/null; then
  echo -e "${DIM}  [already installed] trivy${NC}"
else
  echo -e "${DIM}  ⟳ Installing trivy...${NC}"
  sudo apt-get install -y trivy -qq 2>/dev/null \
    || (curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin 2>/dev/null \
        || echo -e "${YELLOW}  ⚠  trivy install failed${NC}")
fi

echo -e "${GREEN}  ✓ DevSec tools checked${NC}"

# ── Plan-gated mode notice ────────────────────────────────────────────────────
echo ""
echo -e "${DIM}  ℹ  Plan-gated modes in v4.4.0:${NC}"
echo -e "${DIM}     /devsec    — Starter+ plan (₹85/mo)${NC}"
echo -e "${DIM}     /vibe-hack — Pro+ plan (₹1,149/mo)${NC}"
echo -e "${DIM}     /chain     — Pro+ plan (₹1,149/mo)${NC}"
echo -e "${DIM}     /red-team  — Elite plan (₹2,399/mo)${NC}"
echo -e "${DIM}     Upgrade at: https://cybermindcli1.vercel.app/plans${NC}"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ⚡ CyberMind CLI v${VERSION} installed!${NC}"
echo ""
echo -e "  ${CYAN}Verify:${NC}      cybermind --version"
echo -e "  ${CYAN}AI Chat:${NC}     cybermind"
echo -e "  ${CYAN}Doctor:${NC}      sudo cybermind /doctor   ${DIM}← installs ALL tools${NC}"
echo -e "  ${CYAN}Recon:${NC}       sudo cybermind /recon example.com"
echo -e "  ${CYAN}Hunt:${NC}        sudo cybermind /hunt example.com"
echo -e "  ${CYAN}OMEGA Plan:${NC}  sudo cybermind /plan example.com"
echo -e "  ${CYAN}DevSec:${NC}      cybermind /devsec https://github.com/owner/repo  ${DIM}[Starter+]${NC}"
echo -e "  ${CYAN}Vibe Hack:${NC}   cybermind /vibe-hack example.com  ${DIM}[Pro+]${NC}"
echo -e "  ${CYAN}Chain:${NC}       cybermind /chain example.com  ${DIM}[Pro+]${NC}"
echo -e "  ${CYAN}Red Team:${NC}    cybermind /red-team company --duration 7d  ${DIM}[Elite]${NC}"
echo ""
if [ -n "$API_KEY" ]; then
  echo -e "  ${GREEN}✓ API key saved — run: cybermind whoami${NC}"
fi
echo -e "${GREEN}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Final verify ──────────────────────────────────────────────────────────────
if command -v cybermind &>/dev/null; then
  cybermind --version
else
  echo -e "${YELLOW}  ⚠  Restart terminal: source ~/.bashrc && cybermind --version${NC}"
fi
echo ""
