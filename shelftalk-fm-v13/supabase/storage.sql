-- ShelfTalk FM media storage setup.
-- Run after schema.sql in the Supabase SQL Editor.
insert into storage.buckets (id, name, public) values
('book-covers','book-covers',true),
('author-photos','author-photos',true),
('interview-media','interview-media',true),
('journal-images','journal-images',true),
('event-images','event-images',true)
on conflict (id) do nothing;

create policy "public can read ShelfTalk media" on storage.objects
for select using (bucket_id in ('book-covers','author-photos','interview-media','journal-images','event-images'));

create policy "admins can upload ShelfTalk media" on storage.objects
for insert to authenticated with check (public.is_admin() and bucket_id in ('book-covers','author-photos','interview-media','journal-images','event-images'));

create policy "admins can update ShelfTalk media" on storage.objects
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins can delete ShelfTalk media" on storage.objects
for delete to authenticated using (public.is_admin());
