'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
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
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, and .webp formats are supported.'
    )
    .optional(),
  bio: z.string().max(500, { message: 'Bio must be 500 characters or less.' }).optional(),
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
  category: z.enum(['clothing', 'equipment', 'nutrition', 'merchandise'], {
    invalid_type_error: 'Please select a valid category.',
  }),
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
    category?: string[];
    bio?: string[];
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
    image: formData.get('image') || undefined,
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Create User.',
    };
  }

  const { name, email, password, phone_number, role, street, city, state, zip_code, country, image, bio } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const finalPhoneNumber = phone_number || null;

  try {
    await sql.query('BEGIN');

    const userResult = await sql`
      INSERT INTO users (name, email, password, phone_number, role, bio)
      VALUES (${name}, ${email}, ${hashedPassword}, ${finalPhoneNumber}, ${role}, ${bio})
      RETURNING id;
    `;
    const newUserId = userResult.rows[0].id;

    if (image && image.size > 0 && image.name !== 'undefined') {
      try {
        console.log('[Server Action] Uploading profile image to Vercel Blob...');
        const blob = await put(image.name, image, {
          access: 'public',
          addRandomSuffix: true,
          token: process.env.bestrongblob_READ_WRITE_TOKEN,
        });
        console.log('[Server Action] Profile image uploaded. URL:', blob.url);

        await sql`
                UPDATE users
                SET profile_image = ${blob.url}
                WHERE id = ${newUserId}
    `;

      } catch (uploadError) {
        console.error('Blob Upload Error:', uploadError);
        // We don't fail the whole user creation if image fails, just log it.
        // Or we could return a warning.
      }
    }

    await sql`
      INSERT INTO addresses(user_id, street, city, state, zip_code, country)
    VALUES(${newUserId}, ${street}, ${city}, ${state}, ${zip_code}, ${country});
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
  console.log(`[Server Action] User authenticated: ${session.user.id} `);

  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
    image: formData.get('image'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    console.error('[Server Action] Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, description, price, quantity, image, category } = validatedFields.data;
  console.log('[Server Action] Validation successful. Data:', { name, description, price, quantity, category, imageName: image.name });
  const sellerId = session.user.id;

  try {
    console.log('[Server Action] Uploading image to Vercel Blob...');
    console.log('[Server Action] Token Check:', process.env.bestrongblob_READ_WRITE_TOKEN ? 'Token exists (starts with ' + process.env.bestrongblob_READ_WRITE_TOKEN.substring(0, 5) + '...)' : 'Token is MISSING');
    const blob = await put(image.name, image, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.bestrongblob_READ_WRITE_TOKEN,
    });
    console.log('[Server Action] Image uploaded. URL:', blob.url);

    await sql.query('BEGIN');
    console.log('[Server Action] Database transaction started.');

    const productResult = await sql`
      INSERT INTO products(seller_id, name, description, price, quantity, category, isActive)
    VALUES(${sellerId}, ${name}, ${description}, ${price}, ${quantity}, ${category}, TRUE)
      RETURNING id
      `;
    const productId = productResult.rows[0].id;
    console.log(`[Server Action] Inserted into 'products' table.New product ID: ${productId} `);

    await sql`
      INSERT INTO product_images(product_id, image_url, is_primary)
    VALUES(${productId}, ${blob.url}, ${true})
    `;

    await sql.query('COMMIT');
    console.log("[Server Action] Inserted into 'product_images' and committed transaction.");
  } catch (error) {
    await sql.query('ROLLBACK');
    console.error('[Server Action] Database transaction failed. Rolling back.', error);
    return {
      message: `Database Error: Failed to Create Product.${(error as Error).message} `,
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

    const updateResult = await sql`
      UPDATE products 
      SET isActive = false
      WHERE id = ${productId} AND seller_id = ${session.user.id}
    `;

    if (updateResult.rowCount === 0) {
      await sql.query('ROLLBACK');
      return { message: 'Error: Product not found or you do not have permission to delete it.' };
    }

    await sql.query('COMMIT');
    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/products');
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
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { name, description, price, quantity, category } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET name = ${name}, description = ${description}, price = ${price}, quantity = ${quantity}, category = ${category}
      WHERE id = ${id} AND seller_id = ${session.user.id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath(`/ dashboard / products`);
  revalidatePath(`/ dashboard / products / ${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  revalidatePath('/', 'layout');
  redirect('/dashboard/products');
}

export async function addToCart(productId: number, prevState: { message: string | null } | null, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {

    return { message: 'Please log in to add items to your cart.' };
  }
  const userId = session.user.id;

  try {
    await sql.query('BEGIN');

    let orderResult = await sql`
      SELECT id FROM orders WHERE client_id = ${userId} AND status = 'pending'
    `;
    let orderId;

    if (orderResult.rows.length > 0) {
      orderId = orderResult.rows[0].id;
    } else {
      const newOrderResult = await sql`
        INSERT INTO orders (client_id, status) VALUES (${userId}, 'pending') RETURNING id
      `;
      orderId = newOrderResult.rows[0].id;
    }

    const existingItem = await sql`
      SELECT id, quantity FROM order_items WHERE order_id = ${orderId} AND product_id = ${productId}
    `;

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + 1;
      await sql`
        UPDATE order_items SET quantity = ${newQuantity} WHERE id = ${existingItem.rows[0].id}
      `;
    } else {
      const productResult = await sql`
        SELECT name, price, quantity, isActive FROM products WHERE id = ${productId}
      `;

      if (productResult.rows.length === 0) {
        throw new Error('Product not found.');
      }

      const product = productResult.rows[0];

      if (!product.isactive) {
        throw new Error(`Product "${product.name}" is no longer available.`);
      }

      if (product.quantity < 1) throw new Error(`Product "${product.name}" is out of stock.`);

      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}, ${productId}, 1, ${product.price})
      `;
    }

    await sql.query('COMMIT');
  } catch (error) {
    await sql.query('ROLLBACK');
    return { message: `Database Error: Failed to add item to cart. ${(error as Error).message}` };
  }

  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/products/[id]', 'layout');

  return { message: 'Product added to cart!' };
}

export async function updateCartItemQuantity(itemId: number, newQuantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Authentication required.' };
  }

  if (newQuantity < 1) {
    return removeCartItem(itemId);
  }

  try {
    await sql`
      UPDATE order_items
      SET quantity = ${newQuantity}
      WHERE id = ${itemId}
        AND order_id = (SELECT id FROM orders WHERE client_id = ${session.user.id} AND status = 'pending');
    `;
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { error: 'Database Error: Failed to update quantity.' };
  }
}

export async function removeCartItem(itemId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Authentication required.' };
  }

  try {
    const result = await sql`
      DELETE FROM order_items
      WHERE id = ${itemId}
        AND order_id = (SELECT id FROM orders WHERE client_id = ${session.user.id} AND status = 'pending');
    `;

    if (result.rowCount === 0) {
      return { error: 'Item not found in your cart.' };
    }

    revalidatePath('/cart');
    return { success: true, message: 'Item removed from cart.' };
  } catch (error) {
    return { error: 'Database Error: Failed to remove item.' };
  }
}

export async function placeOrder(orderId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    // return { message: 'Authentication required.' };
    redirect('/login');
  }

  try {
    await sql.query('BEGIN');

    const { rows: items } = await sql`
      SELECT product_id, quantity FROM order_items WHERE order_id = ${orderId}
    `;

    if (items.length === 0) {
      throw new Error('Cart is empty.');
    }

    for (const item of items) {
      const updateResult = await sql`
        UPDATE products
        SET quantity = quantity - ${item.quantity}
        WHERE id = ${item.product_id}
          AND quantity >= ${item.quantity} 
          AND isActive = true
      `;

      if (updateResult.rowCount === 0) {
        const productInfo = await sql`
          SELECT name, quantity, isActive FROM products WHERE id = ${item.product_id}
        `;
        const product = productInfo.rows[0];
        if (!product.isactive) {
          throw new Error(`Product "${product.name}" is no longer available and has been removed from your cart.`);
        }
        throw new Error(`Sorry, there is not enough stock for "${product.name}". Only ${product.quantity} left.`);
      }
    }

    const { rows: totalData } = await sql`
      SELECT SUM(price_at_purchase * quantity) as total
      FROM order_items
      WHERE order_id = ${orderId}
    `;
    const totalAmount = totalData[0].total;

    await sql`
      UPDATE orders
      SET status = 'paid', total_amount = ${totalAmount}
      WHERE id = ${orderId} AND client_id = ${session.user.id}
    `;

    await sql.query('COMMIT');
  } catch (error) {
    await sql.query('ROLLBACK');
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
    const encodedMessage = encodeURIComponent(errorMessage);
    redirect(`/checkout?error=${encodedMessage}`);
  }

  revalidatePath('/');
  revalidatePath('/cart');
  revalidatePath('/products', 'layout');
  redirect(`/order/success/${orderId}`);
}

const ProfileSchema = z.object({
  bio: z.string().max(500, { message: 'Bio must be 500 characters or less.' }).optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, and .webp formats are supported.'
    )
    .optional(),
});

export async function updateProfile(prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Authentication required.' };
  }

  const validatedFields = ProfileSchema.safeParse({
    bio: formData.get('bio'),
    image: formData.get('image') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Invalid input.',
    };
  }

  const { bio, image } = validatedFields.data;

  try {
    let imageUrl = null;

    // Handle image upload if provided
    if (image && image.size > 0 && image.name !== 'undefined') {
      try {
        console.log('[Server Action] Uploading profile image to Vercel Blob...');
        const blob = await put(image.name, image, {
          access: 'public',
          addRandomSuffix: true,
          token: process.env.bestrongblob_READ_WRITE_TOKEN,
        });
        imageUrl = blob.url;
        console.log('[Server Action] Profile image uploaded. URL:', imageUrl);
      } catch (uploadError) {
        console.error('Blob Upload Error:', uploadError);
        return { message: 'Failed to upload image.' };
      }
    }

    if (imageUrl) {
      await sql`
            UPDATE users
            SET bio = ${bio}, profile_image = ${imageUrl}
            WHERE id = ${session.user.id}
        `;
    } else {
      await sql`
            UPDATE users
            SET bio = ${bio}
            WHERE id = ${session.user.id}
        `;
    }

    console.log(`[Server Action] Updated profile for user ${session.user.id}`);
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to update profile.' };
  }

  revalidatePath('/dashboard/profile');
  revalidatePath(`/sellers/${session.user.id}`);
  return { message: 'Profile updated successfully!' };
}
