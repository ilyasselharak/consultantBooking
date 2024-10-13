import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../swagger.json";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql";
import { print } from "graphql";
import connectDB from "./config/connectDB"
import authRoute from "./routes/authRoute";
import userRoute from "./routes/users";
dotenv.config();





connectDB()
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

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRoute)

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
