import React from 'react';
import Image from 'next/image';
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import styles from './homepage.module.css';
import AddToCartButton from '@/components/ui/add-to-cart-button';


type Product = {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
};

export default async function Page() {
  const productsData = await sql<Product>`
    SELECT p.id, p.name, p.price, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    ORDER BY RANDOM()
    LIMIT 3;
  `;
  const products = productsData.rows;

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <main className="pb-16">
        {/* === HERO SECTION === */}
        <section className="py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-5xl font-bold text-text-main md:text-6xl">
            Discover Unique, Handcrafted Treasures
          </h2>
          <p className="mt-4 text-xl text-secondary">
            Support Local Artisans & Sustainable Craftsmanship
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded bg-primary px-10 py-3 text-lg font-semibold text-white transition-all hover:bg-opacity-90"
          >
            Shop Now
          </Link>
        </section>

        {/* === PRODUCT GRID === */}
        <section className={styles.productGridSection}>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Image
                  src={product.image_url || 'https://httpcats.com/404.jpg'}
                  alt={product.name}
                  width={400}
                  height={400}
                  className={styles.productImage}
                />
                <div className={styles.productCardContent}>
                  <div>
                    <h3 className={styles.productName}>{product.name}</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={styles.productPrice}>${product.price} USD</span>
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}