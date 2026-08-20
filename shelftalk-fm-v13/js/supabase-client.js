(function () {
  const cfg = window.SHELFTALK_SUPABASE;
  const ready = cfg && cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_PROJECT');
  if (!ready || !window.supabase) {
    window.shelfTalkDB = null;
    return;
  }
  window.shelfTalkDB = window.supabase.createClient(cfg.url, cfg.anonKey);
})();
