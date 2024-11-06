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
import staffsRoute from "./routes/staffRoute";
import permissionsRoute from "./routes/permissionsRoute";
import usersRoute from "./routes/usersRoute";
import TransactionsRoute from "./routes/transactionsRoute";
import availabilitysRoute from "./routes/availabilityRoute";
import ticketsRoute from "./routes/ticketsRoute";
import consultantsRoute from "./routes/consultantsRoute";
import walletsRoute from "./routes/walletsRoute";
import bookingRoute from "./routes/bookingsRoute";
import reviewsRoute from "./routes/reviewsRoute";
import paymentRoute from "./routes/paymentRoute";
import { globalErrorMiddleware } from "./middlewares/ErrorMiddleware";
import redisClient from "./../utils/redis";
import logger from "./middlewares/loggerMiddleware";

dotenv.config();

connectDB();
const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// run apollo server with graphql and rest api
// (async () => {
//   const serverApollo = new ApolloServer({
//     typeDefs: print(typeDefs),
//     resolvers: resolvers,
//     introspection: true,
//   });
//   await serverApollo.start();
//   serverApollo.applyMiddleware({ app: app as any, path: "/api" });
//   console.log(
//     `��� Server ready at http://localhost:${PORT}${serverApollo.graphqlPath}`
//   );
// })();

// Connect to Redis
redisClient.connect();

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/staffs", staffsRoute);
app.use("/api/v1/permissions", permissionsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/wallets", walletsRoute);
app.use("/api/v1/transactions", TransactionsRoute);
app.use("/api/v1/availability", availabilitysRoute);
app.use("/api/v1/tickets", ticketsRoute);
app.use("/api/v1/consultants", consultantsRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/reviews", reviewsRoute);
app.use("/api/v1/payment", paymentRoute);

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
