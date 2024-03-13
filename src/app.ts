import fastify, { FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { version } from "../package.json";

export const server = fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
  // interface FastifyRequest {
  //   user: { email: string; id: number };
  // }
  // export interface FastifyInstance {
  //   authenticate: (
  //     req: FastifyRequest,
  //     rep: FastifyReply
  //   ) => Promise<{ email: string; id: number } | undefined>;
  // }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: { email: string; name: string; id: number };
  }
}

server.register(jwt, {
  secret: "ndkandnan78duy9sau87dbndsa89u7dsy789adb",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply
        .code(401)
        .send({ message: "Non autorisé. Jeton JWT invalide." });
    }
  }
);

server.get("/healthcheck", async function () {
  return { status: "ok" };
});

async function startServer() {
  try {
    // Add schemas
    for (const schema of [...userSchemas, ...productSchemas]) {
      server.addSchema(schema);
    }

    // server.register(
    //   swagger,
    //   withRefResolver({
    //     routePrefix: "/docs",
    //     exposeRoute: true,
    //     staticCSP: true,
    //     openapi: {
    //       info: {
    //         title: "Fastify API",
    //         description: "API for some products",
    //         version,
    //       },
    //     },
    //   })
    // );
    server.register(userRoutes, { prefix: "api/users" });
    server.register(productRoutes, { prefix: "api/products" });

    // Start the server
    await server.listen(3000);
    console.log("Server is running");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
