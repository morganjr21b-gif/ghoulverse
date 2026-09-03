-- Run this in Supabase's SQL Editor to add likes, replies, and follows

alter table comments add column likes int not null default 0;
alter table comments add column parent_id uuid references comments(id) on delete cascade;

create table follows (
  user_id uuid references auth.users(id) on delete cascade,
  series_id uuid references series(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, series_id)
);

alter table follows enable row level security;

create policy "Public can read follows" on follows for select using (true);
create policy "Users can follow" on follows for insert with check (auth.uid() = user_id);
create policy "Users can unfollow" on follows for delete using (auth.uid() = user_id);
