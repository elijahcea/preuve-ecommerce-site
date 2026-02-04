"use server";

import { cookies } from "next/headers";
import { CartItem } from "../lib/types";
import { ItemAction } from "../contexts/cart-provider";
import {
  createCart,
  addCartItem,
  removeCartItem,
  updateCartItem,
} from "../dal/cart/mutations";

export async function createCartAndSetCookie() {
  const cart = await createCart();
  if (!cart.id) {
    throw new Error("Cart creation failed.");
  }
  (await cookies()).set("cartId", cart.id, { maxAge: 604800 });
}

export async function addItemAction(
  prevState: string | undefined,
  variantId: string | undefined,
) {
  if (!variantId) return "Please select a product variant.";

  const cartIdCookie = await (await cookies()).get("cartId");
  if (!cartIdCookie) return "Error adding item to cart.";

  try {
    await addCartItem(cartIdCookie.value.toString(), variantId);
  } catch (e) {
    return `Error adding item to cart: ${e}`;
  }
}

export async function updateItemAction(
  prevState: string | undefined,
  payload: {
    item: CartItem;
    action: ItemAction;
  },
) {
  const { item, action } = payload;
  const cartIdCookie = await (await cookies()).get("cartId");
  if (!cartIdCookie) return "Error updating cart.";

  const cartId = cartIdCookie.value.toString();

  try {
    if (action === "delete") {
      await removeCartItem(cartId, item.merchandise.variantId);
      return;
    }

    const newQuantity =
      action === "plus" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity <= 0) {
      await removeCartItem(cartId, item.merchandise.variantId);
      return;
    }

    await updateCartItem(cartId, item.merchandise.variantId, action);
  } catch (e) {
    return `Error updating cart: ${e}`;
  }
}
