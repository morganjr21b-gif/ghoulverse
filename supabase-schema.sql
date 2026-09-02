-- Run this in Supabase's SQL Editor to set up GhoulVerse's database

create table series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('manga', 'novel')),
  cover_url text,
  creator_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  chapter_number int not null,
  text_content text,
  images jsonb,
  created_at timestamp with time zone default now()
);

-- Allow anyone to read series and chapters (public reading)
alter table series enable row level security;
alter table chapters enable row level security;

create policy "Public can read series" on series for select using (true);
create policy "Public can read chapters" on chapters for select using (true);

-- Allow logged-in users to create series and chapters
create policy "Logged in users can insert series" on series for insert with check (auth.uid() = creator_id);
create policy "Logged in users can insert chapters" on chapters for insert with check (true);
