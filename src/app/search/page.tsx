import SearchBar from "@/src/components/search/search-bar";
import { searchProducts } from "@/src/dal/product/queries";
import { Suspense } from "react";
import { CollectionPageSkeleton } from "@/src/components/skeletons";
import ProductCard from "@/src/components/product/product-card";

export default async function Search({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { q } = await searchParams;

    if (!q) return (
        <div className="flex flex-col items-center pt-5 gap-5">
            <h1 className="font-semibold">Search</h1>
            <SearchBar placeholder="Search our store" />
            <p>Results (0)</p>
        </div>
    )

    const results = await searchProducts(q.toString());

    return (
       <div className="flex flex-col items-center pt-5 gap-5">
            <h1 className="font-semibold">{`Your search for "${q}" revealed the following:`}</h1>
            <SearchBar placeholder="Search our store" />
            <p>Results {`(${results?.length || 0})`}</p>
            <Suspense fallback={ <CollectionPageSkeleton /> }>
                <div className="flex justify-between gap-2 p-3 align-middle border-b-[#e5e5e5] border-b">
                    <div className="flex gap-2">
                        <button className="cursor-pointer">Sort</button>
                        <button className="cursor-pointer">Filter</button>
                    </div>
                </div>
                    <ul className="grid grid-cols-4 auto-rows-auto gap-7 pt-3 pb-3 pl-6 pr-6">
                        {results?.map(product => {
                            return <ProductCard key={product.id} product={product} />
                        })}
                    </ul>    
            </Suspense>
        </div>
    )
}