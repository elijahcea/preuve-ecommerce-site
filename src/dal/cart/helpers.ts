import { CartItem } from "@/src/lib/types";

export function calculateCartTotals(items: CartItem[]) {
  return items.reduce(
    (totals, curr) => {
      return {
        totalQuantity: totals.totalQuantity + curr.quantity,
        cost: {
          totalCost: totals.cost.totalCost + curr.totalCost,
          subtotalCost: totals.cost.subtotalCost + curr.totalCost,
          totalTaxAmount: 0,
        },
      };
    },
    {
      totalQuantity: 0,
      cost: { totalCost: 0, subtotalCost: 0, totalTaxAmount: 0 },
    },
  );
}

export function calculateItemCost(price: number, quantity: number) {
  return price * quantity;
}
