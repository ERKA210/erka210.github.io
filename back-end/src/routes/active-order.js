import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../utils/auth.js";
import { ensureStorageTables } from "../utils/storage.js";

const router = Router();

router.get("/active-order", requireAuth, async (req, res) => {
  await ensureStorageTables();

  const userId = req.user.sub;

  const r = await pool.query(
    `SELECT order_json
       FROM active_orders
      WHERE user_id = $1`,
    [userId]
  );

  res.json({ order: r.rows[0]?.order_json || null });
});

router.put("/active-order", requireAuth, async (req, res) => {
  await ensureStorageTables();

  const userId = req.user.sub;
  const order = req.body.order;

  if (!order) {
    await pool.query(
      `DELETE FROM active_orders WHERE user_id = $1`,
      [userId]
    );
    return res.json({ order: null });
  }

  const r = await pool.query(
    `INSERT INTO active_orders (user_id, order_json)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (user_id)
     DO UPDATE
       SET order_json = EXCLUDED.order_json,
           updated_at = now()
     RETURNING order_json`,
    [userId, JSON.stringify(order)]
  );

  res.json({ order: r.rows[0].order_json });
});

export default router;