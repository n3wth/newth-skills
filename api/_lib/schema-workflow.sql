-- Workflow usage tracking table
-- Run this in your Neon SQL Editor alongside schema.sql

CREATE TABLE IF NOT EXISTS workflow_usage (
  id SERIAL PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_usage_fingerprint ON workflow_usage(fingerprint);
