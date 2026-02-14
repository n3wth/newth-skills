-- Skills table (extends static skill data with launch system)
create table public.skills (
  id text primary key,
  name text not null,
  description text not null,
  long_description text,
  category text not null,
  tags text[] default '{}',
  icon text,
  color text,
  features text[] default '{}',
  use_cases text[] default '{}',
  compatibility text[] default '{}',
  version text default '1.0.0',
  skill_file_url text,
  author_id uuid references public.profiles(id),
  hunter_id uuid references public.profiles(id),
  status text default 'draft' check (status in ('draft', 'upcoming', 'launched', 'archived')),
  launched_at timestamptz,
  scheduled_launch_date date,
  sample_prompts jsonb default '[]',
  contributor jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.skills enable row level security;

create policy "Skills are viewable by everyone"
  on skills for select using (true);

create policy "Authenticated users can insert skills"
  on skills for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own skills"
  on skills for update
  using (auth.uid() = author_id);

-- Leaderboard snapshots
create table public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  skill_id text references public.skills(id),
  period text check (period in ('daily', 'weekly', 'monthly')),
  period_start date not null,
  rank int not null,
  score int not null,
  created_at timestamptz default now()
);

alter table public.leaderboard_snapshots enable row level security;

create policy "Leaderboard snapshots are viewable by everyone"
  on leaderboard_snapshots for select using (true);

-- Index for fast feed queries
create index idx_skills_launched_at on skills(launched_at desc) where status = 'launched';
create index idx_skills_status on skills(status);
create index idx_skills_category on skills(category);
create index idx_leaderboard_period on leaderboard_snapshots(period, period_start desc);

-- Updated_at trigger for skills
create trigger on_skill_updated
  before update on public.skills
  for each row execute function public.handle_updated_at();
