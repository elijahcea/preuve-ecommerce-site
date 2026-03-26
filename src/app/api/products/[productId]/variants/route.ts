import { getProduct } from "@/src/dal/product/queries";
import { createProductVariant } from "@/src/dal/productVariant/mutations";
import {
  CreateVariantResponse,
  ProductVariantCreateDTO,
} from "@/src/lib/types";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateToken, hasPermissions } from "@/src/dal/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse<CreateVariantResponse>> {
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
      "create:variants",
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
