import Link from "next/link"
import { Product } from "@/src/generated/prisma/client"

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
            <p>{product.basePrice}</p>
            <p>{product.description}</p>
        </div>
    )
}