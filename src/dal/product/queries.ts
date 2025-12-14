import "server-only";
import prisma from "@/src/lib/prisma";
import { ProductVariant } from "@/src/lib/types";
import { SelectedOption } from "@/src/lib/types";
import { Cart } from "@/src/lib/types";
import { cookies } from "next/headers";

export async function getProducts({
    pageSize = 20,
    collectionSlug,
    cursor
}: { 
    pageSize?: number,
    collectionSlug?: string,
    cursor?: string 
}) {
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
                AND: [
                    {
                        collections: {
                            some: {
                              slug: collectionSlug // Filter by collection
                            }
                          }                    
                    },
                    {
                        isAvailableForSale: {
                            equals: true
                        }
                    }
                ]
            } : {
                isAvailableForSale: {
                    equals: true
                }
            },
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

export async function getProduct( slug: string ) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: slug
            },       
            include: {
                productOptionValues: {
                    include: {
                        optionValue: {
                            include: {
                                option: true,
                            }
                        }
                    }
                },
                variants: {
                    include: {
                        selectedOptions: {
                            include: {
                                optionValue: {
                                    include: {
                                        option: true,
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })
        if (!product) return null;

        const optionsMap = new Map();

        product.productOptionValues.forEach((pov) => {
            const opt = pov.optionValue.option;
            if (!optionsMap.has(opt.name)) {
                optionsMap.set(opt.name, {
                    name: opt.name,
                    values: []
                });
            }
            optionsMap.get(opt.name).values.push(pov.optionValue.name);
        });

        // Transform variants
        const transformedVariants: ProductVariant[] = product.variants.map((variant) => {
            const selectedOptions: SelectedOption[] = variant.selectedOptions.map((so) => ({
                name: so.optionValue.option.name,
                value: so.optionValue.name
            }));

            return {
                id: variant.id,
                sku: variant.sku,
                price: variant.price,
                isAvailableForSale: variant.isAvailableForSale,
                imageUrl: variant.imageUrl,
                selectedOptions
            };
        });

        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            isAvailableForSale: product.isAvailableForSale,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            options: Array.from(optionsMap.keys()),
            optionsWithValues: Array.from(optionsMap.values()),
            variants: transformedVariants
        };
    } catch (e) {
        throw e;
    }
}