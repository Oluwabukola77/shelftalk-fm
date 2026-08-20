# ShelfTalk FM — v13 Production Candidate

ShelfTalk FM is a global literary platform built with HTML, CSS, JavaScript and Supabase.

## Production candidate includes
- Public discovery, books, authors, spotlight, conversations, journal, community, events and author services.
- Reader and author account areas.
- Supabase schema, RLS, storage and book-interaction migrations.
- Centralized footer contact/social configuration in `js/site-config.js`.
- Production legal pages and a 404 page.
- `robots.txt`, sitemap template and hosting security headers.
- Production-hardening SQL migration in `supabase/v13_production_hardening.sql`.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Run `supabase/storage.sql`.
4. Run `supabase/v10_book_interactions.sql`.
5. Run `supabase/v13_production_hardening.sql`.
6. Replace the placeholders in `js/supabase-config.js` with your project URL and anon/publishable key.
7. Enable the authentication providers you intend to support.
8. Configure the exact production Site URL and redirect URLs in Supabase Auth.
9. Create your first admin account, then set its `profiles.role` to `admin` from the Supabase dashboard.

Never put a Supabase service-role key in browser code.

## Before launch
- Replace all demo books/authors/interviews with real editorial data.
- Replace placeholder book-access URLs with legitimate publisher, bookstore, library or audiobook destinations.
- Replace `YOUR_DOMAIN` in `robots.txt` and `sitemap.xml`.
- Replace placeholder email/social settings in `js/site-config.js`.
- Create the real legal text appropriate to your organization/jurisdiction and have it reviewed if needed.
- Test sign-up, email confirmation, sign-in, password reset and sign-out.
- Test reader, author, editor and admin permissions with separate accounts.
- Test storage uploads and public image URLs.
- Test every form against the production Supabase project.
- Run Lighthouse/other performance checks and verify mobile layouts.
- Configure analytics and error monitoring if desired.
- Deploy only after the QA checklist passes.

## Hosting
This is a static frontend. It can be hosted on Netlify, Vercel, Cloudflare Pages, GitHub Pages or another static host. Use the included `netlify/_headers` or `vercel.json` where appropriate.

## Important
A frontend build is not the same as a deployed production service. Do not publish until the real Supabase project, domain, email, content, legal documents and third-party destinations have been configured and tested.
