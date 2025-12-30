import { Router } from "express";
import crypto from "crypto";
import { pool } from "../db.js";
import { signJwt } from "../utils/jwt.js";
import { requireAuth } from "../utils/auth.js";
import { sanitizeText } from "../utils/sanitize.js";

const router = Router();
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const weekMs = 7 * 24 * 60 * 60 * 1000;
const passwordKeyLen = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, passwordKeyLen).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  const [algo, salt, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hashHex) return false;
  const derived = crypto.scryptSync(password, salt, passwordKeyLen);
  const storedBuf = Buffer.from(hashHex, "hex");
  if (storedBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(storedBuf, derived);
}

router.post("/auth/login", async (req, res) => {
  const { name, phone, studentId, role, password, mode } = req.body || {};
  const phoneSafe = String(phone || "").trim();
  if (!phoneSafe) {
    return res.status(400).json({ error: "phone is required" });
  }
  const passwordSafe = String(password || "");
  if (!passwordSafe) {
    return res.status(400).json({ error: "password is required" });
  }

  const isRegister = mode === "register";
  const fullName = sanitizeText(name || "", { maxLen: 80 }).trim();
  if (isRegister && !fullName) {
    return res.status(400).json({ error: "name is required" });
  }
  const studentSafe = sanitizeText(studentId || "", { maxLen: 32 });
  const studentValue = studentSafe ? studentSafe : null;
  const roleSafe = role === "courier" ? "courier" : "customer";

  try {
    const existing = await pool.query(
      "SELECT id, password_hash FROM users WHERE phone = $1 LIMIT 1",
      [phoneSafe]
    );

    let userRow;
    if (existing.rows.length) {
      const userId = existing.rows[0].id;
      const existingHash = existing.rows[0].password_hash;
      if (existingHash) {
        if (!verifyPassword(passwordSafe, existingHash)) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        const newHash = hashPassword(passwordSafe);
        await pool.query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [
          userId,
          newHash,
        ]);
      }

      if (isRegister) {
        await pool.query(
          `UPDATE users
             SET full_name = $2,
                 student_id = COALESCE($3::text, student_id)
           WHERE id = $1`,
          [userId, fullName, studentValue]
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
      }
      const updated = await pool.query(
        `SELECT id, full_name AS name, phone, student_id, role, avatar_url AS avatar
           FROM users
          WHERE id = $1`,
        [userId]
      );
      userRow = updated.rows[0];
    } else {
      if (!isRegister) {
        return res.status(404).json({ error: "User not found" });
      }
      const passwordHash = hashPassword(passwordSafe);
      const inserted = await pool.query(
        `INSERT INTO users (full_name, phone, student_id, role, password_hash)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, full_name AS name, phone, student_id, role, avatar_url AS avatar`,
        [fullName, phoneSafe, studentValue, roleSafe, passwordHash]
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

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProd,
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
      `SELECT id, full_name AS name, phone, student_id, role, avatar_url AS avatar
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
  const { name, phone, studentId, avatar } = req.body || {};
  const fullName = sanitizeText(name || "", { maxLen: 80 });
  const phoneSafe = String(phone || "").trim();
  const studentSafe = sanitizeText(studentId || "", { maxLen: 32 });
  const studentValue = studentSafe ? studentSafe : null;
  const avatarSafe = sanitizeText(avatar || "", { maxLen: 500 });
  const avatarValue = avatarSafe ? avatarSafe : null;
  if (!fullName || !phoneSafe) {
    return res.status(400).json({ error: "name and phone are required" });
  }
  try {
    const r = await pool.query(
      `UPDATE users
          SET full_name = $2,
              phone = $3,
              student_id = COALESCE($4::text, student_id),
              avatar_url = COALESCE($5::text, avatar_url),
              updated_at = now()
        WHERE id = $1
        RETURNING id, full_name AS name, phone, student_id, role, avatar_url AS avatar`,
      [userId, fullName, phoneSafe, studentValue, avatarValue]
    );
    res.json({ user: r.rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
