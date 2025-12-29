import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../utils/auth.js";
import { ensureStorageTables } from "../utils/storage.js";

const router = Router();

router.get("/active-order", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    const r = await pool.query(
      `SELECT order_json
         FROM active_orders
        WHERE user_id = $1`,
      [userId]
    );
    res.json({ order: r.rows[0]?.order_json || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/active-order", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    const order = req.body?.order;
    if (!order) {
      return res.status(400).json({ error: "order is required" });
    }
    const r = await pool.query(
      `INSERT INTO active_orders (user_id, order_json)
       VALUES ($1,$2)
       ON CONFLICT (user_id)
       DO UPDATE SET order_json = EXCLUDED.order_json, updated_at = now()
       RETURNING order_json`,
      [userId, JSON.stringify(order)]
    );
    res.json({ order: r.rows[0]?.order_json || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
