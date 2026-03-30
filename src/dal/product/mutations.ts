import "server-only";

import prisma from "@/src/lib/prisma";
import { Product, ProductCreateDTO, ProductUpdateInput } from "@/src/lib/types";
import {
  createProductInput,
  includeProductAllRelations,
  updateProductInput,
} from "./prismaTypes";
import {
  formatProduct,
  checkHasOnlyDefaultVariant,
  validateProductCreatePayload,
} from "./utils";
import { createProductVariantInput } from "../productVariant/prismaTypes";
import {
  assignIdsToOptionValues,
  checkIfVariantCombinationsAreUnique,
} from "../productVariant/utils";
import { getProduct } from "./queries";

export async function createProduct(input: ProductCreateDTO): Promise<Product> {
  const { status, title, description, collectionIds, options, variants } =
    input;

  validateProductCreatePayload(input);

  const hasOnlyDefaultVariant = checkHasOnlyDefaultVariant(input);

  const productId = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: createProductInput(
        status,
        title,
        description,
        hasOnlyDefaultVariant,
        collectionIds,
        options,
      ),
      include: includeProductAllRelations,
    });

    const newVariants = await Promise.all(
      variants.map(async (variant) => {
        const optionValuesWithIds = assignIdsToOptionValues(
          variant.selectedValues,
          newProduct.options,
        );
        const newVariant = await tx.productVariant.create({
          data: createProductVariantInput(
            newProduct.id,
            variant.title,
            variant.sku,
            variant.price,
            variant.inventoryQuantity,
            optionValuesWithIds,
          ),
          include: { selectedValues: true },
        });
        return newVariant;
      }),
    );

    checkIfVariantCombinationsAreUnique(newVariants);

    return newProduct.id;
  });

  const latestProduct = await getProduct({ id: productId });
  if (!latestProduct) throw new Error("Invalid product Id.");

  return latestProduct;
}

export async function updateProduct(
  input: ProductUpdateInput,
): Promise<Product> {
  const { id, status, title, description, featuredImage, collectionIds } =
    input;
  if (!id) throw new Error(`Please provide a product Id to update product.`);

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateProductInput(status, title, description, collectionIds),
    include: includeProductAllRelations,
  });

  return formatProduct(updatedProduct);
}

export async function deleteProduct(productId: string): Promise<string> {
  if (!productId)
    throw new Error("Please provide a product Id to delete product.");

  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  return deletedProduct.id;
}
