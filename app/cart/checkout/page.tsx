import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { placeOrder } from '@/app/lib/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const orderResult = await sql`
    SELECT id FROM orders WHERE client_id = ${userId} AND status = 'pending'
  `;

  if (orderResult.rows.length === 0) {
    redirect('/cart');
  }

  const orderId = orderResult.rows[0].id;

  const cartItems = await sql`
    SELECT SUM(quantity * price_at_purchase) as total
    FROM order_items
    WHERE order_id = ${orderId}
  `;

  const total = parseFloat(cartItems.rows[0].total || '0');

  return (
    <main className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold font-serif text-text-main">Checkout</h1>

      <div className="rounded-lg border bg-gray-50 p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <span className="text-lg">Total Amount</span>
          <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>

        <p className="text-secondary mb-8 text-sm">
          Clicking &quot;Place Order&quot; will finalize your purchase.
        </p>

        <form action={placeOrder.bind(null, orderId)}>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            Place Order
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/cart" className="text-sm text-secondary hover:underline">
            Return to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
