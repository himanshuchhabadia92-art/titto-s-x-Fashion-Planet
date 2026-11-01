import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toCard } from "@/lib/catalog";

// Public: returns fresh product data for the ids stored in a visitor's cart / wishlist.
export async function GET(request: NextRequest) {
  const ids = (request.nextUrl.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 100);
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    include: { sizes: { orderBy: { id: "asc" } } },
  });
  return NextResponse.json(products.map(toCard));
}
