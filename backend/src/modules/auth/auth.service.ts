import { createClient, type Session } from "@supabase/supabase-js";
import { env, supabaseApiKey } from "../../config/env";
import { AppError } from "../../errors/AppError";
import type { LoginInput, RegisterInput } from "./auth.schema";

function authClient() {
  return createClient(env.SUPABASE_URL, supabaseApiKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: "implicit" },
  });
}

function serializeSession(session: Session) {
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: { id: session.user.id, email: session.user.email, user_metadata: session.user.user_metadata },
  };
}

export async function register(input: RegisterInput) {
  const { data, error } = await authClient().auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.full_name }, emailRedirectTo: `${env.FRONTEND_URL}/auth/callback` },
  });
  if (error) throw new AppError(error.message, 400);
  return {
    session: data.session ? serializeSession(data.session) : null,
    confirmation_required: !data.session,
  };
}

export async function login(input: LoginInput) {
  const { data, error } = await authClient().auth.signInWithPassword({ email: input.email, password: input.password });
  if (error || !data.session) throw new AppError("Email or password is incorrect.", 401);
  return serializeSession(data.session);
}

export async function completeCallback(accessToken: string, refreshToken: string) {
  const client = authClient();
  const { data, error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error || !data.session) throw new AppError("The confirmation session is invalid or expired.", 401);
  return serializeSession(data.session);
}

export async function refresh(refreshToken: string) {
  const { data, error } = await authClient().auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) throw new AppError("Session expired. Please sign in again.", 401);
  return serializeSession(data.session);
}

export async function logout(accessToken: string, refreshToken: string) {
  const client = authClient();
  const { error: sessionError } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (sessionError) return;
  await client.auth.signOut({ scope: "local" });
}
