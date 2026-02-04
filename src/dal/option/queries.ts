/* import prisma from "@/src/lib/prisma";
import { OptionPreview } from "@/src/lib/types";

export async function getAllOptions(): Promise<OptionPreview[] | null> {
  try {
    const options = await prisma.option.findMany({
      include: {
        values: true,
      },
    });
    if (!options) return null;

    return options.map((option) => {
      return {
        id: option.id,
        name: option.name,
        values: option.values.map((value) => ({
          id: value.id,
          name: value.name,
          optionId: value.optionId,
        })),
      };
    });
  } catch (e) {
    throw e;
  }
} */
