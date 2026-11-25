import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    res.status(409).json({ error: { message: "This record already exists.", code: "DUPLICATE_RECORD" } });
    return;
  }
  if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
    res.status(400).json({ error: { message: "Request body contains invalid JSON.", code: "INVALID_JSON" } });
    return;
  }
  if (error instanceof ZodError) {
    res.status(400).json({
      error: { message: "Request validation failed.", code: "VALIDATION_ERROR", details: error.flatten().fieldErrors },
    });
    return;
  }

  const appError = error instanceof AppError ? error : new AppError("An unexpected error occurred.", 500, false);
  if (!appError.isOperational || env.NODE_ENV !== "production") {
    console.error(error);
  }
  res.status(appError.statusCode).json({
    error: {
      message: appError.isOperational ? appError.message : "An unexpected error occurred.",
      code: appError.isOperational ? appError.code : "INTERNAL_SERVER_ERROR",
    },
  });
};
