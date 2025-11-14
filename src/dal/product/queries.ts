import prisma from "@/lib/prisma";

export default async function GetProducts({ page, pageSize }: { page: number, pageSize: number }) {
    try {
        const skip = page * pageSize;
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
                id: "desc"
            },
            take: pageSize,
            skip: skip
        })

        return products;
    } catch (e) {
        throw e;
    }
}