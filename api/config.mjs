import { json, fail } from './_lib/http.mjs';
import { readConfig } from './_lib/config.mjs';

// Gives the browser what it needs to sign in with Supabase Auth.
// Only public values: the project URL and the publishable (anon) key. Never the secret key.
export function GET() {
  const { supabaseUrl, publishableKey } = readConfig();
  if (!supabaseUrl || !publishableKey) return fail(500, 'Supabase 尚未設定');
  return json(200, { supabaseUrl, publishableKey });
}
