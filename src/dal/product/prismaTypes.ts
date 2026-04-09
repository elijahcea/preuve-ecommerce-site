import { Prisma } from "@/src/generated/prisma/client";
import { slugify } from "../utils";
import { OptionCreateDTO } from "@/src/lib/types";

export const includeProductAllRelations = {
  options: {
    include: {
      values: true,
    },
  },
  variants: {
    include: {
      selectedValues: {
        include: {
          productOption: true,
        },
      },
    },
  },
  collections: true,
} satisfies Prisma.ProductInclude;

export const createProductInput = (
  status: boolean,
  title: string,
  description: string,
  hasOnlyDefaultVariant: boolean,
  collectionIds: string[],
  options: OptionCreateDTO[],
  featuredImageURL?: string | null,
  featuredImageAlt?: string | null,
) => {
  return {
    slug: slugify(title),
    status,
    title,
    description,
    featuredImageURL,
    featuredImageAlt,
    hasOnlyDefaultVariant,
    collections: {
      connect: collectionIds.map((collectionId) => {
        return {
          id: collectionId,
        };
      }),
    },
    options: {
      create: options.map((option, index) => {
        return {
          name: option.name,
          position: index++,
          values: {
            create: option.values.map((value, index) => {
              return {
                name: value.name,
                position: index++,
              };
            }),
          },
        };
      }),
    },
  } satisfies Prisma.ProductCreateInput;
};

export const updateProductInput = (
  status?: boolean,
  title?: string,
  description?: string,
  collectionIds?: string[],
  featuredImageURL?: string | null,
  featuredImageAlt?: string | null,
) => {
  return {
    ...(status !== undefined && { status }),
    ...(title && { slug: slugify(title) }),
    ...(title && { title }),
    ...(description && { description }),
    ...(featuredImageURL && { featuredImageURL }),
    ...(featuredImageAlt && { featuredImageAlt }),
    ...(collectionIds && {
      collections: {
        set: collectionIds.map((collectionId) => {
          return {
            id: collectionId,
          };
        }),
      },
    }),
  } satisfies Prisma.ProductUpdateInput;
};
