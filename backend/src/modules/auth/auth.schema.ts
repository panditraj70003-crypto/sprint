import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
  department: z.string().trim().max(100).optional(),
  year: z.number().int().min(1).max(8).nullable().optional(),
  bio: z.string().trim().max(1000).optional(),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  interests: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  avatar_url: z.union([z.string().trim().url().max(300), z.literal("")]).optional(),
  github_url: z.union([z.string().trim().url().max(300), z.literal("")]).optional(),
  linkedin_url: z.union([z.string().trim().url().max(300), z.literal("")]).optional(),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
}).strict();

export const refreshSchema = z.object({ refresh_token: z.string().min(1) }).strict();
export const logoutSchema = z.object({ refresh_token: z.string().min(1) }).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
