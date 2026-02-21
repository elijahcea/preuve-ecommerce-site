"use client";

import Image from "next/image";
import { Product } from "../../lib/types";
import { useProductContext } from "../../contexts/product-provider";
import VariantSelector from "./variant-selector";
import AddToCartBtn from "../cart/add-to-cart-btn";
import Price from "../price";

export default function ProductDetail({ product }: { product: Product }) {
  const { state } = useProductContext();

  const getSelectedVariant = () => {
    return product.variants.find((variant) => {
      return variant.selectedOptions.every((selectedOption) => {
        const stateValue = state[selectedOption.name.toLowerCase()];
        return stateValue === selectedOption.value.toLowerCase();
      });
    });
  };

  const selectedVariant = getSelectedVariant();
  return (
    <div className="grid grid-cols-2 gap-5 items-start">
      {product.featuredImage?.url ? (
        <div>
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            height={750}
            width={600}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-4 justify-start sticky top-0 pt-5 pr-5">
        <div>
          <div className="flex align-middle justify-between">
            <h2 className="font-semibold text-xl">{product.title}</h2>
            <Price
              amount={
                selectedVariant
                  ? selectedVariant.price
                  : product.priceRange.minVariantPrice
              }
            />
          </div>
          {product.description && (
            <p className="text-sm">{product.description}</p>
          )}
        </div>
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        <AddToCartBtn variant={selectedVariant} product={product} />
      </div>
    </div>
  );
}
