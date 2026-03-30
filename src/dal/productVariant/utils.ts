import { Prisma } from "@/src/generated/prisma/client";
import {
  ProductOptionValue,
  ProductVariant,
  ProductVariantCreateDTO,
  ProductVariantUpdateDTO,
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
    title: variant.title,
    sku: variant.sku,
    productTitle,
    price: calculatePriceInDollars(variant.price),
    inventoryQuantity: variant.inventoryQuantity,
    image: {
      url: variant.imageUrl,
      altText: variant.imageAlt || "",
    },
    href: createProductHref(productSlug, selectedValues),
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
    selectedValues,
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
  const { selectedValues } = input;

  if (selectedValues?.length) {
    if (options.length !== selectedValues.length)
      throw new Error(
        `Product has ${options.length} option but there were ${selectedValues.length} provided option values for the variant.`,
      );

    const uniqueOptionNames = new Set();
    for (const ov of selectedValues) {
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
