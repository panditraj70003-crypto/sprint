import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  full_name: { type: String, required: true, trim: true, maxlength: 100 },
  created_at: { type: Date, default: Date.now, immutable: true },
}, { versionKey: false, collection: "users" });

export const UserModel = models.User || model("User", userSchema);
