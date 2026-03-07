import { getProduct } from "@/src/dal/product/queries";
import {
  deleteProductVariant,
  updateProductVariant,
} from "@/src/dal/productVariant/mutations";
import {
  ProductVariantUpdateDTO,
  ProductVariantUpdateInput,
  UpdateVariantResponse,
} from "@/src/lib/types";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; variantId: string }> },
): Promise<NextResponse<UpdateVariantResponse>> {
  try {
    const body: ProductVariantUpdateDTO = await request.json();

    const newVariant = await updateProductVariant({
      ...body,
      productId: (await params).productId,
      id: (await params).variantId,
    });

    const updatedProduct = await getProduct({ id: (await params).productId });

    if (updatedProduct === null)
      return new NextResponse(JSON.stringify("Product not found"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
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
  { params }: { params: Promise<{ productId: string; variantId: string }> },
): Promise<NextResponse<UpdateVariantResponse>> {
  try {
    const deletedVariant = await deleteProductVariant(
      (await params).productId,
      (await params).variantId,
    );
    const updatedProduct = await getProduct({ id: (await params).productId });

    if (updatedProduct === null)
      return new NextResponse(JSON.stringify("Product not found"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
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
