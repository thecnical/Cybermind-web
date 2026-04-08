import type { LineColor } from "./colors"

export interface TerminalFrame {
  text: string
  color: LineColor
  delay: number
  instant?: boolean
}

export const TERMINAL_FRAMES: TerminalFrame[] = [
  // ASCII banner â€” 6 lines, instant, green
  { text: " â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•—   â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— ", color: "green", delay: 0, instant: true },
  { text: "â–ˆâ–ˆâ•”â•â•â•â•â•â•šâ–ˆâ–ˆâ•— â–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•”â•â•â•â•â•â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ•—  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—", color: "green", delay: 0, instant: true },
  { text: "â–ˆâ–ˆâ•‘      â•šâ–ˆâ–ˆâ–ˆâ–ˆâ•”â• â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—  â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•”â–ˆâ–ˆâ–ˆâ–ˆâ•”â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â–ˆâ–ˆâ•— â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘", color: "green", delay: 0, instant: true },
  { text: "â–ˆâ–ˆâ•‘       â•šâ–ˆâ–ˆâ•”â•  â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•”â•â•â•  â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘", color: "green", delay: 0, instant: true },
  { text: "â•šâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ•‘   â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘ â•šâ•â• â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘ â•šâ–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â• ", color: "green", delay: 0, instant: true },
  { text: " â•šâ•â•â•â•â•â•   â•šâ•â•   â•šâ•â•â•â•â•â• â•šâ•â•â•â•â•â•â•â•šâ•â•  â•šâ•â•â•šâ•â•     â•šâ•â•â•šâ•â•â•šâ•â•  â•šâ•â•â•â•â•šâ•â•â•â•â•â•  ", color: "green", delay: 0, instant: true },

  // Header lines
  { text: "", color: "white", delay: 0, instant: true },
  { text: "âš¡ CyberMind v2.4.1 â€” AI-Powered Offensive Security CLI", color: "cyan", delay: 200, instant: true },
  { text: "   shell-first offensive security CLI", color: "dim", delay: 0, instant: true },
  { text: "", color: "white", delay: 400, instant: true },

  // Phase 1 â€” Passive OSINT
  { text: "[Phase 1] Passive OSINT", color: "white", delay: 300 },
  { text: "  âœ“ whois          done    1.2s", color: "cyan", delay: 600 },
  { text: "  âœ“ theHarvester   done    4.8s", color: "cyan", delay: 400 },
  { text: "  âœ“ dig            done    0.3s", color: "cyan", delay: 300 },
  { text: "", color: "white", delay: 200, instant: true },

  // Phase 2 â€” Subdomain Enum
  { text: "[Phase 2] Subdomain Enum", color: "white", delay: 300 },
  { text: "  âœ“ subfinder      done    12.4s   47 subdomains", color: "cyan", delay: 800 },
  { text: "  âœ“ amass          done    18.2s", color: "cyan", delay: 600 },
  { text: "  âœ“ dnsx           done    3.1s    31 live hosts", color: "cyan", delay: 400 },
  { text: "", color: "white", delay: 200, instant: true },

  // Phase 3 â€” Port Scanning
  { text: "[Phase 3] Port Scanning", color: "white", delay: 300 },
  { text: "  âœ“ rustscan       done    2.1s    open: 80,443,8080", color: "cyan", delay: 700 },
  { text: "  âœ“ nmap           done    8.4s    services fingerprinted", color: "cyan", delay: 500 },
  { text: "", color: "white", delay: 200, instant: true },

  // Phase 4 â€” HTTP Fingerprint
  { text: "[Phase 4] HTTP Fingerprint", color: "white", delay: 300 },
  { text: "  âœ“ httpx          done    5.2s    28 live URLs", color: "cyan", delay: 600 },
  { text: "  âœ“ whatweb        done    3.8s    nginx/1.24, PHP/8.1", color: "cyan", delay: 400 },
  { text: "  âŸ³ tlsx           running...", color: "purple", delay: 500 },

  // AI analysis starting
  { text: "", color: "white", delay: 300, instant: true },
  { text: "âš¡ Sending findings to AI for analysis...", color: "cyan", delay: 400, instant: true },
]

