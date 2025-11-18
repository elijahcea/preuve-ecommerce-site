import { getProductBySlug } from "@/src/dal/product/queries";

export default async function ProductPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return <div>Product not found.</div>
    }

    return (
        <div>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.basePrice}</p>
        </div>
    )
}