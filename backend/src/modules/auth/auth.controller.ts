import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { login, logout, refresh, register } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.schema";

export const registerAccount: RequestHandler = async (req, res) => {
  const result = await register(req.body as RegisterInput);
  res.status(201).json(result);
};

export const loginAccount: RequestHandler = async (req, res) => {
  const session = await login(req.body as LoginInput);
  res.status(200).json({ session });
};

export const refreshSession: RequestHandler = async (req, res) => {
  const { refresh_token } = req.body as { refresh_token: string };
  const session = await refresh(refresh_token);
  res.status(200).json({ session });
};

export const logoutAccount: RequestHandler = async (req, res) => {
  if (!req.authUser) throw new AppError("Authentication required.", 401);
  const { refresh_token } = req.body as { refresh_token: string };
  await logout(req.authUser.id, refresh_token);
  res.status(204).end();
};
