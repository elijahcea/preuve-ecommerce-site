'use client'

import { ProductForDisplay } from "../lib/types";
import { useProductContext } from "./product-provider";
import VariantSelector from "./variant-selector";

export default function ProductDetail({ product }: { product: ProductForDisplay }) {
    const { state } = useProductContext();

    const getSelectedVariant = () => {
        if (product.variants.length === 0) return null;

        return product.variants.find(variant => {
            return variant.selectedOptions.every((selectedOption) => {
                const stateValue = state[selectedOption.name.toLowerCase()];
                return stateValue === selectedOption.value;
            });
        });
    };

    const checkAvailablity = () => {
        if (product.variants.length === 0) {
            // Product with no variants - check baseStock
            return product.baseStock > 0;
        } else {
            // Product with variants - check if a variant is selected and has stock
            return selectedVariant ? selectedVariant.stock > 0 : false;
        }
    }    

    const checkAllOptionsSelected = () => {
        if (product.options.length === 0) return true;
        
        return product.options.every(optionName => {
            return state[optionName.toLowerCase()] !== undefined;
        });
    };

    const selectedVariant = getSelectedVariant();
    const isAvailable = checkAvailablity();
    const allOptionsSelected = checkAllOptionsSelected();

  return (
        <div>
            <VariantSelector 
                options={product.optionsWithValues} 
                variants={product.variants} 
            />
            
            {/* Show price if variant is selected */}
            {selectedVariant && (
                <div className="my-4">
                    <p className="text-2xl font-bold">
                        ${(selectedVariant.price / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {selectedVariant.stock > 0 
                            ? `${selectedVariant.stock} in stock` 
                            : 'Out of stock'
                        }
                    </p>
                </div>
            )}
            
            {/* Show base price if no variant selected */}
            {!selectedVariant && (
                <div className="my-4">
                    <p className="text-2xl font-bold">
                        ${(product.basePrice / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {product.variants.length === 0 
                            ? `${product.baseStock} in stock` 
                            : 'Select options'
                        }
                    </p>
                </div>
            )}
            
            <button
                aria-disabled={!isAvailable || !allOptionsSelected}
                disabled={!isAvailable || !allOptionsSelected}
                className={`
                    w-full px-6 py-3 rounded-lg font-semibold transition-colors
                    ${isAvailable && allOptionsSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                `}
            >
                {!allOptionsSelected 
                    ? 'Please select all options'
                    : isAvailable 
                        ? 'Add to cart' 
                        : 'Out of stock'
                }
            </button>
        </div>
    );
}