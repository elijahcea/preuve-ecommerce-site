import prisma from "@/src/lib/prisma";
import { Collection, CollectionPreview } from "@/src/lib/types";
import { formatProductPreview } from "../product/utils";

export async function getAllCollections(): Promise<CollectionPreview[] | null> {
  try {
    const collections = await prisma.collection.findMany();
    if (!collections) return null;

    return collections.map((c) => {
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
      };
    });
  } catch (e) {
    throw e;
  }
}

export async function getCollection(id: string): Promise<Collection | null> {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: id,
      },
      include: {
        products: {
          include: { variants: true },
        },
      },
    });
    if (!collection) return null;

    const productPreviews = collection.products.map((product) =>
      formatProductPreview(product),
    );

    return {
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      products: productPreviews,
    };
  } catch (e) {
    throw e;
  }
}
