import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Serve the install.sh from public/ directory — single source of truth
// Update public/install.sh to change the installer, not this file.
export async function GET() {
  try {
    const scriptPath = join(process.cwd(), "public", "install.sh");
    const script = readFileSync(scriptPath, "utf-8");
    return new NextResponse(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-CyberMind-Version": "4.8.0",
      },
    });
  } catch {
    // Fallback: redirect to raw GitHub
    return NextResponse.redirect(
      "https://raw.githubusercontent.com/thecnical/cybermind/main/cli/install.sh",
      { status: 302 }
    );
  }
}
