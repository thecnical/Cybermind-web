#!/bin/bash
# CyberMind CLI — macOS Global Installer
# After install: `cybermind` and `cybermind vibe` work from ANY terminal, ANY folder.
# Same as Claude Code — globally available immediately.
#
# Usage:
#   CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

# Read key from env var first, then --key arg
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
echo -e "${CYAN}  ⚡ CyberMind CLI — macOS Global Installer${NC}"
echo -e "${DIM}  After install: cybermind + cybermind vibe work from ANY folder${NC}"
echo ""

# ── Check Go ──────────────────────────────────────────────────────────────────
if ! command -v go &>/dev/null; then
  echo -e "${RED}  ✗ Go not found.${NC}"
  if command -v brew &>/dev/null; then
    echo -e "${DIM}  ⟳ Installing Go via Homebrew...${NC}"
    brew install go
  else
    echo -e "${RED}  Install Go: https://go.dev/dl or run: brew install go${NC}"
    exit 1
  fi
fi

# ── Clone and build ───────────────────────────────────────────────────────────
TMPDIR=$(mktemp -d)
echo -e "${DIM}  ⟳ Cloning CyberMind CLI...${NC}"
git clone --depth=1 https://github.com/thecnical/cybermind.git "$TMPDIR/cybermind" 2>/dev/null

echo -e "${DIM}  ⟳ Building binary...${NC}"
cd "$TMPDIR/cybermind/cli"
go build -o cybermind . 2>/dev/null

# ── Install globally to /usr/local/bin ────────────────────────────────────────
# /usr/local/bin is in PATH by default on macOS — works from ANY terminal immediately
echo -e "${DIM}  ⟳ Installing to /usr/local/bin (requires sudo once)...${NC}"
sudo mv cybermind /usr/local/bin/cybermind
sudo chmod +x /usr/local/bin/cybermind
echo -e "${GREEN}  ✓ Binary installed to /usr/local/bin/cybermind${NC}"
echo -e "${GREEN}  ✓ Works from ANY folder immediately — no restart needed${NC}"

# ── Save API key ───────────────────────────────────────────────────────────────
mkdir -p "$HOME/.cybermind"
chmod 700 "$HOME/.cybermind"

if [ -n "$API_KEY" ]; then
  echo "{\"key\":\"$API_KEY\"}" > "$HOME/.cybermind/config.json"
  chmod 600 "$HOME/.cybermind/config.json"
  echo -e "${GREEN}  ✓ API key saved to ~/.cybermind/config.json${NC}"
else
  echo -e "${YELLOW}  ℹ  No API key. Run: cybermind --key cp_live_xxx${NC}"
fi

rm -rf "$TMPDIR"

echo ""
echo -e "${GREEN}  ✓ CyberMind CLI installed globally!${NC}"
echo ""
echo -e "${CYAN}  Run from ANY folder in ANY terminal:${NC}"
echo -e "${DIM}    cybermind              — AI security chat${NC}"
echo -e "${DIM}    cybermind vibe         — CBM Code (AI coding assistant)${NC}"
echo -e "${DIM}    cybermind --version    — check version${NC}"
echo ""

# ── Verify immediately ────────────────────────────────────────────────────────
if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null || echo "installed")
  echo -e "${GREEN}  ✓ cybermind $VER — ready to use right now!${NC}"
  echo ""
  echo -e "${CYAN}  Try it now:${NC}"
  echo -e "${DIM}    cd ~/my-project && cybermind vibe${NC}"
else
  echo -e "${YELLOW}  ⚠  Run: source ~/.zshrc && cybermind --version${NC}"
fi
echo ""
