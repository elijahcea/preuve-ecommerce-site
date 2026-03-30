import prisma from "@/src/lib/prisma";
import {
  createProductVariantInput,
  updateProductVariantInput,
} from "./prismaTypes";
import {
  ProductVariantCreateInput,
  ProductVariantUpdateInput,
} from "@/src/lib/types";
import { convertPriceForDb } from "../utils";
import {
  assignIdsToOptionValues,
  checkIfVariantCombinationsAreUnique,
  validateVariantPayload,
} from "./utils";

export async function createProductVariant(input: ProductVariantCreateInput) {
  const { productId, title, sku, price, inventoryQuantity, selectedValues } =
    input;
  if (!productId)
    throw new Error(`Please provide a product Id to update product variants.`);

  const options = await prisma.productOption.findMany({
    where: { productId },
    include: { values: true },
  });

  validateVariantPayload(input, options);

  const optionValuesWithIds = assignIdsToOptionValues(selectedValues, options);

  const newVariant = await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.create({
      data: createProductVariantInput(
        productId,
        title,
        sku,
        convertPriceForDb(price),
        inventoryQuantity,
        optionValuesWithIds,
      ),
    });

    const updatedVariants = await tx.productVariant.findMany({
      where: {
        productId,
      },
      include: { selectedValues: true },
    });

    checkIfVariantCombinationsAreUnique(updatedVariants);

    return variant;
  });

  return newVariant;
}

export async function updateProductVariant(input: ProductVariantUpdateInput) {
  const { productId, title, sku, price, inventoryQuantity, selectedValues } =
    input;
  if (!productId)
    throw new Error(`Please provide a product Id to update product variants.`);

  const options = await prisma.productOption.findMany({
    where: { productId },
    include: { values: true },
  });

  validateVariantPayload(input, options);

  const updatedVariant = await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.update({
      where: { id: input.id },
      data: updateProductVariantInput(
        title,
        sku,
        price,
        inventoryQuantity,
        selectedValues,
      ),
    });

    const updatedVariants = await tx.productVariant.findMany({
      where: {
        productId,
      },
      include: { selectedValues: true },
    });

    checkIfVariantCombinationsAreUnique(updatedVariants);

    return variant;
  });

  return updatedVariant;
}

export async function deleteProductVariant(
  productId: string,
  variantId: string,
) {
  if (!productId)
    throw new Error(`Please provide a product Id to delete product variants.`);

  const deletedVariant = await prisma.productVariant.delete({
    where: { productId, id: variantId },
  });

  return deletedVariant;
}
