import { updateItemAction } from "@/src/actions/cart";
import { ItemAction, useCartContext } from "@/src/contexts/cart-provider";
import { CartItem } from "@/src/lib/types";
import { useActionState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function EditItemQuantityBtn({
  item,
  action,
}: {
  item: CartItem;
  action: ItemAction;
}) {
  const { updateCartItem } = useCartContext();
  const [message, formAction, isPending] = useActionState(
    updateItemAction,
    undefined,
  );
  const updateItem = formAction.bind(null, { item, action });

  return (
    <form
      action={async () => {
        await updateItem();
        updateCartItem(item.merchandise.id, action);
      }}
    >
      <button
        aria-disabled={isPending}
        disabled={isPending}
        className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
      >
        {action === "delete" ? (
          <p>Remove</p>
        ) : action === "plus" ? (
          <PlusIcon className="size-4 text-gray-900" />
        ) : (
          <MinusIcon className="size-4 text-gray-900" />
        )}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
