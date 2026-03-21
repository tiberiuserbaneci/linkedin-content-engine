-- LinkedIn Content Engine Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  linkedin_url text unique not null,
  linkedin_handle text not null,
  full_name text not null,
  headline text,
  about text,
  followers_count integer default 0,
  category text not null check (category in ('founder', 'vc', 'ai_creator', 'operator', 'other')),
  avatar_url text,
  scraped_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Posts table
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  linkedin_post_url text unique not null,
  content text not null,
  published_at timestamptz,
  reactions_count integer default 0,
  comments_count integer default 0,
  shares_count integer default 0,
  post_type text default 'text' check (post_type in ('text', 'image', 'video', 'article', 'carousel', 'poll', 'other')),
  word_count integer default 0,
  raw_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Content analyses table
create table if not exists content_analyses (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  posts_analysed integer not null,
  overview text not null,
  topic_clusters jsonb not null default '[]'::jsonb,
  structural_dna jsonb not null default '{}'::jsonb,
  hook_formula jsonb not null default '{}'::jsonb,
  emotional_playbook jsonb not null default '{}'::jsonb,
  winning_format jsonb not null default '{}'::jsonb,
  specificity jsonb not null default '{}'::jsonb,
  close_patterns jsonb not null default '{}'::jsonb,
  what_doesnt_work jsonb not null default '{}'::jsonb,
  winning_formula text not null,
  winning_checklist jsonb not null default '[]'::jsonb,
  model_used text not null,
  created_at timestamptz not null default now()
);

-- Content ideas table
create table if not exists content_ideas (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid not null references content_analyses(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  position integer not null check (position between 1 and 10),
  title text not null,
  topic text not null,
  pattern_matches jsonb not null default '[]'::jsonb,
  angle text not null,
  hook_draft text not null,
  format text not null check (format in ('narrative', 'how_to', 'opinion', 'data_driven')),
  emotional_register text not null,
  trending_signal text not null,
  status text not null default 'idea' check (status in ('idea', 'writing', 'done', 'skipped')),
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_posts_profile_id on posts(profile_id);
create index if not exists idx_posts_reactions on posts(reactions_count desc);
create index if not exists idx_content_analyses_profile_id on content_analyses(profile_id);
create index if not exists idx_content_ideas_analysis_id on content_ideas(analysis_id);
create index if not exists idx_content_ideas_profile_id on content_ideas(profile_id);

-- RLS policies (permissive for server-side access with service role key)
alter table profiles enable row level security;
alter table posts enable row level security;
alter table content_analyses enable row level security;
alter table content_ideas enable row level security;

-- Allow all operations with service role key
create policy "Allow all for service role" on profiles for all using (true) with check (true);
create policy "Allow all for service role" on posts for all using (true) with check (true);
create policy "Allow all for service role" on content_analyses for all using (true) with check (true);
create policy "Allow all for service role" on content_ideas for all using (true) with check (true);

-- VC Outreach Pipeline Tables

create table if not exists vc_firms (
  id uuid primary key default gen_random_uuid(),
  name text,
  linkedin_url text unique,
  linkedin_handle text,
  description text,
  focus_areas text[],
  location text,
  employee_count integer,
  website text,
  follower_count integer,
  scraped_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists vc_contacts (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references vc_firms(id) on delete cascade,
  linkedin_url text unique,
  full_name text,
  title text,
  avatar_url text,
  followers_count integer,
  last_post_date timestamptz,
  last_post_content text,
  is_active boolean default false,
  has_current_position boolean default true,
  about text,
  location text,
  raw_json jsonb,
  created_at timestamptz default now()
);

create table if not exists vc_outreach (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references vc_contacts(id) on delete cascade,
  status text default 'to_contact' check (status in ('to_contact','contacted','replied','not_interested')),
  dm_text text,
  dm_generated_at timestamptz,
  contacted_at timestamptz,
  replied_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create index idx_vc_contacts_firm_id on vc_contacts(firm_id);
create index idx_vc_contacts_active on vc_contacts(is_active, has_current_position);
create index idx_vc_outreach_contact on vc_outreach(contact_id);

-- RLS for VC tables
alter table vc_firms enable row level security;
alter table vc_contacts enable row level security;
alter table vc_outreach enable row level security;

create policy "Allow all for service role" on vc_firms for all using (true) with check (true);
create policy "Allow all for service role" on vc_contacts for all using (true) with check (true);
create policy "Allow all for service role" on vc_outreach for all using (true) with check (true);
