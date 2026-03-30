import { Prisma } from "@/src/generated/prisma/client";
import {
  ProductOptionValue,
  VariantOptionValueCreateInput,
} from "@/src/lib/types";

export const includeProductVariantWithOptionValues = {
  selectedValues: {
    include: {
      productOption: true,
    },
  },
} satisfies Prisma.ProductVariantInclude;

export const createProductVariantInput = (
  productId: string,
  title: string,
  sku: string | null,
  price: number,
  inventoryQuantity: number,
  selectedValues: VariantOptionValueCreateInput[],
) => {
  return {
    product: {
      connect: { id: productId },
    },
    title,
    sku,
    price,
    inventoryQuantity,
    selectedValues: {
      connect: selectedValues.map((value) => {
        return {
          id: value.id,
        };
      }),
    },
  } satisfies Prisma.ProductVariantCreateInput;
};

export const updateProductVariantInput = (
  title?: string,
  sku?: string | null,
  price?: number,
  inventoryQuantity?: number,
  selectedValues?: ProductOptionValue[],
) => {
  return {
    ...(title && { title }),
    ...(sku && { sku }),
    ...(price && { price }),
    ...(inventoryQuantity && { inventoryQuantity }),
    ...(selectedValues && {
      selectedValues: {
        connect: selectedValues.map((value) => {
          return {
            id: value.id,
          };
        }),
      },
    }),
  } satisfies Prisma.ProductVariantUpdateInput;
};
