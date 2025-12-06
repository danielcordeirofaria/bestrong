import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await db.query(
    `SELECT p.id, p.title, p.price, pi.url AS image
     FROM products p
     LEFT JOIN product_images pi ON p.id = pi.product_id
     WHERE p.id = $1`,
    [params.id]
  );

  if (product.rows.length === 0) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product.rows[0]);
}
