import React from 'react';
import Image from 'next/image';
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import styles from './homepage.module.css';

<<<<<<< HEAD
const products = [
  {
    id: 1,
    name: 'Hand-Thrown Ceramic Mug',
    price: 45,
    img: 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Mug',
  },
  {
    id: 2,
    name: 'Woven Macrame Wall Hanging',
    price: 45,
    img: 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Macrame',
  },
  {
    id: 3,
    name: "Minimalist Wooden Desk Organizer",
    price: 45,
    img: 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Mug+2',
  },
];
=======
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
>>>>>>> 67755ce17ea3534e0dca3f6f7020643b047deaba

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
                    <button className={styles.addToCartButton}>Add to Cart</button>
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