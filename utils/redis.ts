import { createClient } from "redis";

const redisClient = createClient({
  password: "MLWfb0s2JDPoCqE1LoC8aDbhJ8QWSNQ3",
  socket: {
    host: "redis-13368.c281.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 13368,
  },
});

// Handle connection errors
redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});
// Connect to Redis
redisClient.on("connect", () => {
  console.log("Connected to Redis");

  // Test Redis operations
  // (async () => {
  //   try {
  //     await redisClient.set("key", "value");
  //     const value = await redisClient.get("key");

  //     if (value !== null) {
  //       console.log("Value:", value.toString());
  //     }
  //   } catch (error) {
  //     console.error("Error performing Redis operations:", error);
  //   } finally {
  //     // Close the Redis connection
  //     redisClient.quit();
  //   }
  // })();
});

export default redisClient;
