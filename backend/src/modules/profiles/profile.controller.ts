import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { getOwnProfile, updateOwnProfile } from "./profile.service";
import type { ProfileUpdateInput } from "./profile.schema";

export const getMe: RequestHandler = async (req, res) => {
  if (!req.authUser || !req.accessToken) throw new AppError("Authentication required.", 401);
  const profile = await getOwnProfile(req.accessToken, req.authUser);
  res.status(200).json({ profile });
};

export const patchMe: RequestHandler = async (req, res) => {
  if (!req.authUser || !req.accessToken) throw new AppError("Authentication required.", 401);
  const profile = await updateOwnProfile(req.accessToken, req.authUser, req.body as ProfileUpdateInput);
  res.status(200).json({ profile });
};
