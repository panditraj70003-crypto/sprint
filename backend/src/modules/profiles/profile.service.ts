import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { env, supabaseApiKey } from "../../config/env";
import { AppError } from "../../errors/AppError";
import type { ProfileUpdateInput } from "./profile.schema";

const selectedFields = "id,full_name,department,year,bio,skills,interests,avatar_url,github_url,linkedin_url,created_at,updated_at";

function userClient(accessToken: string) {
  return createClient(env.SUPABASE_URL, supabaseApiKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export async function getOwnProfile(accessToken: string, user: User) {
  const { data, error } = await userClient(accessToken).from("profiles").select(selectedFields).eq("id", user.id).maybeSingle();
  if (error) throw new AppError("Could not load profile.", 500);
  if (!data) throw new AppError("Profile was not found. Apply the profiles database migration.", 404);
  return data;
}

export async function updateOwnProfile(accessToken: string, user: User, input: ProfileUpdateInput) {
  const { data, error } = await userClient(accessToken).from("profiles").update(input).eq("id", user.id).select(selectedFields).maybeSingle();
  if (error) throw new AppError("Could not save profile.", 500);
  if (!data) throw new AppError("Profile was not found. Apply the profiles database migration.", 404);
  return data;
}
