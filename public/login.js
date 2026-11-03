// Login page: magic-link sign-in with Supabase Auth, then asks our API who we are.
import { supabase, authHeaders } from './auth.js';

const $ = id => document.getElementById(id);

// Updates the page for a session. Takes the session as given (no Supabase calls),
// so it is safe to run inside onAuthStateChange.
function show(session) {
  const user = session?.user;
  $('signed-out').hidden = Boolean(user);
  $('signed-in').hidden = !user;
  $('who').textContent = user?.email ?? '';
  $('server-check').textContent = '';
  if (user) setTimeout(checkServer);
}

// Proves the server can verify the browser's session token.
async function checkServer() {
  const res = await fetch('/api/me', { headers: await authHeaders() });
  $('server-check').textContent = res.ok ? '✅ 伺服器確認了你的登入身分' : '❌ 伺服器無法確認登入身分';
}

$('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const client = await supabase();
  const { error } = await client.auth.signInWithOtp({
    email: $('email').value,
    options: { emailRedirectTo: location.origin + '/login' },
  });
  $('message').textContent = error ? '寄送失敗：' + error.message : '已寄出，請到信箱點登入連結';
});

$('logout').addEventListener('click', async () => {
  await (await supabase()).auth.signOut();
  $('message').textContent = '已登出';
});

supabase()
  .then(client => {
    // Fires once right away with the current session, then on every sign-in/out.
    // Keep this callback synchronous: awaiting Supabase calls inside it can hang.
    client.auth.onAuthStateChange((_event, session) => show(session));
  })
  .catch(() => {
    $('message').textContent = 'Supabase 尚未設定，請先完成 README 的設定步驟';
  });
