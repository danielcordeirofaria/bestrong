import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProductById(id: string) {
  noStore();

  try {
    const data = await sql`
      SELECT
        id,
        name,
        description,
        price,
        quantity,
        category
      FROM products
      WHERE id = ${id};
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

const ITEMS_PER_PAGE = 12;

export async function fetchFilteredProducts(
  query: string,
  category: string,
  minPrice: number,
  maxPrice: number,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pi.image_url,
        p.category
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE
        p.isActive = true AND
        p.quantity > 0 AND
        (
          p.name ILIKE ${`%${query}%`} OR
          p.description ILIKE ${`%${query}%`}
        ) AND
        (${category} = '' OR p.category = ${category}) AND
        p.price >= ${minPrice} AND
        p.price <= ${maxPrice}
      ORDER BY p.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return products.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(
  query: string,
  category: string,
  minPrice: number,
  maxPrice: number
) {
  noStore();
  try {
    const count = await sql`
        SELECT COUNT(*)
        FROM products
        WHERE
          isActive = true AND
          quantity > 0 AND
          (
            name ILIKE ${`%${query}%`} OR
            description ILIKE ${`%${query}%`}
          ) AND
          (${category} = '' OR category = ${category}) AND
          price >= ${minPrice} AND
          price <= ${maxPrice}
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchSellerProfile(sellerId: string) {
  noStore();
  try {
    const user = await sql`SELECT id, name, bio, email, role, profile_image FROM users WHERE id = ${sellerId} AND role = 'seller'`;

    if (user.rows.length === 0) {
      return null;
    }

    const products = await sql`
        SELECT id, name, price, description, category, quantity, isActive 
        FROM products 
        WHERE seller_id = ${sellerId} AND isActive = true AND quantity > 0
        ORDER BY id DESC
    `;

    const productsWithImages = await Promise.all(products.rows.map(async (product) => {
      const image = await sql`SELECT image_url FROM product_images WHERE product_id = ${product.id} AND is_primary = true`;
      return {
        ...product,
        image_url: image.rows[0]?.image_url || null
      };
    }));

    return {
      seller: user.rows[0],
      products: productsWithImages
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch seller profile.');
  }
}