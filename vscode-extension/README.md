# CyberMind AI for VSCode

**AI-powered security scanning and coding assistant — free tier included, no account required.**

[![Version](https://img.shields.io/badge/version-1.0.0-00ffff)](https://cybermindcli1.vercel.app/extensions)
[![Free Tier](https://img.shields.io/badge/free%20tier-included-00ff88)](https://cybermindcli1.vercel.app)

---

## What is CyberMind AI?

CyberMind AI brings 8 specialized AI agents, OWASP security scanning, Plan Mode (like Cline/Kiro), real file editing with diff view, and inline completions — all inside VSCode.

**Free tier uses OpenRouter free models (DeepSeek R1, Llama 3.3, Gemma 4) — no account needed.**

---

## Features

### ⚡ Plan Mode
Type `/plan add JWT authentication` → AI generates a step-by-step plan → you approve → it executes automatically.

### 🔒 Security Agent (Unique)
OWASP Top 10 scanning with inline diagnostics. SQL injection, XSS, hardcoded secrets, broken auth — all appear as editor squiggles like TypeScript errors.

### 8 Specialized AI Agents
| Agent | What it does |
|-------|-------------|
| 🔒 Security | OWASP scanning, secrets detection |
| </> Code | Multi-file generation & editing |
| 🧪 Unit Test | Generate test suites |
| 🐛 Bug Fix | Root cause analysis |
| 💡 Explain | Plain language walkthroughs |
| ♻️ Refactor | Improve without changing behavior |
| 📝 Docs | Generate JSDoc/TSDoc |
| 🤖 Custom | Define your own agents |

### ✏️ Real File Editing
AI edits open a diff view — accept or reject before anything is written. Full undo via `Ctrl+Shift+Z`.

### 🔗 MCP Support
Connect GitHub, databases, Slack, and custom tools via Model Context Protocol. `Ctrl+Shift+P → CyberMind: Configure MCP Servers`.

### ⚡ Inline Completions
Ghost text as you type. Tab to accept, Esc to reject. 600ms debounce.

### 📁 Repo Grokking
Indexes your entire workspace (100K token context). Use `@filename` to attach any file.

---

## Getting Started

### 1. Install
Search `CyberMind AI` in the Extensions panel, or press `Ctrl+Shift+X`.

### 2. Sign in (optional)
Click the ⚡ icon in the Activity Bar:
- **Sign in with CyberMind** — opens browser, sign in with Google or email
- **Use API Key** — paste your `cp_live_...` key from [dashboard](https://cybermindcli1.vercel.app/dashboard/api-keys)
- **Continue Free** — uses OpenRouter free models, no account needed

### 3. Start coding
Select an agent and start typing. Use `/plan` for multi-step tasks.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Open Chat Panel |
| `Ctrl+Shift+S` | Scan File for Vulnerabilities |
| `Ctrl+Shift+Z` | Undo Last AI Change |
| `Tab` | Accept Inline Completion |
| `@filename` | Attach File as Context |
| `/plan task` | Activate Plan Mode |

---

## Plans

| Plan | Price | Requests | Model |
|------|-------|----------|-------|
| Free | ₹0 | 20/day | OpenRouter free models |
| Pro | ₹1,149/mo | 200/day | Pro models |
| Elite | ₹2,399/mo | Unlimited | Claude 3.7 Sonnet (AWS Bedrock) |

[View Plans →](https://cybermindcli1.vercel.app/plans)

---

## Links

- [Website](https://cybermindcli1.vercel.app)
- [Extension Guide](https://cybermindcli1.vercel.app/extensions/guide)
- [Dashboard](https://cybermindcli1.vercel.app/dashboard)
- [Support](https://cybermindcli1.vercel.app/support)

---

## Privacy

CyberMind does not collect your code. Messages are sent to the AI backend for processing only. See our [Privacy Policy](https://cybermindcli1.vercel.app/privacy).
