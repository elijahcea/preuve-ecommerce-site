import { Product } from "../../generated/prisma"

interface productCardProp {
    product: Product
}

export default function ProductCard({ product }: productCardProp) {
    return (
        <div>
            <p>{product.name}</p>
            <p>{product.basePrice}</p>
            <p>{product.description}</p>
        </div>
    )
}