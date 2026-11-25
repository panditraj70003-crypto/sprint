import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/AppError";
import { ProjectModel } from "./project.model";

const modeToDb = (mode: string) => mode.toLowerCase() === "remote" ? "online" : mode.toLowerCase() === "on campus" ? "offline" : mode.toLowerCase();
const modeToUi = (mode: string) => mode === "online" ? "Remote" : mode === "offline" ? "On campus" : "Hybrid";

export const serializeProject = (project: any) => ({
  id: project.id, creatorId: project.creator_id, title: project.title, description: project.description,
  category: project.category, department: project.department, duration: project.duration, commitment: project.commitment,
  skills: project.skills, tags: project.tags, mode: modeToUi(project.mode), draft: project.status === "draft",
  closed: project.status === "closed" || project.status === "completed", status: project.status,
  deadline: project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : "", link: project.link,
  created_at: project.created_at,
  roles: (project.roles ?? []).map((role: any) => ({ id: role.id, title: role.title, description: role.description, skills: role.required_skills, openings: role.openings })),
  team: (project.members ?? []).map((member: any) => ({ studentId: member.user_id, roleId: member.role_id ?? "", roleTitle: member.role_title, isOwner: member.is_owner })),
});

export async function listProjects() {
  const documents = await ProjectModel.find({ status: { $ne: "draft" } }).sort({ created_at: -1 }).lean();
  return documents.map(serializeProject);
}

export async function listMyProjects(userId: string) {
  const documents = await ProjectModel.find({ $or: [{ creator_id: userId }, { "members.user_id": userId }] }).sort({ created_at: -1 }).lean();
  return documents.map(serializeProject);
}

export async function getProject(id: string) {
  const project = await ProjectModel.findOne({ id }).lean();
  if (!project) throw new AppError("Project not found.", 404);
  return serializeProject(project);
}

export async function saveProject(userId: string, input: any) {
  const id = input.id || randomUUID();
  const isNew = !input.id || !(await ProjectModel.exists({ id }));
  if (!isNew) {
    const current = await ProjectModel.findOne({ id });
    if (!current) throw new AppError("Project not found.", 404);
    if (current.creator_id !== userId) throw new AppError("Only the project creator can edit it.", 403);
  }

  const roles = (input.roles ?? []).map((role: any) => ({
    id: role.id || randomUUID(), title: role.title, description: role.description || "",
    required_skills: role.skills ?? role.required_skills ?? [], openings: Number(role.openings),
  }));
  const previous = isNew ? null : await ProjectModel.findOne({ id });
  const members = previous?.members?.map((member: any) => ({
    user_id: member.user_id, role_id: member.role_id, role_title: member.role_title,
    is_owner: member.is_owner, joined_at: member.joined_at,
  })) ?? [{ user_id: userId, role_id: null, role_title: "Project Lead", is_owner: true }];
  const status = input.draft ? "draft" : input.closed ? "closed" : "open";
  const project = await ProjectModel.findOneAndUpdate({ id }, {
    $set: {
      creator_id: userId, title: input.title.trim(), description: input.description ?? "", category: input.category,
      department: input.department ?? "", duration: input.duration ?? "", commitment: input.commitment ?? "",
      skills: input.skills ?? [], tags: input.tags ?? input.skills ?? [], mode: modeToDb(input.mode),
      deadline: input.deadline ? new Date(input.deadline) : null, link: input.link ?? "", roles, members, status,
    }, $setOnInsert: { id, created_at: new Date() },
  }, { upsert: true, new: true, runValidators: true });
  if (!project) throw new AppError("Could not save project.", 500);
  return serializeProject(project.toObject());
}

export async function setProjectClosed(userId: string, projectId: string, closed: boolean) {
  const current = await ProjectModel.findOne({ id: projectId, creator_id: userId });
  if (!current) throw new AppError("Project not found or you are not its creator.", 404);
  const isFull = current.roles.length > 0 && current.roles.every((role: any) => current.members.filter((member: any) => member.role_id === role.id).length >= role.openings);
  const project = await ProjectModel.findOneAndUpdate({ id: projectId, creator_id: userId }, { $set: { status: closed ? "closed" : isFull ? "full" : "open" } }, { new: true });
  if (!project) throw new AppError("Project not found or you are not its creator.", 404);
  return serializeProject(project.toObject());
}
