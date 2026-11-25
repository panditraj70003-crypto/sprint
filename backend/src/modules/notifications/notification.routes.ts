import { Router } from "express";
import { asyncMiddleware } from "../../middlewares/async.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getNotifications, markRead } from "./notification.controller";

export const notificationRouter = Router();
notificationRouter.get("/notifications", requireAuth, asyncMiddleware(getNotifications));
notificationRouter.patch("/notifications/:id/read", requireAuth, asyncMiddleware(markRead));
