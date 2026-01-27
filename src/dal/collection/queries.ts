import prisma from "@/src/lib/prisma";
import { Collection, CollectionPreview } from "@/src/lib/types";

export async function getAllCollections(): Promise<CollectionPreview[] | null> {
  try {
    const collections = await prisma.collection.findMany();
    if (!collections) return null;

    return collections;
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
        products: true,
      },
    });
    if (!collection) return null;

    return collection;
  } catch (e) {
    throw e;
  }
}
