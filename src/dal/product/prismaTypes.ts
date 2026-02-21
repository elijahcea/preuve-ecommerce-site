import { Prisma } from "@/src/generated/prisma/client";
import { slugify } from "../utils";
import { OptionCreateInput } from "@/src/lib/types";

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
  options: OptionCreateInput[],
) => {
  return {
    slug: slugify(title),
    status,
    title,
    description,
    hasOnlyDefaultVariant,
    collections: {
      connect: collectionIds.map((id) => {
        return {
          id: id,
        };
      }),
    },
    options: {
      create: options.map((option) => {
        return {
          name: option.name,
          position: option.position,
          optionValues: {
            create: option.values.map((value) => {
              return {
                name: value.name,
                slug: slugify(value.name),
                position: value.position,
              };
            }),
          },
        };
      }),
    },
  } satisfies Prisma.ProductCreateInput;
};
