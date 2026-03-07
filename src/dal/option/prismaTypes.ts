import { Prisma } from "@/src/generated/prisma/client";
import { OptionValueCreateInput } from "@/src/lib/types";

export const createOptionInput = (
  productId: string,
  name: string,
  position: number,
  values: OptionValueCreateInput[],
) => {
  return {
    name,
    position,
    product: {
      connect: {
        id: productId,
      },
    },
    values: {
      create: values.map((value, index) => {
        return {
          name: value.name,
          position: index++,
        };
      }),
    },
  } satisfies Prisma.ProductOptionCreateInput;
};
