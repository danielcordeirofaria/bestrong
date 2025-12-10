import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterSidebar from '@/components/products/filter-sidebar';
import { fetchFilteredProducts } from '@/app/lib/data';

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || '';
  const minPrice = Number(searchParams?.minPrice) || 0;
  const maxPrice = Number(searchParams?.maxPrice) || 100000;
  const currentPage = Number(searchParams?.page) || 1;

  const products = await fetchFilteredProducts(query, category, minPrice, maxPrice, currentPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text-main">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group block">
                  <div className="flex flex-col overflow-hidden rounded-lg border border-ui-border bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-lg h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.image_url || 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Image'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-text-main group-hover:text-primary line-clamp-1">{product.name}</h3>
                        {product.category && (
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                            {product.category}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                      <p className="text-xl font-bold text-text-main">${Number(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
