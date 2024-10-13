import { createClient } from "redis";

const redisClient = createClient({
  url: "http://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});
(async () => {
  await redisClient.set("key", "value");
  const value = await redisClient.get("key");
  if (value !== null) {
    console.log("Value:", value.toString());
  }
  redisClient.quit();
})();
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
redisClient.on("end", () => {
  console.log("Disconnected from Redis");
});


export default redisClient