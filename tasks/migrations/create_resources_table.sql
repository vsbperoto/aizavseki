-- Resources table for 333 LLMO/GEO-optimized reference articles
-- Run via Supabase SQL Editor or MCP

CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('definition', 'howto', 'comparison')),
  category TEXT NOT NULL CHECK (category IN ('AI_BASICS', 'AI_TOOLS', 'AI_TIPS', 'AI_BUSINESS', 'AI_CREATIVE', 'AI_DEVELOPMENT', 'AI_ETHICS', 'AI_TRENDS')),
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  key_takeaway TEXT,
  faq_items JSONB DEFAULT '[]',
  target_keyword TEXT,
  secondary_keywords TEXT[],
  image_url TEXT,
  image_alt_text TEXT,
  word_count INTEGER DEFAULT 0,
  quality_score NUMERIC(3,1),
  related_resources TEXT[],
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are viewable by everyone" ON resources FOR SELECT USING (true);
CREATE POLICY "Service role can manage resources" ON resources FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_resources_content_type ON resources (content_type);
CREATE INDEX idx_resources_category ON resources (category);
CREATE INDEX idx_resources_slug ON resources (slug);
CREATE INDEX idx_resources_published ON resources (published_at DESC);
CREATE INDEX idx_resources_fts ON resources USING GIN (to_tsvector('simple', title || ' ' || content));
