import {
  ProductOption,
  Product,
  ProductVariant,
  SelectedOption,
  ProductCreateInput,
} from "@/src/lib/types";
import { calculatePriceInDollars } from "../utils";
import { includeProductAllRelations } from "./prismaTypes";
import { Prisma } from "@/src/generated/prisma/client";

export function formatProduct(
  product: Prisma.ProductGetPayload<{
    include: typeof includeProductAllRelations;
  }>,
): Product {
  const options: ProductOption[] = product.options.map((option) => {
    return {
      id: option.id,
      position: option.position,
      name: option.name,
      values: option.values.map((value) => ({
        id: value.id,
        position: value.position,
        name: value.name,
        optionId: value.productOptionId,
      })),
    };
  });

  const transformedVariants: ProductVariant[] = product.variants.map(
    (variant) => {
      const selectedOptions: SelectedOption[] = variant.selectedValues.map(
        (value) => ({
          name: value.productOption.name,
          value: value.name,
          optionValueId: value.id,
        }),
      );

      return {
        id: variant.id,
        sku: variant.sku,
        productTitle: product.title,
        price: calculatePriceInDollars(variant.price),
        inventoryQuantity: variant.inventoryQuantity,
        image: {
          url: variant.imageUrl,
          altText: variant.imageAlt,
        },
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
    title: product.title,
    priceRange: calculateProductPriceRange(product.variants),
    hasOnlyDefaultVariant: product.hasOnlyDefaultVariant,
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

export function calculateProductPriceRange(
  variants: Prisma.ProductVariantGetPayload<null>[],
) {
  const prices = variants.map((variant) =>
    calculatePriceInDollars(variant.price),
  );

  return {
    minVariantPrice: Math.min(...prices),
    maxVariantPrice: Math.max(...prices),
  };
}

export function checkHasOnlyDefaultVariant(productInput: ProductCreateInput) {
  if (productInput.product.options.length > 1) {
    return false;
  } else if (
    productInput.product.options[0].name === "Title" &&
    productInput.product.variants[0].optionValues[0].name === "Default Title"
  ) {
    return true;
  } else return false;
}
