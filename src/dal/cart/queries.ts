import "server-only";

import prisma from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";
import { Cart, CartItem, SelectedOption } from "@/src/lib/types";
import { cookies } from "next/headers";
import { calculateCartTotals, calculateItemCost } from "./helpers";
import { createProductHref } from "@/src/dal/helpers";

const selectCartWithItems = {
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
          imageAlt: true,
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
          selectedOptions: {
            select: {
              optionValue: {
                select: {
                  name: true,
                  option: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartSelect;

export async function getCart(): Promise<Cart | undefined> {
  try {
    const cartId = (await cookies()).get("cartId")?.value;

    if (!cartId) {
      return undefined;
    }

    const res = await prisma.cart.findUnique({
      where: { id: cartId },
      select: selectCartWithItems,
    });

    if (!res) return undefined;

    const cartItems: CartItem[] = res.items.map((item) => {
      const selectedOptions: SelectedOption[] =
        item.productVariant.selectedOptions.map((so) => {
          return {
            name: so.optionValue.option.name,
            value: so.optionValue.name,
          };
        });

      return {
        id: item.id,
        totalCost: calculateItemCost(item.productVariant.price, item.quantity),
        quantity: item.quantity,
        merchandise: {
          id: item.productVariant.id,
          name: item.productVariant.product.name,
          sku: item.productVariant.sku,
          isAvailableForSale: item.productVariant.isAvailableForSale,
          price: item.productVariant.price,
          image: {
            url: item.productVariant.imageUrl,
            altText: item.productVariant.imageAlt,
          },
          href: createProductHref(
            item.productVariant.product.slug,
            selectedOptions,
          ),
          selectedOptions,
        },
      };
    });

    const cart: Cart = {
      id: res.id,
      ...calculateCartTotals(cartItems),
      items: cartItems,
    };

    return cart;
  } catch (e) {
    throw e;
  }
}
