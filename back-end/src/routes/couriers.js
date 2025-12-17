import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/courier/me", async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT u.id, u.full_name AS name, u.phone, u.student_id
      FROM couriers c
      JOIN users u ON u.id = c.user_id
      WHERE c.is_active = true
      ORDER BY c.created_at ASC
      LIMIT 1
    `);

    res.json(r.rows[0] || null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
