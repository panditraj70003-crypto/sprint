import { API_BASE, apiRequest } from "./auth-api";
import type { App, Project, Student } from "./data";

async function publicGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message ?? "Could not load workspace data.");
  return result as T;
}
const toStudent = (p: any): Student => ({ id: p.id, name: p.full_name ?? "Student", dept: p.department ?? "", year: p.year ? `${p.year}${p.year === 1 ? "st" : p.year === 2 ? "nd" : p.year === 3 ? "rd" : "th"} Year` : "", bio: p.bio ?? "", skills: p.skills ?? [], interests: p.interests ?? [], roles: [], github: p.github_url ?? "", linkedin: p.linkedin_url ?? "", portfolio: p.github_url?.replace(/^https?:\/\//, "") ?? "", past: [] });
export const workspaceApi = {
  async loadPublic() {
    const [projectResult, profileResult] = await Promise.all([publicGet<{ projects: Project[] }>("/api/v1/projects"), publicGet<{ profiles: any[] }>("/api/v1/profiles")]);
    return { projects: projectResult.projects, students: profileResult.profiles.map(toStudent) };
  },
  async loadMine() {
    const [projects, received, applications, saved, notifications] = await Promise.all([
      apiRequest<{ projects: Project[] }>("/api/v1/my-projects"), apiRequest<{ applications: App[] }>("/api/v1/applications/received"),
      apiRequest<{ applications: App[] }>("/api/v1/applications/me"), apiRequest<{ project_ids: string[] }>("/api/v1/saved-projects"),
      apiRequest<{ notifications: NotificationItem[] }>("/api/v1/notifications"),
    ]);
    return { projects: projects.projects, apps: [...received.applications, ...applications.applications], saved: saved.project_ids, notifications: notifications.notifications };
  },
  async saveProject(project: Project) {
    const method = project.id ? "PATCH" : "POST";
    const path = method === "PATCH" ? `/api/v1/projects/${project.id}` : "/api/v1/projects";
    const result = await apiRequest<{ project: Project }>(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    return result.project;
  },
  async setClosed(id: string, closed: boolean) { return apiRequest<{ project: Project }>(`/api/v1/projects/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ closed }) }); },
  async apply(projectId: string, roleId: string, message: string) { return apiRequest<{ application: App }>(`/api/v1/projects/${projectId}/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role_id: roleId, message }) }); },
  async withdraw(id: string) { return apiRequest(`/api/v1/applications/${id}/withdraw`, { method: "PATCH" }); },
  async decide(id: string, accept: boolean) { return apiRequest(`/api/v1/applications/${id}/decision`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: accept ? "accepted" : "rejected" }) }); },
  async toggleSaved(id: string, saved: boolean) { return apiRequest(`/api/v1/projects/${id}/saved`, { method: saved ? "DELETE" : "PUT" }); },
  async markNotificationRead(id: string) { return apiRequest(`/api/v1/notifications/${id}/read`, { method: "PATCH" }); },
};
export type NotificationItem = { id: string; title: string; message: string; type: string; is_read: boolean; created_at: string };
