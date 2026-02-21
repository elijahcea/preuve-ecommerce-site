import "server-only";

import prisma from "@/src/lib/prisma";
import { formatProduct } from "./utils";
import { Product, ProductPreview } from "@/src/lib/types";
import { calculateProductPriceRange } from "./utils";
import { includeProductAllRelations } from "./prismaTypes";

export async function getAllProducts(): Promise<ProductPreview[] | null> {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });
    if (!products) return null;

    return products.map((product) => {
      return {
        id: product.id,
        slug: product.slug,
        status: product.status,
        title: product.title,
        priceRange: calculateProductPriceRange(product.variants),
        description: product.description,
        hasOnlyDefaultVariant: product.hasOnlyDefaultVariant,
        featuredImage: {
          url: product.featuredImageURL,
          altText: product.featuredImageAlt,
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  } catch (e) {
    throw e;
  }
}

export async function getProduct(
  uniqueIdentifierObject: { slug: string } | { id: string },
): Promise<Product | null> {
  try {
    if ("slug" in uniqueIdentifierObject) {
      const product = await prisma.product.findUnique({
        where: {
          slug: uniqueIdentifierObject.slug,
        },
        include: includeProductAllRelations,
      });
      if (!product) return null;
      return formatProduct(product);
    } else if ("id" in uniqueIdentifierObject) {
      const product = await prisma.product.findUnique({
        where: {
          id: uniqueIdentifierObject.id,
        },
        include: includeProductAllRelations,
      });
      if (!product) return null;
      return formatProduct(product);
    } else {
      throw new Error("Pass in slug or id as unique product identifier");
    }
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
      include: includeProductAllRelations,
    });

    const formattedProducts = products.map((product) => formatProduct(product));

    const nextCursor = products[products.length - 1].id;

    return {
      collection: {
        title: collection.title,
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
            title: {
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
                title: {
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
      include: includeProductAllRelations,
    });

    if (!results) return null;

    return results.map((product) => formatProduct(product));
  } catch (e) {
    throw e;
  }
}
