import { ApiError } from "./../utils/APIError";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../swagger.json";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql";
import { print } from "graphql";
import connectDB from "./config/connectDB";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/users";
import walletsRoute from "./routes/walletsRoute";
import { globalErrorMiddleware } from "./middlewares/ErrorMiddleware";
import redisClient from './../utils/redis';


dotenv.config();

connectDB();
const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// run apollo server with graphql and rest api
(async () => {
  const serverApollo = new ApolloServer({
    typeDefs: print(typeDefs),
    resolvers: resolvers,
    introspection: true,
  });
  await serverApollo.start();
  serverApollo.applyMiddleware({ app: app as any, path: "/api" });
  console.log(
    `��� Server ready at http://localhost:${PORT}${serverApollo.graphqlPath}`
  );
})();

// const redisClient = createClient({
//   username: "db-M27YH2A2",
//   password: "MLWfb0s2JDPoCqE1LoC8aDbhJ8QWSNQ3",
//   database: 0,
//   socket: {
//     host: "redis-13368.c281.us-east-1-2.ec2.redns.redis-cloud.com/db-M27YH2A2",
//     port: 13368,
//   },
// });

// // Handle connection errors
// redisClient.on("error", (err) => {
//   console.error("Error connecting to Redis:", err);
// });
// // Connect to Redis
// redisClient.on("connect", () => {
//   console.log("Connected to Redis");

//   // Test Redis operations
//   (async () => {
//     try {
//       await redisClient.set("key", "value");
//       const value = await redisClient.get("key");
//       if (value !== null) {
//         console.log("Value:", value.toString());
//       }
//     } catch (error) {
//       console.error("Error performing Redis operations:", error);
//     } finally {
//       // Close the Redis connection
//       redisClient.quit();
//     }
//   })();
// });

redisClient.connect();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/wallets", walletsRoute);

// Error Api
app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handling midleware
app.use(globalErrorMiddleware);

// run listen
const server = app.listen(5000, () => {
  console.log("listening on port 5000");
});

// Handle rejection outside express
process.on("unhandledRejection", (err: any) => {
  console.log(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
