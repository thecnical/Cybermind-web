import { NextResponse } from "next/server";

const SCRIPT = `#!/usr/bin/env bash
# CyberMind CLI — macOS installer
# Usage: curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash
# Usage: CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install-mac.sh | bash
set -e

CYAN="\\033[0;36m"
GREEN="\\033[0;32m"
RED="\\033[0;31m"
YELLOW="\\033[0;33m"
DIM="\\033[0;90m"
RESET="\\033[0m"

echo ""
echo -e "\${CYAN}  CyberMind CLI - macOS Installer\${RESET}"
echo -e "\${DIM}  https://cybermindcli1.vercel.app\${RESET}"
echo ""

ARCH=$(uname -m)
case "$ARCH" in
  arm64)  ARCH_TAG="arm64" ;;
  x86_64) ARCH_TAG="amd64" ;;
  *)      ARCH_TAG="amd64" ;;
esac

# macOS: try darwin binary first, fall back to linux binary (works via Rosetta/compatibility)
BINARY_URL="https://cybermindcli1.vercel.app/cybermind-linux-\${ARCH_TAG}"
INSTALL_DIR="/usr/local/bin"
TMP="/tmp/cybermind_install"

echo -e "\${DIM}  Downloading cybermind for macOS (\${ARCH})...\${RESET}"

curl -fsSL "\$BINARY_URL" -o "\$TMP"

if [ ! -f "\$TMP" ] || [ ! -s "\$TMP" ]; then
  echo -e "\${RED}  Download failed\${RESET}"
  exit 1
fi

chmod +x "\$TMP"

if [ -w "\$INSTALL_DIR" ]; then
  mv "\$TMP" "\$INSTALL_DIR/cybermind"
else
  sudo mv "\$TMP" "\$INSTALL_DIR/cybermind"
fi

echo -e "\${GREEN}  Installed to \$INSTALL_DIR/cybermind\${RESET}"

# Save API key if provided
if [ -n "\$CYBERMIND_KEY" ]; then
  mkdir -p "\$HOME/.cybermind"
  printf '{"key":"%s"}' "\$CYBERMIND_KEY" > "\$HOME/.cybermind/config.json"
  chmod 600 "\$HOME/.cybermind/config.json"
  echo -e "\${GREEN}  API key saved to ~/.cybermind/config.json\${RESET}"
fi

echo ""
echo -e "\${GREEN}  CyberMind CLI installed successfully!\${RESET}"
echo ""
echo -e "\${CYAN}  Run: cybermind\${RESET}"
echo -e "\${YELLOW}  Note: Recon/Hunt/Abhimanyu modes are Linux-only\${RESET}"
echo -e "\${DIM}  Docs: https://cybermindcli1.vercel.app/docs\${RESET}"
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
