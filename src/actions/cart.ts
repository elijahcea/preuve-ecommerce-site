'use server';

import { cookies } from "next/headers";
import { ProductVariant } from "../lib/types";
import { createCart, addCartItem } from "../dal/cart/mutations";

export async function createCartAndSetCookie() {
    const cart = await createCart();
    if (!cart.id) {
        throw new Error("Cart creation failed.");
    }
    (await cookies()).set("cartId", cart.id, { maxAge: 604800 });
}

export async function addItemAction(prevState: string | undefined, variant: ProductVariant) {
    if (!variant) return "Please select a product variant."

    const cartId = await (await cookies()).get("cartId");
    if (!cartId) return "Error adding item to cart."

    try {
        await addCartItem(cartId.value.toString(), variant);
    } catch (e) {
        return `Error adding item to cart: ${e}`
    }
}