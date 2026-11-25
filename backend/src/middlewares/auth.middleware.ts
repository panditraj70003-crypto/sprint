import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RequestHandler } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { SessionModel } from "../modules/auth/session.model";
import { asyncMiddleware } from "./async.middleware";

export const requireAuth: RequestHandler = asyncMiddleware(async (req, _res, next) => {
  const header = req.header("authorization");
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError("A bearer access token is required.", 401);

  let payload: string | JwtPayload;
  try { payload = jwt.verify(token, env.JWT_ACCESS_SECRET); }
  catch { throw new AppError("Your session is invalid or expired.", 401); }
  if (typeof payload === "string" || typeof payload.sub !== "string" || typeof payload.sid !== "string" || payload.token_type !== "access") {
    throw new AppError("Your session is invalid or expired.", 401);
  }
  const activeSession = await SessionModel.exists({ _id: payload.sid, userId: payload.sub, revokedAt: null, expiresAt: { $gt: new Date() } });
  if (!activeSession) throw new AppError("Your session is invalid or expired.", 401);
  req.authUser = {
    id: payload.sub,
    email: typeof payload.email === "string" ? payload.email : "",
    user_metadata: { full_name: typeof payload.full_name === "string" ? payload.full_name : "" },
  };
  req.accessToken = token;
  next();
});
