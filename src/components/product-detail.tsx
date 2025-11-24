import { ProductForDisplay } from "../lib/types";
import VariantSelector from "./variant-selector";

export default function ProductDetail({ product }: { product: ProductForDisplay }) {
    return (
        <div>
            <VariantSelector options={product.optionsWithValues} variants={product.variants} />
        </div>
    )
}