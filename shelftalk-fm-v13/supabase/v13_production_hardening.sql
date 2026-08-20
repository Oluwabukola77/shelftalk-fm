-- ShelfTalk FM v13 production hardening
-- Run AFTER schema.sql and v10_book_interactions.sql.

create or replace function public.set_updated_at() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end; $$;

do $$ declare t text; begin
  foreach t in array array['profiles','authors','books','impact_metrics','reading_statuses'] loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', t, t);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- Admin/editor access for editorial mutations; readers/authors do not get editorial privileges.
create or replace function public.is_editorial() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','editor'));
$$;

-- Remove overly broad admin-only mutation policy where an explicit editorial policy is clearer.
drop policy if exists "admin authors" on public.authors;
create policy "editorial manage authors" on public.authors for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage books" on public.books for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage featured books" on public.featured_books for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage spotlights" on public.spotlights for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage interviews" on public.interviews for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage interview platforms" on public.interview_platforms for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage metrics" on public.impact_metrics for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage journal" on public.journal_articles for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage events" on public.events for all using (public.is_editorial()) with check (public.is_editorial());
create policy "editorial manage clubs" on public.book_clubs for all using (public.is_editorial()) with check (public.is_editorial());

-- Service requests should be readable by the submitting user or editorial/admin staff.
create policy "service requests own read" on public.service_requests for select using (user_id=auth.uid() or public.is_editorial());
create policy "service requests editorial update" on public.service_requests for update using (public.is_editorial()) with check (public.is_editorial());

-- Newsletter subscribers should not be publicly readable.
create policy "newsletter editorial read" on public.newsletter_subscribers for select using (public.is_editorial());

-- Users may delete or update their own reviews; admins/editors may moderate.
create policy "own review delete" on public.reviews for delete using (user_id=auth.uid() or public.is_editorial());
create policy "editorial review moderation" on public.reviews for all using (public.is_editorial()) with check (public.is_editorial());

-- Authors can update their own public author profile, but cannot change ownership.
create policy "author own profile update" on public.authors for update using (profile_id=auth.uid()) with check (profile_id=auth.uid());
