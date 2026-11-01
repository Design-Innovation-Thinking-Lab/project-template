// Login page: magic-link sign-in with Supabase Auth, then asks our API who we are.
import { supabase, authHeaders } from './auth.js';

const $ = id => document.getElementById(id);

async function render() {
  const client = await supabase();
  const { data } = await client.auth.getSession();
  const user = data.session?.user;
  $('signed-out').hidden = Boolean(user);
  $('signed-in').hidden = !user;
  if (!user) return;
  $('who').textContent = user.email;
  // Proves the server can verify the browser's session token.
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
  render();
});

supabase()
  .then(client => {
    client.auth.onAuthStateChange(() => render());
    return render();
  })
  .catch(() => {
    $('message').textContent = 'Supabase 尚未設定，請先完成 README 的設定步驟';
  });
