-- Migration: Initial schema setup for Stream
-- This migration creates the core tables for content, preferences, and feedback

-- Enable pgvector extension (note: may not be available on all D1 plans)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Content table: normalized media objects with vector embeddings
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY,
  content_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  crawl_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT,
  description TEXT,
  content TEXT,
  author TEXT,
  published_at DATETIME,
  poster_url TEXT,
  media_urls JSON,
  video_length INTEGER,
  youtube_video_id TEXT,
  transcript TEXT,
  reading_time INTEGER,
  word_count INTEGER,
  tags JSON DEFAULT '[]',
  generated_tags JSON DEFAULT '[]',
  user_generated_tags JSON DEFAULT '[]',
  embedding BLOB,
  embedding_model TEXT DEFAULT 'all-MiniLM-L6-v2',
  content_hash TEXT,
  is_duplicate BOOLEAN DEFAULT 0,
  original_content_id INTEGER,
  collections JSON DEFAULT '[]',
  source_quality REAL,
  engagement JSON DEFAULT '{}',
  UNIQUE(source_type, source_id),
  UNIQUE(content_hash)
);

CREATE INDEX content_created_idx ON content(crawl_time);
CREATE INDEX content_tags_idx ON content(tags);

-- User preferences: tag weights, inclusion/exclusion rules
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  tag_weights JSON DEFAULT '{}',
  focus_tags JSON DEFAULT '[]',
  muted_tags JSON DEFAULT '[]',
  require_tags JSON DEFAULT '[]',
  preferred_sources JSON DEFAULT '[]',
  muted_sources JSON DEFAULT '[]',
  is_session_only BOOLEAN DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

-- User feedback: likes, saves, skips, tag edits for learning
CREATE TABLE IF NOT EXISTS user_feedback (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  content_id INTEGER NOT NULL,
  liked BOOLEAN DEFAULT 0,
  saved BOOLEAN DEFAULT 0,
  skipped BOOLEAN DEFAULT 0,
  dwell_time INTEGER,
  tags_added JSON DEFAULT '[]',
  tags_removed JSON DEFAULT '[]',
  source_visited BOOLEAN DEFAULT 0,
  collection_added TEXT,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT
);

CREATE INDEX user_feedback_user_id_idx ON user_feedback(user_id);
CREATE INDEX user_feedback_content_id_idx ON user_feedback(content_id);
CREATE INDEX user_feedback_recorded_idx ON user_feedback(recorded_at);

-- Ingestion tracking: source adapters, discovery jobs
CREATE TABLE IF NOT EXISTS ingestion_state (
  id INTEGER PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_identifier TEXT NOT NULL,
  last_cursor TEXT,
  last_fetch_time DATETIME,
  items_discovered_total INTEGER DEFAULT 0,
  consecutive_failures INTEGER DEFAULT 0,
  last_error_message TEXT,
  is_active BOOLEAN DEFAULT 1,
  next_retry_at DATETIME,
  retry_backoff_ms INTEGER DEFAULT 5000
);

CREATE INDEX ingestion_source_type_idx ON ingestion_state(source_type);
CREATE INDEX ingestion_active_idx ON ingestion_state(is_active);
