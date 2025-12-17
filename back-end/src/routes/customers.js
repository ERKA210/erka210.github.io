import { Router } from "express";
import { pool } from "../db.js";
import { uuidRe } from "../utils/validation.js";

const router = Router();

router.get("/customers/:id", async (req, res) => {
  const { id } = req.params;
  if (!uuidRe.test(id || "")) {
    return res.status(400).json({ error: "customerId must be UUID" });
  }

  try {
    const r = await pool.query(
      `SELECT id, full_name AS name, phone, student_id
       FROM users
       WHERE id = $1 AND role = 'customer'`,
      [id]
    );
    res.json(r.rows[0] || null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
