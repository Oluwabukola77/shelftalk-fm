# ShelfTalk FM + Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. Copy `js/supabase-config.js.example` to `js/supabase-config.js` and add the project URL + anon key.
4. Create the first user through `auth.html`.
5. In Supabase Table Editor, change that user's `profiles.role` to `admin`.
6. Open `dashboard.html` to confirm admin access.

## Storage buckets to add
Create public buckets named:
- `book-covers`
- `author-photos`
- `interview-media`
- `journal-images`
- `event-images`

Keep service-role keys off the frontend. Only the anon key belongs in `supabase-config.js`.
