'use client'

import Link from "next/link"
import SearchBar from "@/src/components/search-bar"
import CartModal from "@/src/components/cart/cart-modal"
import { useCartContext } from "../contexts/cart-provider"

export default function Header() {
    const { cart } = useCartContext();

    return (
        <header>
            <nav className="">
                <ul>
                    <Link href="/collections/shop-all">
                        SHOP
                    </Link>
                    <Link href="/lookbooks">
                        LOOKBOOKS
                    </Link>
                    <Link href="/about">
                        ABOUT
                    </Link>
                </ul>
            </nav>
            <nav>
                <ul>
                    <SearchBar />
                    <Link href="/account/login">
                        LOGIN
                    </Link>
                    <Link href="/cart">
                        CART 
                        {cart?.totalQuantity && (
                            <p>{cart?.totalQuantity}</p>
                        )}
                    </Link>
                </ul>
            </nav>
            <CartModal />
        </header>
    )
}