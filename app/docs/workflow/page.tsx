import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Workflow Guide — CyberMind Docs",
  description: "Full CyberMind CLI workflow: install, doctor, recon, hunt, OMEGA planning, Abhimanyu exploit — every command with flags explained.",
};

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mb-16 scroll-mt-28">
    <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
    {children}
  </section>
);

const Sub = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <div id={id} className="mb-10 scroll-mt-28">
    <h3 className="mb-4 text-lg font-semibold text-[var(--accent-cyan)]">{title}</h3>
    {children}
  </div>
);

const Cmd = ({ cmd, desc }: { cmd: string; desc?: string }) => (
  <div className="mb-3">
    <code className="block rounded-xl bg-[rgba(0,255,255,0.06)] border border-[rgba(0,255,255,0.12)] px-4 py-3 font-mono text-sm text-[var(--accent-cyan)] whitespace-pre-wrap break-all">
      {cmd}
    </code>
    {desc && <p className="mt-1.5 pl-1 text-sm text-[var(--text-muted)]">{desc}</p>}
  </div>
);

const Flag = ({ flag, desc }: { flag: string; desc: string }) => (
  <div className="mb-2 grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
    <code className="font-mono text-xs text-[var(--accent-cyan)] whitespace-nowrap">{flag}</code>
    <span className="text-sm text-[var(--text-soft)]">{desc}</span>
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] px-4 py-3 text-sm text-yellow-200/80">
    {children}
  </div>
);

const toc = [
  { id: "install", label: "1. Install" },
  { id: "doctor", label: "2. Doctor (tool setup)" },
  { id: "key", label: "3. Save API key" },
  { id: "chat", label: "4. AI Chat" },
  { id: "recon", label: "5. Recon mode" },
  { id: "hunt", label: "6. Hunt mode" },
  { id: "plan", label: "7. OMEGA Planning" },
  { id: "abhimanyu", label: "8. Abhimanyu (exploit)" },
  { id: "vibe", label: "9. Vibe Coder" },
  { id: "utils", label: "10. Utilities" },
  { id: "uninstall", label: "11. Uninstall / Update" },
];

