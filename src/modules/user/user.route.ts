import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ message: "Non autorisé. Jeton JWT invalide." });
  }
}

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/",
    {
      preHandler: authenticate,
    },
    getUsersHandler
  );
}

export default userRoutes;
