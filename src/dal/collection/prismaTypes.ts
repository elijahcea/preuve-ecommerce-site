import { Prisma } from "@/src/generated/prisma/client";
import { slugify } from "../utils";

export const createCollectionInput = (
  title: string,
  description: string,
  productIds: string[],
) => {
  return {
    title,
    slug: slugify(title),
    description,
    products: {
      connect: productIds.map((productId) => {
        return {
          id: productId,
        };
      }),
    },
  } satisfies Prisma.CollectionCreateInput;
};

export const updateCollectionInput = (
  title?: string,
  description?: string,
  productIds?: string[],
) => {
  return {
    ...(title && { title }),
    ...(title && { slug: slugify(title) }),
    ...(description && { description }),
    ...(productIds && {
      products: {
        set: productIds.map((productId) => {
          return {
            id: productId,
          };
        }),
      },
    }),
  } satisfies Prisma.CollectionUpdateInput;
};
