import { model, models, Schema } from "mongoose";

const applicationSchema = new Schema({
  id: { type: String, required: true, unique: true }, project_id: { type: String, required: true, index: true },
  role_id: { type: String, required: true }, applicant_id: { type: String, required: true, index: true },
  message: { type: String, required: true, maxlength: 3000 },
  status: { type: String, enum: ["pending", "accepted", "rejected", "withdrawn"], default: "pending" },
  created_at: { type: Date, default: Date.now },
}, { versionKey: false, collection: "applications" });
applicationSchema.index({ role_id: 1, applicant_id: 1 }, { unique: true });

export const ApplicationModel = models.Application || model("Application", applicationSchema);
