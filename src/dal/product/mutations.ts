import "server-only";

import prisma from "@/src/lib/prisma";
import { Product, ProductCreateInput } from "@/src/lib/types";
import { createProductInput, includeProductAllRelations } from "./prismaTypes";
import { formatProduct, checkHasOnlyDefaultVariant } from "./utils";

export async function createProductWithOptions(
  input: ProductCreateInput,
): Promise<Product> {
  const { product } = input;

  const hasOnlyDefaultVariant = checkHasOnlyDefaultVariant(input);

  const newProduct = await prisma.product.create({
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

  return formattedProduct;
}
