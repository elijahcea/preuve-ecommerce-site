'use client'

import { Product } from "../../lib/types";
import { useProductContext } from "../../contexts/product-provider";
import VariantSelector from "./variant-selector";
import AddToCartBtn from "../cart/add-to-cart-btn";

export default function ProductDetail({ product }: { product: Product }) {
    const { state } = useProductContext();

    const getSelectedVariant = () => {
        return product.variants.find(variant => {
            return variant.selectedOptions.every((selectedOption) => {
                const stateValue = state[selectedOption.name.toLowerCase()];
                return stateValue === selectedOption.value;
            });
        });
    }; 

    const checkAllOptionsSelected = () => {
        if (product.options.length === 0) return true;
        
        return product.options.every(optionName => {
            return state[optionName.toLowerCase()] !== undefined;
        });
    };

    const selectedVariant = getSelectedVariant();

  return (
        <div>
            <VariantSelector 
                options={product.optionsWithValues} 
                variants={product.variants} 
            />
            
            {selectedVariant?.isAvailableForSale && (
                <div className="my-4">
                    <p className="text-2xl font-bold">
                        ${(selectedVariant.price / 100).toFixed(2)}
                    </p>
                </div>
            )}
            
            <AddToCartBtn variant={selectedVariant} product={product} />
        </div>
    );
}