import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { createApplication, decideOnApplication, getApplicationsForProject, getMyApplications, getReceivedApplications, withdrawMyApplication } from "./application.controller";

export const applicationRouter = Router();
applicationRouter.post("/projects/:id/applications", requireAuth, asyncMiddleware(createApplication));
applicationRouter.get("/applications/me", requireAuth, asyncMiddleware(getMyApplications));
applicationRouter.get("/applications/received", requireAuth, asyncMiddleware(getReceivedApplications));
applicationRouter.get("/projects/:id/applications", requireAuth, asyncMiddleware(getApplicationsForProject));
applicationRouter.patch("/applications/:id/withdraw", requireAuth, asyncMiddleware(withdrawMyApplication));
applicationRouter.patch("/applications/:id/decision", requireAuth, asyncMiddleware(decideOnApplication));
