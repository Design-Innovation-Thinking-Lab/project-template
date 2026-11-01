import { json, fail } from './_lib/http.mjs';
import { userFromRequest } from './_lib/supabase.mjs';

// Example of a signed-in-only API: returns who the caller is.
export async function GET(request) {
  const user = await userFromRequest(request);
  if (!user) return fail(401, '請先登入');
  return json(200, { id: user.id, email: user.email });
}
