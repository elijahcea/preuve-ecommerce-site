import { getProductBySlug } from "@/src/dal/product/queries";

export default async function ProductPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return (
        <p>This is a Product Slug page.</p>
    )
}