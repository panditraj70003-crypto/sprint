import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
}).strict();

export const callbackSessionSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
}).strict();

export const refreshSchema = z.object({ refresh_token: z.string().min(1) }).strict();
export const logoutSchema = z.object({ refresh_token: z.string().min(1) }).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
