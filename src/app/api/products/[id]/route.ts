import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 Params ab Promise hai
) {
  try {
    const { id } = await params; // 👈 Id nikalne ke liye await lazmi hai
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: body.title,
        price: body.price,
        category: body.category,
        description: body.description,
        image: body.image,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}