import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
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

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-text-main">No products found</h3>
                        <p className="text-secondary mt-2">
                            Get started by creating your first product.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
