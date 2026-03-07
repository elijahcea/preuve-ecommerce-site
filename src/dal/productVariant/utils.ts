import { Prisma } from "@/src/generated/prisma/client";
import {
  ProductVariant,
  ProductVariantCreateDTO,
  ProductVariantUpdateDTO,
  SelectedOption,
  VariantOptionValueCreateDTO,
} from "@/src/lib/types";
import { calculatePriceInDollars } from "../utils";
import { createProductHref } from "../product/utils";
import { includeProductVariantWithOptionValues } from "./prismaTypes";
import { ProductVariantGetPayload } from "@/src/generated/prisma/models";

export function formatVariant(
  productTitle: string,
  productSlug: string,
  variant: Prisma.ProductVariantGetPayload<{
    include: typeof includeProductVariantWithOptionValues;
  }>,
): ProductVariant {
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
    productTitle,
    price: calculatePriceInDollars(variant.price),
    inventoryQuantity: variant.inventoryQuantity,
    image: {
      url: variant.imageUrl,
      altText: variant.imageAlt || "",
    },
    href: createProductHref(productSlug, selectedOptions),
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
    selectedOptions,
  };
}

export function checkIfVariantCombinationsAreUnique(
  variants: ProductVariantGetPayload<{ include: { selectedValues: true } }>[],
) {
  for (const variant of variants) {
    const existingCombination = variants.find((v) => {
      if (v.id === variant.id) return false;
      if (variant.selectedValues.length !== v.selectedValues.length)
        return false;
      return variant.selectedValues.every((optionValue) => {
        const variantOptionValue = v.selectedValues.find(
          (ov) => ov.id === optionValue.id,
        );
        return !!variantOptionValue;
      });
    });

    if (existingCombination) {
      throw new Error(`Variant with provided options already exists.`);
    }
  }
}

export function validateVariantPayload(
  input: ProductVariantCreateDTO | ProductVariantUpdateDTO,
  options: Prisma.ProductOptionGetPayload<{ include: { values: true } }>[],
) {
  const { optionValues } = input;

  if (optionValues?.length) {
    if (options.length !== optionValues.length)
      throw new Error(
        `Product has ${options.length} option but there were ${optionValues.length} provided option values for the variant.`,
      );

    const uniqueOptionNames = new Set();
    for (const ov of optionValues) {
      if (uniqueOptionNames.has(ov.optionName)) {
        throw new Error(
          "Cannot create product variant with more than one value for the same option.",
        );
      }
      uniqueOptionNames.add(ov.optionName);
    }
  }
}

export function assignIdsToOptionValues(
  input: VariantOptionValueCreateDTO[],
  options: Prisma.ProductOptionGetPayload<{ include: { values: true } }>[],
) {
  return input.map((optionValue) => {
    const option = options.find(
      (option) => optionValue.optionName === option.name,
    );
    const validOptionValue = option?.values.find(
      (val) => optionValue.name === val.name,
    );

    if (!validOptionValue) {
      throw new Error(
        `Option value ${optionValue.name} does not exist for option ${optionValue.optionName}`,
      );
    }

    return {
      id: validOptionValue.id,
      name: validOptionValue.name,
      optionName: optionValue.optionName,
    };
  });
}
