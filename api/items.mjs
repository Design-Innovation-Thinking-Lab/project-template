import { json, fail, readJson, text } from './_lib/http.mjs';
import { adminClient, userFromRequest } from './_lib/supabase.mjs';

// Example data API. Replace "items" with your own tables.
// The browser never talks to the table directly: RLS is on with no policies,
// so only this server code (secret key) can read or write it. The secret key
// bypasses RLS, so this code must check who is asking and limit what they see:
// here every request must be signed in, and each user sees only their own rows.

export async function GET(request) {
  const user = await userFromRequest(request);
  if (!user) return fail(401, '請先登入');
  const { data, error } = await adminClient()
    .from('items')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return fail(500, '讀取失敗');
  return json(200, { items: data });
}

export async function POST(request) {
  const user = await userFromRequest(request);
  if (!user) return fail(401, '請先登入');
  const body = await readJson(request);
  const title = text(body.title, 100);
  if (!title) return fail(400, '請輸入 1–100 字的標題');

  const { data, error } = await adminClient()
    .from('items')
    .insert({ title, user_id: user.id })
    .select('id, title, created_at')
    .single();
  if (error) return fail(500, '新增失敗');
  return json(201, { item: data });
}
