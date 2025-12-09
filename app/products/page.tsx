import React from 'react';
import Image from 'next/image';
import { sql } from '@vercel/postgres';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
};

export default async function ProductsPage() {
  const { rows: products } = await sql<Product>`
    SELECT p.id, p.name, p.price, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.quantity > 0 AND p.isActive = true -- Only show products that are in stock and active
    ORDER BY p.id DESC;
  `;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="group block">
            <div className="flex flex-col overflow-hidden rounded-lg border border-ui-border bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-lg">
              <div className="relative h-72 w-full">
                <Image
                  src={product.image_url || 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Image'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold text-text-main group-hover:text-primary">{product.name}</h3>
                <p className="mt-1 text-lg font-bold text-text-main">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
