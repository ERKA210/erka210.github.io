import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

// ✅ Logged-in courier profile
router.get("/courier/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // role шалгалт (optional гэхдээ зөв)
    if (req.user?.role !== "courier") {
      return res.status(403).json({ error: "Forbidden: courier only" });
    }

    const r = await pool.query(
      `
      SELECT u.id, u.full_name AS name, u.phone, u.student_id
      FROM couriers c
      JOIN users u ON u.id = c.user_id
      WHERE c.user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (!r.rows.length) {
      return res.status(404).json({ error: "Courier profile not found" });
    }

    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
