import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/from-places", async (_req, res) => {
  const r = await pool.query(
    `SELECT id, kind, name
     FROM places
     WHERE is_active=true AND kind IN ('store','restaurant','other')
     ORDER BY name`
  );
  res.json(r.rows);
});

router.get("/to-places", async (_req, res) => {
  const r = await pool.query(
    `SELECT id, name
     FROM places
     WHERE is_active=true AND kind='campus'
     ORDER BY name`
  );
  res.json(r.rows);
});

export default router;
