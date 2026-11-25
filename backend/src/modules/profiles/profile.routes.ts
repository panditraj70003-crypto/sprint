import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { getMe, patchMe } from "./profile.controller";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { listPublicProfiles } from "./profile.service";
import { profileUpdateSchema } from "./profile.schema";

export const profileRouter = Router();
profileRouter.get("/", asyncMiddleware(async (_req, res) => { res.json({ profiles: await listPublicProfiles() }); }));
profileRouter.use(requireAuth);
profileRouter.get("/me", asyncMiddleware(getMe));
profileRouter.patch("/me", validateBody(profileUpdateSchema), asyncMiddleware(patchMe));
