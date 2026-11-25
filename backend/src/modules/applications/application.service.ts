import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/AppError";
import { ProfileModel } from "../profiles/profile.model";
import { ProjectModel } from "../projects/project.model";
import { NotificationModel } from "../notifications/notification.model";
import { ApplicationModel } from "./application.model";

const serializeApplication = (application: any) => ({
  id: application.id, projectId: application.project_id, roleId: application.role_id,
  studentId: application.applicant_id, message: application.message,
  date: new Date(application.created_at).toISOString().slice(0, 10),
  status: application.status[0].toUpperCase() + application.status.slice(1),
});

export async function listMyApplications(userId: string) {
  const applications = await ApplicationModel.find({ applicant_id: userId }).sort({ created_at: -1 }).lean();
  return applications.map(serializeApplication);
}

export async function listReceivedApplications(userId: string) {
  const projects = await ProjectModel.find({ creator_id: userId }).select("id").lean();
  const applications = await ApplicationModel.find({ project_id: { $in: projects.map(project => project.id) } }).sort({ created_at: -1 }).lean();
  return applications.map(serializeApplication);
}

export async function listProjectApplications(userId: string, projectId: string) {
  const project = await ProjectModel.findOne({ id: projectId }).select("creator_id").lean();
  if (!project) throw new AppError("Project not found.", 404);
  if (project.creator_id !== userId) throw new AppError("Only the project creator can view applications.", 403);
  const applications = await ApplicationModel.find({ project_id: projectId }).sort({ created_at: -1 }).lean();
  return applications.map(serializeApplication);
}

export async function applyToRole(userId: string, projectId: string, roleId: string, message: string) {
  const project = await ProjectModel.findOne({ id: projectId });
  if (!project) throw new AppError("Project not found.", 404);
  if (project.status !== "open") throw new AppError("This project is not accepting applications.", 409);
  const role = project.roles.find((item: any) => item.id === roleId);
  if (!role) throw new AppError("Role not found.", 404);
  if (project.members.some((member: any) => member.user_id === userId)) throw new AppError("You are already a member of this project.", 409);
  const accepted = await ApplicationModel.countDocuments({ role_id: roleId, project_id: projectId, status: "accepted" });
  if (accepted >= role.openings) throw new AppError("This role is full.", 409);

  const application = await ApplicationModel.create({ id: randomUUID(), project_id: projectId, role_id: roleId, applicant_id: userId, message });
  const profile = await ProfileModel.findOne({ userId }).select("full_name").lean();
  await NotificationModel.create({
    id: randomUUID(), user_id: project.creator_id, title: "New project application",
    message: `${profile?.full_name ?? "A student"} applied for ${role.title}.`, type: "application",
  });
  return serializeApplication(application.toObject());
}

export async function withdrawApplication(userId: string, applicationId: string) {
  const application = await ApplicationModel.findOneAndUpdate(
    { id: applicationId, applicant_id: userId, status: "pending" }, { $set: { status: "withdrawn" } }, { new: true },
  );
  if (!application) throw new AppError("Pending application not found.", 404);
  return serializeApplication(application.toObject());
}

export async function decideApplication(userId: string, applicationId: string, status: "accepted" | "rejected") {
  const application = await ApplicationModel.findOne({ id: applicationId });
  if (!application) throw new AppError("Application not found.", 404);
  const project = await ProjectModel.findOne({ id: application.project_id });
  if (!project) throw new AppError("Project not found.", 404);
  if (project.creator_id !== userId) throw new AppError("Only the project creator can decide applications.", 403);
  if (application.status !== "pending") throw new AppError("This application has already been resolved.", 409);

  if (status === "accepted") {
    const role = project.roles.find((item: any) => item.id === application.role_id);
    if (!role) throw new AppError("Role not found.", 404);
    if (project.members.some((member: any) => member.user_id === application.applicant_id)) throw new AppError("This applicant is already a project member.", 409);
    const accepted = await ApplicationModel.countDocuments({ role_id: application.role_id, project_id: project.id, status: "accepted" });
    if (accepted >= role.openings) throw new AppError("No vacancies remain for this role.", 409);
    project.members.push({ user_id: application.applicant_id, role_id: application.role_id, role_title: role.title, is_owner: false, joined_at: new Date() } as any);
    await project.save();
  }

  application.status = status;
  await application.save();
  if (status === "accepted") {
    const full = project.roles.length > 0 && project.roles.every((role: any) => project.members.filter((member: any) => member.role_id === role.id).length >= role.openings);
    project.status = full ? "full" : "open";
    await project.save();
  }
  await NotificationModel.create({
    id: randomUUID(), user_id: application.applicant_id,
    title: status === "accepted" ? "Application accepted" : "Application update",
    message: status === "accepted" ? `You joined ${project.title}.` : `Your application to ${project.title} was rejected.`, type: status,
  });
  return serializeApplication(application.toObject());
}
