// Server component — metadata lives here (cannot be in "use client")
import type { Metadata } from "next";
import CBMCodeClient from "./client";

export const metadata: Metadata = {
  title: "CBM Code — Free AI Coding Assistant | Claude Code Alternative | CyberMind",
  description: "CBM Code is a terminal-based AI coding assistant with 11+ providers (MiniMax M2.5, DeepSeek R1, Qwen3 Coder), free tier, MCP support, built-in security scanner. Works on Windows & macOS. Better than Claude Code.",
  keywords: ["CBM Code","AI coding assistant","claude code alternative","MiniMax M2.5","DeepSeek R1","Qwen3 Coder","free AI coding tool","Windows AI coding","terminal coding assistant"],
};

export default function CBMCodePage() {
  return <CBMCodeClient />;
}
