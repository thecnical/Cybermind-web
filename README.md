# CyberMind Web

> Official website and dashboard for [CyberMind CLI](https://github.com/thecnical/cybermind) — the AI-powered offensive security CLI.

[![Version](https://img.shields.io/badge/version-1.0.0-00FFFF?style=flat-square)](https://github.com/thecnical/Cybermind-web)
[![License](https://img.shields.io/badge/license-MIT-8A2BE2?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

---

## What This Is

The CyberMind Web repo is the frontend for the CyberMind CLI product. It handles:

- **Marketing site** — homepage, features, plans, docs
- **Auth** — email signup/login via Supabase Auth (no manual verification)
- **Dashboard** — API key management, usage stats, billing, settings
- **Install page** — generates platform-specific install commands with the user's API key embedded
- **Docs** — full CLI documentation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL (via backend) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, features, how it works |
| `/plans` | Free / Pro / Elite pricing |
| `/install` | Platform-specific install command generator |
| `/docs/*` | Full CLI documentation |
| `/auth/login` | Email + OAuth login |
| `/auth/register` | Signup with email verification |
| `/auth/forgot-password` | Password reset flow |
| `/dashboard` | Usage stats + install command |
| `/dashboard/api-keys` | Create, view, revoke API keys |
| `/dashboard/billing` | Plan management |
| `/dashboard/settings` | Profile + account settings |
| `/changelog` | Release history |
| `/resources` | FAQ, troubleshooting |

---

## Local Development

**Prerequisites:** Node.js 18+, npm

```bash
# Clone
git clone https://github.com/thecnical/Cybermind-web.git
cd Cybermind-web

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xaxbbonibqoxcxtqkhth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=https://cybermind-backend-8yrt.onrender.com
```

Get your Supabase keys from: `https://supabase.com/dashboard/project/xaxbbonibqoxcxtqkhth/settings/api`

---

## Project Structure

```
cybermind-web/
├── app/
│   ├── auth/
│   │   ├── login/          — Email + OAuth login
│   │   ├── register/       — Signup with plan selection
│   │   ├── forgot-password/ — Send reset link
│   │   └── reset-password/ — Set new password
│   ├── dashboard/
│   │   ├── layout.tsx      — Sidebar navigation
│   │   ├── page.tsx        — Main dashboard + install command
│   │   ├── api-keys/       — Key management
│   │   ├── billing/        — Plan + subscription
│   │   └── settings/       — Profile + danger zone
│   ├── docs/               — Documentation (dynamic routes)
│   ├── plans/              — Pricing page
│   ├── install/            — Install command generator
│   ├── layout.tsx          — Root layout with AuthProvider
│   └── globals.css         — Design system variables
├── components/
│   ├── AuthProvider.tsx    — Supabase session context (useAuth hook)
│   ├── Navbar.tsx          — Top nav with auth state
│   ├── Footer.tsx          — Site footer
│   ├── CyberMindLogo.tsx   — Logo component
│   ├── CyberMindTerminal.tsx — Animated terminal demo
│   └── SitePrimitives.tsx  — Shared UI primitives
├── lib/
│   ├── supabase.ts         — Supabase client + API helpers
│   ├── siteContent.ts      — Docs content data
│   └── utils.ts            — cn() and helpers
├── .env.example            — Environment variable template
├── .gitignore
├── LICENSE                 — MIT
├── VERSION                 — Current version
└── README.md
```

---

## Auth Flow

```
User visits /auth/register
    ↓
Fills email + password → Supabase creates account
    ↓
Supabase sends verification email automatically
    ↓
User clicks link → redirected to /dashboard
    ↓
Dashboard auto-generates first API key
    ↓
User copies install command with key embedded
    ↓
Runs on Kali/Windows/Mac → CLI authenticates
```

---

## API Key System

Each user gets API keys that authenticate CLI requests:

```
sk_live_cm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Keys are validated by the backend (`cybermind-backend`) against Supabase. Plan limits are enforced per key:

| Plan | Requests/day | Modes |
|---|---|---|
| Free | 20 | Chat only |
| Pro | 200 | Recon + Hunt |
| Elite | Unlimited | All modes + Abhimanyu |

---

## Deployment (Vercel)

### Step 1 — Import repo

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import Git Repository**
3. Select `thecnical/Cybermind-web`
4. Framework: **Next.js** (auto-detected)

### Step 2 — Add environment variables

In Vercel project settings → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL     = https://xaxbbonibqoxcxtqkhth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BACKEND_URL      = https://cybermind-backend-8yrt.onrender.com
```

### Step 3 — Deploy

Click **Deploy**. Vercel builds and deploys automatically.

### Step 4 — Add domain (optional)

Vercel project → **Domains** → Add `cybermind.thecnical.dev` or your custom domain.

### Auto-deploy

Every push to `main` triggers a new Vercel deployment automatically.

---

## Supabase Setup

Run `supabase_setup.sql` (in `cybermind-backend/`) in the Supabase SQL Editor:

`https://supabase.com/dashboard/project/xaxbbonibqoxcxtqkhth/sql`

This creates:
- `profiles` table (auto-created on signup via trigger)
- `api_keys` table
- `usage_logs` table
- Row Level Security policies
- Auto-profile trigger on user signup

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npm run test     # Run tests (vitest)
```

---

## Related Repos

| Repo | Description |
|---|---|
| [thecnical/cybermind](https://github.com/thecnical/cybermind) | CLI (Go) |
| [thecnical/cybermind-backend](https://github.com/thecnical/cybermind-backend) | Backend API (Node.js) |
| [thecnical/Cybermind-web](https://github.com/thecnical/Cybermind-web) | This repo |

---

## License

MIT — see [LICENSE](LICENSE).

Created by [Chandan Pandey](https://github.com/thecnical).
