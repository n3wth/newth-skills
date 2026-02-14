-- Epic 4: Threaded Comments System
-- Dependencies: Epic 1 (Auth), profiles

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  skill_id text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create index idx_comments_skill_id on public.comments(skill_id);
create index idx_comments_parent_id on public.comments(parent_id);
create index idx_comments_created_at on public.comments(created_at desc);

alter table public.comments enable row level security;

create policy "Anyone can read comments"
  on comments for select
  using (true);

create policy "Authenticated users can insert own comment"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comment"
  on comments for delete
  using (auth.uid() = user_id);
