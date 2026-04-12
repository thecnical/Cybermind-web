#!/bin/bash
# CyberMind CLI installer for Linux/Kali
# Installs: Full hacking pipeline (recon + hunt + Abhimanyu + Omega + AI chat)
#
# Usage (recommended — key via env var, never in shell history):
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash
#
# Usage (key as arg):
#   curl -sL https://cybermindcli1.vercel.app/install.sh | bash -s -- --key cp_live_xxx

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

# FIX: read key from env var first, then --key arg
API_KEY="${CYBERMIND_KEY:-}"
INSTALL_DIR="/usr/local/bin"
REPO="https://github.com/thecnical/cybermind"
VERSION="latest"

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --key) API_KEY="$2"; shift 2 ;;
    --version) VERSION="$2"; shift 2 ;;
    *) shift ;;
  esac
done

echo ""
echo -e "${CYAN} ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ███╗██╗███╗   ██╗██████╗${NC}"
echo -e "${CYAN}██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗${NC}"
echo -e "${CYAN}╚██████╗   ██║   ██████╔╝███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██████╔╝${NC}"
echo ""
echo -e "${CYAN}  ⚡ CyberMind CLI — Global Linux Installer${NC}"
echo -e "${DIM}  After install: cybermind works from ANY folder immediately${NC}"
echo ""

# Check Go
if ! command -v go &>/dev/null; then
  echo -e "${RED}  ✗ Go not found. Installing...${NC}"
  sudo apt-get install -y golang-go 2>/dev/null || {
    echo -e "${RED}  ✗ Could not install Go. Please install manually: https://go.dev/dl${NC}"
    exit 1
  }
fi

echo -e "${DIM}  ⟳ Cloning CyberMind CLI...${NC}"
TMPDIR=$(mktemp -d)
git clone --depth=1 "$REPO.git" "$TMPDIR/cybermind" 2>/dev/null

echo -e "${DIM}  ⟳ Building binary...${NC}"
cd "$TMPDIR/cybermind/cli"
go build -o cybermind . 2>/dev/null

echo -e "${DIM}  ⟳ Installing to $INSTALL_DIR...${NC}"
sudo mv cybermind "$INSTALL_DIR/cybermind"
sudo chmod +x "$INSTALL_DIR/cybermind"

# Save API key if provided
if [ -n "$API_KEY" ]; then
  mkdir -p "$HOME/.cybermind"
  echo "{\"key\":\"$API_KEY\"}" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved to ~/.cybermind/config.json${NC}"
fi

# Cleanup
rm -rf "$TMPDIR"

echo ""
echo -e "${GREEN}  ✓ CyberMind CLI installed globally!${NC}"
echo ""
echo -e "${CYAN}  Run from ANY folder in ANY terminal:${NC}"
echo -e "${DIM}    cybermind              — AI security chat${NC}"
echo -e "${DIM}    cybermind vibe         — CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}    cybermind recon -t TARGET — automated recon${NC}"
echo -e "${DIM}    cybermind --version    — check version${NC}"
echo ""

# Verify immediately
if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null || echo "installed")
  echo -e "${GREEN}  ✓ cybermind $VER — ready to use right now!${NC}"
  echo ""
  echo -e "${CYAN}  Try it now:${NC}"
  echo -e "${DIM}    cybermind --version${NC}"
  echo -e "${DIM}    cd ~/my-project && cybermind vibe${NC}"
else
  echo -e "${YELLOW}  ⚠  Run: hash -r && cybermind --version${NC}"
fi
echo ""
