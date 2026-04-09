import {
  deleteCollection,
  updateCollection,
} from "@/src/dal/collection/mutations";
import { getCollection } from "@/src/dal/collection/queries";
import { CollectionUpdateDTO, GetCollectionResponse } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/src/generated/prisma/client";
import { validateToken, hasPermissions } from "@/src/dal/utils";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(
        JSON.stringify({
          message: "No token provided",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const token = authHeader.split(" ")[1];
    const authPayload = await validateToken(token);

    if (!authPayload) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid token",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const isAuthorized = hasPermissions(
      authPayload.permissions as Array<string>,
      ["update:collections"],
    );

    if (!isAuthorized) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const body: CollectionUpdateDTO = await request.json();

    const updatedCollection = updateCollection({
      id: (await params).id,
      ...body,
    });

    const response = {
      collection: updatedCollection,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(
        JSON.stringify({
          message: "No token provided",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const token = authHeader.split(" ")[1];
    const authPayload = await validateToken(token);

    if (!authPayload) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid token",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const isAuthorized = hasPermissions(
      authPayload.permissions as Array<string>,
      ["delete:collections"],
    );

    if (!isAuthorized) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

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
