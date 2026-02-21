import { Prisma } from "@/src/generated/prisma/client";

export const createCartItemInputs = (
  cartId: string,
  productVariantId: string,
  quantity: number,
) => {
  return {
    cartId,
    productVariantId,
    quantity,
  } satisfies Prisma.CartItemCreateManyInput;
};
