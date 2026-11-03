// Reads Supabase settings from environment variables.
// Supabase created on supabase.com and Supabase added through the Vercel Marketplace
// name some variables differently, so each setting accepts every known name.
// This is what lets a project move from a student's account to the lab's without code changes.

const NAMES = {
  supabaseUrl: ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
  // Safe to send to the browser, but only because every table has RLS turned on.
  publishableKey: [
    'SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  // Server only. Bypasses RLS, so it must never reach the browser or a commit.
  secretKey: ['SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
};

function pick(names, env) {
  for (const name of names) {
    const value = env[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

// True for a secret key: the new "sb_secret_…" form, or a legacy JWT whose role is service_role.
export function looksSecret(key) {
  if (key.startsWith('sb_secret_')) return true;
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

export function readConfig(env = process.env) {
  const config = Object.fromEntries(Object.entries(NAMES).map(([key, names]) => [key, pick(names, env)]));
  // A secret key pasted into a public variable would be sent to every browser; refuse to use it.
  if (config.publishableKey && looksSecret(config.publishableKey)) config.publishableKey = null;
  return config;
}

// Lists the settings that are not set, by their first (preferred) name.
export function missingSettings(env = process.env) {
  const config = readConfig(env);
  return Object.keys(NAMES).filter(key => !config[key]).map(key => NAMES[key][0]);
}

export const SETTING_NAMES = NAMES;
