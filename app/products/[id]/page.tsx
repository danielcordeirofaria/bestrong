import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

type ProductDetails = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  images: { image_url: string }[];
};

async function getProductDetails(id: string): Promise<ProductDetails | undefined> {
  try {
    const productData = await sql`
      SELECT id, name, description, price, quantity
      FROM products
      WHERE id = ${id} AND quantity > 0;
    `;

    if (productData.rows.length === 0) {
      return undefined;
    }

    const imageData = await sql`
      SELECT image_url
      FROM product_images
      WHERE product_id = ${id}
      ORDER BY is_primary DESC;
    `;

    const product = productData.rows[0];

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      images: imageData.rows,
    };
  } catch (error) {
    console.error('Database Error fetching product details:', error);
    return undefined;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.image_url || 'https://httpstatusdogs.com/img/404.jpg';

  return (
    <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-96 w-full md:h-full">
          <Image src={primaryImage} alt={product.name} fill className="rounded-lg object-contain" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-bold text-text-main">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-text-main">${product.price}</p>
          <p className="mt-4 flex-grow text-secondary">{product.description}</p>
          <button className="mt-8 w-full rounded bg-primary py-3 text-lg font-semibold text-white transition-all hover:bg-opacity-90">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}