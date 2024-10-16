"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = require("./../utils/APIError");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("./graphql");
const graphql_2 = require("graphql");
const connectDB_1 = __importDefault(require("./config/connectDB"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const walletsRoute_1 = __importDefault(require("./routes/walletsRoute"));
const ErrorMiddleware_1 = require("./middlewares/ErrorMiddleware");
const redis_1 = __importDefault(require("./../utils/redis"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
dotenv_1.default.config();
(0, connectDB_1.default)();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(loggerMiddleware_1.default);
// Swagger
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// run apollo server with graphql and rest api
(() => __awaiter(void 0, void 0, void 0, function* () {
    const serverApollo = new apollo_server_express_1.ApolloServer({
        typeDefs: (0, graphql_2.print)(graphql_1.typeDefs),
        resolvers: graphql_1.resolvers,
        introspection: true,
    });
    yield serverApollo.start();
    serverApollo.applyMiddleware({ app: app, path: "/api" });
    console.log(`��� Server ready at http://localhost:${PORT}${serverApollo.graphqlPath}`);
}))();
// Connect to Redis
redis_1.default.connect();
// Routes
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/users", usersRoute_1.default);
app.use("/api/v1/wallets", walletsRoute_1.default);
// Error Api
app.use("*", (req, res, next) => {
    next(new APIError_1.ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});
// global error handling midleware
app.use(ErrorMiddleware_1.globalErrorMiddleware);
// run listen
const server = app.listen(5000, () => {
    console.log("listening on port 5000");
});
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
    console.log(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("Shutting down...");
        process.exit(1);
    });
});
