#!/bin/bash
# CyberMind CLI — Linux/Kali Installer
# Downloads pre-built binary — NO Go required.
# Full pipeline: recon + hunt + Abhimanyu + Omega + AI chat
#
# Usage:
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash

set -e
CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; DIM='\033[2m'; NC='\033[0m'

API_KEY="${CYBERMIND_KEY:-}"
INSTALL_DIR="/usr/local/bin"
while [[ $# -gt 0 ]]; do
  case $1 in --key) API_KEY="$2"; shift 2 ;; *) shift ;; esac
done

echo ""
echo -e "${CYAN}  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗${NC}"
echo -e "${CYAN} ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝${NC}"
echo -e "${CYAN} ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗  ${NC}"
echo -e "${CYAN} ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗${NC}"
echo -e "${CYAN}  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝${NC}"
echo ""
echo -e "${CYAN}  ⚡ CyberMind CLI — Linux/Kali Installer${NC}"
echo -e "${DIM}  No Go required — downloads pre-built binary directly.${NC}"
echo -e "${DIM}  Full pipeline: recon + hunt + Abhimanyu + Omega + AI chat${NC}"
echo ""

# Detect architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
  BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-arm64"
  echo -e "${DIM}  Detected: ARM64${NC}"
else
  BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-amd64"
  echo -e "${DIM}  Detected: AMD64${NC}"
fi

# Download binary
echo -e "${DIM}  ⟳ Downloading CyberMind CLI...${NC}"
TMPFILE=$(mktemp)
if command -v curl &>/dev/null; then
  curl -sL "$BINARY_URL" -o "$TMPFILE"
elif command -v wget &>/dev/null; then
  wget -q "$BINARY_URL" -O "$TMPFILE"
else
  echo -e "${RED}  ✗ curl or wget required. Install: sudo apt install curl${NC}"; exit 1
fi

# Install globally
echo -e "${DIM}  ⟳ Installing to $INSTALL_DIR...${NC}"
sudo mv "$TMPFILE" "$INSTALL_DIR/cybermind"
sudo chmod +x "$INSTALL_DIR/cybermind"
echo -e "${GREEN}  ✓ Installed to $INSTALL_DIR/cybermind${NC}"

# Save API key
mkdir -p "$HOME/.cybermind"
chmod 700 "$HOME/.cybermind"
if [ -n "$API_KEY" ]; then
  echo "{\"key\":\"$API_KEY\"}" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved to ~/.cybermind/config.json${NC}"
else
  echo -e "${YELLOW}  ℹ  No API key. Run: cybermind --key cp_live_xxx${NC}"
fi

echo ""
echo -e "${GREEN}  ✓ CyberMind CLI installed globally!${NC}"
echo ""
echo -e "${CYAN}  Commands (from ANY folder):${NC}"
echo -e "${DIM}    cybermind              — AI security chat${NC}"
echo -e "${DIM}    cybermind vibe         — CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}    cybermind recon -t TARGET — automated recon (Linux only)${NC}"
echo -e "${DIM}    cybermind --version    — check version${NC}"
echo ""

if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null || echo "installed")
  echo -e "${GREEN}  ✓ $VER — ready!${NC}"
  echo ""
  echo -e "${CYAN}  Try it now:${NC}"
  echo -e "${DIM}    cybermind --version${NC}"
  echo -e "${DIM}    cd ~/my-project && cybermind vibe${NC}"
else
  echo -e "${YELLOW}  ⚠  Run: hash -r && cybermind --version${NC}"
fi
echo ""
