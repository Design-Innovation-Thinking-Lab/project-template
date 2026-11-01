// Small helpers shared by the API functions.

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export const fail = (status, error) => json(status, { error });

// Reads a small JSON object body; anything else becomes {} so field checks reject it.
export async function readJson(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return {};
  const text = await request.text();
  if (text.length > 10_000) return {};
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

// A trimmed string of 1..max characters, or null.
export function text(value, max) {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  return s.length >= 1 && s.length <= max ? s : null;
}
