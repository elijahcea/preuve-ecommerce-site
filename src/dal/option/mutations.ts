import prisma from "@/src/lib/prisma";
import { OptionCreateInput, OptionUpdateInput } from "@/src/lib/types";
import { createOptionInput } from "./prismaTypes";
import { checkIfVariantCombinationsAreUnique } from "../productVariant/utils";

export async function createOption(input: OptionCreateInput) {
  const { productId, name, values } = input;
  if (!productId)
    throw new Error(`Please provide a product Id to create product option.`);

  const productOptionsCount = await prisma.productOption.count({
    where: {
      productId,
    },
  });

  const newOption = await prisma.productOption.create({
    data: createOptionInput(productId, name, productOptionsCount + 1, values),
  });

  return newOption;
}

export async function updateOption(input: OptionUpdateInput) {
  const { productId, id, name, values } = input;
  if (!productId)
    throw new Error(`Please provide a product Id to update product option.`);

  await prisma.$transaction(async (tx) => {
    await tx.productOption.update({
      where: { productId, id },
      data: { name },
    });

    const valIdsToKeep = values
      .map((val) => val.id)
      .filter((id): id is string => Boolean(id));

    await tx.productOptionValue.deleteMany({
      where: {
        productOptionId: id,
        id: { notIn: valIdsToKeep },
      },
    });

    await Promise.all(
      input.values.map(async (val, idx) => {
        await tx.productOptionValue.upsert({
          where: {
            name_productOptionId: {
              name: name,
              productOptionId: id,
            },
            id: val.id,
          },
          update: { name: val.name },
          create: {
            productOptionId: id,
            name: val.name,
            position: idx + 1,
          },
        });
      }),
    );
  });

  const updatedOption = await prisma.productOption.findUniqueOrThrow({
    where: { productId, id },
  });

  return updatedOption;
}

export async function deleteOption(productId: string, optionId: string) {
  if (!productId)
    throw new Error(`Please provide a product Id to delete product option.`);

  const deletedOption = await prisma.$transaction(async (tx) => {
    const option = await tx.productOption.delete({
      where: { productId, id: optionId },
    });
    const variants = await tx.productVariant.findMany({
      where: {
        productId,
      },
      include: { selectedValues: true },
    });

    checkIfVariantCombinationsAreUnique(variants);

    return option;
  });

  return deletedOption;
}
