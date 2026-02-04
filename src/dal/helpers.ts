import "server-only";

import {
  SelectedOption,
  ProductVariant,
  Product,
  ProductOption,
} from "@/src/lib/types";
import { ProductVariantRaw, ProductWithAllRelations } from "./product/queries";

export function createProductHref(
  productSlug: string,
  selectedOptions: SelectedOption[],
) {
  const searchParams = new URLSearchParams();
  for (const so of selectedOptions) {
    searchParams.set(so.name.toLowerCase(), so.value.toLowerCase());
  }
  const queryString =
    selectedOptions.length === 0 ? "" : "?" + searchParams.toString();

  return `/products/${productSlug}` + queryString;
}

export function calculatePriceInDollars(price: number): number {
  return price / 100;
}

export function formatProduct(product: ProductWithAllRelations): Product {
  const options: ProductOption[] = product.productOptions.map(
    (productOption) => {
      return {
        id: productOption.id,
        position: productOption.position,
        name: productOption.name,
        optionValues: productOption.optionValues.map((optionValue) => ({
          id: optionValue.id,
          position: optionValue.position,
          name: optionValue.name,
          optionId: optionValue.productOptionId,
        })),
      };
    },
  );

  // Transform variants
  const transformedVariants: ProductVariant[] = product.variants.map(
    (variant) => {
      const selectedOptions: SelectedOption[] = variant.optionValues.map(
        (optionValue) => ({
          name: optionValue.productOption.name,
          value: optionValue.name,
          optionValue: {
            id: optionValue.id,
            position: optionValue.position,
            name: optionValue.name,
            optionId: optionValue.productOptionId,
          },
        }),
      );

      const image = !variant.imageUrl
        ? {}
        : {
            image: {
              url: variant.imageUrl,
              altText: variant.imageAlt || "",
            },
          };

      return {
        id: variant.id,
        sku: variant.sku,
        productName: product.name,
        price: calculatePriceInDollars(variant.price),
        inventoryQuantity: variant.inventoryQuantity,
        ...image,
        href: createProductHref(product.slug, selectedOptions),
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
        selectedOptions,
      };
    },
  );

  return {
    id: product.id,
    slug: product.slug,
    status: product.status,
    name: product.name,
    priceRange: calculateProductPriceRange(product.variants),
    description: product.description,
    featuredImage: {
      url: product.featuredImageURL,
      altText: product.featuredImageAlt,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    collections: product.collections,
    options: options,
    variants: transformedVariants,
  };
}

export function calculateProductPriceRange(variants: ProductVariantRaw[]) {
  const prices = variants.map((variant) =>
    calculatePriceInDollars(variant.price),
  );

  return {
    minVariantPrice: Math.min(...prices),
    maxVariantPrice: Math.max(...prices),
  };
}
