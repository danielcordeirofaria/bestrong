import React from 'react';
import Link from 'next/link';
import { Plus, AlertTriangle } from 'lucide-react';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import Image from 'next/image';
import DeleteProductButton from '@/components/ui/delete-product-button';

type ProductWithImage = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  image_url: string | null;
};

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <p className="p-8 text-center">Please log in to manage products.</p>;
  }

  const productsData = await sql<ProductWithImage>`
    SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.quantity,
        pi.image_url
    FROM products AS p
    LEFT JOIN product_images AS pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.seller_id = ${session.user.id}
    ORDER BY p.id DESC;
  `;
  const products = productsData.rows;

  return (
    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-text-main">
              Products
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Manage your product inventory.
            </p>
          </div>
          <Link
            href="/dashboard/products/create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="py-12 text-center">
              <h3 className="text-lg font-semibold text-text-main">No products found</h3>
              <p className="mt-2 text-secondary">
                Get started by creating your first product.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
                {product.quantity === 0 && (
                  <div className="absolute top-2 right-2 z-10 flex items-center rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Out of Stock
                  </div>
                )}
                <div className="relative h-48 w-full bg-gray-200">
                  <Image src={product.image_url || '/placeholder.svg'} alt={product.name} layout="fill" objectFit="cover" className={product.quantity === 0 ? 'grayscale' : ''} />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-text-main">{product.name}</h3>
                  <p className="mt-1 flex-grow text-sm text-secondary">{product.description?.substring(0, 60)}...</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-lg font-bold text-text-main">${product.price}</p>
                    <p className="text-sm text-secondary">Qty: {product.quantity}</p>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
