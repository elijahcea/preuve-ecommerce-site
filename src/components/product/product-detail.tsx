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
    if (!product.options.length) return undefined;
    if (product.options.length === 1 && product.options[0].values.length <= 1) {
      return product.variants.find((variant) => {
        return variant.selectedValues.every((value) => {
          const optionValue = product.options[0].values.find(
            (val) => value.id === val.id,
          );
          return optionValue;
        });
      });
    }
    return product.variants.find((variant) => {
      if (variant.selectedValues.length !== product.options.length)
        return undefined;
      return variant.selectedValues.every((val) => {
        const stateValue = state[val.optionName.toLowerCase()];
        return stateValue === val.name.toLowerCase();
      });
    });
  };

  const selectedVariant = getSelectedVariant();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start max-h-full">
      {product.featuredImage?.url ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          loading="lazy"
          height={750}
          width={600}
          style={{ width: "100%", height: "auto" }}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-4 justify-start p-4 md:sticky md:top-0 md:pt-5 md:pr-5">
        <div>
          <div className="flex align-middle justify-between">
            <h2 className="font-semibold text-xl">{product.title}</h2>
            <Price
              amount={
                selectedVariant
                  ? selectedVariant.price
                  : product.priceRange.minVariantPrice
              }
              styles={["text-foreground/50"]}
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
