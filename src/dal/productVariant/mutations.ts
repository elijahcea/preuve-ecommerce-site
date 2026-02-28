import prisma from "@/src/lib/prisma";
import {
  createProductVariantInput,
  includeProductVariantWithOptionValues,
} from "./prismaTypes";
import { ProductOption, VariantOptionValueCreateInput } from "@/src/lib/types";
import { formatVariant } from "./utils";
import { getProduct } from "../product/queries";

export async function createProductVariant(
  productId: string,
  productOptions: ProductOption[],
  sku: string | null,
  price: number,
  inventoryQuantity: number,
  variantOptionValues: VariantOptionValueCreateInput[],
) {
  const product = await getProduct({ id: productId });
  if (!product) throw new Error(`Product with ID: ${productId} does not exist`);

  const newVariant = await prisma.productVariant.create({
    data: createProductVariantInput(
      productId,
      productOptions,
      sku,
      price,
      inventoryQuantity,
      variantOptionValues,
    ),
    include: includeProductVariantWithOptionValues,
  });
  return formatVariant(product.title, product.slug, newVariant);
}
