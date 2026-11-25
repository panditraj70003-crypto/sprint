import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getSavedProjects, saveProject, unsaveProject } from "./savedProject.controller";

export const savedProjectRouter = Router();
savedProjectRouter.get("/saved-projects", requireAuth, asyncMiddleware(getSavedProjects));
savedProjectRouter.put("/projects/:id/saved", requireAuth, asyncMiddleware(saveProject));
savedProjectRouter.delete("/projects/:id/saved", requireAuth, asyncMiddleware(unsaveProject));
