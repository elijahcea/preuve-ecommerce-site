import { getAllProducts } from "@/src/dal/product/queries";
import { createProductWithOptions } from "@/src/dal/product/mutations";
import {
  ProductCreateInput,
  GetProductsResponse,
  CreateProductResponse,
} from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { createProductVariant } from "@/src/dal/productVariant/mutations";

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
    const body = await request.json();
    const { product }: ProductCreateInput = body;
    const newProduct = await createProductWithOptions({ product });
    const productVariants = await Promise.all(
      product.variants.map(async (variant) => {
        const newVariant = await createProductVariant(
          newProduct.id,
          newProduct.options,
          variant.sku,
          variant.price,
          variant.inventoryQuantity,
          variant.optionValues,
        );
        return newVariant;
      }),
    );

    newProduct.variants = productVariants;

    const response = {
      product: newProduct,
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
