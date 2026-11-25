import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.info(`SkillBridge API listening on port ${env.PORT} (${env.NODE_ENV})`);
});

function shutdown(signal: string) {
  console.info(`${signal} received. Closing HTTP server.`);
  server.close(error => {
    if (error) {
      console.error("Failed to close HTTP server cleanly.", error);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
