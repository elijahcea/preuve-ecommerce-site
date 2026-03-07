import { deleteOption, updateOption } from "@/src/dal/option/mutations";
import { getProduct } from "@/src/dal/product/queries";
import { OptionUpdateDTO } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; optionId: string }> },
) {
  try {
    const body: OptionUpdateDTO = await request.json();

    const updatedOption = await updateOption({
      ...body,
      productId: (await params).productId,
      id: (await params).optionId,
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
  { params }: { params: Promise<{ productId: string; optionId: string }> },
) {
  try {
    const deletedOption = await deleteOption(
      (await params).productId,
      (await params).optionId,
    );

    const response = {
      option: deletedOption,
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
