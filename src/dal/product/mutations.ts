import "server-only";

import prisma from "@/src/lib/prisma";
import { Product, ProductCreateInput } from "@/src/lib/types";
import { createProductInput, includeProductAllRelations } from "./prismaTypes";
import { formatProduct, checkHasOnlyDefaultVariant } from "./utils";
import {
  createProductVariantInput,
  includeProductVariantWithOptionValues,
} from "../productVariant/prismaTypes";
import { formatVariant } from "../productVariant/utils";

export async function createProduct(
  input: ProductCreateInput,
): Promise<Product> {
  const { product } = input;

  const hasOnlyDefaultVariant = checkHasOnlyDefaultVariant(input);

  const result = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: createProductInput(
        product.status,
        product.title,
        product.description,
        hasOnlyDefaultVariant,
        product.collectionIds,
        product.options,
      ),
      include: includeProductAllRelations,
    });
    const formattedProduct = formatProduct(newProduct);

    const variants = await Promise.all(
      product.variants.map(async (variant) => {
        const newVar = await tx.productVariant.create({
          data: createProductVariantInput(
            formattedProduct.id,
            formattedProduct.options,
            variant.sku,
            variant.price,
            variant.inventoryQuantity,
            variant.optionValues,
          ),
          include: includeProductVariantWithOptionValues,
        });
        return formatVariant(
          formattedProduct.title,
          formattedProduct.slug,
          newVar,
        );
      }),
    );

    formattedProduct.variants = variants;

    return formattedProduct;
  });

  return result;
}
