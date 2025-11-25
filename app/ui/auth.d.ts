import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in `User` model from `next-auth` to include the `role`.
   * This is what the `authorize` callback returns.
   */
  interface User {
    role?: 'buyer' | 'seller';
  }

  /**
   * Extends the built-in `Session` model, adding the `role` to the `user` object.
   * This is what you'll see when you use `auth()` or `useSession()`.
   */
  interface Session {
    user: {
      role?: 'buyer' | 'seller';
    } & DefaultSession['user'];
  }
}