// Home page: connection check and the items example. Talks only to our own /api functions.
import { authHeaders } from './auth.js';

const $ = id => document.getElementById(id);

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const body = await res.json();
    if (body.ok) $('health').textContent = '✅ Vercel 與 Supabase 都連上了';
    else if (body.missing) $('health').textContent = '❌ 缺少環境變數：' + body.missing.join('、');
    else $('health').textContent = '❌ ' + (body.database || '資料庫連線失敗');
  } catch {
    $('health').textContent = '❌ 無法連到 /api（本機請用 vercel dev 執行）';
  }
}

async function loadItems() {
  const res = await fetch('/api/items');
  if (!res.ok) return;
  const { items } = await res.json();
  $('items').replaceChildren(...items.map(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title}（${new Date(item.created_at).toLocaleString('zh-TW')}）`;
    return li;
  }));
}

$('add-form').addEventListener('submit', async event => {
  event.preventDefault();
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ title: $('title').value }),
  });
  const body = await res.json().catch(() => ({}));
  $('message').textContent = res.ok ? '已新增' : body.error || '新增失敗';
  if (res.ok) {
    $('title').value = '';
    loadItems();
  }
});

checkHealth();
loadItems();
