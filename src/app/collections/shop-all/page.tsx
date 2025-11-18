import { Suspense } from "react"
import ProductList from "@/src/components/product-list"
import ProductListSkeleton from "@/src/components/skeletons"

export default async function ShopAll() {
    return (
        <>
            <Suspense fallback={ <ProductListSkeleton /> }>
                <ProductList />
            </Suspense>
        </>
    )
}