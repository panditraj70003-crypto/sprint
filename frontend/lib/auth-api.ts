export const API_BASE = "https://sprint-79ki.onrender.com";
const SESSION_KEY = "skillbridge_auth_session";
let refreshInFlight: Promise<AuthSession | null> | null = null;

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
};

class AuthApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "AuthApiError";
  }
}

function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("skillbridge-auth-change"));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("skillbridge-auth-change"));
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthApiError(result.error?.message ?? "The backend API request failed.", response.status);
  return result as T;
}

export async function register(input: { full_name: string; email: string; password: string; department: string; year: number | null; bio: string; skills: string[]; interests: string[]; avatar_url: string; github_url: string; linkedin_url: string }) {
  const result = await post<{ session: AuthSession }>("/api/v1/auth/register", input);
  saveSession(result.session);
  return result;
}

export async function login(email: string, password: string) {
  const result = await post<{ session: AuthSession }>("/api/v1/auth/login", { email, password });
  saveSession(result.session);
  return result.session;
}

export async function getValidSession(): Promise<AuthSession | null> {
  const session = readSession();
  if (!session) return null;
  if (!session.expires_at || session.expires_at * 1000 > Date.now() + 60_000) return session;
  return refreshSession(session);
}

function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  if (refreshInFlight) return refreshInFlight;
  const request = (async (): Promise<AuthSession | null> => {
    try {
      const result = await post<{ session: AuthSession }>("/api/v1/auth/refresh", { refresh_token: session.refresh_token });
      const latest = readSession();
      if (!latest) return null;
      if (latest.refresh_token !== session.refresh_token) return latest;
      saveSession(result.session);
      return result.session;
    } catch (error) {
      const latest = readSession();
      if (!latest) return null;
      if (latest.refresh_token !== session.refresh_token) return latest;
      if (error instanceof AuthApiError && (error.status === 401 || error.status === 403)) {
        clearSession();
        return null;
      }
      // Keep the login if the API is temporarily unavailable (for example, while Render wakes up).
      return latest;
    }
  })();
  refreshInFlight = request;
  return request.finally(() => {
    if (refreshInFlight === request) refreshInFlight = null;
  });
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let session = await getValidSession();
  if (!session) throw new Error("Please sign in again to continue.");
  const send = (accessToken: string) => fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
  });
  let response = await send(session.access_token);
  if (response.status === 401) {
    const refreshed = await refreshSession(session);
    if (refreshed && refreshed.access_token !== session.access_token) {
      session = refreshed;
      response = await send(session.access_token);
    }
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message ?? "The backend API request failed.");
  return result as T;
}

export async function logout() {
  const session = readSession();
  try {
    if (session) await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
  } catch {
    // Clear the local session even if the API is unavailable during logout.
  } finally {
    clearSession();
  }
}
