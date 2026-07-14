/**
 * API root. VITE_API_BASE may be given as a bare host (Render's env UI makes
 * that easy to do by accident), so the versioned prefix is enforced here.
 */
export const BASE = normalizeBase(import.meta.env.VITE_API_BASE || '/api/v1');

function normalizeBase(raw) {
  const base = raw.trim().replace(/\/+$/, '');
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
}

/** Thin fetch wrapper that unwraps the API's { success, data } envelope. */
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || !payload?.success) {
    const message = payload?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return payload.data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body });
