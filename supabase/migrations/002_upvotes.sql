-- Epic 3: Upvoting Engine - user-based votes with reputation weight
-- Dependencies: Epic 1 (profiles with reputation)

create table public.upvotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  skill_id text not null,
  created_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- Index for fetching votes by skill
create index idx_upvotes_skill_id on public.upvotes(skill_id);
create index idx_upvotes_user_id on public.upvotes(user_id);

-- RLS
alter table public.upvotes enable row level security;

create policy "Anyone can read upvote counts"
  on upvotes for select
  using (true);

create policy "Authenticated users can insert own upvote"
  on upvotes for insert
  with check (auth.uid() = user_id);

create policy "Authenticated users can delete own upvote"
  on upvotes for delete
  using (auth.uid() = user_id);

-- Function to get vote count with optional reputation weighting
-- For now we use simple count; can add weight from profiles.reputation later
create or replace function public.get_skill_upvote_count(p_skill_id text)
returns int as $$
  select count(*)::int from public.upvotes where skill_id = p_skill_id;
$$ language sql stable security definer;
