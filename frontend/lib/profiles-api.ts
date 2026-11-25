import { apiRequest } from "@/lib/auth-api";

export type Profile = {
  id: string;
  full_name: string;
  department: string | null;
  year: number | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = Omit<Profile, "id" | "created_at" | "updated_at">;
async function requestProfile(method: "GET" | "PATCH", body?: ProfileUpdate) {
  const result = await apiRequest<{ profile: Profile }>("/api/v1/profiles/me", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return result.profile as Profile;
}

export const getProfile = () => requestProfile("GET");
export const updateProfile = (profile: ProfileUpdate) => requestProfile("PATCH", profile);
