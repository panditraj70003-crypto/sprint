import { createClient } from "@supabase/supabase-js";
import type { RequestHandler } from "express";
import { env, supabaseApiKey } from "../config/env";
import { AppError } from "../errors/AppError";
import { asyncMiddleware } from "./async.middleware";

export const requireAuth: RequestHandler = asyncMiddleware(async (req, _res, next) => {
  const header = req.header("authorization");
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError("A bearer access token is required.", 401);

  const supabase = createClient(env.SUPABASE_URL, supabaseApiKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new AppError("Your session is invalid or expired.", 401);
  req.authUser = data.user;
  req.accessToken = token;
  next();
});
