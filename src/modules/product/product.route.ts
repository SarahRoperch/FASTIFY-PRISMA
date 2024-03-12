import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createProductHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ message: "Non autorisé. Jeton JWT invalide." });
  }
}
async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );
}

export default productRoutes;
