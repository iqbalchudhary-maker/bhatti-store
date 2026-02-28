import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 👈 Ye line sab se zaroori hai

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}