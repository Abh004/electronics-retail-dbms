import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";


if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a standard 'pg' Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pass the 'pg' pool to Drizzle
export const db = drizzle(pool, { schema }); // <-- CHANGED: Drizzle syntax is slightly different