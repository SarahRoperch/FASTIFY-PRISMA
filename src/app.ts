import fastify from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const server = fastify();

server.get("/healthcheck", async function () {
  return { status: "ok" };
});

async function startServer() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });

  try {
    await server.listen(3000);

    console.log("Server is running");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
