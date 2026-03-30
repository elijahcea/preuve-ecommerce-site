import {
  ProductOption,
  Product,
  ProductVariant,
  ProductCreateDTO,
  ProductOptionValue,
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
        optionName: option.name,
        optionId: value.productOptionId,
      })),
    };
  });

  const transformedVariants: ProductVariant[] = product.variants.map(
    (variant) => {
      const selectedValues: ProductOptionValue[] = variant.selectedValues.map(
        (value) => ({
          id: value.id,
          position: value.position,
          name: value.name,
          optionName: value.productOption.name,
          optionId: value.productOptionId,
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
        href: createProductHref(product.slug, selectedValues),
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
        selectedValues,
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

export function formatProductPreview(
  product: Prisma.ProductGetPayload<{ include: { variants: true } }>,
) {
  return {
    id: product.id,
    slug: product.slug,
    status: product.status,
    title: product.title,
    priceRange: calculateProductPriceRange(product.variants),
    description: product.description,
    hasOnlyDefaultVariant: product.hasOnlyDefaultVariant,
    featuredImage: {
      url: product.featuredImageURL,
      altText: product.featuredImageAlt,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function createProductHref(
  productSlug: string,
  selectedValues: ProductOptionValue[],
) {
  const searchParams = new URLSearchParams();
  for (const ov of selectedValues) {
    searchParams.set(ov.optionName.toLowerCase(), ov.name.toLowerCase());
  }
  const queryString =
    selectedValues.length === 0 ? "" : "?" + searchParams.toString();

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

export function checkHasOnlyDefaultVariant(input: ProductCreateDTO) {
  if (input.options.length > 1) {
    return false;
  } else if (
    input.options[0].name === "Title" &&
    input.variants[0].selectedValues[0].name === "Default Title"
  ) {
    return true;
  } else return false;
}

export function validateProductCreatePayload(input: ProductCreateDTO) {
  const { options, variants } = input;
  if (options.length) {
    for (const variant of variants) {
      if (options.length !== variant.selectedValues.length)
        throw new Error(
          `Product has ${options.length} option but there were ${variant.selectedValues.length} provided option values for the variant.`,
        );

      variant.selectedValues.forEach((ov) => {
        const option = options.find((option) => ov.optionName === option.name);
        const optionValue = option?.values.find((val) => ov.name === val.name);

        if (!optionValue) {
          throw new Error(
            `Option value ${ov.name} does not exist for option ${ov.optionName}`,
          );
        }

        const uniqueOptionNames = new Set();
        if (uniqueOptionNames.has(ov.optionName)) {
          throw new Error(
            "Cannot create product variant with more than one value for the same option.",
          );
        }
        uniqueOptionNames.add(ov.optionName);
      });
    }
  }
}
