import { getAllProducts } from "@/src/dal/product/queries";
import { createProduct } from "@/src/dal/product/mutations";
import {
  GetProductsResponse,
  CreateProductResponse,
  ProductCreateDTO,
} from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { hasPermissions, validateToken } from "@/src/dal/utils";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetProductsResponse>> {
  try {
    const products = await getAllProducts();

    const response = {
      products: products ?? [],
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

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateProductResponse>> {
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
      ["create:products"],
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

    const body: ProductCreateDTO = await request.json();
    const newProduct = await createProduct(body);

    const response = {
      product: newProduct,
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
