import fastify from "fastify";
import jwt from "@fastify/jwt";

import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";

export const server = fastify();

server.register(jwt, {
  secret: "ndkandnan78duy9sau87dbndsa89u7dsy789adb",
});

server.get("/healthcheck", async function () {
  return { status: "ok" };
});

async function startServer() {
  try {
    // Add schemas
    const schemasToAdd = [...userSchemas, ...productSchemas];
    for (const schema of schemasToAdd) {
      server.addSchema(schema);
    }

    server.register(userRoutes, { prefix: "api/users" });
    // server.register(productRoutes, { prefix: "api/products" });

    // Start the server
    await server.listen(3000);
    console.log("Server is running");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
