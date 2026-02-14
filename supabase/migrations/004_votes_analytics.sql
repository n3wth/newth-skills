-- Anonymous votes (fingerprint) + analytics
-- Used by /api/vote (anonymous path) and /api/analytics

create table if not exists public.votes (
  id serial primary key,
  skill_id text not null,
  fingerprint text not null,
  created_at timestamptz default now(),
  unique(skill_id, fingerprint)
);

create index if not exists idx_votes_skill_id on public.votes(skill_id);

create table if not exists public.analytics (
  id serial primary key,
  skill_id text not null,
  event_type text not null check (event_type in ('view', 'copy')),
  created_at timestamptz default now()
);

create index if not exists idx_analytics_skill_id on public.analytics(skill_id);
create index if not exists idx_analytics_event_type on public.analytics(event_type);

create table if not exists public.playground_usage (
  id serial primary key,
  fingerprint text not null,
  created_at timestamptz default now()
);

create index if not exists idx_playground_usage_fingerprint on public.playground_usage(fingerprint);
