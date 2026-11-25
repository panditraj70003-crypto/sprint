import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { acceptCallback, loginAccount, logoutAccount, refreshSession, registerAccount } from "./auth.controller";
import { callbackSessionSchema, loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.schema";

export const authRouter = Router();
authRouter.post("/register", validateBody(registerSchema), asyncMiddleware(registerAccount));
authRouter.post("/login", validateBody(loginSchema), asyncMiddleware(loginAccount));
authRouter.post("/callback", validateBody(callbackSessionSchema), asyncMiddleware(acceptCallback));
authRouter.post("/refresh", validateBody(refreshSchema), asyncMiddleware(refreshSession));
authRouter.post("/logout", requireAuth, validateBody(logoutSchema), asyncMiddleware(logoutAccount));
