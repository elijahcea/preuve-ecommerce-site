import prisma from "@/lib/prisma";

export default async function GetProducts({ page, pageSize }: { page: number, pageSize: number }) {
    try {
        const skip = page * pageSize;
        const products = await prisma.product.findMany({
            take: pageSize,
            skip: skip,
            orderBy: {
                
            }
        })

        return products;
    } catch (e) {
        throw e;
    }
}