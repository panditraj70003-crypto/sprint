import { AppError } from "../errors/AppError";
import type { AuthUser } from "../types/auth";
import type { Request } from "express";

export function getAuthenticatedUser(req: Request): AuthUser {
  if (!req.authUser) throw new AppError("Authentication required.", 401);
  return req.authUser;
}

export function getAuthenticatedUserId(req: Request): string {
  return getAuthenticatedUser(req).id;
}
