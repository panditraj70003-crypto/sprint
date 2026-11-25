import type { RequestHandler } from "express";
import { getAuthenticatedUserId } from "../../utils/authenticatedUser";
import { listNotifications, markNotificationRead } from "./notification.service";

export const getNotifications: RequestHandler = async (req, res) => { res.json({ notifications: await listNotifications(getAuthenticatedUserId(req)) }); };
export const markRead: RequestHandler = async (req, res) => { res.json({ notification: await markNotificationRead(getAuthenticatedUserId(req), req.params.id) }); };
