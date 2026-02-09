-- Facebook Tokens table for OAuth token management
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.facebook_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  page_id TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  page_access_token TEXT NOT NULL,
  user_access_token TEXT NOT NULL,
  token_type TEXT NOT NULL DEFAULT 'long_lived',
  scopes TEXT NOT NULL DEFAULT 'pages_manage_posts,pages_read_engagement',
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.facebook_tokens ENABLE ROW LEVEL SECURITY;

-- Service role only — no public access
CREATE POLICY "Service role full access" ON public.facebook_tokens
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for active token lookup
CREATE INDEX idx_facebook_tokens_active ON public.facebook_tokens (is_active) WHERE is_active = true;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_facebook_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER facebook_tokens_updated_at
  BEFORE UPDATE ON public.facebook_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_facebook_tokens_updated_at();
