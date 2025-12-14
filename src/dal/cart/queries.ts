import "server-only";

import prisma from "@/src/lib/prisma";
import { Cart, CartItem } from "@/src/lib/types";
import { cookies } from "next/headers";
import { calculateCartTotals, calculateItemCost } from "./helpers";

export async function getCart(): Promise<Cart | undefined> {
    try {
        const cartId = (await cookies()).get('cartId')?.value;

        if (!cartId) {
            return undefined;
        }

        const res = await prisma.cart.findUnique({
            where: { id: cartId },
            select: {
                id: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                price: true,
                                isAvailableForSale: true,
                                imageUrl: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                },
                                selectedOptions: {
                                    select: {
                                        optionValue: {
                                            select: {
                                                name: true,
                                                option: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    }
                }
            }
        })

        if (!res) return undefined;

        const cartItems: CartItem[] = res.items.map(item => {
            return {
                id: item.id,
                totalCost: calculateItemCost(item.productVariant.price, item.quantity),
                quantity: item.quantity,
                merchandise: {
                    id: item.productVariant.id,
                    name: item.productVariant.product.name,
                    isAvailableForSale: item.productVariant.isAvailableForSale,
                    price: item.productVariant.price,
                    imageUrl: item.productVariant.imageUrl,
                    selectedOptions: item.productVariant.selectedOptions.map(so => {
                        return {
                            name: so.optionValue.option.name,
                            value: so.optionValue.name
                        }
                    })
                }
            }
        })

        const cart: Cart = {
            id: res.id,
            ...calculateCartTotals(cartItems),
            items: cartItems
        };

        return cart;
    } catch (e) {
        throw e;
    }
}