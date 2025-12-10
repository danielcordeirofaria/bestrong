import { sql } from '@vercel/postgres';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/ui/add-to-cart-button';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import React from 'react';

type ProductDetails = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  seller_id: number;
  seller_name: string;
  images: { image_url: string }[];
};

type ProductRow = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  seller_name: string;
};

type ImageRow = {
  image_url: string;
};

type ReviewRow = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string | Date;
  reviewer_name: string;
};

async function getProductDetails(id: string): Promise<ProductDetails> {
  try {
    const productData = await sql`
      SELECT p.id, p.name, p.description, p.price, p.quantity, u.name as seller_name, u.id as seller_id
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ${id} AND p.quantity > 0;
    `;

    if (productData.rows.length === 0) {
      notFound();
    }

    const imageData = await sql<ImageRow>`
      SELECT image_url
      FROM product_images
      WHERE product_id = ${id}
      ORDER BY is_primary DESC;
    `;

    const product = productData.rows[0];

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      seller_id: product.seller_id,
      seller_name: product.seller_name,
      images: imageData.rows as { image_url: string }[],
    };
  } catch (error) {
    console.error('Database Error fetching product details:', error);
    notFound();
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const product = await getProductDetails(params.id);

  // --- FETCH REVIEWS ---
  const { rows: reviewRows } = await sql<ReviewRow>`
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS reviewer_name
    FROM product_reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC;
  `;

  const hasReviews = reviewRows.length > 0;
  const averageRating = hasReviews
    ? reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewRows.length
    : null;

  const primaryImage =
    product.images[0]?.image_url ||
    'https://httpstatusdogs.com/img/404.jpg';

  // --- SERVER ACTION TO SUBMIT / UPDATE REVIEW ---
  async function submitReview(formData: FormData) {
    'use server';

    const currentSession = await auth();
    if (
      !currentSession ||
      !currentSession.user ||
      !currentSession.user.id
    ) {
      redirect('/login');
    }

    const userId = currentSession.user.id;
    const ratingValue = Number(formData.get('rating'));
    const commentRaw = formData.get('comment');
    const comment =
      typeof commentRaw === 'string' && commentRaw.trim().length > 0
        ? commentRaw.trim()
        : null;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return;
    }

    try {
      console.log('Inserting review:', { productId: product.id, userId, ratingValue, comment });
      await sql`
        INSERT INTO product_reviews (product_id, user_id, rating, comment)
        VALUES (${product.id}, ${userId}, ${ratingValue}, ${comment})
      `;
      revalidatePath(`/products/${product.id}`);
    } catch (error) {
      console.error('Error inserting review:', error);
    }
  }

  return (
    <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      {/* PRODUCT HEADER */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-96 w-full md:h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="rounded-lg object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-bold text-text-main">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-text-main">
            ${product.price}
          </p>
          <p className="mt-4 flex-grow text-secondary">
            {product.description}
            Sold by <Link href={`/ sellers / ${product.seller_id} `} className="font-medium text-primary hover:underline">{product.seller_name}</Link>
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {/* REVIEWS & RATINGS */}
      <section className="mt-10 border-t pt-8">
        <h2 className="mb-4 text-2xl font-semibold text-text-main">
          Reviews & Ratings
        </h2>

        {hasReviews ? (
          <div className="mb-6 flex items-center gap-4">
            <div className="text-3xl">
              {averageRating?.toFixed(1)}{' '}
              <span className="text-lg text-yellow-500">★</span>
            </div>
            <div className="text-sm text-secondary">
              Based on {reviewRows.length}{' '}
              {reviewRows.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        ) : (
          <p className="mb-6 text-sm text-secondary">
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {/* Form (logged-in users) */}
        {session?.user?.id ? (
          <div className="mb-8 rounded-md border bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-medium text-text-main">
              Leave a review
            </h3>
            <form action={submitReview} className="space-y-3">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-text-main"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  className="mt-1 block w-28 rounded-md border-gray-300 text-sm shadow-sm"
                  defaultValue="5"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-text-main"
                >
                  Written review (optional)
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                Submit review
              </button>
            </form>
          </div>
        ) : (
          <p className="mb-8 text-sm text-secondary">
            You must be logged in to leave a review.
          </p>
        )}

        {/* Reviews list */}
        {hasReviews && (
          <ul className="space-y-4">
            {reviewRows.map((review) => (
              <li
                key={review.id}
                className="rounded-md border bg-white p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">
                    {review.reviewer_name}
                  </span>
                  <span className="text-sm text-yellow-500">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-secondary">{review.comment}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}