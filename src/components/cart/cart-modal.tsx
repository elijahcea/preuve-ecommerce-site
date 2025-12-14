'use client'

import { useEffect } from "react";
import { useCartContext } from "@/src/contexts/cart-provider";
import { createCartAndSetCookie } from "@/src/actions/cart"

export default function CartModal() {
    const { cart } = useCartContext();

    useEffect(() => {
        if (!cart) {
            createCartAndSetCookie();
        }
    }, [cart]);

    return (
        <>
            {cart?.cost.totalCost}
            {cart?.items.map(item => {
                return (
                    <div key={item.id}>
                        {item.merchandise.name}
                        {item.quantity}
                        {item.merchandise.price}
                    </div>                
                )
                
            })}
        </>
    )
}