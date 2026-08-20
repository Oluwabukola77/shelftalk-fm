(async function () {
  const db = window.shelfTalkDB;
  const form = document.getElementById('authForm');
  if (!form) return;

  const tabs = [...document.querySelectorAll('[data-mode]')];
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const submit = document.getElementById('authSubmit');
  const nameField = document.getElementById('nameField');
  const roleField = document.getElementById('roleField');
  const termsField = document.getElementById('termsField');
  const forgot = document.getElementById('forgotPassword');
  const status = document.getElementById('authStatus');
  let mode = 'signin';

  function setStatus(message, type = '') {
    status.textContent = message;
    status.className = 'auth-status' + (type ? ' ' + type : '');
  }

  function refresh(nextMode) {
    mode = nextMode;
    const signup = mode === 'signup';
    tabs.forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    title.textContent = signup ? 'Join the global shelf.' : 'Welcome back.';
    subtitle.textContent = signup
      ? 'Create your ShelfTalk account and start connecting with books and authors.'
      : 'Sign in to continue your ShelfTalk experience.';
    nameField.hidden = !signup;
    roleField.hidden = !signup;
    termsField.hidden = !signup;
    forgot.hidden = signup;
    form.full_name.required = signup;
    form.terms.required = signup;
    submit.textContent = signup ? 'Create my account' : 'Sign in';
    form.password.autocomplete = signup ? 'new-password' : 'current-password';
    setStatus('');
  }

  tabs.forEach(tab => tab.addEventListener('click', () => refresh(tab.dataset.mode)));
  refresh('signin');

  if (!db) {
    setStatus('Supabase is not connected yet. Add your project URL and anon key in js/supabase-config.js.', 'error');
  }


  async function routeAfterAuth(){
    const { data:{ user } } = await db.auth.getUser();
    if(!user){ window.location.href='index.html'; return; }
    const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();
    const role = profile?.role || user.user_metadata?.role || 'reader';
    window.location.href = role === 'admin' || role === 'editor' ? 'dashboard.html' : role === 'author' ? 'author-dashboard.html' : 'reader-dashboard.html';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!db) return;
    setStatus('Please wait…');
    submit.disabled = true;

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      let result;
      if (mode === 'signup') {
        result = await db.auth.signUp({
        email,
        password,
        options: {
        emailRedirectTo: 'http://127.0.0.1:5500/shelftalk-fm-v13/auth.html',
        data: {
         full_name: form.full_name.value.trim(),
         role: form.role.value
        }
     }
    });
      } else {
        result = await db.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (mode === 'signup') {
        if (result.data?.session) {
          setStatus('Your account is ready. Welcome to ShelfTalk FM.', 'success');
          setTimeout(async () => { await routeAfterAuth(); }, 700);
        } else {
          setStatus('Account created. Check your email to confirm your address, then sign in.', 'success');
          form.reset();
        }
      } else {
        setStatus('Signed in successfully. Welcome back.', 'success');
        setTimeout(async () => { await routeAfterAuth(); }, 600);
      }
    } catch (error) {
      setStatus(error.message || 'We could not complete your request. Please try again.', 'error');
    } finally {
      submit.disabled = false;
    }
  });

  forgot.addEventListener('click', async (event) => {
    event.preventDefault();
    if (!db) return setStatus('Connect Supabase before using password recovery.', 'error');
    const email = form.email.value.trim();
    if (!email) return setStatus('Enter your email address first, then choose “Forgot password?”.', 'error');
    try {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) throw error;
      setStatus('Password reset instructions have been sent to your email.', 'success');
    } catch (error) {
      setStatus(error.message || 'Unable to send password reset instructions.', 'error');
    }
  });
})();
