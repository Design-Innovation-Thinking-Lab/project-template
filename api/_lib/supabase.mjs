import { createClient } from '@supabase/supabase-js';
import { readConfig } from './config.mjs';

let admin;

// Server-side client with the secret key. It bypasses RLS, so every API function
// that uses it must check inputs (and, where needed, the signed-in user) itself.
export function adminClient() {
  if (!admin) {
    const { supabaseUrl, secretKey } = readConfig();
    if (!supabaseUrl || !secretKey) throw new Error('Supabase is not configured (see .env.example)');
    admin = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}

// Returns the signed-in Supabase user for a request ("Authorization: Bearer <token>"), or null.
export async function userFromRequest(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  const { data, error } = await adminClient().auth.getUser(token);
  return error ? null : data.user;
}
