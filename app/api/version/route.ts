import { NextResponse } from "next/server";

// Latest CLI version — update this when releasing a new version
const LATEST_VERSION = "4.4.0";

export async function GET() {
  return new NextResponse(JSON.stringify({ version: LATEST_VERSION }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
