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
        quantity
      FROM products
      WHERE id = ${id};
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}