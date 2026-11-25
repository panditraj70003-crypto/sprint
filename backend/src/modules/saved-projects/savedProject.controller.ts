import type { RequestHandler } from "express";
import { getAuthenticatedUserId } from "../../utils/authenticatedUser";
import { listSavedProjects, setProjectSaved } from "./savedProject.service";

export const getSavedProjects: RequestHandler = async (req, res) => { res.json({ project_ids: await listSavedProjects(getAuthenticatedUserId(req)) }); };
export const saveProject: RequestHandler = async (req, res) => { res.json(await setProjectSaved(getAuthenticatedUserId(req), req.params.id, true)); };
export const unsaveProject: RequestHandler = async (req, res) => { res.json(await setProjectSaved(getAuthenticatedUserId(req), req.params.id, false)); };
