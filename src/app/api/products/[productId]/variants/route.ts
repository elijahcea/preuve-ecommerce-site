import { getProduct } from "@/src/dal/product/queries";
import { createProductVariant } from "@/src/dal/productVariant/mutations";
import {
  CreateVariantResponse,
  ProductVariantCreateDTO,
} from "@/src/lib/types";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse<CreateVariantResponse>> {
  try {
    const body: ProductVariantCreateDTO = await request.json();

    const newVariant = await createProductVariant({
      ...body,
      productId: (await params).productId,
    });

    const updatedProduct = await getProduct({ id: (await params).productId });

    if (!updatedProduct)
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
