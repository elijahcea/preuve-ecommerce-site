import { addItemAction } from "@/src/actions/cart";
import { useCartContext } from "@/src/contexts/cart-provider";
import { Product, ProductVariant } from "@/src/lib/types";
import { useActionState } from "react";

export default function AddToCartBtn({ variant, product }: { variant: ProductVariant | undefined, product: Product }) {
    const { addCartItem } = useCartContext();
    const [message, formAction, isPending] = useActionState(addItemAction, undefined);

    return (
        <form action={async () => {
            if (!variant) return;
            await formAction(variant);
            addCartItem(variant, product);
        }}>
            <button
                aria-disabled={!variant?.isAvailableForSale}
                disabled={!variant?.isAvailableForSale}
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
                        ? (isPending ? "Adding to cart..." : "Add to cart")
                        : "Out of stock"
                }
            </button>
            {message && (
                <p>{message}</p>
            )}
        </form>

    )
}