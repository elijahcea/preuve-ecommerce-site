import prisma from "@/src/lib/prisma";

export async function deleteCollection(collectionId: string): Promise<string> {
  if (!collectionId)
    throw new Error("Please provide a collection Id to delete collection.");

  const deletedCollection = await prisma.collection.delete({
    where: { id: collectionId },
  });

  return deletedCollection.id;
}
