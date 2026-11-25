import { z } from "zod";

export const roleSchema = z.object({
  id: z.string().optional(), title: z.string().trim().min(1).max(100),
  description: z.string().max(2000).optional().default(""),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).default([]), openings: z.number().int().min(1).max(100),
});

export const projectSchema = z.object({
  id: z.string().optional(), title: z.string().trim().min(4).max(160), description: z.string().max(10000).default(""),
  category: z.string().trim().min(1).max(100), department: z.string().max(100).optional().default(""),
  duration: z.string().max(100).optional().default(""), commitment: z.string().max(100).optional().default(""),
  skills: z.array(z.string().trim().min(1).max(60)).max(50).default([]),
  mode: z.enum(["Remote", "On campus", "Hybrid", "online", "offline", "hybrid"]),
  deadline: z.string().optional().or(z.literal("")), link: z.string().max(500).optional().default(""),
  draft: z.boolean().default(false), closed: z.boolean().default(false), roles: z.array(roleSchema).max(30).default([]),
});

export const projectStatusSchema = z.object({ closed: z.boolean() });
