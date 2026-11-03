import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readConfig, missingSettings } from '../api/_lib/config.mjs';
import { text, readJson } from '../api/_lib/http.mjs';

test('reads the names Supabase uses when created on supabase.com', () => {
  const env = { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'pub', SUPABASE_SECRET_KEY: 'sec' };
  assert.deepEqual(readConfig(env), { supabaseUrl: 'https://x.supabase.co', publishableKey: 'pub', secretKey: 'sec' });
  assert.deepEqual(missingSettings(env), []);
});

test('reads the names the Vercel Marketplace integration sets', () => {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://y.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x',
    SUPABASE_SECRET_KEY: 'sb_secret_x',
  };
  assert.deepEqual(readConfig(env), { supabaseUrl: 'https://y.supabase.co', publishableKey: 'sb_publishable_x', secretKey: 'sb_secret_x' });
});

test('reads the legacy anon and service_role names', () => {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://y.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
    SUPABASE_SERVICE_ROLE_KEY: 'service',
  };
  assert.deepEqual(readConfig(env), { supabaseUrl: 'https://y.supabase.co', publishableKey: 'anon', secretKey: 'service' });
});

test('never serves a secret key as the public key', () => {
  const jwt = role => ['e30', Buffer.from(JSON.stringify({ role })).toString('base64url'), 'sig'].join('.');
  const base = { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SECRET_KEY: 'sb_secret_x' };
  assert.equal(readConfig({ ...base, SUPABASE_PUBLISHABLE_KEY: 'sb_secret_oops' }).publishableKey, null);
  assert.equal(readConfig({ ...base, SUPABASE_ANON_KEY: jwt('service_role') }).publishableKey, null);
  assert.equal(readConfig({ ...base, SUPABASE_ANON_KEY: jwt('anon') }).publishableKey, jwt('anon'));
  assert.deepEqual(missingSettings({ ...base, SUPABASE_PUBLISHABLE_KEY: 'sb_secret_oops' }), ['SUPABASE_PUBLISHABLE_KEY']);
});

test('prefers the first name and ignores blank values', () => {
  const env = { SUPABASE_URL: '  ', NEXT_PUBLIC_SUPABASE_URL: 'https://z.supabase.co', SUPABASE_SECRET_KEY: 'new', SUPABASE_SERVICE_ROLE_KEY: 'old' };
  const config = readConfig(env);
  assert.equal(config.supabaseUrl, 'https://z.supabase.co');
  assert.equal(config.secretKey, 'new');
});

test('reports missing settings by name, never by value', () => {
  assert.deepEqual(missingSettings({ SUPABASE_URL: 'https://x.supabase.co' }), ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY']);
});

test('text() trims and enforces length', () => {
  assert.equal(text('  hi  ', 5), 'hi');
  assert.equal(text('', 5), null);
  assert.equal(text('toolong', 3), null);
  assert.equal(text(42, 5), null);
});

test('readJson() only accepts small JSON objects', async () => {
  const req = body => new Request('http://x/', { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  assert.deepEqual(await readJson(req('{"a":1}')), { a: 1 });
  assert.deepEqual(await readJson(req('[1,2]')), {});
  assert.deepEqual(await readJson(req('not json')), {});
  assert.deepEqual(await readJson(new Request('http://x/', { method: 'POST', body: '{"a":1}' })), {});
});
