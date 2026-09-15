// Browser-side glue for the edge authentication (Caddy forward_auth + Authelia).
// The app never sees passwords or tokens: when the session at the edge is gone
// the API answers 401, and a full navigation lets Caddy redirect to the portal.

const RELOAD_PENDING_KEY = 'arag_auth_reload_pending';

function readPending(): boolean {
  try {
    return window.sessionStorage.getItem(RELOAD_PENDING_KEY) === '1';
  } catch {
    return false;
  }
}

function writePending(pending: boolean): void {
  try {
    if (pending) window.sessionStorage.setItem(RELOAD_PENDING_KEY, '1');
    else window.sessionStorage.removeItem(RELOAD_PENDING_KEY);
  } catch {
    // sessionStorage may be unavailable (private mode)
  }
}

// Called on a 401 from the API. Reloads at most once until some API call
// succeeds again: if the 401 survives the reload there is no portal to go to
// (edge auth off, backend misconfigured) and looping would lock the tab.
export function redirectToLogin(): boolean {
  if (typeof window === 'undefined' || readPending()) return false;
  writePending(true);
  window.location.reload();
  return true;
}

// Called after any successful API response: the session works again
export function markAuthenticated(): void {
  if (typeof window === 'undefined') return;
  writePending(false);
}

// Authelia's portal lives on auth.<site host>; `rd` brings the user back
export function logoutUrl(): string {
  const { host, origin } = window.location;
  return `https://auth.${host}/logout?rd=${encodeURIComponent(origin)}`;
}
