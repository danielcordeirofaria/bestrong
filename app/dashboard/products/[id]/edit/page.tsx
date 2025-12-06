import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import React from 'react';
import EditProductForm from '@/components/ui/edit-product-form';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4 md:p-6">
      <EditProductForm product={product} />
    </main>
  );
}
