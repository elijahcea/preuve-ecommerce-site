import { Suspense } from "react"
import ProductCard from "@/src/components/product/product-card";
import { CollectionPageSkeleton } from "@/src/components/skeletons"
import { getCollectionProducts } from "@/src/dal/product/queries"

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const result = await getCollectionProducts({ collectionSlug: slug });
    if (!result) throw new Error("Collection not found.");

    const { collection, formattedProducts, nextCursor } = result;

    return (
        <>
            <Suspense fallback={ <CollectionPageSkeleton /> }>
                <div className="flex justify-between gap-2 p-3 align-middle border-b-[#e5e5e5] border-b">
                    <div className="flex flex-col">
                        <h2>{collection.title}</h2>
                        {collection.description ? <p className="text-xs">{collection.description}</p> : <></>}
                    </div>
                    <div className="flex gap-2">
                        <button className="cursor-pointer">Sort</button>
                        <button className="cursor-pointer">Filter</button>
                    </div>
                </div>
                    <ul className="grid grid-cols-4 auto-rows-auto gap-7 pt-3 pb-3 pl-6 pr-6">
                        {formattedProducts.map(product => {
                            return <ProductCard key={product.id} product={product} />
                        })}
                    </ul>    
            </Suspense>
        </>
    )
}