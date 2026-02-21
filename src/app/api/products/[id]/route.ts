import { getProduct } from "@/src/dal/product/queries";
import { Product } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

type GetProductResponse = {
  product: Product;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetProductResponse>> {
  try {
    const id = (await params).id;

    const product = await getProduct({ id });

    if (product === null)
      return new NextResponse(JSON.stringify("Product not found"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const response = {
      product,
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
) {}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {}
