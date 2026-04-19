import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Debug 
console.log("REDIS_URL =", process.env.REDIS_URL);

const redis = createClient({
  url: process.env.REDIS_URL,
});

// Error handling
redis.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

// Connect function
const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.log("REDIS_URL missing in .env");
      return;
    }

    if (!redis.isOpen) {
      await redis.connect();
      console.log("Redis Connected Successfully");
    }
  } catch (err) {
    console.log("Redis Connection Failed:", err.message);
  }
};

// connect on startup
connectRedis();

export default redis;