import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session and user types to include the numeric ID.
   */
  interface Session {
    user: {
      id: number;
    } & DefaultSession['user'];
  }
}