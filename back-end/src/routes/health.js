import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const r = await pool.query("select now() as now");
  res.json({ ok: true, db_time: r.rows[0].now });
});

export default router;
