import Link from "next/link"
import SearchBar from "@/src/components/search-bar"
import CartModal from "@/src/components/cart/cart-modal"

export default function Header() {
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
                    <CartModal />
                </ul>
            </nav>
        </header>
    )
}