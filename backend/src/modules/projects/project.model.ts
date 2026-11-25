import { model, models, Schema } from "mongoose";

const roleSchema = new Schema({
  id: { type: String, required: true }, title: { type: String, required: true, trim: true },
  description: { type: String, default: "" }, required_skills: { type: [String], default: [] },
  openings: { type: Number, required: true, min: 1 }, created_at: { type: Date, default: Date.now },
}, { _id: false });

const memberSchema = new Schema({
  user_id: { type: String, required: true }, role_id: { type: String, default: null },
  role_title: { type: String, default: "Project Lead" }, is_owner: { type: Boolean, default: false }, joined_at: { type: Date, default: Date.now },
}, { _id: false });

const projectSchema = new Schema({
  id: { type: String, required: true, unique: true }, creator_id: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 }, description: { type: String, default: "", maxlength: 10000 },
  category: { type: String, required: true }, department: { type: String, default: "" }, duration: { type: String, default: "" },
  commitment: { type: String, default: "" }, tags: { type: [String], default: [] }, skills: { type: [String], default: [] },
  status: { type: String, enum: ["open", "full", "closed", "completed", "draft"], default: "open", index: true },
  mode: { type: String, enum: ["online", "offline", "hybrid"], required: true }, deadline: { type: Date, default: null },
  link: { type: String, default: "" }, roles: { type: [roleSchema], default: [] }, members: { type: [memberSchema], default: [] },
  created_at: { type: Date, default: Date.now, immutable: true },
}, { versionKey: false, collection: "projects" });
projectSchema.index({ "members.user_id": 1 });

export const ProjectModel = models.Project || model("Project", projectSchema);
