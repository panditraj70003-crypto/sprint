import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { getMe, patchMe } from "./profile.controller";
import { profileUpdateSchema } from "./profile.schema";

export const profileRouter = Router();
profileRouter.use(requireAuth);
profileRouter.get("/me", asyncMiddleware(getMe));
profileRouter.patch("/me", validateBody(profileUpdateSchema), asyncMiddleware(patchMe));
