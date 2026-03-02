import { getAllCollections } from "@/src/dal/collection/queries";
import { GetCollectionsResponse } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetCollectionsResponse>> {
  try {
    const collections = await getAllCollections();

    const response = {
      collections: collections ?? [],
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
