import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { profileRouter } from "./modules/profiles/profile.routes";
import { authRouter } from "./modules/auth/auth.routes";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: false }));
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", profileRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);
