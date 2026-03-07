import { getAllProducts } from "@/src/dal/product/queries";
import { createProduct } from "@/src/dal/product/mutations";
import {
  GetProductsResponse,
  CreateProductResponse,
  ProductCreateDTO,
} from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

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
