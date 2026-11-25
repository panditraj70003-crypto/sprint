import { z } from "zod";

const nullableUrl = z.string().trim().url().max(300).or(z.literal("")).nullable().optional()
  .transform(value => value || null);

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  department: z.string().trim().max(100).nullable().optional().transform(value => value || null),
  year: z.number().int().min(1).max(8).nullable().optional(),
  bio: z.string().trim().max(1000).nullable().optional().transform(value => value || null),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).default([]).transform(values => [...new Set(values)]),
  interests: z.array(z.string().trim().min(1).max(60)).max(30).default([]).transform(values => [...new Set(values)]),
  avatar_url: nullableUrl,
  github_url: nullableUrl,
  linkedin_url: nullableUrl,
}).strict();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
