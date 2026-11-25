import { z } from "zod";

export const createApplicationSchema = z.object({ role_id: z.string().min(1), message: z.string().trim().min(10).max(3000) });
export const applicationDecisionSchema = z.object({ status: z.enum(["accepted", "rejected"]) });
