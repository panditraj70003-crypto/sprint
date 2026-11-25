import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { getAuthenticatedUserId } from "../../utils/authenticatedUser";
import { getProject, listMyProjects, listProjects, markProjectCompleted, saveProject, setProjectClosed } from "./project.service";
import { projectSchema, projectStatusSchema } from "./project.schema";

export const getProjects: RequestHandler = async (_req, res) => { res.json({ projects: await listProjects() }); };
export const getProjectById: RequestHandler = async (req, res) => { res.json({ project: await getProject(req.params.id) }); };
export const getMyProjects: RequestHandler = async (req, res) => { res.json({ projects: await listMyProjects(getAuthenticatedUserId(req)) }); };

export const createProject: RequestHandler = async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Invalid project.", 400);
  const project = await saveProject(getAuthenticatedUserId(req), { ...parsed.data, id: parsed.data.id || randomUUID() });
  res.status(201).json({ project });
};

export const updateProject: RequestHandler = async (req, res) => {
  const parsed = projectSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Invalid project.", 400);
  res.json({ project: await saveProject(getAuthenticatedUserId(req), parsed.data) });
};

export const updateProjectStatus: RequestHandler = async (req, res) => {
  const parsed = projectStatusSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError("closed must be a boolean.", 400);
  res.json({ project: await setProjectClosed(getAuthenticatedUserId(req), req.params.id, parsed.data.closed) });
};

export const completeProject: RequestHandler = async (req, res) => {
  res.json({ project: await markProjectCompleted(getAuthenticatedUserId(req), req.params.id) });
};
