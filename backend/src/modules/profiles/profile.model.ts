import { model, models, Schema, type InferSchemaType } from "mongoose";

const profileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  full_name: { type: String, required: true, trim: true, maxlength: 100 },
  department: { type: String, default: null, maxlength: 100 },
  year: { type: Number, default: null, min: 1, max: 8 },
  bio: { type: String, default: null, maxlength: 1000 },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  avatar_url: { type: String, default: null, maxlength: 300 },
  github_url: { type: String, default: null, maxlength: 300 },
  linkedin_url: { type: String, default: null, maxlength: 300 },
  created_at: { type: Date, default: Date.now, immutable: true },
}, { versionKey: false, collection: "profiles" });

export type ProfileDocument = InferSchemaType<typeof profileSchema>;
export const ProfileModel = models.Profile || model("Profile", profileSchema);
