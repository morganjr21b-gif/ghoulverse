# GhoulVerse

Read and publish original manga, manhwa, manhua, and novels.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Supabase** (Auth + Database + Storage)

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/morganjr21b-gif/ghoulverse.git
cd ghoulverse
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema files in order:
   - `supabase-schema.sql`
   - `supabase-schema-part2.sql`
   - `supabase-schema-part3.sql`
3. Create a **Storage** bucket:
   - Name: `chapter-images`
   - Public bucket: **Yes**
4. Add Storage policies (SQL Editor):

```sql
-- Allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'chapter-images' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
with check (
  bucket_id = 'chapter-images'
  and auth.role() = 'authenticated'
);

-- Allow users to update/delete their own files
create policy "Users can update own files"
on storage.objects for update
using ( auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete own files"
on storage.objects for delete
using ( auth.uid()::text = (storage.foldername(name))[1] );
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Browse & read manga / novels
- Upload series + chapters (images or text)
- Library (Reading / Completed / Plan to Read)
- Comments + replies + likes
- Follow series
- Creator Studio
- VIP status (preview)

## Project Structure

```
app/
  page.js              Home
  explore/             Explore page
  library/             User library
  login/ & signup/     Auth
  profile/             User profile
  settings/            Settings
  studio/              Creator dashboard
  upload/              Upload new series
  series/[id]/         Series detail + chapters
  read/[chapterId]/    Reader + comments
lib/
  supabaseClient.js
  config.js
public/
  mascot.png
```

## License

Private project.
