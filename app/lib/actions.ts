'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { put, del } from '@vercel/blob';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { signIn, signOut, auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  phone_number: z.string().optional().or(z.literal('')),
  role: z.enum(['buyer', 'seller'], {
    invalid_type_error: 'Please select a user role.',
  }),
  street: z.string().min(1, { message: 'Street is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
  zip_code: z.string().min(1, { message: 'ZIP Code is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
});

const ProductSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .gt(0, { message: 'Price must be greater than $0.' }),
  quantity: z.coerce
    .number()
    .int()
    .min(0, { message: 'Quantity must be at least 0.' }),
  image: z
    .instanceof(File, { message: 'Image is required.' })
    .refine((file) => file.size > 0, 'Image is required.')
    .refine((file) => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    phone_number?: string[];
    role?: string[];
    street?: string[];
    city?: string[];
    state?: string[];
    zip_code?: string[];
    country?: string[];
    description?: string[];
    price?: string[];
    quantity?: string[];
    image?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone_number: formData.get('phone_number'),
    role: formData.get('role'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip_code: formData.get('zip_code'),
    country: formData.get('country'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Create User.',
    };
  }

  const { name, email, password, phone_number, role, street, city, state, zip_code, country } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const finalPhoneNumber = phone_number || null;

  try {
    await sql.query('BEGIN');

    const userResult = await sql`
      INSERT INTO users (name, email, password, phone_number, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${finalPhoneNumber}, ${role})
      RETURNING id;
    `;
    const newUserId = userResult.rows[0].id;

    await sql`
      INSERT INTO addresses (user_id, street, city, state, zip_code, country)
      VALUES (${newUserId}, ${street}, ${city}, ${state}, ${zip_code}, ${country});
    `;

    await sql.query('COMMIT');

  } catch (error: unknown) {
    await sql.query('ROLLBACK');
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === '23505'
    ) {
      return { message: 'An account with this email already exists.' };
    }

    return { message: 'Database Error: Failed to create user. Please try again.' };
  }

  redirect('/login');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof Error && error.message.includes('CredentialsSignin')) {
      return 'Invalid credentials.';
    }
    throw error;
  }
}

export async function signOutAction() {
  console.log('Server Action: signOutAction called!');
  await signOut();
}

export async function createProduct(prevState: State, formData: FormData): Promise<State> {
  console.log('\n--- [Server Action] createProduct started ---');
  const session = await auth();
  if (!session?.user?.id) {
    console.error('[Server Action] Error: User not authenticated.');
    return {
      message: 'You must be logged in to create a product.',
    };
  }
  console.log(`[Server Action] User authenticated: ${session.user.id}`);

  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    console.error('[Server Action] Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, description, price, quantity, image } = validatedFields.data;
  console.log('[Server Action] Validation successful. Data:', { name, description, price, quantity, imageName: image.name });
  const sellerId = session.user.id;

  try {
    console.log('[Server Action] Uploading image to Vercel Blob...');
    const blob = await put(image.name, image, {
      access: 'public',
      token: process.env.BESTRONGBLOB_READ_WRITE_TOKEN,
    });
    console.log('[Server Action] Image uploaded. URL:', blob.url);

    await sql.query('BEGIN');
    console.log('[Server Action] Database transaction started.');

    const productResult = await sql`
      INSERT INTO products (seller_id, name, description, price, quantity)
      VALUES (${sellerId}, ${name}, ${description}, ${price}, ${quantity})
      RETURNING id
    `;
    const productId = productResult.rows[0].id;
    console.log(`[Server Action] Inserted into 'products' table. New product ID: ${productId}`);

    await sql`
      INSERT INTO product_images (product_id, image_url, is_primary)
      VALUES (${productId}, ${blob.url}, ${true})
    `;

    await sql.query('COMMIT');
    console.log("[Server Action] Inserted into 'product_images' and committed transaction.");
  } catch (error) {
    await sql.query('ROLLBACK');
    console.error('[Server Action] Database transaction failed. Rolling back.', error);
    return {
      message: `Database Error: Failed to Create Product. ${(error as Error).message}`,
    };
  }

  console.log('[Server Action] Product created successfully. Revalidating path and redirecting...');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(productId: number, prevState: { message: string | null }, formData: FormData): Promise<{ message: string | null }> {
  if (!productId) {
    return { message: 'Invalid Product ID.' };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Authentication required.' };
  }

  try {
    await sql.query('BEGIN');

    const imagesData = await sql`
      SELECT pi.image_url
      FROM product_images pi
      JOIN products p ON pi.product_id = p.id
      WHERE p.id = ${productId} AND p.seller_id = ${session.user.id}
    `;

    const deleteResult = await sql`
      DELETE FROM products
      WHERE id = ${productId} AND seller_id = ${session.user.id}
    `;

    if (deleteResult.rowCount === 0) {
      await sql.query('ROLLBACK');
      return { message: 'Error: Product not found or you do not have permission to delete it.' };
    }

    if (imagesData.rows.length > 0) {
      const urlsToDelete = imagesData.rows.map((row) => row.image_url);
      await del(urlsToDelete, { token: process.env.BESTRONGBLOB_READ_WRITE_TOKEN });
    }

    await sql.query('COMMIT');
    revalidatePath('/dashboard/products');
    return { message: 'Product deleted successfully.' };
  } catch (error) {
    await sql.query('ROLLBACK');
    return { message: 'Database Error: Failed to delete product.' };
  }
}

export async function updateProduct(id: string, prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Authentication required.' };
  }

  const validatedFields = ProductSchema.omit({ image: true }).safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { name, description, price, quantity } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET name = ${name}, description = ${description}, price = ${price}, quantity = ${quantity}
      WHERE id = ${id} AND seller_id = ${session.user.id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath(`/dashboard/products`);
  revalidatePath(`/dashboard/products/${id}/edit`);
  redirect('/dashboard/products');
}
