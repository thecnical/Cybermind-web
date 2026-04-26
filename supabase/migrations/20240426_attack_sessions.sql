-- CyberMind attack_sessions table
-- Tracks real-time OMEGA/Recon/Hunt/Abhimanyu sessions from the Linux CLI
-- Created via: cybermind /plan, /recon, /hunt, /abhimanyu, /vibe-hack, /chain

CREATE TABLE IF NOT EXISTS public.attack_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target        TEXT NOT NULL,
  mode          TEXT NOT NULL DEFAULT 'omega',  -- omega|recon|hunt|abhimanyu|chain|vibe-hack
  status        TEXT NOT NULL DEFAULT 'running', -- running|completed|failed
  bugs_found    INTEGER NOT NULL DEFAULT 0,
  tools_ran     INTEGER NOT NULL DEFAULT 0,
  finding_chance INTEGER NOT NULL DEFAULT 0,    -- 0-100 probability score
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_attack_sessions_user_id
  ON public.attack_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_attack_sessions_started_at
  ON public.attack_sessions(started_at DESC);

-- Row Level Security — users can only see their own sessions
ALTER TABLE public.attack_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attack sessions"
  ON public.attack_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attack sessions"
  ON public.attack_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attack sessions"
  ON public.attack_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.attack_sessions;
