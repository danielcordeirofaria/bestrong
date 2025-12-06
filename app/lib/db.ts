// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from your .env file
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
