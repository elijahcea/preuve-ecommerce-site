"use client";

import { createContext, use, useContext, useState } from "react";
import { Cart, CartItem, Product, ProductVariant } from "../lib/types";

type CartContextType = {
  cart: Cart | undefined;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItem: (merchandiseId: string, action: ItemAction) => void;
};

export type ItemAction = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: { variant: ProductVariant; product: Product };
    }
  | {
      type: "UPDATE_CART";
      payload: { merchandiseId: string; action: ItemAction };
    };

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    id: undefined,
    items: [],
    totalQuantity: 0,
    cost: {
      totalCost: 0,
      subtotalCost: 0,
      totalTaxAmount: 0,
    },
  };
}

function createNewItem(variant: ProductVariant, product: Product): CartItem {
  return {
    id: undefined,
    totalCost: variant.price,
    quantity: 1,
    merchandise: {
      id: variant.id,
      name: product.name,
      sku: variant.sku,
      price: variant.price,
      isAvailableForSale: variant.isAvailableForSale,
      image: variant.image,
      href: variant.href,
      selectedOptions: variant.selectedOptions,
    },
  };
}

function calculateItemCost(price: number, quantity: number) {
  return price * quantity;
}

function updateCartItem(item: CartItem, action: ItemAction): CartItem | null {
  if (action === "delete") return null;

  const newQuantity = action === "plus" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity <= 0) return null;

  return {
    id: item.id,
    totalCost: calculateItemCost(item.merchandise.price, newQuantity),
    quantity: newQuantity,
    merchandise: item.merchandise,
  };
}

function calculateCartCostAndQuantity(items: CartItem[]) {
  return items.reduce(
    (totals, item) => {
      return {
        totalQuantity: totals.totalQuantity + item.quantity,
        cost: {
          totalCost: totals.cost.totalCost + item.totalCost,
          subtotalCost: totals.cost.subtotalCost + item.totalCost,
          totalTaxAmount: 0, // To do, add tax amounts
        },
      };
    },
    {
      totalQuantity: 0,
      cost: { totalCost: 0, subtotalCost: 0, totalTaxAmount: 0 },
    },
  );
}

function updateCart(cartState: Cart | undefined, cartAction: CartAction): Cart {
  const cart = cartState || createEmptyCart();

  switch (cartAction.type) {
    case "ADD_TO_CART": {
      const { variant, product } = cartAction.payload;
      const existingItem = cart.items.find(
        (item) => item.merchandise.id === variant.id,
      );

      if (!existingItem) {
        const newItem = createNewItem(variant, product);
        const updatedItems = [...cart.items, newItem];
        return {
          ...cart,
          ...calculateCartCostAndQuantity(updatedItems),
          items: updatedItems,
        };
      }

      const updatedItems = cart.items.map((item) =>
        item.merchandise.id === existingItem.merchandise.id
          ? updateCartItem(existingItem, "plus")
          : item,
      ) as CartItem[];
      return {
        ...cart,
        ...calculateCartCostAndQuantity(updatedItems),
        items: updatedItems,
      };
    }
    case "UPDATE_CART": {
      const { merchandiseId, action } = cartAction.payload;
      const newItems = cart.items
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, action)
            : item,
        )
        .filter(Boolean) as CartItem[];
      if (newItems.length === 0) {
        return {
          id: cart.id,
          items: [],
          totalQuantity: 0,
          cost: {
            totalCost: 0,
            subtotalCost: 0,
            totalTaxAmount: 0,
          },
        };
      }

      return {
        ...cart,
        ...calculateCartCostAndQuantity(newItems),
        items: newItems,
      };
    }
    default:
      return cart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [cart, setCart] = useState(initialCart);

  const addCartItem = (variant: ProductVariant, product: Product) => {
    const updatedCart = updateCart(cart, {
      type: "ADD_TO_CART",
      payload: { variant, product },
    });
    setCart(updatedCart);
  };

  const updateCartItem = (merchandiseId: string, action: ItemAction) => {
    const updatedCart = updateCart(cart, {
      type: "UPDATE_CART",
      payload: { merchandiseId, action },
    });
    setCart(updatedCart);
  };

  const context: CartContextType = {
    cart: cart,
    addCartItem,
    updateCartItem,
  };

  return (
    <CartContext.Provider value={context}>{children}</CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
