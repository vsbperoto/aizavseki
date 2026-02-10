-- Content Pipeline v3 Migration
-- Run this in Supabase SQL Editor

-- 1. Create trending_topics table
CREATE TABLE IF NOT EXISTS trending_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  topic_en TEXT,
  pillar TEXT NOT NULL CHECK (pillar IN ('AI_NEWS','AI_TOOLS','AI_TIPS','AI_BUSINESS','AI_FUN')),
  source TEXT DEFAULT 'grok',
  source_url TEXT,
  source_author TEXT,
  deep_context JSONB NOT NULL DEFAULT '{}',
  target_keyword TEXT,
  secondary_keywords TEXT[],
  search_intent TEXT,
  engagement_score INTEGER DEFAULT 0,
  relevance_score NUMERIC(3,1),
  scan_batch TEXT,
  scouted_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON trending_topics FOR SELECT USING (true);
CREATE POLICY "Service insert/update" ON trending_topics FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_trending_unused ON trending_topics (pillar, scouted_at DESC) WHERE used_at IS NULL;

-- 2. Add new columns to posts table
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS image_alt_text TEXT,
  ADD COLUMN IF NOT EXISTS quality_score NUMERIC,
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS target_keyword TEXT,
  ADD COLUMN IF NOT EXISTS internal_links_used TEXT[];
