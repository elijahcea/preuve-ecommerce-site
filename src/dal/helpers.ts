import "server-only";

import { SelectedOption, ProductVariant } from "@/src/lib/types";
import { ProductVariantRaw, ProductWithAllRelations } from "./product/queries";

export function createProductHref(
  productSlug: string,
  selectedOptions: SelectedOption[],
) {
  const searchParams = new URLSearchParams();
  for (const so of selectedOptions) {
    searchParams.set(so.name, so.value);
  }
  const queryString =
    selectedOptions.length === 0 ? "" : "?" + searchParams.toString();

  return `/products/${productSlug}` + queryString;
}

export function calculatePriceInDollars(price: number): number {
  return price / 100;
}

export function formatProduct(product: ProductWithAllRelations) {
  const optionsMap = new Map();

  product.productOptionValues.forEach((pov) => {
    const opt = pov.optionValue.option;
    if (!optionsMap.has(opt.name)) {
      optionsMap.set(opt.name, {
        name: opt.name,
        values: [],
      });
    }
    optionsMap.get(opt.name).values.push(pov.optionValue.name);
  });

  // Transform variants
  const transformedVariants: ProductVariant[] = product.variants.map(
    (variant) => {
      const selectedOptions: SelectedOption[] = variant.selectedOptions.map(
        (so) => ({
          name: so.optionValue.option.name,
          value: so.optionValue.name,
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
        name: product.name,
        sku: variant.sku,
        price: calculatePriceInDollars(variant.price),
        href: createProductHref(product.slug, selectedOptions),
        selectedOptions,
        ...image,
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
      alt: product.featuredImageAlt,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    collections: product.collections,
    options: Array.from(optionsMap.keys()),
    optionsWithValues: Array.from(optionsMap.values()),
    variants: transformedVariants,
  };
}

export function calculateProductPriceRange(variants: ProductVariantRaw[]) {
  const prices = variants.map((variant) => variant.price);

  return {
    minVariantPrice: Math.min(...prices),
    maxVariantPrice: Math.max(...prices),
  };
}
