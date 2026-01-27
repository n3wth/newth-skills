-- Neon Database Schema for skills.newth.ai
-- Run this in your Neon SQL Editor to create the required tables

-- Votes table: tracks user votes per skill using browser fingerprint
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  skill_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(skill_id, fingerprint)
);

-- Analytics table: tracks views and copies per skill
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  skill_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'copy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table: tracks user ratings (1-5 stars) per skill using browser fingerprint
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  skill_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(skill_id, fingerprint)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_skill_id ON votes(skill_id);
CREATE INDEX IF NOT EXISTS idx_analytics_skill_id ON analytics(skill_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_ratings_skill_id ON ratings(skill_id);
