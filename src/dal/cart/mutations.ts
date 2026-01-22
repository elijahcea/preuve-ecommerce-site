import "server-only";

import prisma from "@/src/lib/prisma";
import { ProductVariant } from "@/src/lib/types";

export async function createCart() {
  const cart = await prisma.cart.create({ data: {} });
  return cart;
}

export async function addCartItem(cartId: string, variantId: string) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cartId,
      productVariantId: variantId,
    },
  });

  if (!existingItem) {
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productVariantId: variantId,
        quantity: 1,
      },
    });
    return newItem;
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: existingItem.id,
    },
    data: {
      quantity: {
        increment: 1,
      },
    },
  });

  return updatedItem;
}

export async function removeCartItem(cartId: string, variantId: string) {
  const item = await prisma.cartItem.findFirst({
    where: {
      cartId: cartId,
      productVariantId: variantId,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  await prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });
}

export async function updateCartItem(
  cartId: string,
  variantId: string,
  action: "plus" | "minus",
) {
  const item = await prisma.cartItem.findFirst({
    where: {
      cartId: cartId,
      productVariantId: variantId,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: item.id,
    },
    data: {
      quantity: action === "plus" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedItem;
}
