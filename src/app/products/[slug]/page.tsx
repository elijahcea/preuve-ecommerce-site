import ProductDetail from "@/src/components/product/product-detail";
import ProductProvider from "@/src/contexts/product-provider";
import { ProductDetailSkeleton } from "@/src/components/skeletons";
import { getProduct } from "@/src/dal/product/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
    <ProductProvider>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>
    </ProductProvider>
  );
}
