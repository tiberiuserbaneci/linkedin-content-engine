-- Migration V2: Update content_assets for HTML-based generation
-- Run this in Supabase SQL Editor AFTER the original migration.sql

-- Drop old constraints and column
ALTER TABLE content_assets DROP CONSTRAINT IF EXISTS content_assets_format_check;
ALTER TABLE content_assets DROP CONSTRAINT IF EXISTS content_assets_theme_check;

-- Add html_content column
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS html_content text;

-- Remove old content_json column (data migrated to html_content)
ALTER TABLE content_assets DROP COLUMN IF EXISTS content_json;

-- Update format constraint to include poster, remove post-cover
ALTER TABLE content_assets ADD CONSTRAINT content_assets_format_check
  CHECK (format IN ('infographic', 'cheatsheet', 'carousel', 'poster'));

-- Update theme constraint to include expressive, remove handwriting
ALTER TABLE content_assets ADD CONSTRAINT content_assets_theme_check
  CHECK (theme IN ('light', 'dark', 'expressive'));
