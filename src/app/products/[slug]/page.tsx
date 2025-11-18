import { getProductBySlug } from "@/src/dal/product/queries";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return notFound();
    }

    return (
        <div>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.basePrice}</p>
        </div>
    )
}