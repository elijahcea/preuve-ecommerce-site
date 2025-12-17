'use client';

import { addItemAction } from "@/src/actions/cart";
import { useCartContext } from "@/src/contexts/cart-provider";
import { Product, ProductVariant } from "@/src/lib/types";
import { useActionState } from "react";
import LoadingSpinner from "../loading-spinner";

export default function AddToCartBtn({ variant, product }: { variant: ProductVariant | undefined, product: Product }) {
    const { addCartItem } = useCartContext();
    const [message, formAction, isPending] = useActionState(addItemAction, undefined);
    const addItem = formAction.bind(null, variant?.id);

    return (
        <form action={async () => {
            if (!variant) return;
            await addItem();
            addCartItem(variant, product);
        }}>
            <button
                aria-disabled={!variant?.isAvailableForSale || isPending}
                disabled={!variant?.isAvailableForSale || isPending}
                className={`
                    w-full px-6 py-3 rounded-lg font-semibold transition-colors
                    ${variant?.isAvailableForSale
                        ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                `}
                type="submit"
            >
                {!variant 
                    ? "Please select all options"
                    : variant.isAvailableForSale
                        ? (isPending ? <LoadingSpinner /> : "Add to cart")
                        : "Out of stock"
                }
            </button>
            {message && (
                <p>{message}</p>
            )}
        </form>

    )
}