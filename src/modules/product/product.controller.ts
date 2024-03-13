import { FastifyReply, FastifyRequest } from "fastify";
import { createProduct, getProducts } from "./product.service";
import { CreateProductInput } from "./product.schema";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>
  // request: FastifyRequest<{
  //   Body: {
  //     title: string;
  //     price: number;
  //     content?: string | undefined;
  //   };
  // }>
) {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });
  return product;
}

export async function getProductsHandler() {
  const products = await getProducts();
  return products;
}
