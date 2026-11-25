import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { completeProject, createProject, getMyProjects, getProjectById, getProjects, updateProject, updateProjectStatus } from "./project.controller";

export const projectRouter = Router();
projectRouter.get("/projects", asyncMiddleware(getProjects));
projectRouter.get("/projects/:id", asyncMiddleware(getProjectById));
projectRouter.post("/projects", requireAuth, asyncMiddleware(createProject));
projectRouter.patch("/projects/:id", requireAuth, asyncMiddleware(updateProject));
projectRouter.patch("/projects/:id/status", requireAuth, asyncMiddleware(updateProjectStatus));
projectRouter.patch("/projects/:id/complete", requireAuth, asyncMiddleware(completeProject));
projectRouter.get("/my-projects", requireAuth, asyncMiddleware(getMyProjects));
