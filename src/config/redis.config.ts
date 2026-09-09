import { Redis } from "ioredis";
import { environments } from "./enviroment.js";

export const redis = new Redis({
  host: environments.REDIS_HOST,
  port: environments.REDIS_PORT,
});

redis.on("connect", () => {
  console.log("redis connected");
});

redis.on("error", (err: Error) => {
  console.error("redis error:", err.message);
});

