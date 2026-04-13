import { NextResponse } from "next/server";

const SCRIPT = `#!/usr/bin/env bash
# CyberMind CLI — Linux/Kali installer
# Usage: curl -sL https://cybermindcli1.vercel.app/install.sh | bash
# Usage: CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash
set -e

CYAN="\\033[0;36m"
GREEN="\\033[0;32m"
RED="\\033[0;31m"
YELLOW="\\033[0;33m"
DIM="\\033[0;90m"
RESET="\\033[0m"

echo ""
echo -e "\${CYAN}  CyberMind CLI - Linux Installer\${RESET}"
echo -e "\${DIM}  https://cybermindcli1.vercel.app\${RESET}"
echo ""

ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  ARCH_TAG="amd64" ;;
  aarch64) ARCH_TAG="arm64" ;;
  *)       ARCH_TAG="amd64" ;;
esac

BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-\${ARCH_TAG}"
INSTALL_DIR="/usr/local/bin"
TMP="/tmp/cybermind_install"

echo -e "\${DIM}  Downloading cybermind-linux-\${ARCH_TAG}...\${RESET}"

if command -v curl &>/dev/null; then
  curl -fsSL "\$BINARY_URL" -o "\$TMP"
elif command -v wget &>/dev/null; then
  wget -q "\$BINARY_URL" -O "\$TMP"
else
  echo -e "\${RED}  curl or wget required\${RESET}"
  exit 1
fi

if [ ! -f "\$TMP" ] || [ ! -s "\$TMP" ]; then
  echo -e "\${RED}  Download failed\${RESET}"
  exit 1
fi

chmod +x "\$TMP"

# Install to /usr/local/bin
if [ -w "\$INSTALL_DIR" ]; then
  mv "\$TMP" "\$INSTALL_DIR/cybermind"
  cp "\$INSTALL_DIR/cybermind" "\$INSTALL_DIR/cbm"
else
  sudo mv "\$TMP" "\$INSTALL_DIR/cybermind"
  sudo cp "\$INSTALL_DIR/cybermind" "\$INSTALL_DIR/cbm"
fi

echo -e "\${GREEN}  Installed cybermind + cbm to \$INSTALL_DIR\${RESET}"

# Save API key — overwrite any existing key (new key replaces old automatically)
if [ -n "\$CYBERMIND_KEY" ]; then
  mkdir -p "\$HOME/.cybermind"
  rm -f "\$HOME/.cybermind/config.json"
  printf '{"key":"%s"}' "\$CYBERMIND_KEY" > "\$HOME/.cybermind/config.json"
  chmod 600 "\$HOME/.cybermind/config.json"
  echo -e "\${GREEN}  API key saved (any previous key replaced)\${RESET}"
fi

echo ""
echo -e "\${GREEN}  CyberMind CLI installed successfully!\${RESET}"
echo ""
echo -e "\${CYAN}  Commands:\${RESET}"
echo -e "\${DIM}    cybermind              - AI security chat\${RESET}"
echo -e "\${DIM}    cybermind vibe         - CBM Code (AI coding assistant)\${RESET}"
echo -e "\${DIM}    cbm vibe               - same as above (short alias)\${RESET}"
echo -e "\${DIM}    cybermind /recon       - Auto recon (Linux only)\${RESET}"
echo -e "\${DIM}    cybermind /hunt        - Hunt mode (Linux only)\${RESET}"
echo -e "\${DIM}    cybermind --version    - check version\${RESET}"
echo ""
echo -e "\${DIM}  Docs: https://cybermindcli1.vercel.app/docs\${RESET}"
echo ""

# Verify install
if command -v cybermind &>/dev/null; then
  VER=$(cybermind --version 2>/dev/null | head -1)
  echo -e "\${GREEN}  ✓ \${VER} — ready!\${RESET}"
fi
echo ""
`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
    },
  });
}
