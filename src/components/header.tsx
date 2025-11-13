import Link from "next/link"

export default function Header() {
    return (
        <header>
            <nav className="">
                <ul>
                    <Link href="/shop">
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
                    <Link href="/search">
                        SEARCH
                    </Link>
                    <Link href="/cart">
                        CART
                    </Link>
                </ul>
            </nav>
        </header>
    )
}