import Redis from "ioredis";
import { config } from "./index";

const redis = new Redis({
  host: config.redisHost || "localhost",
  port: Number(config.redisPort) || 6379, 
  password: config.redisPassword || 'MyStrongPass@123',
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
