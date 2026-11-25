import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/AppError";
import { ProjectModel } from "../projects/project.model";
import { SavedProjectModel } from "./savedProject.model";

export async function listSavedProjects(userId: string) {
  const rows = await SavedProjectModel.find({ user_id: userId }).select("project_id").lean();
  return rows.map(row => row.project_id);
}

export async function setProjectSaved(userId: string, projectId: string, saved: boolean) {
  if (saved) {
    if (!(await ProjectModel.exists({ id: projectId }))) throw new AppError("Project not found.", 404);
    await SavedProjectModel.updateOne(
      { user_id: userId, project_id: projectId },
      { $setOnInsert: { id: randomUUID(), user_id: userId, project_id: projectId } },
      { upsert: true },
    );
  } else {
    await SavedProjectModel.deleteOne({ user_id: userId, project_id: projectId });
  }
  return { saved };
}
