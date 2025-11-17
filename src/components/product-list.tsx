import getProducts from "@/dal/product/queries";
import ProductCard from "./product-card";

export default async function ProductList() {
    const result = await getProducts({ pageSize: 20 });
    return (
        <ul>
            {result.products.map(p => {
                return <ProductCard
                    key={p.id}
                    product={p}
                />
                })
            }
        </ul>
    )
}