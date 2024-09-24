import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

await redisClient.connect(); 

export default redisClient;
