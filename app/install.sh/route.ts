import { NextResponse } from "next/server";

const SCRIPT = `#!/usr/bin/env bash
# CyberMind CLI — Linux/Kali installer
# Usage: curl -sL https://cybermindcli1.vercel.app/install.sh | bash
# Usage: CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash
set -e

CYAN="\\033[0;36m"
GREEN="\\033[0;32m"
RED="\\033[0;31m"
DIM="\\033[0;90m"
RESET="\\033[0m"

echo ""
echo -e "\${CYAN}  ⚡ CyberMind CLI — Linux Installer\${RESET}"
echo -e "\${DIM}  https://cybermindcli1.vercel.app\${RESET}"
echo ""

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
  x86_64)  ARCH_TAG="amd64" ;;
  aarch64) ARCH_TAG="arm64" ;;
  armv7l)  ARCH_TAG="armv7" ;;
  *)       ARCH_TAG="amd64" ;;
esac

INSTALL_DIR="/usr/local/bin"
BINARY="cybermind"
RELEASE_URL="https://github.com/thecnical/cybermind/releases/latest/download/cybermind-linux-\${ARCH_TAG}"

echo -e "\${DIM}  Detected: \${OS}/\${ARCH} → downloading \${ARCH_TAG} binary\${RESET}"
echo ""

# Download binary
if command -v curl &>/dev/null; then
  curl -sL "\$RELEASE_URL" -o /tmp/cybermind_install
elif command -v wget &>/dev/null; then
  wget -q "\$RELEASE_URL" -O /tmp/cybermind_install
else
  echo -e "\${RED}  ✗ curl or wget required\${RESET}"
  exit 1
fi

chmod +x /tmp/cybermind_install

# Install to /usr/local/bin
if [ -w "\$INSTALL_DIR" ]; then
  mv /tmp/cybermind_install "\$INSTALL_DIR/\$BINARY"
else
  sudo mv /tmp/cybermind_install "\$INSTALL_DIR/\$BINARY"
fi

echo -e "\${GREEN}  ✓ CyberMind CLI installed to \$INSTALL_DIR/\$BINARY\${RESET}"

# Save API key if provided via env
if [ -n "\$CYBERMIND_KEY" ]; then
  mkdir -p "\$HOME/.cybermind"
  echo "{\\"key\\":\\"\$CYBERMIND_KEY\\"}" > "\$HOME/.cybermind/config.json"
  chmod 600 "\$HOME/.cybermind/config.json"
  echo -e "\${GREEN}  ✓ API key saved to ~/.cybermind/config.json\${RESET}"
fi

echo ""
echo -e "\${CYAN}  Run: cybermind\${RESET}"
echo -e "\${DIM}  Docs: https://cybermindcli1.vercel.app/docs\${RESET}"
echo ""
`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
