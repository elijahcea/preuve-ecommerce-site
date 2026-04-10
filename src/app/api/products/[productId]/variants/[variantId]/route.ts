import { getProduct } from "@/src/dal/product/queries";
import {
  deleteProductVariant,
  updateProductVariant,
} from "@/src/dal/productVariant/mutations";
import {
  ProductVariantUpdateDTO,
  UpdateVariantResponse,
} from "@/src/lib/types";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateToken, hasPermissions } from "@/src/dal/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; variantId: string }> },
): Promise<NextResponse<UpdateVariantResponse>> {
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
      ["update:variants"],
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

    const body: ProductVariantUpdateDTO = await request.json();

    const newVariant = await updateProductVariant({
      ...body,
      productId: (await params).productId,
      id: (await params).variantId,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; variantId: string }> },
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
      ["delete:variants"],
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

    const deletedVariant = await deleteProductVariant(
      (await params).productId,
      (await params).variantId,
    );

    const response = {
      variant: deletedVariant,
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
