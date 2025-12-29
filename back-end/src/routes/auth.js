import { Router } from "express";
import { pool } from "../db.js";
import { signJwt } from "../utils/jwt.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const weekMs = 7 * 24 * 60 * 60 * 1000;

router.post("/auth/login", async (req, res) => {
  const { name, phone, studentId, role } = req.body || {};
  const phoneSafe = String(phone || "").trim();
  if (!phoneSafe) {
    return res.status(400).json({ error: "phone is required" });
  }

  const fullName = String(name || "Зочин хэрэглэгч").trim() || "Зочин хэрэглэгч";
  const studentSafe = String(studentId || "").trim();
  const roleSafe = role === "courier" ? "courier" : "customer";

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE phone = $1 LIMIT 1",
      [phoneSafe]
    );

    let userRow;
    if (existing.rows.length) {
      const userId = existing.rows[0].id;
      await pool.query(
        `UPDATE users
           SET full_name = $2,
               student_id = CASE WHEN $3 <> '' THEN $3 ELSE student_id END
         WHERE id = $1`,
        [userId, fullName, studentSafe]
      );
      if (roleSafe === "courier") {
        await pool.query(
          `UPDATE users SET role = 'courier' WHERE id = $1`,
          [userId]
        );
        await pool.query(
          `INSERT INTO couriers (user_id, is_active)
           VALUES ($1, true)
           ON CONFLICT (user_id) DO NOTHING`,
          [userId]
        );
      }
      const updated = await pool.query(
        `SELECT id, full_name AS name, phone, student_id, role
           FROM users
          WHERE id = $1`,
        [userId]
      );
      userRow = updated.rows[0];
    } else {
      const inserted = await pool.query(
        `INSERT INTO users (full_name, phone, student_id, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name AS name, phone, student_id, role`,
        [fullName, phoneSafe, studentSafe, roleSafe]
      );
      userRow = inserted.rows[0];
      if (roleSafe === "courier") {
        await pool.query(
          `INSERT INTO couriers (user_id, is_active)
           VALUES ($1, true)
           ON CONFLICT (user_id) DO NOTHING`,
          [userRow.id]
        );
      }
    }

    const token = signJwt(
      { sub: userRow.id, name: userRow.name, phone: userRow.phone, role: userRow.role },
      jwtSecret
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: weekMs,
    });

    res.json({ user: userRow, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const r = await pool.query(
      `SELECT id, full_name AS name, phone, student_id, role
       FROM users
       WHERE id = $1`,
      [userId]
    );
    res.json({ user: r.rows[0] || null });
  } catch (e) {
    res.status(401).json({ error: e.message || "Unauthorized" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("auth_token");
  res.json({ ok: true });
});

router.put("/auth/me", requireAuth, async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { name, phone, studentId } = req.body || {};
  const fullName = String(name || "").trim();
  const phoneSafe = String(phone || "").trim();
  const studentSafe = String(studentId || "").trim();
  if (!fullName || !phoneSafe) {
    return res.status(400).json({ error: "name and phone are required" });
  }
  try {
    const r = await pool.query(
      `UPDATE users
          SET full_name = $2,
              phone = $3,
              student_id = $4,
              updated_at = now()
        WHERE id = $1
        RETURNING id, full_name AS name, phone, student_id, role`,
      [userId, fullName, phoneSafe, studentSafe]
    );
    res.json({ user: r.rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
