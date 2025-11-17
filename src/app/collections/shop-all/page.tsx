import { Suspense } from "react"
import ProductList from "@/components/product-list"
import ProductListSkeleton from "../../products/loading"

export default async function ShopAll() {
    return (
        <>
            <Suspense fallback={ <ProductListSkeleton /> }>
                <ProductList />
            </Suspense>
        </>
    )
}