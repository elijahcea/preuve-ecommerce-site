import { Prisma } from "@/src/generated/prisma/client";
import {
  VariantOptionValueCreateInput,
  VariantOptionValueUpdateDTO,
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
  sku: string | null,
  price: number,
  inventoryQuantity: number,
  optionValues: VariantOptionValueCreateInput[],
) => {
  return {
    product: {
      connect: { id: productId },
    },
    sku,
    price,
    inventoryQuantity,
    selectedValues: {
      connect: optionValues.map((value) => {
        return {
          id: value.id,
        };
      }),
    },
  } satisfies Prisma.ProductVariantCreateInput;
};

export const updateProductVariantInput = (
  sku?: string | null,
  price?: number,
  inventoryQuantity?: number,
  optionValues?: VariantOptionValueUpdateDTO[],
) => {
  return {
    ...(sku && { sku }),
    ...(price && { price }),
    ...(inventoryQuantity && { inventoryQuantity }),
    ...(optionValues && {
      optionValues: {
        connect: optionValues.map((value) => {
          return {
            id: value.id,
          };
        }),
      },
    }),
  } satisfies Prisma.ProductVariantUpdateInput;
};
