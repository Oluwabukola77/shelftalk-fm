# ShelfTalk FM launch checklist

## Required before public launch
- [ ] Supabase production project created
- [ ] Base schema + v10 + v13 migrations applied successfully
- [ ] RLS verified with reader/author/editor/admin test accounts
- [ ] Email confirmation and password reset tested
- [ ] Production redirect URLs configured
- [ ] Real book/author/interview data loaded
- [ ] Every book-access link verified as legitimate and current
- [ ] Real contact emails and social URLs added
- [ ] Legal documents approved
- [ ] Domain configured with HTTPS
- [ ] `robots.txt` and `sitemap.xml` updated with the real domain
- [ ] Mobile navigation and forms tested
- [ ] 404 page tested
- [ ] Image loading and external media tested
- [ ] Newsletter delivery provider configured and tested
- [ ] Analytics/error monitoring configured if required
- [ ] Backup/recovery process documented

## Suggested acceptance tests
1. Visitor can discover a book and open its detail page.
2. Reader can sign up, confirm email, sign in and reach Reader Dashboard.
3. Reader can save a book, change reading status, follow an author and submit a review.
4. Author can sign up, reach Author Dashboard and submit a draft book.
5. Editor/admin can publish the draft and it appears publicly.
6. Admin can schedule a Top Pick and Author Spotlight.
7. Admin can publish an interview and platform destinations.
8. Service request appears to the submitting user and editorial/admin staff only.
9. Search returns the intended content.
10. Sign-out ends the authenticated session.
