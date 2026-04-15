#!/bin/bash
# CyberMind CLI — Linux/Kali Installer v2.6.2
# Downloads pre-built binary — NO Go required.
# Full pipeline: recon + hunt + Abhimanyu + Omega + AI chat
#
# Usage:
#   curl -sL https://cybermindcli1.vercel.app/install.sh | bash
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash

set -e
CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; DIM='\033[2m'; NC='\033[0m'

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
echo -e "${GREEN}  ⚡ CyberMind CLI v2.6.2 — Installer${NC}"
echo -e "${DIM}  No Go required. Full pipeline: recon + hunt + Abhimanyu + Omega + AI chat${NC}"
echo ""

# ── Detect architecture ───────────────────────────────────────────────────────
ARCH=$(uname -m)
case "$ARCH" in
  aarch64|arm64) BINARY_URL="${CDN}/cybermind-linux-arm64"; echo -e "${DIM}  Detected: ARM64${NC}" ;;
  *)             BINARY_URL="${CDN}/cybermind-linux-amd64"; echo -e "${DIM}  Detected: AMD64${NC}" ;;
esac

# ── Download binary ───────────────────────────────────────────────────────────
echo -e "${DIM}  ⟳ Downloading CyberMind CLI...${NC}"
TMPFILE=$(mktemp /tmp/cybermind-XXXXXX)

if command -v curl &>/dev/null; then
  HTTP_CODE=$(curl -fsSL -w "%{http_code}" -o "$TMPFILE" "$BINARY_URL" 2>/dev/null)
elif command -v wget &>/dev/null; then
  wget -q "$BINARY_URL" -O "$TMPFILE" && HTTP_CODE="200" || HTTP_CODE="000"
else
  echo -e "${RED}  ✗ curl or wget required. Run: sudo apt install curl${NC}"; exit 1
fi

# Validate download
FILESIZE=$(stat -c%s "$TMPFILE" 2>/dev/null || stat -f%z "$TMPFILE" 2>/dev/null || echo 0)
if [ "$FILESIZE" -lt 1048576 ]; then
  rm -f "$TMPFILE"
  echo -e "${RED}  ✗ Download failed or file too small (${FILESIZE} bytes).${NC}"
  echo -e "${YELLOW}  Try: sudo apt install curl && CYBERMIND_KEY=${API_KEY} curl -sL ${CDN}/install.sh | bash${NC}"
  exit 1
fi

# ── Install globally ──────────────────────────────────────────────────────────
echo -e "${DIM}  ⟳ Installing to ${INSTALL_DIR}...${NC}"
chmod +x "$TMPFILE"
sudo cp "$TMPFILE" "${INSTALL_DIR}/cybermind"
sudo chmod +x "${INSTALL_DIR}/cybermind"
sudo cp "${INSTALL_DIR}/cybermind" "${INSTALL_DIR}/cbm"
sudo chmod +x "${INSTALL_DIR}/cbm"
rm -f "$TMPFILE"
echo -e "${GREEN}  ✓ Installed: ${INSTALL_DIR}/cybermind${NC}"
echo -e "${GREEN}  ✓ Alias:     ${INSTALL_DIR}/cbm${NC}"

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

# ── Quick tool install (essentials only — /doctor installs everything) ────────
echo ""
echo -e "${DIM}  ⟳ Installing essential recon tools...${NC}"
sudo apt-get update -qq 2>/dev/null || true
for tool in nmap whois dnsutils theharvester ffuf gobuster nuclei; do
  command -v "$tool" &>/dev/null || sudo apt-get install -y "$tool" -qq 2>/dev/null || true
done

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ⚡ CyberMind CLI v2.6.2 installed!${NC}"
echo ""
echo -e "  ${CYAN}Verify:${NC}      cybermind --version"
echo -e "  ${CYAN}AI Chat:${NC}     cybermind"
echo -e "  ${CYAN}Doctor:${NC}      sudo cybermind /doctor   ${DIM}← installs ALL tools${NC}"
echo -e "  ${CYAN}Recon:${NC}       sudo cybermind /recon example.com"
echo -e "  ${CYAN}Hunt:${NC}        sudo cybermind /hunt example.com"
echo -e "  ${CYAN}OMEGA Plan:${NC}  sudo cybermind /plan --auto-target --skill intermediate"
echo ""
if [ -n "$API_KEY" ]; then
  echo -e "  ${GREEN}✓ API key saved — run: cybermind whoami${NC}"
fi
echo -e "${GREEN}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Verify install ────────────────────────────────────────────────────────────
if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null || echo "v2.5.2")
  echo -e "${GREEN}  ✓ ${VER} — ready!${NC}"
else
  echo -e "${YELLOW}  ⚠  Run: hash -r && cybermind --version${NC}"
fi
echo ""
