#!/bin/bash
# CyberMind CLI installer for macOS
# Installs: AI chat + CBM Code (vibe coder) + all macOS features
#
# Usage (recommended — key via env var, never in shell history):
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash
#
# Usage (key as arg):
#   curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash -s -- --key cp_live_xxx

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

# FIX: read key from env var first, then --key arg
# One command installs everything — key never in shell history
API_KEY="${CYBERMIND_KEY:-}"

while [[ $# -gt 0 ]]; do
  case $1 in
    --key) API_KEY="$2"; shift 2 ;;
    *) shift ;;
  esac
done

echo ""
echo -e "${CYAN}  ██████╗██████╗ ███╗   ███╗     ██████╗ ██████╗ ██████╗ ███████╗${NC}"
echo -e "${CYAN} ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝${NC}"
echo -e "${CYAN} ██║     ██████╔╝██╔████╔██║    ██║     ██║   ██║██║  ██║█████╗  ${NC}"
echo -e "${CYAN} ╚██████╗██████╔╝██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██████╔╝███████╗${NC}"
echo -e "${CYAN}  ╚═════╝╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝${NC}"
echo ""
echo -e "${CYAN}  ⚡ CyberMind CLI — macOS Installer${NC}"
echo -e "${DIM}  Includes: AI chat + CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}  Note: Full recon/hunt/Abhimanyu pipeline requires Linux/Kali.${NC}"
echo ""

# Check Go
if ! command -v go &>/dev/null; then
  echo -e "${RED}  ✗ Go not found.${NC}"
  if command -v brew &>/dev/null; then
    echo -e "${DIM}  ⟳ Installing Go via Homebrew...${NC}"
    brew install go
  else
    echo -e "${RED}  Install Go from https://go.dev/dl or install Homebrew first.${NC}"
    exit 1
  fi
fi

echo -e "${DIM}  ⟳ Cloning CyberMind CLI...${NC}"
TMPDIR=$(mktemp -d)
git clone --depth=1 https://github.com/thecnical/cybermind.git "$TMPDIR/cybermind" 2>/dev/null

echo -e "${DIM}  ⟳ Building binary...${NC}"
cd "$TMPDIR/cybermind/cli"
go build -o cybermind . 2>/dev/null

echo -e "${DIM}  ⟳ Installing to /usr/local/bin...${NC}"
sudo mv cybermind /usr/local/bin/cybermind
sudo chmod +x /usr/local/bin/cybermind

# Save API key
if [ -n "$API_KEY" ]; then
  mkdir -p "$HOME/.cybermind"
  chmod 700 "$HOME/.cybermind"
  echo "{\"key\":\"$API_KEY\"}" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved to ~/.cybermind/config.json${NC}"
else
  echo -e "${YELLOW}  ℹ  No API key provided. Run: cybermind --key cp_live_xxx${NC}"
fi

rm -rf "$TMPDIR"

echo ""
echo -e "${GREEN}  ✓ CyberMind CLI installed on macOS!${NC}"
echo ""
echo -e "${CYAN}  Commands:${NC}"
echo -e "${DIM}    cybermind          — AI security chat${NC}"
echo -e "${DIM}    cybermind vibe     — CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}    cybermind --version${NC}"
echo ""
