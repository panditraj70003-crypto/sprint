import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

let server: ReturnType<typeof app.listen> | undefined;

async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, () => {
    console.info(`SkillBridge API listening on port ${env.PORT} (${env.NODE_ENV})`);
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
