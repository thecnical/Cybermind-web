# Contributing to CyberMind Web

Thank you for your interest in contributing to the CyberMind CLI website.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v3
- **Language:** TypeScript (strict)
- **Auth:** Supabase Auth
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
git clone https://github.com/thecnical/Cybermind-web.git
cd Cybermind-web
npm install
cp .env.example .env.local
# Fill in your Supabase keys in .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xaxbbonibqoxcxtqkhth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=https://cybermind-backend-8yrt.onrender.com
```

## Project Structure

```
app/
  auth/          — Login, register, forgot/reset password
  dashboard/     — User dashboard (keys, billing, settings)
  docs/          — Documentation pages
  plans/         — Pricing page
  install/       — Install command generator
components/
  AuthProvider   — Supabase session context
  Navbar         — Top navigation with auth state
  Dashboard*     — Dashboard layout components
lib/
  supabase.ts    — Supabase client + API helpers
  mockAuth.ts    — Legacy mock (being phased out)
```

## Guidelines

- Keep components small and focused
- Use TypeScript — no `any` types
- Follow the existing dark theme design system
- Test auth flows before submitting PRs
- Do not commit `.env` files or API keys

## Pull Requests

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with clear messages
4. Push and open a PR against `main`

## Design System

Colors, spacing, and component patterns are documented in `app/globals.css` and `tailwind.config.ts`. Match the existing dark glassmorphism style.
