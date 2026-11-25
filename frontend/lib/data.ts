export type Student = { id: string; name: string; dept: string; year: string; bio: string; skills: string[]; interests: string[]; roles: string[]; github: string; linkedin: string; portfolio: string; past: string[] };
export type Role = { id: string; title: string; description: string; skills: string[]; openings: number };
export type Member = { studentId: string; roleId: string; roleTitle: string; isOwner?: boolean };
export type Project = { id: string; title: string; description: string; category: string; department: string; duration: string; commitment: string; mode: string; skills: string[]; creatorId: string; roles: Role[]; team: Member[]; draft: boolean; closed: boolean; deadline?: string; link?: string; status?: string; created_at?: string };
export type App = { id: string; projectId: string; roleId: string; studentId: string; message: string; date: string; status: "Pending" | "Accepted" | "Rejected" | "Withdrawn" };

export const CATEGORIES = ["Web & Apps", "AI & Data", "Hardware & IoT", "Design", "Research", "Social Impact", "Startup"];
export const DEPARTMENTS = ["Computer Science", "Electronics", "Mechanical", "Design", "Business", "Biotechnology"];
export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
export const DURATIONS = ["2-4 weeks", "1-2 months", "3-4 months", "6+ months"];
export const COMMITMENTS = ["2-4 hrs/week", "5-8 hrs/week", "10+ hrs/week"];
export const MODES = ["Remote", "On campus", "Hybrid"];
