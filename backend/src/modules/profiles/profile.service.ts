import type { HydratedDocument } from "mongoose";
import { AppError } from "../../errors/AppError";
import type { AuthUser } from "../../types/auth";
import type { ProfileUpdateInput } from "./profile.schema";
import { ProfileModel, type ProfileDocument } from "./profile.model";

function baseProfile(user: AuthUser) {
  const metadata = user.user_metadata ?? {};
  const fallbackName = user.email?.split("@")[0] || "Student";
  return {
    userId: user.id,
    full_name: typeof metadata.full_name === "string" && metadata.full_name.trim() ? metadata.full_name.trim() : fallbackName,
    department: typeof metadata.department === "string" ? metadata.department : null,
    year: typeof metadata.year === "number" ? metadata.year : null,
    bio: typeof metadata.bio === "string" ? metadata.bio : null,
    skills: Array.isArray(metadata.skills) ? metadata.skills.filter((value): value is string => typeof value === "string") : [],
    interests: Array.isArray(metadata.interests) ? metadata.interests.filter((value): value is string => typeof value === "string") : [],
    avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    github_url: typeof metadata.github_url === "string" ? metadata.github_url : null,
    linkedin_url: typeof metadata.linkedin_url === "string" ? metadata.linkedin_url : null,
  };
}

function serializeProfile(document: HydratedDocument<ProfileDocument>) {
  return {
    id: document.userId,
    full_name: document.full_name,
    department: document.department,
    year: document.year,
    bio: document.bio,
    skills: document.skills,
    interests: document.interests,
    avatar_url: document.avatar_url,
    github_url: document.github_url,
    linkedin_url: document.linkedin_url,
    created_at: document.created_at.toISOString(),
  };
}

export async function createProfileFromSignup(user: AuthUser, input: ProfileUpdateInput) {
  const document = await ProfileModel.findOneAndUpdate(
    { userId: user.id },
    { $set: input, $setOnInsert: { userId: user.id } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
  if (!document) throw new AppError("Could not save the new profile.", 500);
  return serializeProfile(document);
}

export async function getOwnProfile(user: AuthUser) {
  const document = await ProfileModel.findOneAndUpdate(
    { userId: user.id },
    { $setOnInsert: baseProfile(user) },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  if (!document) throw new AppError("Could not load profile.", 500);
  return serializeProfile(document);
}

export async function updateOwnProfile(user: AuthUser, input: ProfileUpdateInput) {
  await getOwnProfile(user);
  const document = await ProfileModel.findOneAndUpdate(
    { userId: user.id },
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!document) throw new AppError("Could not save profile.", 500);
  return serializeProfile(document);
}
