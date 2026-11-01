import { json } from './_lib/http.mjs';
import { missingSettings } from './_lib/config.mjs';
import { adminClient } from './_lib/supabase.mjs';

// Quick check after deploying: are the settings present, and can we reach the database?
// It reports only names of missing settings, never their values.
export async function GET() {
  const missing = missingSettings();
  if (missing.length) return json(500, { ok: false, missing });
  const { error } = await adminClient().from('items').select('id', { head: true, count: 'exact' });
  if (error) return json(500, { ok: false, database: '無法讀取 items 資料表，請確認已執行 supabase/migrations' });
  return json(200, { ok: true });
}
