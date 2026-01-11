import { pool } from "../db.js";

let initialized = false;

export async function ensureStorageTables() {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS delivery_cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_id UUID,
      title TEXT,
      meta TEXT,
      price TEXT,
      thumb TEXT,
      sub JSONB NOT NULL DEFAULT '[]'::jsonb,
      qty INT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, title, meta, price)
    );
  `);
  await pool.query(`
    ALTER TABLE delivery_cart_items
    ADD COLUMN IF NOT EXISTS order_id UUID;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS active_orders (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      order_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rating_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courier_id UUID REFERENCES users(id) ON DELETE SET NULL,
      stars INT NOT NULL CHECK(stars BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  initialized = true;
}
