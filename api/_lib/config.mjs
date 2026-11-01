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

export function readConfig(env = process.env) {
  return Object.fromEntries(Object.entries(NAMES).map(([key, names]) => [key, pick(names, env)]));
}

// Lists the settings that are not set, by their first (preferred) name.
export function missingSettings(env = process.env) {
  const config = readConfig(env);
  return Object.keys(NAMES).filter(key => !config[key]).map(key => NAMES[key][0]);
}

export const SETTING_NAMES = NAMES;
