import { Express } from "express";
import http from "http";
import { configDotenv } from "dotenv";
import app from "./config/express";
import { initRedis } from "./config/redis";
configDotenv();

async function main(app: Express): Promise<void> {
  const server = http.createServer(app);

  await initRedis();
  const PORT = process.env.PORT || 7000;
  const Env = process.env.NODE_ENV || "development";
  const isDevEnv = Env === "development" || Env === "test";
  console.log("Env", isDevEnv);
  if (isDevEnv) {
    server.on("listening", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
  server.listen(PORT);
}

main(app);
