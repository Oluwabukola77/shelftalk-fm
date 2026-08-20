-- ShelfTalk FM v10: book interactions + author publishing
create type public.reading_status as enum ('want_to_read','currently_reading','finished');

create table public.reading_statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  status public.reading_status not null,
  updated_at timestamptz not null default now(),
  unique(user_id, book_id)
);

alter table public.reading_statuses enable row level security;
create policy "reading status self manage" on public.reading_statuses for all using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());

-- Authors can submit and update their own books. They remain drafts until editorial/admin publication.
create policy "author submit own books" on public.books for insert with check (
  exists(select 1 from public.authors a where a.id=author_id and a.profile_id=auth.uid())
);
create policy "author update own books" on public.books for update using (
  exists(select 1 from public.authors a where a.id=author_id and a.profile_id=auth.uid())
) with check (
  exists(select 1 from public.authors a where a.id=author_id and a.profile_id=auth.uid())
);

-- Authors can view their own draft books; public visitors only see published books through the existing policy.
create policy "author read own books" on public.books for select using (
  exists(select 1 from public.authors a where a.id=author_id and a.profile_id=auth.uid())
);