export default function WorkflowPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent-cyan)]">Complete Guide</p>
        <h1 className="mb-4 text-4xl font-bold text-white">CyberMind CLI — Full Workflow</h1>
        <p className="text-lg text-[var(--text-soft)]">
          Everything from fresh install to overnight bug bounty hunting. Every command, every flag, every workflow — in order.
        </p>
      </div>

      {/* TOC */}
      <div className="mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent-cyan)]">On this page</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {toc.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-lg px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-white/[0.05] hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── 1. INSTALL ── */}
      <Section id="install" title="1. Install CyberMind CLI">
        <Sub id="install-linux" title="Linux / Kali (recommended)">
          <Cmd cmd="curl -sL https://cybermindcli1.vercel.app/install.sh | bash" desc="One-command install. Downloads pre-built binary, installs to /usr/local/bin." />
          <Cmd cmd='CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash' desc="Install and save your API key in one step." />
          <Cmd cmd="cybermind --version" desc="Verify install. Should show v2.5.7 or later." />
        </Sub>
        <Sub id="install-windows" title="Windows (PowerShell)">
          <Cmd cmd='(iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex' desc="Run in PowerShell (Admin recommended)." />
          <Cmd cmd='$env:CYBERMIND_KEY="cp_live_xxx"; (iwr https://cybermindcli1.vercel.app/install.ps1 -UseBasicParsing).Content | iex' desc="Install with API key pre-saved." />
        </Sub>
        <Sub id="install-manual" title="Manual binary install (if curl fails)">
          <Cmd cmd={`wget https://cybermindcli1.vercel.app/cybermind-linux-amd64 -O /tmp/cm
chmod +x /tmp/cm
sudo cp /tmp/cm /usr/local/bin/cybermind
sudo cp /tmp/cm /usr/local/bin/cbm`} desc="Download binary directly and install manually." />
        </Sub>
      </Section>

      {/* ── 2. DOCTOR ── */}
      <Section id="doctor" title="2. Doctor — Install All Tools">
        <p className="mb-6 text-[var(--text-soft)]">
          Run doctor after install. It checks every recon/hunt/exploit tool, installs missing ones automatically, and updates the CLI binary.
        </p>
        <Cmd cmd="sudo cybermind /doctor" desc="Full health check + auto-install all missing tools. Takes 10-20 min on first run." />
        <Note>Run as root (sudo) — tool installation requires system-level access.</Note>
        <Sub id="doctor-tools" title="What doctor installs">
          <div className="grid gap-2 text-sm text-[var(--text-soft)]">
            {[
              ["Recon (35 tools)", "nmap, subfinder, amass, httpx, nuclei, rustscan, ffuf, katana, dnsx, tlsx, wafw00f, shodan, h8mail, exiftool, recon-ng, spiderfoot, metagoofil, theHarvester, feroxbuster, gobuster, nikto, whatweb, masscan, zmap, naabu, reconftw, crlfuzz, tinja, sstimap, gitxray, binwalk3, wpprobe, dig, whois, amass"],
              ["Hunt (28 tools)", "dalfox, gau, waybackurls, hakrawler, gospider, cariddi, trufflehog, mantra, paramspider, arjun, x8, smuggler, jwt_tool, graphw00f, xsstrike, kxss, bxss, corsy, gf, ssrfmap, tplmap, liffy, gopherus, waymore, subjs, httprobe, urlfinder, beef-xss"],
              ["Exploit (38 tools)", "sqlmap, commix, wpscan, nosqlmap, xxeinjector, hydra, john, hashcat, kerbrute, searchsploit, msfconsole, linpeas, pspy, bloodhound-python, certipy, bloodyAD, pywhisker, crackmapexec, netexec, evil-winrm, impacket-secretsdump, coercer, mitm6, chisel, ligolo-ng, iodine, empire, sliver, evilginx2, routersploit, sprayhound, wpscan, rubeus, ldeep, adaptixc2, fluxion, donut-shellcode, bopscrk"],
            ].map(([cat, tools]) => (
              <div key={cat} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-2 font-semibold text-white">{cat}</p>
                <p className="font-mono text-xs leading-6 text-[var(--text-muted)]">{tools}</p>
              </div>
            ))}
          </div>
        </Sub>
      </Section>

      {/* ── 3. API KEY ── */}
      <Section id="key" title="3. Save Your API Key">
        <Cmd cmd="cybermind --key cp_live_YOUR_KEY_HERE" desc="Save your Elite/Pro/Starter API key. Stored in ~/.cybermind/config.json." />
        <Cmd cmd="cybermind whoami" desc="Verify key — shows your plan, usage, and limits." />
        <div className="mt-4 rounded-xl border border-[rgba(0,255,255,0.15)] bg-[rgba(0,255,255,0.04)] p-4 text-sm text-[var(--text-soft)]">
          <p className="mb-2 font-semibold text-white">Plan features:</p>
          <div className="grid gap-1">
            {[
              ["Starter", "AI chat, /scan, /osint, /cve, /payload"],
              ["Pro", "All Starter + /recon, /hunt, /plan, /doctor"],
              ["Elite", "All Pro + Abhimanyu exploit engine, unlimited usage, priority AI"],
            ].map(([plan, features]) => (
              <div key={plan} className="flex gap-3">
                <span className="w-16 font-mono text-xs text-[var(--accent-cyan)]">{plan}</span>
                <span className="text-xs text-[var(--text-muted)]">{features}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. AI CHAT ── */}
      <Section id="chat" title="4. AI Chat">
        <Cmd cmd="cybermind" desc="Launch interactive AI security chat. Works on all platforms." />
        <Cmd cmd="cybermind --local" desc="Use local Ollama AI instead of cloud (set CYBERMIND_LOCAL=true)." />
        <Sub id="chat-commands" title="Chat slash commands">
          {[
            ["/recon <target>", "Run full automated recon (Linux only)"],
            ["/hunt <target>", "Run vulnerability hunt (Linux only)"],
            ["/plan <target>", "OMEGA planning mode (Linux only)"],
            ["/scan <target>", "AI-guided network scan (all platforms)"],
            ["/osint <target>", "OSINT lookup (all platforms)"],
            ["/cve --latest", "Latest critical CVEs"],
            ["/cve <CVE-ID>", "CVE details and exploit info"],
            ["/payload", "Generate reverse shell payloads"],
            ["/wordlist <target>", "Generate custom wordlist"],
            ["/doctor", "Health check + auto-update"],
            ["/uninstall", "Remove CyberMind completely"],
            ["report", "Generate pentest report from chat history"],
            ["clear", "Clear chat history"],
          ].map(([cmd, desc]) => <Flag key={cmd} flag={cmd} desc={desc} />)}
        </Sub>
      </Section>

      {/* ── 5. RECON ── */}
      <Section id="recon" title="5. Recon Mode">
        <p className="mb-6 text-[var(--text-soft)]">Full automated recon pipeline — passive OSINT → subdomain enum → port scan → HTTP fingerprint → vuln scan → AI analysis.</p>
        <Cmd cmd="sudo cybermind /recon example.com" desc="Full recon on a target domain." />
        <Cmd cmd="sudo cybermind /recon example.com --tools nmap,httpx,nuclei" desc="Run only specific tools." />
        <Cmd cmd="sudo cybermind /recon example.com --passive" desc="Passive recon only (no active scanning)." />
        <Sub id="recon-flags" title="Flags">
          <Flag flag="--tools <list>" desc="Comma-separated tool names to run. E.g. nmap,subfinder,httpx" />
          <Flag flag="--passive" desc="Passive mode only — no active port scanning or fingerprinting" />
          <Flag flag="--output <file>" desc="Save results to file" />
        </Sub>
        <Sub id="recon-flow" title="Recon pipeline (in order)">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-xs text-[var(--text-muted)] leading-7">
            {[
              "1. whois + theHarvester + shodan → passive OSINT",
              "2. subfinder + amass + dnsx → subdomain enumeration",
              "3. rustscan + nmap + naabu → port scanning",
              "4. httpx + whatweb + tlsx + wafw00f → HTTP fingerprinting",
              "5. ffuf + feroxbuster + gobuster → directory discovery",
              "6. nuclei + nikto + katana → vulnerability scanning",
              "7. AI analysis → attack surface summary + recommendations",
            ].map((step) => <div key={step}>{step}</div>)}
          </div>
        </Sub>
      </Section>

      {/* ── 6. HUNT ── */}
      <Section id="hunt" title="6. Hunt Mode">
        <p className="mb-6 text-[var(--text-soft)]">Deep vulnerability hunting — URL collection → parameter discovery → XSS/SSRF/IDOR/SQLi hunting → AI triage.</p>
        <Cmd cmd="sudo cybermind /hunt example.com" desc="Full hunt on a target." />
        <Cmd cmd="sudo cybermind /hunt example.com --tools dalfox,nuclei,gau" desc="Run specific hunt tools only." />
        <Sub id="hunt-flags" title="Flags">
          <Flag flag="--tools <list>" desc="Specific hunt tools to run" />
          <Flag flag="--focus xss,idor,ssrf" desc="Focus on specific vulnerability types" />
        </Sub>
        <Sub id="hunt-flow" title="Hunt pipeline (in order)">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-xs text-[var(--text-muted)] leading-7">
            {[
              "1. gau + waybackurls + waymore → URL collection from archives",
              "2. hakrawler + gospider + cariddi → live crawling",
              "3. paramspider + arjun + x8 → parameter discovery",
              "4. dalfox + xsstrike + kxss + bxss → XSS hunting",
              "5. ssrfmap + gopherus → SSRF testing",
              "6. tplmap → SSTI detection",
              "7. jwt_tool → JWT vulnerability testing",
              "8. gf patterns → grep for interesting params",
              "9. trufflehog + mantra → secret/API key leaks",
              "10. AI triage → bug report with severity + PoC suggestions",
            ].map((step) => <div key={step}>{step}</div>)}
          </div>
        </Sub>
      </Section>

      {/* ── 7. OMEGA PLAN ── */}
      <Section id="plan" title="7. OMEGA Planning Mode">
        <p className="mb-6 text-[var(--text-soft)]">
          The most powerful mode. Runs full recon → hunt → exploit pipeline automatically. Best for overnight bug bounty runs.
        </p>
        <Cmd cmd="sudo cybermind /plan example.com" desc="Full OMEGA plan on a specific target." />
        <Cmd cmd="sudo cybermind /plan --auto-target" desc="AI picks the best HackerOne target for you automatically." />
        <Cmd cmd="sudo cybermind /plan --auto-target --skill intermediate --focus idor,xss,ssrf" desc="Auto-target with skill level and bug focus." />
        <Cmd cmd="sudo cybermind /plan example.com --focus xss,idor --skill beginner" desc="Target with focus and skill level." />
        <Sub id="plan-flags" title="Flags">
          <Flag flag="--auto-target" desc="AI fetches best HackerOne bug bounty target based on your skill + focus. No domain needed." />
          <Flag flag="--skill <level>" desc="beginner | intermediate | advanced — adjusts tool aggression and AI recommendations" />
          <Flag flag="--focus <types>" desc="Comma-separated: xss, idor, ssrf, sqli, rce, lfi, xxe, ssti, auth, logic — focuses the hunt" />
        </Sub>
        <Sub id="plan-flow" title="OMEGA pipeline (in order)">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-xs text-[var(--text-muted)] leading-7">
            {[
              "1. Doctor check → verify all tools installed",
              "2. Passive recon → OSINT, subdomains, ports",
              "3. Active recon → HTTP fingerprint, vuln scan",
              "4. Hunt phase → URL collection, param discovery, XSS/SSRF/IDOR",
              "5. AI analysis → attack plan with prioritized targets",
              "6. Abhimanyu → exploit confirmed vulnerabilities",
              "7. PoC generation → AI writes proof-of-concept for each bug",
              "8. Report → full pentest report with CVSS scores",
            ].map((step) => <div key={step}>{step}</div>)}
          </div>
        </Sub>
        <Note>
          For overnight runs: <code className="font-mono text-xs">sudo cybermind /plan --auto-target --skill intermediate --focus idor,xss,ssrf</code> — leave it running, check results in the morning.
        </Note>
      </Section>

      {/* ── 8. ABHIMANYU ── */}
      <Section id="abhimanyu" title="8. Abhimanyu — Exploit Engine">
        <p className="mb-6 text-[var(--text-soft)]">
          Elite-only exploit engine. Takes recon findings and runs targeted exploitation — SQLi, XSS, RCE, auth bypass, CVE chains.
        </p>
        <Cmd cmd="sudo cybermind /abhimanyu example.com" desc="Run full exploit pipeline on target." />
        <Cmd cmd="sudo cybermind /abhimanyu example.com sqli" desc="Focus on SQL injection exploitation." />
        <Cmd cmd="sudo cybermind /abhimanyu example.com xss" desc="Focus on XSS exploitation." />
        <Sub id="abhimanyu-vulns" title="Supported vulnerability types">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["sqli", "xss", "rce", "ssrf", "lfi", "xxe", "ssti", "idor", "auth", "csrf", "open-redirect", "cve"].map((v) => (
              <code key={v} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-center font-mono text-xs text-[var(--accent-cyan)]">{v}</code>
            ))}
          </div>
        </Sub>
        <Sub id="abhimanyu-tools" title="Tools used by Abhimanyu">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-xs text-[var(--text-muted)] leading-7">
            {[
              "sqlmap → SQL injection detection + exploitation",
              "commix → command injection exploitation",
              "nosqlmap → NoSQL injection",
              "xxeinjector → XXE exploitation",
              "tplmap → SSTI exploitation",
              "hydra + john + hashcat → auth brute force",
              "kerbrute → Kerberos attacks",
              "searchsploit + msfconsole → CVE exploitation",
              "bloodhound-python + certipy → AD attacks",
              "crackmapexec + netexec → lateral movement",
              "chisel + ligolo-ng → tunneling",
              "linpeas + pspy → post-exploitation",
            ].map((step) => <div key={step}>{step}</div>)}
          </div>
        </Sub>
      </Section>

      {/* ── 9. VIBE CODER ── */}
      <Section id="vibe" title="9. Vibe Coder (CyberMind Neural)">
        <p className="mb-6 text-[var(--text-soft)]">AI coding assistant — works in any project directory. Reads your codebase, writes code, runs commands.</p>
        <Cmd cmd="cybermind vibe" desc="Launch Vibe Coder in current directory." />
        <Cmd cmd="cbm vibe" desc="Short alias — same as cybermind vibe." />
        <Sub id="vibe-slash" title="Vibe Coder slash commands">
          {[
            ["/build", "Build the project"],
            ["/test", "Run tests"],
            ["/fix", "Auto-fix errors in current file"],
            ["/explain", "Explain selected code"],
            ["/refactor", "Refactor current file"],
            ["/security", "Security audit of codebase"],
            ["/fullstack", "Full-stack feature implementation"],
            ["/deploy", "Deployment guide for current project"],
          ].map(([cmd, desc]) => <Flag key={cmd} flag={cmd} desc={desc} />)}
        </Sub>
      </Section>

      {/* ── 10. UTILITIES ── */}
      <Section id="utils" title="10. Utility Commands">
        <Sub id="utils-scan" title="Network scan">
          <Cmd cmd="cybermind /scan 192.168.1.0/24" desc="AI-guided network scan (all platforms)." />
          <Cmd cmd="cybermind /portscan example.com" desc="Port scan with AI analysis." />
        </Sub>
        <Sub id="utils-osint" title="OSINT">
          <Cmd cmd="cybermind /osint example.com" desc="Full OSINT lookup — whois, DNS, emails, subdomains." />
        </Sub>
        <Sub id="utils-cve" title="CVE intelligence">
          <Cmd cmd="cybermind /cve --latest" desc="Latest critical CVEs (last 7 days)." />
          <Cmd cmd="cybermind /cve CVE-2024-1234" desc="Specific CVE details + exploit info." />
          <Cmd cmd="cybermind /cve --keyword apache" desc="Search CVEs by keyword." />
        </Sub>
        <Sub id="utils-payload" title="Payload generation">
          <Cmd cmd="cybermind /payload" desc="Interactive payload generator — reverse shells, web shells, encoders." />
          <Cmd cmd="cybermind /wordlist example.com" desc="Generate custom wordlist for target." />
        </Sub>
        <Sub id="utils-report" title="Report generation">
          <Cmd cmd="cybermind report" desc="Generate full pentest report from current chat/session history." />
        </Sub>
      </Section>

      {/* ── 11. UNINSTALL / UPDATE ── */}
      <Section id="uninstall" title="11. Update and Uninstall">
        <Sub id="update" title="Update to latest version">
          <Cmd cmd="sudo cybermind /doctor" desc="Auto-updates CLI binary + installs any new tools." />
        </Sub>
        <Sub id="uninstall-cmd" title="Uninstall completely">
          <Cmd cmd="sudo cybermind /uninstall" desc="Removes binary + config. Clean uninstall." />
          <Cmd cmd="sudo rm -f /usr/local/bin/cybermind /usr/local/bin/cbm && rm -rf ~/.cybermind" desc="Manual uninstall if CLI is broken." />
        </Sub>
        <Sub id="reinstall" title="Reinstall fresh">
          <Cmd cmd='CYBERMIND_KEY=cp_live_xxx curl -sL https://cybermindcli1.vercel.app/install.sh | bash' desc="Fresh install with API key." />
        </Sub>
      </Section>

      {/* Quick reference card */}
      <div className="rounded-2xl border border-[rgba(0,255,255,0.15)] bg-[rgba(0,255,255,0.03)] p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent-cyan)]">Quick reference — most used commands</p>
        <div className="grid gap-2 font-mono text-xs">
          {[
            ["sudo cybermind /doctor", "Install/update all tools"],
            ["sudo cybermind /plan --auto-target", "Overnight bug bounty (auto picks target)"],
            ["sudo cybermind /recon example.com", "Full recon"],
            ["sudo cybermind /hunt example.com", "Vulnerability hunt"],
            ["cybermind /cve --latest", "Latest CVEs"],
            ["cybermind vibe", "AI coding assistant"],
            ["cybermind whoami", "Check plan + usage"],
          ].map(([cmd, desc]) => (
            <div key={cmd} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <code className="text-[var(--accent-cyan)]">{cmd}</code>
              <span className="text-[var(--text-muted)]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
