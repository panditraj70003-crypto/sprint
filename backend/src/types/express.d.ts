import type { AuthUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      accessToken?: string;
    }
  }
}

export {};
