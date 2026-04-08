#!/bin/bash
# CyberMind CLI installer for Linux/Kali
# Usage: curl -sL https://cybermind.thecnical.dev/install.sh | bash -s -- --key cp_live_xxxxx

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
DIM='\033[2m'
NC='\033[0m'

API_KEY=""
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
echo -e "${CYAN}  ⚡ CyberMind CLI Installer${NC}"
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
echo -e "${GREEN}  ✓ CyberMind CLI installed successfully!${NC}"
echo ""
echo -e "${CYAN}  Next steps:${NC}"
echo -e "${DIM}  cybermind --version${NC}"
echo -e "${DIM}  cybermind /doctor${NC}"
echo -e "${DIM}  cybermind /recon <target>${NC}"
echo ""
