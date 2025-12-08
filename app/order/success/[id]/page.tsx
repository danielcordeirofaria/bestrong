import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import React from 'react';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
    return (
        <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-text-main">Thank You for Your Order!</h1>
            <p className="mt-2 text-lg text-secondary">
                Your order #{params.id} has been placed successfully.
            </p>
            <p className="mt-2 text-secondary">
                We will notify you once it has been shipped.
            </p>
            <div className="mt-8">
                <Link
                    href="/products"
                    className="rounded-md bg-primary px-6 py-3 font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}
