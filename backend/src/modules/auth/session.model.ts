import { model, models, Schema } from "mongoose";

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  refreshTokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
  revokedAt: { type: Date, default: null },
  created_at: { type: Date, default: Date.now, immutable: true },
}, { versionKey: false, collection: "sessions" });

export const SessionModel = models.Session || model("Session", sessionSchema);
