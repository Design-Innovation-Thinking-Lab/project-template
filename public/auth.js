// Browser-side Supabase Auth, loaded from a CDN so no build step is needed.
// Uses only the public URL and publishable key served by /api/config.
// The library is loaded on first use, so pages still work if the CDN is unreachable.
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let clientPromise;

export function supabase() {
  clientPromise ??= Promise.all([
    import(SUPABASE_JS),
    fetch('/api/config').then(res => (res.ok ? res.json() : Promise.reject(new Error('Supabase 尚未設定')))),
  ])
    .then(([{ createClient }, { supabaseUrl, publishableKey }]) => createClient(supabaseUrl, publishableKey))
    .catch(error => {
      clientPromise = undefined;
      throw error;
    });
  return clientPromise;
}

// Headers that tell our API who is signed in (empty when nobody is, or Auth isn't set up).
export async function authHeaders() {
  try {
    const { data } = await (await supabase()).auth.getSession();
    const token = data.session?.access_token;
    return token ? { authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
