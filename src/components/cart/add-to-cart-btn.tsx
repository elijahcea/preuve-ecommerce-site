"use client";

import { addItemAction } from "@/src/actions/cart";
import { useCartContext } from "@/src/contexts/cart-provider";
import { Product, ProductVariant } from "@/src/lib/types";
import { useActionState } from "react";
import LoadingSpinner from "../loading-spinner";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function AddToCartBtn({
  variant,
  product,
}: {
  variant: ProductVariant | undefined;
  product: Product;
}) {
  const { addCartItem } = useCartContext();
  const [message, formAction, isPending] = useActionState(
    addItemAction,
    undefined,
  );
  const addItem = formAction.bind(null, variant?.id);

  return (
    <form
      action={async () => {
        if (!variant) return;
        await addItem();
        addCartItem(variant, product);
      }}
    >
      <button
        aria-disabled={!variant?.isAvailableForSale || isPending}
        disabled={!variant?.isAvailableForSale || isPending}
        className={`
                    w-full px-6 py-3 rounded-xs font-semibold transition-opacity ease-in-out duration-250 text-white bg-foreground
                    ${
                      !variant?.isAvailableForSale || isPending
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:opacity-75"
                    }
                `}
        type="submit"
      >
        <span className="flex gap-2 items-center justify-center">
          <ShoppingBagIcon aria-hidden="true" className="size-5" />
          {!variant ? (
            "SELECT OPTIONS"
          ) : variant.isAvailableForSale ? (
            isPending ? (
              <LoadingSpinner />
            ) : (
              "ADD TO CART"
            )
          ) : (
            "OUT OF STOCK"
          )}
        </span>
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
