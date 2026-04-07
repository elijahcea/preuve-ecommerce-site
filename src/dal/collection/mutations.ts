import prisma from "@/src/lib/prisma";
import { CollectionCreateDTO, CollectionUpdateInput } from "@/src/lib/types";
import { createCollectionInput, updateCollectionInput } from "./prismaTypes";
import { formatProductPreview } from "../product/utils";

export async function createCollection(input: CollectionCreateDTO) {
  const { title, description, productIds } = input;
  if (!title) throw new Error("Collection title required");

  const newCollection = await prisma.collection.create({
    data: createCollectionInput(title, description, productIds),
    include: {
      products: {
        include: { variants: true },
      },
    },
  });

  const productPreviews = newCollection.products.map((product) =>
    formatProductPreview(product),
  );

  return {
    id: newCollection.id,
    title: newCollection.title,
    slug: newCollection.slug,
    description: newCollection.description,
    products: productPreviews,
  };
}

export async function updateCollection(input: CollectionUpdateInput) {
  const { id, title, description, productIds } = input;
  if (!id) throw new Error("Collection id required");

  const updatedCollection = await prisma.collection.update({
    where: { id },
    data: updateCollectionInput(title, description, productIds),
    include: {
      products: {
        include: { variants: true },
      },
    },
  });

  const productPreviews = updatedCollection.products.map((product) =>
    formatProductPreview(product),
  );

  return {
    id: updatedCollection.id,
    title: updatedCollection.title,
    slug: updatedCollection.slug,
    description: updatedCollection.description,
    products: productPreviews,
  };
}

export async function deleteCollection(collectionId: string): Promise<string> {
  if (!collectionId)
    throw new Error("Please provide a collection Id to delete collection.");

  const deletedCollection = await prisma.collection.delete({
    where: { id: collectionId },
  });

  return deletedCollection.id;
}
