import { Prisma } from "@/src/generated/prisma/client";
import { ProductOption, VariantOptionValueInput } from "@/src/lib/types";

export const includeProductVariantWithOptionValues = {
  selectedValues: {
    include: {
      productOption: true,
    },
  },
} satisfies Prisma.ProductVariantInclude;

export const createProductVariantInput = (
  productId: string,
  productOptions: ProductOption[],
  sku: string,
  price: number,
  inventoryQuantity: number,
  optionValues: VariantOptionValueInput[],
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
          id: productOptions
            .find((option) => option.name === value.optionName)
            ?.values.find((v) => v.name === value.name)?.id,
        };
      }),
    },
  } satisfies Prisma.ProductVariantCreateInput;
};
