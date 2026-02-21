import "server-only";

import prisma from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";
import { Cart, CartItem, SelectedOption } from "@/src/lib/types";
import { cookies } from "next/headers";
import { calculateCartTotals, calculateItemCost } from "./utils";
import { calculatePriceInDollars } from "@/src/dal/utils";
import { createProductHref } from "../product/utils";

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
              title: true,
              slug: true,
            },
          },
          selectedValues: {
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
        item.productVariant.selectedValues.map((value) => {
          return {
            name: value.productOption.name,
            value: value.name,
            optionValueId: value.id,
          };
        });

      return {
        id: item.id,
        totalCost: calculateItemCost(price, item.quantity),
        quantity: item.quantity,
        merchandise: {
          variantId: item.productVariant.id,
          productTitle: item.productVariant.product.title,
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
