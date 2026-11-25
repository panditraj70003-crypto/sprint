"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { App, Project, Student } from "./data";
import { getValidSession } from "./auth-api";
import { getProfile, updateProfile } from "./profiles-api";
import { workspaceApi } from "./workspace-api";
import type { NotificationItem } from "./workspace-api";

const emptyMe: Student = { id: "", name: "Student", dept: "", year: "", bio: "", skills: [], interests: [], roles: [], github: "", linkedin: "", portfolio: "", past: [] };
function useImpl() {
  const [students, setStudents] = useState<Student[]>([]); const [projects, setProjects] = useState<Project[]>([]);
  const [apps, setApps] = useState<App[]>([]); const [saved, setSaved] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [me, setMe] = useState<Student>(emptyMe); const [meId, setMeId] = useState("");
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [toast, setToast] = useState(""); const [loading, setLoading] = useState(true);
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(""), 2600); };
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const publicData = await workspaceApi.loadPublic(); setStudents(publicData.students); setProjects(publicData.projects);
      const session = await getValidSession(); setMeId(session?.user.id ?? "");
      if (session) {
        const [profile, mine] = await Promise.all([getProfile(), workspaceApi.loadMine()]);
        const own: Student = { id: profile.id, name: profile.full_name, dept: profile.department ?? "", year: profile.year ? `${profile.year}${profile.year === 1 ? "st" : profile.year === 2 ? "nd" : profile.year === 3 ? "rd" : "th"} Year` : "", bio: profile.bio ?? "", skills: profile.skills ?? [], interests: profile.interests ?? [], roles: [], github: profile.github_url ?? "", linkedin: profile.linkedin_url ?? "", portfolio: profile.github_url?.replace(/^https?:\/\//, "") ?? "", past: [] };
        setMe(own); setStudents(list => [own, ...list.filter(student => student.id !== own.id)]);
        setProjects(list => [...mine.projects, ...list.filter(project => !mine.projects.some(ownProject => ownProject.id === project.id))]);
        setApps(mine.apps); setSaved(mine.saved); setNotifications(mine.notifications);
      } else { setMe(emptyMe); setApps([]); setSaved([]); setNotifications([]); }
    } catch (error) { notify(error instanceof Error ? error.message : "Could not load dashboard data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); const listener = () => { void refresh(); }; window.addEventListener("skillbridge-auth-change", listener); window.addEventListener("skillbridge-profile-change", listener); return () => { window.removeEventListener("skillbridge-auth-change", listener); window.removeEventListener("skillbridge-profile-change", listener); }; }, [refresh]);
  const student = (id: string) => students.find(item => item.id === id);
  const upsertProject = async (project: Project) => { const savedProject = await workspaceApi.saveProject(project); await refresh(); return savedProject; };
  const apply = async (projectId: string, roleId: string, message: string) => { await workspaceApi.apply(projectId, roleId, message); await refresh(); notify("Application sent"); };
  const withdraw = async (id: string) => { try { await workspaceApi.withdraw(id); await refresh(); notify("Application withdrawn"); } catch (error) { notify(error instanceof Error ? error.message : "Could not withdraw application."); } };
  const decide = async (id: string, accept: boolean) => { try { await workspaceApi.decide(id, accept); await refresh(); notify(accept ? "Application accepted" : "Application rejected"); } catch (error) { notify(error instanceof Error ? error.message : "Could not update application."); } };
  const toggleSave = async (id: string) => { const currentlySaved = saved.includes(id); try { await workspaceApi.toggleSaved(id, currentlySaved); setSaved(current => currentlySaved ? current.filter(item => item !== id) : [...current, id]); notify(currentlySaved ? "Removed from saved" : "Saved project"); } catch (error) { notify(error instanceof Error ? error.message : "Could not update saved projects."); } };
  const updateMe = async (patch: Partial<Student>) => {
    const profile = await updateProfile({ full_name: patch.name ?? me.name, department: patch.dept ?? me.dept, year: patch.year ? Number.parseInt(patch.year, 10) : null, bio: patch.bio ?? me.bio, skills: patch.skills ?? me.skills, interests: patch.interests ?? me.interests, avatar_url: null, github_url: patch.github || null, linkedin_url: patch.linkedin || null });
    setMe({ ...me, id: profile.id, name: profile.full_name, dept: profile.department ?? "", skills: profile.skills, interests: profile.interests }); notify("Profile updated");
  };
  const setClosed = async (id: string, closed: boolean) => { await workspaceApi.setClosed(id, closed); await refresh(); };
  const completeProject = async (id: string) => { await workspaceApi.completeProject(id); await refresh(); };
  const markNotificationRead = async (id: string) => { try { await workspaceApi.markNotificationRead(id); setNotifications(current => current.map(item => item.id === id ? { ...item, is_read: true } : item)); } catch (error) { notify(error instanceof Error ? error.message : "Could not update notification."); } };
  return { students, projects, apps, saved, notifications, toast, notify, me, meId, loading, student, upsertProject, apply, withdraw, decide, toggleSave, updateMe, setClosed, completeProject, markNotificationRead, createProjectOpen, openCreateProject: () => setCreateProjectOpen(true), closeCreateProject: () => setCreateProjectOpen(false), refresh };
}
const Ctx = createContext<ReturnType<typeof useImpl> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) { const value = useImpl(); return <Ctx.Provider value={value}>{children}</Ctx.Provider>; }
export const useApp = () => { const context = useContext(Ctx); if (!context) throw new Error("useApp must be used within StoreProvider"); return context; };
