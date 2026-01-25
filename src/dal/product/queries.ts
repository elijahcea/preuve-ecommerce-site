import "server-only";

import prisma from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";
import { formatProduct } from "@/src/dal/helpers";
import { Product } from "@/src/lib/types";

const includeProductFull = {
  productOptionValues: {
    include: {
      optionValue: {
        include: {
          option: true,
        },
      },
    },
  },
  variants: {
    include: {
      selectedOptions: {
        include: {
          optionValue: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  },
  collections: true,
} satisfies Prisma.ProductInclude;

export type ProductWithOptionsAndVariants = Prisma.ProductGetPayload<{
  include: typeof includeProductFull;
}>;

export async function getAllProducts(): Promise<Product[] | null> {
  try {
    const products = await prisma.product.findMany({
      include: includeProductFull,
    });
    if (!products) return null;

    return products.map((product) => formatProduct(product));
  } catch (e) {
    throw e;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: includeProductFull,
    });
    if (!product) return null;

    return formatProduct(product);
  } catch (e) {
    throw e;
  }
}

export async function getCollectionProducts({
  collectionSlug,
  pageSize = 20,
  cursor,
}: {
  collectionSlug: string;
  pageSize?: number;
  cursor?: string;
}) {
  if (pageSize < 1 || pageSize > 100) {
    throw new Error("pageSize must be between 1 and 100");
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: {
        slug: collectionSlug,
      },
    });
    if (!collection) return null;

    const products = await prisma.product.findMany({
      take: pageSize,
      skip: cursor ? 1 : undefined,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      where: {
        AND: [
          {
            collections: {
              some: {
                slug: collectionSlug,
              },
            },
          },
          {
            status: {
              equals: true,
            },
          },
        ],
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      include: includeProductFull,
    });

    const formattedProducts = products.map((product) => formatProduct(product));

    const nextCursor = products[products.length - 1].id;

    return {
      collection: {
        title: collection.name,
        description: collection.description,
      },
      formattedProducts,
      nextCursor,
    };
  } catch (e) {
    throw e;
  }
}

export async function searchProducts(searchInput: string) {
  try {
    const results = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
          {
            collections: {
              some: {
                name: {
                  contains: searchInput,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            collections: {
              some: {
                description: {
                  contains: searchInput,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: includeProductFull,
    });

    if (!results) return null;

    return results.map((product) => formatProduct(product));
  } catch (e) {
    throw e;
  }
}
