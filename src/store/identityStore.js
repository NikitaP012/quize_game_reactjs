/**
 * The student's identity, captured from the entry URL:
 *   quiz.prisms.in/{school_id}/{class}/{user_id}/{user_name}
 *
 * There is no login, so the URL is the source of truth for WHO is playing. We
 * cache it in localStorage so it survives internal navigation and refreshes
 * (the URL params only appear on the very first hop before we redirect into the
 * app). Shape: { schoolId, classId, userId, userName }.
 */
const KEY = 'quize_identity_v1';

export function loadIdentity() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(identity) {
  try {
    localStorage.setItem(KEY, JSON.stringify(identity));
  } catch {
    /* storage full / disabled — identity just won't persist across refreshes */
  }
}

export function clearIdentity() {
  localStorage.removeItem(KEY);
}
