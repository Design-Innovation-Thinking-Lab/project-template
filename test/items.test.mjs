import { test } from 'node:test';
import assert from 'node:assert/strict';

// Runs the real items API against a fake Supabase (no network): only the HTTP layer is stubbed.
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';

const calls = [];
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url);
  const auth = new Headers(init.headers).get('authorization');
  calls.push({ path: url.pathname, query: url.search, method: init.method || 'GET', body: init.body });
  const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  if (url.pathname === '/auth/v1/user') {
    return auth === 'Bearer good' ? reply(200, { id: 'user-1', email: 'a@example.com', aud: 'authenticated' }) : reply(401, { msg: 'bad token' });
  }
  if (url.pathname === '/rest/v1/items') {
    return (init.method || 'GET') === 'POST'
      ? reply(201, { id: 1, title: 'x', created_at: '2026-11-01T00:00:00Z' })
      : reply(200, []);
  }
  return reply(404, {});
};

const { GET, POST } = await import('../api/items.mjs');
const req = (method, token, body) => new Request('http://x/api/items', {
  method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
  body: body && JSON.stringify(body),
});

test('items API rejects visitors who are not signed in', async () => {
  calls.length = 0;
  assert.equal((await GET(req('GET'))).status, 401);
  assert.equal((await POST(req('POST', null, { title: 'x' }))).status, 401);
  assert.equal((await POST(req('POST', 'forged', { title: 'x' }))).status, 401);
  assert.ok(!calls.some(c => c.path === '/rest/v1/items'), 'no table access without a valid login');
});

test('items API reads and writes only the signed-in user\'s rows', async () => {
  calls.length = 0;
  assert.equal((await GET(req('GET', 'good'))).status, 200);
  assert.match(calls.find(c => c.path === '/rest/v1/items').query, /user_id=eq\.user-1/);
  assert.equal((await POST(req('POST', 'good', { title: 'x' }))).status, 201);
  assert.equal(JSON.parse(calls.find(c => c.method === 'POST').body).user_id, 'user-1');
});
