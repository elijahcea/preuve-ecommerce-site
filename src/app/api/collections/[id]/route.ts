import { deleteCollection } from "@/src/dal/collection/mutations";
import { getCollection } from "@/src/dal/collection/queries";
import { GetCollectionResponse } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/src/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetCollectionResponse>> {
  try {
    const id = (await params).id;

    const collection = await getCollection(id);

    if (collection === null)
      return new NextResponse(JSON.stringify("Collection not found"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const response = {
      collection,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new NextResponse(JSON.stringify(`Internal server error: ${e}`), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const deletedCollectionId = await deleteCollection((await params).id);

    const response = {
      deletedCollectionId,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error(
          `Collection with ID ${(await params).id} was not found.`,
        );
      }
    }

    return new NextResponse(JSON.stringify(`Internal server error: ${e}`), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
