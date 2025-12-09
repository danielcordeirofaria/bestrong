import React from 'react';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import NavBar from './NavBar';

const Header = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let cartItemCount = 0;

  if (userId) {
    try {
      const cartData = await sql`
        SELECT SUM(oi.quantity) as total
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.client_id = ${userId} AND o.status = 'pending'
        `;
      cartItemCount = Number(cartData.rows[0]?.total) || 0;
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  }

  const user = session?.user ? { role: session.user.role, id: session.user.id } : null;

  return (
    <header className="py-6">
      <NavBar user={user} cartItemCount={cartItemCount} />
    </header>
  );
};

export default Header;
