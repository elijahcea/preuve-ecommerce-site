import "server-only";

import prisma from "@/src/lib/prisma";
import { ProductVariant } from "@/src/lib/types";

export async function createCart() {
    const cart = await prisma.cart.create({data: {}});
    return cart;
}

export async function addCartItem(cartId: string, variant: ProductVariant) {
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cartId,
            productVariantId: variant.id
        }
    })

    if (!existingItem) {
        const newItem = await prisma.cartItem.create({
            data: {
                cartId: cartId,
                productVariantId: variant.id,
                quantity: 1
            }
        })
        return newItem;
    }

    const updatedItem = await prisma.cartItem.update({
        where: {
            id: existingItem.id
        },
        data: {
            quantity: {
                increment: 1,
            }
        }
    })

    return updatedItem;
}