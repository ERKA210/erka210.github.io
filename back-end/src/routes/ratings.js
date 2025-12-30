import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../utils/auth.js";
import { ensureStorageTables } from "../utils/storage.js";
import { assertUuid } from "../utils/validation.js";
import { sanitizeText } from "../utils/sanitize.js";

const router = Router();

router.get("/ratings/me", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const r = await pool.query(
      `SELECT r.id,
              r.stars,
              r.comment,
              r.created_at,
              pfrom.name AS from_name,
              pto.name AS to_name
         FROM rating_history r
         JOIN orders o ON o.id = r.order_id
         LEFT JOIN places pfrom ON pfrom.id = o.from_place_id
         LEFT JOIN places pto ON pto.id = o.to_place_id
        WHERE r.customer_id = $1
        ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json({ items: r.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/ratings", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { orderId, stars, comment } = req.body || {};
    assertUuid(orderId, "orderId must be UUID");
    const starsNum = Number(stars);
    if (!Number.isInteger(starsNum) || starsNum < 1 || starsNum > 5) {
      return res.status(400).json({ error: "stars must be 1-5" });
    }

    const orderRes = await pool.query(
      `SELECT id
         FROM orders
        WHERE id = $1 AND customer_id = $2`,
      [orderId, userId]
    );
    if (!orderRes.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const courierRes = await pool.query(
      `SELECT courier_id
         FROM order_couriers
        WHERE order_id = $1`,
      [orderId]
    );
    const courierId = courierRes.rows[0]?.courier_id || null;

    const commentSafe = sanitizeText(comment, { maxLen: 1000 });
    const history = await pool.query(
      `INSERT INTO rating_history (order_id, customer_id, courier_id, stars, comment)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, order_id, stars, comment, created_at`,
      [orderId, userId, courierId, starsNum, commentSafe]
    );

    await pool.query(
      `INSERT INTO ratings (order_id, customer_id, courier_id, stars, comment)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (order_id)
       DO UPDATE SET
         stars = EXCLUDED.stars,
         comment = EXCLUDED.comment,
         courier_id = EXCLUDED.courier_id`,
      [orderId, userId, courierId, starsNum, commentSafe]
    );

    res.json({ rating: history.rows[0] });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

export default router;
