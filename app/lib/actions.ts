'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';


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
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
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

export type LoginState = string | undefined;

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: LoginState,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
