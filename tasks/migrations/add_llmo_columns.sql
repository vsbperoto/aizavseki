-- LLMO/GEO Content Pipeline: Add new columns to posts table
-- Run this in Supabase SQL Editor

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS key_takeaway TEXT,
  ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]';
