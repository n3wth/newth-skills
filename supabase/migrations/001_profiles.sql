-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  github_url text,
  twitter_url text,
  website_url text,
  reputation int default 0,
  streak int default 0,
  role text default 'user' check (role in ('user', 'maker', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from profiles where id = auth.uid())
    and reputation = (select reputation from profiles where id = auth.uid())
    and streak = (select streak from profiles where id = auth.uid())
  );

-- Auto-create profile on first login
create or replace function public.handle_new_user()
returns trigger as $$
declare
  _username text;
begin
  _username := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    split_part(new.email, '@', 1)
  );

  if exists (select 1 from public.profiles where username = _username) then
    _username := _username || '-' || substr(gen_random_uuid()::text, 1, 8);
  end if;

  insert into public.profiles (id, username, display_name, avatar_url, github_url)
  values (
    new.id,
    _username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    'https://github.com/' || coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'preferred_username', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
