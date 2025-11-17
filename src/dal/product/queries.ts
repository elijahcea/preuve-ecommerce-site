import prisma from "@/lib/prisma";

interface getProductParams {
    pageSize?: number,
    collectionSlug?: string
    cursor?: string, // id of last product from previous page
}

export default async function getProducts({
    pageSize = 20,
    collectionSlug,
    cursor
 }: getProductParams) {

    if (pageSize < 1 || pageSize > 100) {
        throw new Error("pageSize must be between 1 and 100");
    }

    try {
        const products = await prisma.product.findMany({
            take: pageSize,
            skip: cursor ? 1 : undefined,
            cursor: cursor ? {
                id: cursor
            } : undefined,
            where: collectionSlug ? {
                collections: {
                  some: {
                    slug: collectionSlug, // Filter by collection
                  },
                },
            } : undefined,
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    id: "desc"
                }
            ]
        })

        const nextCursor = products[products.length - 1].id

        return {
            products,
            nextCursor
        };
    } catch (e) {
        throw e;
    }
}