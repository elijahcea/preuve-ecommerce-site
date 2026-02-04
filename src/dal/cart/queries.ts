import "server-only";

import prisma from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";
import { Cart, CartItem, SelectedOption } from "@/src/lib/types";
import { cookies } from "next/headers";
import { calculateCartTotals, calculateItemCost } from "./helpers";
import { calculatePriceInDollars, createProductHref } from "@/src/dal/helpers";

const selectCartWithItems = {
  id: true,
  items: {
    select: {
      id: true,
      quantity: true,
      productVariant: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
          optionValues: {
            include: {
              productOption: {
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
      const price = calculatePriceInDollars(item.productVariant.price);
      const selectedOptions: SelectedOption[] =
        item.productVariant.optionValues.map((optionValue) => {
          return {
            name: optionValue.productOption.name,
            value: optionValue.name,
            optionValue: {
              id: optionValue.name,
              position: optionValue.position,
              name: optionValue.name,
              optionId: optionValue.productOptionId,
            },
          };
        });

      return {
        id: item.id,
        totalCost: calculateItemCost(price, item.quantity),
        quantity: item.quantity,
        merchandise: {
          variantId: item.productVariant.id,
          productName: item.productVariant.product.name,
          sku: item.productVariant.sku,
          price: price,
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
