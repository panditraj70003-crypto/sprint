import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { getAuthenticatedUserId } from "../../utils/authenticatedUser";
import { applyToRole, decideApplication, listMyApplications, listProjectApplications, listReceivedApplications, withdrawApplication } from "./application.service";
import { applicationDecisionSchema, createApplicationSchema } from "./application.schema";

export const createApplication: RequestHandler = async (req, res) => {
  const parsed = createApplicationSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Invalid application.", 400);
  const application = await applyToRole(getAuthenticatedUserId(req), req.params.id, parsed.data.role_id, parsed.data.message);
  res.status(201).json({ application });
};
export const getMyApplications: RequestHandler = async (req, res) => { res.json({ applications: await listMyApplications(getAuthenticatedUserId(req)) }); };
export const getReceivedApplications: RequestHandler = async (req, res) => { res.json({ applications: await listReceivedApplications(getAuthenticatedUserId(req)) }); };
export const getApplicationsForProject: RequestHandler = async (req, res) => { res.json({ applications: await listProjectApplications(getAuthenticatedUserId(req), req.params.id) }); };
export const withdrawMyApplication: RequestHandler = async (req, res) => { res.json({ application: await withdrawApplication(getAuthenticatedUserId(req), req.params.id) }); };
export const decideOnApplication: RequestHandler = async (req, res) => {
  const parsed = applicationDecisionSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError("status must be accepted or rejected.", 400);
  res.json({ application: await decideApplication(getAuthenticatedUserId(req), req.params.id, parsed.data.status) });
};
