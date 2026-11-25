import type { Request, RequestHandler, Response, NextFunction } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => unknown;

export const asyncMiddleware = (controller: AsyncController): RequestHandler => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};
