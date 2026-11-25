import { model, models, Schema } from "mongoose";

const savedProjectSchema = new Schema({
  id: { type: String, required: true }, user_id: { type: String, required: true },
  project_id: { type: String, required: true }, created_at: { type: Date, default: Date.now },
}, { versionKey: false, collection: "saved_projects" });
savedProjectSchema.index({ user_id: 1, project_id: 1 }, { unique: true });

export const SavedProjectModel = models.SavedProject || model("SavedProject", savedProjectSchema);
