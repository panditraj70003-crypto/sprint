import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import mongoose from "mongoose";

let server: ReturnType<typeof app.listen> | undefined;

async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, () => {
    console.info(`SkillBridge API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
  server.on("error", error => {
    const serverError = error as NodeJS.ErrnoException;
    if (serverError.code === "EADDRINUSE") {
      console.error(`Port ${env.PORT} is already in use. Stop the other backend process or configure a different PORT in backend/.env.`);
    } else {
      console.error("The backend HTTP server failed to start.", error);
    }
    void mongoose.disconnect().finally(() => process.exit(1));
  });
}

void start().catch(error => {
  console.error("Backend startup failed.", error);
  process.exit(1);
});

function shutdown(signal: string) {
  console.info(`${signal} received. Closing HTTP server.`);
  server?.close(error => {
    if (error) {
      console.error("Failed to close HTTP server cleanly.", error);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
