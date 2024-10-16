"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: String
    name: String
    email: String
    password: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
    createUser(name: String, email: String, password: String): User
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
  }
`;
exports.resolvers = {
// Query: {
//   users: async () => await prisma.user.findMany(),
//   user: async (parent: unknown, { id }: { id: string }) =>
//     await prisma.user.findUnique({ where: { id } }),
// },
// Mutation: {
//   createUser: async (_: any, args: UserInput) => {
//     await prisma.user
//       .create({
//         data: {
//           name: args.name,
//           email: args.email,
//           password: args.password,
//         },
//       })
//       .then(() => {
//         console.log("redis", args);
//         return args;
//       })
//       .catch((err) => {
//         console.log("erroris: ", err);
//         return err;
//       });
//     console.log("redis", args);
//     return await prisma.user.findUnique({ where: { email: args.email } });
// },
// },
};
