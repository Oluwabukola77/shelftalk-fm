(function () {
  const cfg = window.SHELF_TALK_CONFIG || { contact: {}, social: {} };
  const social = [
    ['YouTube', cfg.social.youtube],
    ['Instagram', cfg.social.instagram],
    ['Facebook', cfg.social.facebook],
    ['TikTok', cfg.social.tiktok],
    ['LinkedIn', cfg.social.linkedin],
    ['X', cfg.social.x]
  ];
  const target = document.getElementById('site-footer');
  if (!target) return;

  target.innerHTML = `
    <footer class="st-footer">
      <div class="st-footer-grid">
        <div class="st-footer-brand">
          <a class="st-footer-logo" href="index.html">
            <img src="assets/shelftalk-logo.jpg" alt="ShelfTalk FM logo">
            <span><strong>SHELFTALK</strong><small>FM</small></span>
          </a>
          <p>The global home for readers, authors, books and literary conversations.</p>
          <div class="st-footer-contact">
            <a href="mailto:${cfg.contact.generalEmail || 'info@shelftalkfm.com'}">✉ ${cfg.contact.generalEmail || 'info@shelftalkfm.com'}</a>
            <a href="mailto:${cfg.contact.authorsEmail || 'info@shelftalkfm.com'}">✍ ${cfg.contact.authorsEmail || 'info@shelftalkfm.com'}</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <a href="search.html">Discover</a><a href="books.html">Books</a><a href="authors.html">Authors</a>
          <a href="spotlight.html">Author Spotlight</a><a href="conversations.html">Conversations</a>
          <a href="journal.html">Journal</a><a href="community.html">Community</a><a href="events.html">Events</a>
        </div>
        <div>
          <h4>For Authors</h4>
          <a href="services.html">Author Services</a><a href="author-dashboard.html">Author Dashboard</a>
          <a href="services.html#request">Submit a Project</a><a href="conversations.html">Author Interviews</a>
        </div>
        <div>
          <h4>Connect</h4>
          ${social.map(([name, href]) => `<a href="${href || '#'}" ${href && href !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${name}${href === '#' ? ' <small class="st-coming">Coming soon</small>' : ''}</a>`).join('')}
        </div>
      </div>
      
      <div class="st-newsletter-strip">
        <div><span class="eyebrow">STAY IN THE CONVERSATION</span><h3>Get the latest from ShelfTalk FM.</h3><p>New books, author interviews, literary events and stories from around the world.</p></div>
        <a class="btn btn-dark" href="index.html#newsletter">Join the newsletter</a>
      </div>
      <div class="st-footer-bottom">
        <span>© ${new Date().getFullYear()} ShelfTalk FM. All rights reserved.</span>
        <span><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a><a href="community-guidelines.html">Community Guidelines</a><a href="author-service-terms.html">Author Service Terms</a></span>
      </div>

    </footer>`;
})();
