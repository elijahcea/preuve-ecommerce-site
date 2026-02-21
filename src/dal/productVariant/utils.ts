import { Prisma } from "@/src/generated/prisma/client";
import { ProductVariant, SelectedOption } from "@/src/lib/types";
import { calculatePriceInDollars } from "../utils";
import { createProductHref } from "../product/utils";
import { includeProductVariantWithOptionValues } from "./prismaTypes";

export function formatVariant(
  productTitle: string,
  productSlug: string,
  variant: Prisma.ProductVariantGetPayload<{
    include: typeof includeProductVariantWithOptionValues;
  }>,
): ProductVariant {
  const selectedOptions: SelectedOption[] = variant.selectedValues.map(
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
    productTitle,
    price: calculatePriceInDollars(variant.price),
    inventoryQuantity: variant.inventoryQuantity,
    ...image,
    href: createProductHref(productSlug, selectedOptions),
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
    selectedOptions,
  };
}
