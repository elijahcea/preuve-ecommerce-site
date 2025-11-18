import Link from "next/link"
import { Product } from "../../generated/prisma"

interface productCardProp {
    product: Product
}

export default function ProductCard({ product }: productCardProp) {
    return (
        <div>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
            <p>{product.basePrice}</p>
            <p>{product.description}</p>
        </div>
    )
}