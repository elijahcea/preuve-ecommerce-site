import { deleteProduct, updateProduct } from "@/src/dal/product/mutations";
import { Prisma } from "@/src/generated/prisma/client";
import { getProduct } from "@/src/dal/product/queries";
import {
  GetProductResponse,
  UpdateProductResponse,
  ProductUpdateDTO,
} from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse<GetProductResponse>> {
  try {
    const id = (await params).productId;

    const product = await getProduct({ id });

    if (!product)
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
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse<UpdateProductResponse>> {
  try {
    const body: ProductUpdateDTO = await request.json();

    const updatedProduct = await updateProduct({
      ...body,
      id: (await params).productId,
    });

    const response = {
      product: updatedProduct,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(JSON.stringify(`Internal server error: ${e}`), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const deletedProductId = await deleteProduct((await params).productId);

    const response = {
      deletedProductId,
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
          `Product with ID ${(await params).productId} was not found.`,
        );
      }
    }

    return new NextResponse(JSON.stringify(`Internal server error: ${e}`), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
