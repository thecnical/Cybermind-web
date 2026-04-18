# CyberMind AI — VSCode Extension

AI-powered security and coding assistant with OWASP scanning, multi-agent system, and real file editing.

## Installation

1. Install from the VSCode Marketplace or download the `.vsix` and run:
   ```
   code --install-extension cybermind-vscode-1.0.0.vsix
   ```
2. Click the CyberMind icon in the Activity Bar to open the chat panel.
3. Sign in with your CyberMind account or API key (`cp_live_...`), or use the free tier.

## Features

- **AI Chat Panel** — Sidebar chat with streaming responses and code block apply/reject
- **8 Specialized Agents** — Security, Code, Unit Test, Bug Fix, Explain, Refactor, Docs, and custom agents
- **OWASP Security Scanning** — Scan files or entire workspace for vulnerabilities with inline diagnostics
- **Real File Editing** — AI edits open a diff view; accept or reject before any file is changed
- **Terminal Execution** — AI can run commands; dangerous commands require explicit confirmation
- **Inline Completions** — Ghost text suggestions with 600ms debounce (Tab to accept)
- **Session History** — 20 most recent chats persisted across restarts
- **Workspace Indexing** — Background file indexing with `@filename` mention support

## Agents

| Agent | Description |
|-------|-------------|
| 🔒 Security | OWASP Top 10, secrets detection, SQL injection & XSS analysis |
| </> Code | Multi-file code generation and editing |
| 🧪 Unit Test | Generate test files for your code |
| 🐛 Bug Fix | Identify and fix bugs with minimal changes |
| 💡 Explain | Plain language explanation of code |
| ♻️ Refactor | Improve code without changing behavior |
| 📝 Docs | Generate JSDoc/TSDoc documentation |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Open Chat Panel |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Scan File for Vulnerabilities |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Undo Last AI Change |
| `Tab` | Accept Inline Completion |
| `Enter` | Send Chat Message |
| `Shift+Enter` | New Line in Chat |
| `Escape` | Close Dropdowns |

## Models

- **CyberMind Free** — Fast, free model (no account required)
- **Pro Standard** — Enhanced reasoning (requires API key)
- **Pro Fast** — Optimized for speed (requires API key)
- **Elite (Claude 3.7)** — AWS Bedrock Claude 3.7, maximum capability (requires Elite plan)

## Context Menu

Right-click any selection in the editor for quick access:
- CyberMind → Explain Selection
- CyberMind → Fix Bug in Selection
- CyberMind → Refactor Selection
- CyberMind → Generate Tests for Selection
- CyberMind → Scan for Vulnerabilities
- CyberMind → Add Documentation

## Backend

Connects to `https://cybermind-backend-8yrt.onrender.com`. All credentials stored in VSCode SecretStorage — never in plaintext.

## License

MIT
