import ProductDetail from "@/src/components/product/product-detail";
import ProductProvider from "@/src/contexts/product-provider";
import { getProduct } from "@/src/dal/product/queries";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct({ slug });

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <ProductProvider>
        <ProductDetail product={product} />
      </ProductProvider>
    </main>
  );
}
