#!/bin/bash
# CyberMind CLI — macOS Installer
# Downloads pre-built binary — NO Go required.
# After install: cybermind + cybermind vibe work from ANY terminal.
#
# Usage:
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash

set -e
CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; DIM='\033[2m'; NC='\033[0m'

API_KEY="${CYBERMIND_KEY:-}"
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
echo -e "${CYAN}  ⚡ CyberMind CLI — macOS Installer${NC}"
echo -e "${DIM}  No Go required — downloads pre-built binary directly.${NC}"
echo ""

# Detect architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
  BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-arm64"
  echo -e "${DIM}  Detected: Apple Silicon (arm64)${NC}"
else
  BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-amd64"
  echo -e "${DIM}  Detected: Intel (amd64)${NC}"
fi

# Download binary
echo -e "${DIM}  ⟳ Downloading CyberMind CLI...${NC}"
TMPFILE=$(mktemp)
if command -v curl &>/dev/null; then
  curl -sL "$BINARY_URL" -o "$TMPFILE"
elif command -v wget &>/dev/null; then
  wget -q "$BINARY_URL" -O "$TMPFILE"
else
  echo -e "${RED}  ✗ curl or wget required${NC}"; exit 1
fi

# Install globally
echo -e "${DIM}  ⟳ Installing to /usr/local/bin (requires sudo once)...${NC}"
sudo mv "$TMPFILE" /usr/local/bin/cybermind
sudo chmod +x /usr/local/bin/cybermind
echo -e "${GREEN}  ✓ Installed to /usr/local/bin/cybermind${NC}"
echo -e "${GREEN}  ✓ Works from ANY folder immediately${NC}"

# Save API key
mkdir -p "$HOME/.cybermind"
chmod 700 "$HOME/.cybermind"
if [ -n "$API_KEY" ]; then
  echo "{\"key\":\"$API_KEY\"}" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved${NC}"
else
  echo -e "${YELLOW}  ℹ  No API key. Run: cybermind --key cp_live_xxx${NC}"
fi

echo ""
echo -e "${GREEN}  ✓ CyberMind CLI installed!${NC}"
echo ""
echo -e "${CYAN}  Commands (from ANY folder):${NC}"
echo -e "${DIM}    cybermind              — AI security chat${NC}"
echo -e "${DIM}    cybermind vibe         — CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}    cybermind --version    — check version${NC}"
echo ""

if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null || echo "installed")
  echo -e "${GREEN}  ✓ $VER — ready!${NC}"
else
  echo -e "${YELLOW}  ⚠  Run: source ~/.zshrc && cybermind --version${NC}"
fi
echo ""
