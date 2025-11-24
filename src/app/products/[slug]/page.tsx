import ProductDetail from "@/src/components/product-detail";
import ProductProvider from "@/src/components/product-provider";
import { ProductDetailSkeleton } from "@/src/components/skeletons";
import { getProductForDisplay } from "@/src/dal/product/queries";
import { ProductForDisplay } from "@/src/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product: ProductForDisplay | null = await getProductForDisplay(slug);

    if (!product) {
      return notFound();
    }

    return (
        <ProductProvider>
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetail product={product}/>
            </Suspense>
        </ProductProvider>
    )
}