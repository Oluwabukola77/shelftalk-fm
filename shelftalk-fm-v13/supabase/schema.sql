-- ShelfTalk FM production schema for Supabase/Postgres
create extension if not exists pgcrypto;

create type public.user_role as enum ('reader','author','editor','admin');
create type public.publish_status as enum ('draft','published','archived');
create type public.service_status as enum ('new','in_progress','completed','closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  role public.user_role not null default 'reader',
  avatar_url text,
  country text,
  bio text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  country text,
  role text,
  bio text,
  image_url text,
  website_url text,
  social_links jsonb not null default '{}'::jsonb,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  author_id uuid references public.authors(id) on delete set null,
  author_name text,
  genre text,
  country text,
  description text,
  cover_url text,
  isbn text,
  rating numeric(2,1),
  access_links jsonb not null default '[]'::jsonb,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.featured_books (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  feature_type text not null check (feature_type in ('top_pick_week','book_of_month')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  editorial_note text,
  created_at timestamptz not null default now()
);

create table public.spotlights (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.authors(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  reminder_enabled boolean not null default true,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.authors(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  duration_seconds integer,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.interview_platforms (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  platform text not null check (platform in ('youtube','spotify','apple_podcasts','shelftalk','other')),
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  unique(interview_id, platform)
);

create table public.impact_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text unique not null check (metric_key in ('readers','authors_interviewed','books_featured')),
  metric_value bigint not null default 0,
  display_label text not null,
  description text,
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  source text,
  created_at timestamptz not null default now()
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  email text not null,
  service text not null,
  message text,
  budget text,
  status public.service_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.journal_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  image_url text,
  author_name text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  meeting_url text,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.book_clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cover_url text,
  host_id uuid references public.profiles(id) on delete set null,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.reading_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);

create table public.club_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  club_id uuid not null references public.book_clubs(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(user_id, club_id)
);

create table public.author_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid not null references public.authors(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, author_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique(book_id,user_id)
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role) values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), case when new.raw_user_meta_data->>'role' in ('reader','author') then (new.raw_user_meta_data->>'role')::public.user_role else 'reader'::public.user_role end);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.books enable row level security;
alter table public.featured_books enable row level security;
alter table public.spotlights enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_platforms enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.service_requests enable row level security;
alter table public.journal_articles enable row level security;
alter table public.events enable row level security;
alter table public.book_clubs enable row level security;
alter table public.reviews enable row level security;
alter table public.reading_list enable row level security;
alter table public.club_members enable row level security;
alter table public.author_follows enable row level security;

-- Public read access to published editorial content.
create policy "published authors readable" on public.authors for select using (status='published' or public.is_admin());
create policy "published books readable" on public.books for select using (status='published' or public.is_admin());
create policy "featured books readable" on public.featured_books for select using (true);
create policy "published spotlights readable" on public.spotlights for select using (status='published' or public.is_admin());
create policy "published interviews readable" on public.interviews for select using (status='published' or public.is_admin());
create policy "interview platforms readable" on public.interview_platforms for select using (true);
create policy "impact metrics readable" on public.impact_metrics for select using (true);
create policy "published journal readable" on public.journal_articles for select using (status='published' or public.is_admin());
create policy "published events readable" on public.events for select using (status='published' or public.is_admin());
create policy "published clubs readable" on public.book_clubs for select using (status='published' or public.is_admin());
create policy "reviews readable" on public.reviews for select using (true);
create policy "own reading list" on public.reading_list for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own club membership" on public.club_members for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own author follows" on public.author_follows for all using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Authenticated users can manage their own profile and submit forms.
create policy "own profile read" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id=auth.uid() or public.is_admin());
create policy "newsletter insert" on public.newsletter_subscribers for insert with check (true);
create policy "service request insert" on public.service_requests for insert with check (true);
create policy "own reviews insert" on public.reviews for insert with check (user_id=auth.uid());
create policy "own reviews update" on public.reviews for update using (user_id=auth.uid() or public.is_admin());

create policy "author own profile row" on public.authors for update using (profile_id=auth.uid()) with check (profile_id=auth.uid());

-- Admin-only mutations.
create policy "admin authors" on public.authors for all using (public.is_admin()) with check (public.is_admin());
create policy "admin books" on public.books for all using (public.is_admin()) with check (public.is_admin());
create policy "admin featured books" on public.featured_books for all using (public.is_admin()) with check (public.is_admin());
create policy "admin spotlights" on public.spotlights for all using (public.is_admin()) with check (public.is_admin());
create policy "admin interviews" on public.interviews for all using (public.is_admin()) with check (public.is_admin());
create policy "admin interview platforms" on public.interview_platforms for all using (public.is_admin()) with check (public.is_admin());
create policy "admin impact" on public.impact_metrics for all using (public.is_admin()) with check (public.is_admin());
create policy "admin newsletters" on public.newsletter_subscribers for select using (public.is_admin());
create policy "admin service requests" on public.service_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "admin journal" on public.journal_articles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "admin clubs" on public.book_clubs for all using (public.is_admin()) with check (public.is_admin());
create policy "admin profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

insert into public.impact_metrics(metric_key,metric_value,display_label,description) values
('readers',12500,'Readers','Across our growing community'),
('authors_interviewed',86,'Authors interviewed','Voices featured by ShelfTalk'),
('books_featured',214,'Books featured','Titles in our discovery ecosystem')
on conflict (metric_key) do nothing;

-- Default public impact counters. Safe to run once; duplicates are ignored.
insert into public.impact_metrics (metric_key, metric_value, display_label, description) values
('readers', 0, 'Readers', 'Readers connected with ShelfTalk FM.'),
('authors_interviewed', 0, 'Authors Interviewed', 'Authors featured in ShelfTalk conversations.'),
('books_featured', 0, 'Books Featured', 'Books highlighted through ShelfTalk programming.')
on conflict (metric_key) do nothing;

-- Community permissions: members can manage only their own participation/content.
create policy "profiles self readable" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "book clubs published readable" on public.book_clubs for select using (status='published' or public.is_admin());
create policy "club members self read" on public.club_members for select using (user_id = auth.uid() or public.is_admin());
create policy "club members self join" on public.club_members for insert with check (user_id = auth.uid());
create policy "club members self leave" on public.club_members for delete using (user_id = auth.uid() or public.is_admin());
create policy "reviews public readable" on public.reviews for select using (true);
create policy "reviews self create" on public.reviews for insert with check (user_id = auth.uid());
create policy "reviews self update" on public.reviews for update using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "reviews self delete" on public.reviews for delete using (user_id = auth.uid() or public.is_admin());
create policy "reading list self manage" on public.reading_list for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "author follows self manage" on public.author_follows for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "events published readable" on public.events for select using (status='published' or public.is_admin());
