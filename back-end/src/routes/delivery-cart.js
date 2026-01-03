import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../utils/auth.js";
import { ensureStorageTables } from "../utils/storage.js";

const router = Router();

router.get("/delivery-cart", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    const r = await pool.query(
      `SELECT id, title, meta, price, thumb, sub, qty
         FROM delivery_cart_items
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ items: r.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/delivery-cart", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    const { title, meta, price, thumb, sub } = req.body || {};
    if (!title || !price) {
      return res.status(400).json({ error: "title and price are required" });
    }

    const count = await pool.query(
      `SELECT COUNT(*)::int AS count
         FROM delivery_cart_items
        WHERE user_id = $1`,
      [userId]
    );
    if (count.rows[0]?.count >= 4) {
      return res.status(400).json({ error: "Cart limit reached" });
    }

    const r = await pool.query(
      `INSERT INTO delivery_cart_items (user_id, title, meta, price, thumb, sub, qty)
       VALUES ($1,$2,$3,$4,$5,$6,1)
       ON CONFLICT (user_id, title, meta, price)
       DO NOTHING
       RETURNING id, title, meta, price, thumb, sub, qty`,
      [userId, title, meta || "", price, thumb || "", JSON.stringify(sub || [])]
    );

    if (!r.rows.length) {
      return res.status(400).json({ error: "Already in cart" });
    }

    res.json({ item: r.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/delivery-cart/:id", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;
    const { id } = req.params;

    const r = await pool.query(
      `SELECT id, qty
         FROM delivery_cart_items
        WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (!r.rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    const qty = r.rows[0].qty || 1;
    if (qty > 1) {
      const updated = await pool.query(
        `UPDATE delivery_cart_items
            SET qty = qty - 1, updated_at = now()
          WHERE id = $1 AND user_id = $2
          RETURNING id, title, meta, price, thumb, sub, qty`,
        [id, userId]
      );
      return res.json({ item: updated.rows[0] });
    }

    await pool.query(
      `DELETE FROM delivery_cart_items WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete("/delivery-cart", requireAuth, async (req, res) => {
  try {
    await ensureStorageTables();
    const userId = req.user?.sub;

    await pool.query(
      `DELETE FROM delivery_cart_items WHERE user_id = $1`,
      [userId]
    );

    res.json({ cleared: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;
