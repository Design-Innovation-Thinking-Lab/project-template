import { json, fail, readJson, text } from './_lib/http.mjs';
import { adminClient, userFromRequest } from './_lib/supabase.mjs';

// Example data API. Replace "items" with your own tables.
// The browser never talks to the table directly: RLS is on with no policies,
// so only this server code (secret key) can read or write it.

export async function GET() {
  const { data, error } = await adminClient()
    .from('items')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return fail(500, '讀取失敗');
  return json(200, { items: data });
}

export async function POST(request) {
  const body = await readJson(request);
  const title = text(body.title, 100);
  if (!title) return fail(400, '請輸入 1–100 字的標題');

  // Signing in is optional here; when the visitor is signed in, the row records who added it.
  const user = await userFromRequest(request);
  const { data, error } = await adminClient()
    .from('items')
    .insert({ title, user_id: user?.id ?? null })
    .select('id, title, created_at')
    .single();
  if (error) return fail(500, '新增失敗');
  return json(201, { item: data });
}
