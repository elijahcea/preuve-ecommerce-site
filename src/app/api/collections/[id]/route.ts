import { getCollection } from "@/src/dal/collection/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    const collection = await getCollection(id);

    if (collection === null)
      return new NextResponse(JSON.stringify("Collection not found"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    return new NextResponse(JSON.stringify(collection), {
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
