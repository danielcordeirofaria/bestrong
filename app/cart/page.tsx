import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import Image from 'next/image';
import Link from 'next/link';
import UpdateCartQuantity from '@/components/ui/update-cart-quantity';
import React from 'react';

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  image_url: string | null;
};

async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const data = await sql<CartItem>`
      SELECT
        oi.id,
        oi.product_id,
        p.name,
        oi.quantity,
        oi.price_at_purchase AS price,
        pi.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE o.client_id = ${userId} AND o.status = 'pending'
      ORDER BY oi.id;
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cart items.');
  }
}

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <main className="container mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="mt-4">Please <Link href="/login" className="text-primary underline">log in</Link> to view your cart.</p>
      </main>
    );
  }

  const items = await getCartItems(session.user.id);
  const subtotal = items.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0);

  return (
    <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="font-serif text-3xl font-bold text-text-main mb-8">Your Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center text-secondary">
          <p>Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <Image src={item.image_url || 'https://placehold.co/100x100'} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                  <div className="flex-grow">
                    <h2 className="font-semibold">{item.name}</h2>
                    <UpdateCartQuantity itemId={item.id} quantity={item.quantity} />
                  </div>
                  <p className="font-semibold">${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-gray-50 p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-secondary">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <Link href="/cart/checkout" className="mt-6 block w-full rounded-md bg-primary py-2 text-center font-semibold text-white shadow-sm hover:bg-primary/90">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
