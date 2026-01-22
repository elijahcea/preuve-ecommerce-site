import prisma from "@/src/lib/prisma";

export async function getAllCollections() {
  const collections = await prisma.collection.findMany();
  if (!collections) return undefined;

  return collections;
}
