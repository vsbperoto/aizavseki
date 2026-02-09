-- AiZaVseki Database Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ogdeziynjtxglhbuctgb/sql

-- ============================================
-- TABLES
-- ============================================

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN DEFAULT TRUE
);

-- Blog posts (synced from n8n content pipeline)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  pillar TEXT NOT NULL CHECK (pillar IN ('AI_NEWS', 'AI_TOOLS', 'AI_TIPS', 'AI_BUSINESS', 'AI_FUN')),
  content JSONB NOT NULL,
  caption TEXT,
  hashtags TEXT,
  image_urls TEXT[],
  instagram_post_id TEXT,
  facebook_post_id TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Data deletion requests (CRITICAL for Meta)
CREATE TABLE data_deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_code TEXT UNIQUE NOT NULL,
  facebook_user_id TEXT,
  email TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'user' CHECK (source IN ('user', 'meta_callback'))
);

-- Page analytics
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public read access for posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Insert-only for public
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit contact" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can request deletion" ON data_deletion_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can check deletion status" ON data_deletion_requests
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role full access newsletter" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access posts" ON posts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access contact" ON contact_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access deletion" ON data_deletion_requests
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access page_views" ON page_views
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_posts_pillar ON posts(pillar);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_deletion_confirmation ON data_deletion_requests(confirmation_code);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_page_views_path ON page_views(path);
