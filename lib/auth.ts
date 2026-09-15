// Browser-side glue for the edge authentication (Caddy forward_auth + Authelia).
// The app never sees passwords or tokens: when the session at the edge is gone
// the API answers 401, and a full navigation lets Caddy redirect to the portal.

const RELOAD_STAMP_KEY = 'arag_auth_reload_at';
// A backend that answers 401 for another reason must not put the tab into a
// reload loop; one navigation per window is enough for the portal redirect
const RELOAD_THROTTLE_MS = 10_000;

function readStamp(): number {
  try {
    return Number(window.sessionStorage.getItem(RELOAD_STAMP_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeStamp(value: number): void {
  try {
    window.sessionStorage.setItem(RELOAD_STAMP_KEY, String(value));
  } catch {
    // sessionStorage may be unavailable (private mode); reload anyway
  }
}

// Called on any 401 from the API. Returns true when a navigation was started.
export function redirectToLogin(): boolean {
  if (typeof window === 'undefined') return false;
  const now = Date.now();
  if (now - readStamp() < RELOAD_THROTTLE_MS) return false;
  writeStamp(now);
  window.location.reload();
  return true;
}

// Authelia's portal lives on auth.<site host>; `rd` brings the user back
export function logoutUrl(): string {
  const { host, origin } = window.location;
  return `https://auth.${host}/logout?rd=${encodeURIComponent(origin)}`;
}
