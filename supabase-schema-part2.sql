-- Run this in Supabase's SQL Editor to add the new features

create table library (
  user_id uuid references auth.users(id) on delete cascade,
  series_id uuid references series(id) on delete cascade,
  status text not null check (status in ('reading', 'completed', 'plan_to_read')),
  created_at timestamp with time zone default now(),
  primary key (user_id, series_id)
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  user_id uuid references auth.users(id),
  text text not null,
  created_at timestamp with time zone default now()
);

alter table library enable row level security;
alter table comments enable row level security;

create policy "Users can read their own library" on library for select using (auth.uid() = user_id);
create policy "Users can insert their own library items" on library for insert with check (auth.uid() = user_id);
create policy "Users can update their own library items" on library for update using (auth.uid() = user_id);

create policy "Public can read comments" on comments for select using (true);
create policy "Logged in users can post comments" on comments for insert with check (auth.uid() = user_id);
