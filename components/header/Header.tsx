import Image from 'next/image';
import styles from './header.module.css';
import Link from 'next/link';
import React from 'react';
import { ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { auth } from '@/auth';
import LogoutButton from '@/components/ui/logout-button';
import { sql } from '@vercel/postgres';

async function CartIcon() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <Link href="/cart" className="relative" aria-label="Cart">
        <div className={styles.pCart}>
          <p className={styles.p}>Cart</p>
          <ShoppingCart className="h-6 w-6 text-text-main" />
        </div>
      </Link>
    );
  }

  const cartData = await sql`
    SELECT SUM(oi.quantity) as total
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.client_id = ${userId} AND o.status = 'pending'
  `;

  const itemCount = Number(cartData.rows[0]?.total) || 0;

  return (
    <Link href="/cart" className="relative" aria-label="Cart">
      <div className={styles.pCart}>
        <p className={styles.p}>Cart</p>
        <ShoppingCart className="h-6 w-6 text-text-main" />
      </div>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

const Header = async () => {
  const session = await auth();

  return (
    <header className="py-6">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between border-b border-ui-border pb-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/HandcraftedHaven.png"
              alt="Bestrong Logo"
              width={50}
              height={50}
              className="rounded-full"
              priority
            />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            <Link href="/">Handcrafted Haven</Link>
          </h1>
          <div className="flex items-center gap-5">
            <Link href="/dashboard" aria-label="Dashboard" className={styles.link} >
              <p className={styles.p}>Dashboard</p>
              <LayoutDashboard className="h-6 w-6 text-text-main" />
            </Link>
            <CartIcon />
            {session?.user ? (
              <>

                <LogoutButton />
              </>
            ) : (
              <Link href="/login" aria-label="Login">
                <User className="h-6 w-6 text-text-main" />
              </Link>
            )}
          </div>
        </div>
        <nav className="mt-4 flex justify-center gap-10">
          {/* <a href="#" className="border-b-2 border-text-main pb-1 font-semibold text-text-main">Explore</a>
          <a href="#" className="text-secondary hover:text-text-main">Sell</a>
          <a href="#" className="text-secondary hover:text-text-main">Community</a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;